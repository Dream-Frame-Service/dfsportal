// Sample data loader for DFS Manager Portal
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🗂️  Loading comprehensive sample data for DFS Manager Portal...')

// Sample employees data
const employees = [
  {
    id: 1,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@dfsportal.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Full Stack Developer',
    hire_date: '2023-01-15',
    status: 'active',
    salary: 95000.00,
    benefits: {
      health_insurance: true,
      dental: true,
      vision: true,
      "401k": "6% match",
      pto_days: 25
    },
    emergency_contact: {
      name: "Maria Rodriguez",
      phone: "+1-555-0102",
      relationship: "spouse"
    },
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    certifications: ["AWS Solutions Architect", "React Certified Developer"],
    performance_rating: 4.7,
    manager_id: null
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@dfsportal.com',
    phone: '+1-555-0103',
    department: 'Engineering',
    position: 'Frontend Developer',
    hire_date: '2023-03-22',
    status: 'active',
    salary: 78000.00,
    benefits: {
      health_insurance: true,
      dental: true,
      vision: false,
      "401k": "4% match",
      pto_days: 20
    },
    emergency_contact: {
      name: "David Chen",
      phone: "+1-555-0104",
      relationship: "brother"
    },
    skills: ["React", "Vue.js", "CSS", "JavaScript", "Figma", "Tailwind"],
    certifications: ["Frontend Masters Certificate"],
    performance_rating: 4.5,
    manager_id: 1
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus.johnson@dfsportal.com',
    phone: '+1-555-0105',
    department: 'Engineering',
    position: 'Backend Developer',
    hire_date: '2023-02-10',
    status: 'active',
    salary: 82000.00,
    benefits: {
      health_insurance: true,
      dental: true,
      vision: true,
      "401k": "5% match",
      pto_days: 22
    },
    emergency_contact: {
      name: "Lisa Johnson",
      phone: "+1-555-0106",
      relationship: "wife"
    },
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    certifications: ["Python Institute Certification"],
    performance_rating: 4.6,
    manager_id: 1
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@dfsportal.com',
    phone: '+1-555-0107',
    department: 'Product',
    position: 'Product Manager',
    hire_date: '2022-11-05',
    status: 'active',
    salary: 105000.00,
    benefits: {
      health_insurance: true,
      dental: true,
      vision: true,
      "401k": "6% match",
      pto_days: 25
    },
    emergency_contact: {
      name: "Michael Davis",
      phone: "+1-555-0108",
      relationship: "husband"
    },
    skills: ["Product Strategy", "Agile", "Scrum", "Analytics", "User Research"],
    certifications: ["Certified Scrum Product Owner", "Google Analytics"],
    performance_rating: 4.8,
    manager_id: null
  },
  {
    id: 5,
    name: 'Jordan Kim',
    email: 'jordan.kim@dfsportal.com',
    phone: '+1-555-0109',
    department: 'Design',
    position: 'UX/UI Designer',
    hire_date: '2023-04-18',
    status: 'active',
    salary: 72000.00,
    benefits: {
      health_insurance: true,
      dental: false,
      vision: true,
      "401k": "4% match",
      pto_days: 20
    },
    emergency_contact: {
      name: "Alex Kim",
      phone: "+1-555-0110",
      relationship: "sibling"
    },
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    certifications: ["UX Design Institute Certificate"],
    performance_rating: 4.4,
    manager_id: 4
  }
]

// Sample projects data
const projects = [
  {
    id: 1,
    name: 'DFS Portal MVP',
    description: 'Initial development of the DFS Manager Portal with core functionality including employee management, project tracking, and basic analytics.',
    start_date: '2023-01-15',
    end_date: '2023-06-30',
    status: 'completed',
    budget: 150000.00,
    client_id: null,
    manager_id: 1,
    priority: 'high',
    tags: ["MVP", "Core Features", "Employee Management"],
    requirements: {
      features: ["Employee CRUD", "Project Management", "Basic Dashboard", "Authentication"],
      tech_stack: ["React", "TypeScript", "Supabase", "Tailwind"]
    },
    milestones: {
      phase1: "2023-02-15",
      phase2: "2023-04-15",
      launch: "2023-06-30"
    },
    risk_assessment: {
      technical: "medium",
      timeline: "low",
      budget: "low"
    }
  },
  {
    id: 2,
    name: 'AI Integration Phase',
    description: 'Integration of AI features including Claude AI for automated insights, smart scheduling, and predictive analytics for employee performance.',
    start_date: '2024-01-15',
    end_date: '2024-08-31',
    status: 'in_progress',
    budget: 95000.00,
    client_id: null,
    manager_id: 4,
    priority: 'high',
    tags: ["AI", "Machine Learning", "Claude AI", "Automation"],
    requirements: {
      features: ["AI Chat Assistant", "Predictive Analytics", "Smart Scheduling", "Automated Reports"],
      ai_models: ["Claude AI", "Custom ML Models"]
    },
    milestones: {
      research: "2024-02-15",
      mvp: "2024-05-15",
      full_integration: "2024-08-31"
    },
    risk_assessment: {
      technical: "very_high",
      timeline: "high",
      budget: "medium"
    }
  }
]

