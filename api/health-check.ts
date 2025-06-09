import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔍 Starting system health check...');
    
    const healthCheck = {
      timestamp: new Date().toISOString(),
      checks: {} as Record<string, any>
    };

    // 1. Database connectivity check
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .limit(1);
      
      healthCheck.checks.database = {
        status: error ? 'error' : 'healthy',
        response_time: Date.now(),
        error: error?.message || null
      };
    } catch (error) {
      healthCheck.checks.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 2. Auth service check
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      healthCheck.checks.auth = {
        status: error ? 'error' : 'healthy',
        error: error?.message || null
      };
    } catch (error) {
      healthCheck.checks.auth = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 3. Critical table checks
    const criticalTables = ['employees', 'stations', 'licenses_certificates', 'salary_records'];
    for (const table of criticalTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        healthCheck.checks[`table_${table}`] = {
          status: error ? 'error' : 'healthy',
          record_count: count || 0,
          error: error?.message || null
        };
      } catch (error) {
        healthCheck.checks[`table_${table}`] = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 4. Storage check (if configured)
    try {
      const { data, error } = await supabase.storage.listBuckets();
      healthCheck.checks.storage = {
        status: error ? 'error' : 'healthy',
        buckets_count: data?.length || 0,
        error: error?.message || null
      };
    } catch (error) {
      healthCheck.checks.storage = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Calculate overall health score
    const totalChecks = Object.keys(healthCheck.checks).length;
    const healthyChecks = Object.values(healthCheck.checks).filter(check => check.status === 'healthy').length;
    const healthScore = Math.round((healthyChecks / totalChecks) * 100);

    healthCheck.checks.overall = {
      status: healthScore >= 90 ? 'healthy' : healthScore >= 70 ? 'warning' : 'critical',
      score: healthScore,
      healthy_checks: healthyChecks,
      total_checks: totalChecks
    };

    console.log(`🏥 Health check completed - Score: ${healthScore}%`);

    // Log critical issues
    const criticalIssues = Object.entries(healthCheck.checks)
      .filter(([key, check]) => check.status === 'error')
      .map(([key, check]) => ({ component: key, error: check.error }));

    if (criticalIssues.length > 0) {
      console.warn('⚠️ Critical issues detected:', criticalIssues);
    }

    return res.status(200).json({
      success: true,
      message: 'System health check completed',
      health_score: healthScore,
      status: healthCheck.checks.overall.status,
      details: healthCheck,
      critical_issues: criticalIssues
    });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
