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
    console.log('🧹 Starting weekly database cleanup...');
    
    const now = new Date();
    const cleanupSummary = {
      started_at: now.toISOString(),
      tasks: [] as any[]
    };

    // 1. Clean up old audit logs (keep last 90 days)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    try {
      const { count: oldAuditLogs } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .lt('event_timestamp', ninetyDaysAgo.toISOString());

      // In production, you might want to archive these before deleting
      const { error: auditDeleteError } = await supabase
        .from('audit_logs')
        .delete()
        .lt('event_timestamp', ninetyDaysAgo.toISOString());

      cleanupSummary.tasks.push({
        task: 'cleanup_old_audit_logs',
        status: auditDeleteError ? 'error' : 'success',
        records_affected: oldAuditLogs || 0,
        cutoff_date: ninetyDaysAgo.toISOString(),
        error: auditDeleteError?.message || null
      });

    } catch (error) {
      cleanupSummary.tasks.push({
        task: 'cleanup_old_audit_logs',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 2. Clean up old delivery records (archive older than 1 year)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    try {
      const { count: oldDeliveries } = await supabase
        .from('delivery_records')
        .select('*', { count: 'exact', head: true })
        .lt('delivery_date', oneYearAgo.toISOString());

      // For delivery records, we'll just count them for now
      // In production, these should be archived, not deleted
      cleanupSummary.tasks.push({
        task: 'identify_old_delivery_records',
        status: 'success',
        records_identified: oldDeliveries || 0,
        cutoff_date: oneYearAgo.toISOString(),
        action: 'identified_for_archival'
      });

    } catch (error) {
      cleanupSummary.tasks.push({
        task: 'identify_old_delivery_records',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 3. Clean up incomplete salary records (drafts older than 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    try {
      const { count: incompleteSalaries } = await supabase
        .from('salary_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Draft')
        .lt('created_at', thirtyDaysAgo.toISOString());

      // Clean up old draft salary records
      const { error: salaryDeleteError } = await supabase
        .from('salary_records')
        .delete()
        .eq('status', 'Draft')
        .lt('created_at', thirtyDaysAgo.toISOString());

      cleanupSummary.tasks.push({
        task: 'cleanup_draft_salary_records',
        status: salaryDeleteError ? 'error' : 'success',
        records_affected: incompleteSalaries || 0,
        cutoff_date: thirtyDaysAgo.toISOString(),
        error: salaryDeleteError?.message || null
      });

    } catch (error) {
      cleanupSummary.tasks.push({
        task: 'cleanup_draft_salary_records',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // 4. Update statistics and create cleanup log
    const successfulTasks = cleanupSummary.tasks.filter(t => t.status === 'success');
    const failedTasks = cleanupSummary.tasks.filter(t => t.status === 'error');
    
    const totalRecordsAffected = successfulTasks.reduce(
      (sum, task) => sum + (task.records_affected || 0), 0
    );

    cleanupSummary.completed_at = new Date().toISOString();
    cleanupSummary.summary = {
      total_tasks: cleanupSummary.tasks.length,
      successful_tasks: successfulTasks.length,
      failed_tasks: failedTasks.length,
      total_records_affected: totalRecordsAffected
    };

    console.log(`🧹 Weekly cleanup completed:
      - Tasks executed: ${cleanupSummary.summary.total_tasks}
      - Successful: ${cleanupSummary.summary.successful_tasks}
      - Failed: ${cleanupSummary.summary.failed_tasks}
      - Records processed: ${totalRecordsAffected}`);

    if (failedTasks.length > 0) {
      console.warn('⚠️ Some cleanup tasks failed:', failedTasks);
    }

    return res.status(200).json({
      success: true,
      message: 'Weekly database cleanup completed',
      summary: cleanupSummary.summary,
      details: cleanupSummary
    });

  } catch (error) {
    console.error('❌ Weekly cleanup failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Weekly cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