// Sample tasks data
const tasks = [
  {
    id: 1,
    title: 'Setup Project Infrastructure',
    description: 'Initialize React TypeScript project with Vite, setup Supabase integration, configure Tailwind CSS and basic project structure.',
    project_id: 1,
    assignee_id: 1,
    status: 'completed',
    priority: 'high',
    due_date: '2023-01-20',
    estimated_hours: 16,
    actual_hours: 18,
    tags: ["setup", "infrastructure"],
    dependencies: [],
    progress_percentage: 100,
    notes: 'Project successfully initialized with all required dependencies.'
  },
  {
    id: 2,
    title: 'Claude AI Integration Setup',
    description: 'Setup Claude AI API integration and design conversation framework for employee assistance.',
    project_id: 2,
    assignee_id: 1,
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-03-15',
    estimated_hours: 32,
    actual_hours: 24,
    tags: ["ai", "integration"],
    dependencies: [],
    progress_percentage: 75,
    notes: 'API integration working, refining conversation flow.'
  },
  {
    id: 3,
    title: 'Employee Management CRUD',
    description: 'Implement complete employee management system with create, read, update, delete operations and form validation.',
    project_id: 1,
    assignee_id: 2,
    status: 'completed',
    priority: 'high',
    due_date: '2023-02-15',
    estimated_hours: 32,
    actual_hours: 35,
    tags: ["frontend", "crud"],
    dependencies: [1],
    progress_percentage: 100,
    notes: 'All CRUD operations working with proper validation and error handling.'
  }
]

async function loadSampleData() {
  try {
    console.log('🧹 Clearing existing data...')
    
    // Clear existing data in reverse order due to foreign key constraints
    await supabase.from('task_assignments').delete().neq('id', 0)
    await supabase.from('tasks').delete().neq('id', 0)
    await supabase.from('project_members').delete().neq('id', 0)
    await supabase.from('projects').delete().neq('id', 0)
    await supabase.from('employees').delete().neq('id', 0)
    
    console.log('👥 Inserting employees...')
    const { data: employeesResult, error: employeesError } = await supabase
      .from('employees')
      .insert(employees)
    
    if (employeesError) {
      console.error('❌ Error inserting employees:', employeesError)
      return
    }
    console.log(`✅ Inserted ${employees.length} employees`)
    
    console.log('📋 Inserting projects...')
    const { data: projectsResult, error: projectsError } = await supabase
      .from('projects')
      .insert(projects)
    
    if (projectsError) {
      console.error('❌ Error inserting projects:', projectsError)
      return
    }
    console.log(`✅ Inserted ${projects.length} projects`)
    
    console.log('✅ Inserting tasks...')
    const { data: tasksResult, error: tasksError } = await supabase
      .from('tasks')
      .insert(tasks)
    
    if (tasksError) {
      console.error('❌ Error inserting tasks:', tasksError)
      return
    }
    console.log(`✅ Inserted ${tasks.length} tasks`)
    
    // Insert project members
    const projectMembers = [
      {
        project_id: 1,
        employee_id: 1,
        role: 'Tech Lead',
        join_date: '2023-01-15',
        hourly_rate: 55.00,
        allocation_percentage: 100,
        responsibilities: ["Architecture Design", "Code Review", "Team Leadership"]
      },
      {
        project_id: 1,
        employee_id: 2,
        role: 'Frontend Developer',
        join_date: '2023-01-15',
        hourly_rate: 40.00,
        allocation_percentage: 100,
        responsibilities: ["UI Development", "Component Library", "User Experience"]
      },
      {
        project_id: 2,
        employee_id: 1,
        role: 'AI Lead',
        join_date: '2024-01-15',
        hourly_rate: 55.00,
        allocation_percentage: 80,
        responsibilities: ["AI Architecture", "Model Integration"]
      },
      {
        project_id: 2,
        employee_id: 4,
        role: 'Product Manager',
        join_date: '2024-01-15',
        hourly_rate: 50.00,
        allocation_percentage: 90,
        responsibilities: ["AI Feature Planning", "User Experience"]
      }
    ]
    
    console.log('👔 Inserting project members...')
    const { data: membersResult, error: membersError } = await supabase
      .from('project_members')
      .insert(projectMembers)
    
    if (membersError) {
      console.error('❌ Error inserting project members:', membersError)
      return
    }
    console.log(`✅ Inserted ${projectMembers.length} project members`)
    
    console.log('\n🎉 Sample data loaded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   • ${employees.length} employees`)
    console.log(`   • ${projects.length} projects`)
    console.log(`   • ${tasks.length} tasks`)
    console.log(`   • ${projectMembers.length} project assignments`)
    
    // Verification queries
    console.log('\n🔍 Verifying data...')
    
    const { data: employeeCount } = await supabase
      .from('employees')
      .select('id', { count: 'exact' })
    
    const { data: projectCount } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
    
    const { data: taskCount } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
    
    console.log(`✅ Verified: ${employeeCount?.length || 0} employees in database`)
    console.log(`✅ Verified: ${projectCount?.length || 0} projects in database`)
    console.log(`✅ Verified: ${taskCount?.length || 0} tasks in database`)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the data loader
loadSampleData()
