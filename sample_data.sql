-- Comprehensive Sample Data for DFS Manager Portal
-- Generated on 2025-06-08

-- Clear existing data (if any)
TRUNCATE TABLE task_assignments CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE project_members CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE employees CASCADE;

-- Insert Employees (DFS team members)
INSERT INTO employees (id, name, email, phone, department, position, hire_date, status, salary, benefits, emergency_contact, skills, certifications, performance_rating, manager_id) VALUES
(1, 'Alex Rodriguez', 'alex.rodriguez@dfsportal.com', '+1-555-0101', 'Engineering', 'Senior Full Stack Developer', '2023-01-15', 'active', 95000.00, '{"health_insurance": true, "dental": true, "vision": true, "401k": "6% match", "pto_days": 25}', '{"name": "Maria Rodriguez", "phone": "+1-555-0102", "relationship": "spouse"}', '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]', '["AWS Solutions Architect", "React Certified Developer"]', 4.7, NULL),

(2, 'Sarah Chen', 'sarah.chen@dfsportal.com', '+1-555-0103', 'Engineering', 'Frontend Developer', '2023-03-22', 'active', 78000.00, '{"health_insurance": true, "dental": true, "vision": false, "401k": "4% match", "pto_days": 20}', '{"name": "David Chen", "phone": "+1-555-0104", "relationship": "brother"}', '["React", "Vue.js", "CSS", "JavaScript", "Figma", "Tailwind"]', '["Frontend Masters Certificate"]', 4.5, 1),

(3, 'Marcus Johnson', 'marcus.johnson@dfsportal.com', '+1-555-0105', 'Engineering', 'Backend Developer', '2023-02-10', 'active', 82000.00, '{"health_insurance": true, "dental": true, "vision": true, "401k": "5% match", "pto_days": 22}', '{"name": "Lisa Johnson", "phone": "+1-555-0106", "relationship": "wife"}', '["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker"]', '["Python Institute Certification"]', 4.6, 1),

(4, 'Emily Davis', 'emily.davis@dfsportal.com', '+1-555-0107', 'Product', 'Product Manager', '2022-11-05', 'active', 105000.00, '{"health_insurance": true, "dental": true, "vision": true, "401k": "6% match", "pto_days": 25}', '{"name": "Michael Davis", "phone": "+1-555-0108", "relationship": "husband"}', '["Product Strategy", "Agile", "Scrum", "Analytics", "User Research"]', '["Certified Scrum Product Owner", "Google Analytics"]', 4.8, NULL),

(5, 'Jordan Kim', 'jordan.kim@dfsportal.com', '+1-555-0109', 'Design', 'UX/UI Designer', '2023-04-18', 'active', 72000.00, '{"health_insurance": true, "dental": false, "vision": true, "401k": "4% match", "pto_days": 20}', '{"name": "Alex Kim", "phone": "+1-555-0110", "relationship": "sibling"}', '["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"]', '["UX Design Institute Certificate"]', 4.4, 4),

(6, 'Ryan Thompson', 'ryan.thompson@dfsportal.com', '+1-555-0111', 'DevOps', 'DevOps Engineer', '2023-01-30', 'active', 88000.00, '{"health_insurance": true, "dental": true, "vision": true, "401k": "5% match", "pto_days": 23}', '{"name": "Kate Thompson", "phone": "+1-555-0112", "relationship": "spouse"}', '["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "monitoring"]', '["AWS Certified DevOps Engineer"]', 4.7, 1),

(7, 'Priya Patel', 'priya.patel@dfsportal.com', '+1-555-0113', 'QA', 'QA Engineer', '2023-05-12', 'active', 68000.00, '{"health_insurance": true, "dental": true, "vision": false, "401k": "4% match", "pto_days": 20}', '{"name": "Raj Patel", "phone": "+1-555-0114", "relationship": "father"}', '["Manual Testing", "Automation", "Selenium", "Jest", "Cypress"]', '["ISTQB Foundation Level"]', 4.3, 4),

(8, 'David Wilson', 'david.wilson@dfsportal.com', '+1-555-0115', 'Sales', 'Sales Representative', '2023-06-01', 'active', 65000.00, '{"health_insurance": true, "dental": true, "vision": true, "401k": "3% match", "pto_days": 18, "commission": true}', '{"name": "Sarah Wilson", "phone": "+1-555-0116", "relationship": "wife"}', '["Sales", "CRM", "Lead Generation", "Customer Relations"]', '["Salesforce Certified"]', 4.2, NULL);

-- Insert Projects (DFS Portal development phases)
INSERT INTO projects (id, name, description, start_date, end_date, status, budget, client_id, manager_id, priority, tags, requirements, milestones, risk_assessment) VALUES
(1, 'DFS Portal MVP', 'Initial development of the DFS Manager Portal with core functionality including employee management, project tracking, and basic analytics.', '2023-01-15', '2023-06-30', 'completed', 150000.00, NULL, 1, 'high', '["MVP", "Core Features", "Employee Management"]', '{"features": ["Employee CRUD", "Project Management", "Basic Dashboard", "Authentication"], "tech_stack": ["React", "TypeScript", "Supabase", "Tailwind"]}', '{"phase1": "2023-02-15", "phase2": "2023-04-15", "launch": "2023-06-30"}', '{"technical": "medium", "timeline": "low", "budget": "low"}'),

(2, 'Advanced Analytics Module', 'Development of advanced analytics and reporting features including real-time dashboards, custom reports, and data visualization components.', '2023-07-01', '2023-11-30', 'completed', 80000.00, NULL, 4, 'high', '["Analytics", "Reporting", "Dashboards"]', '{"features": ["Real-time Charts", "Custom Reports", "Data Export", "Advanced Filtering"], "integrations": ["Chart.js", "D3.js", "Excel Export"]}', '{"design": "2023-07-15", "development": "2023-09-30", "testing": "2023-11-15"}', '{"technical": "high", "timeline": "medium", "budget": "low"}'),

(3, 'Mobile App Development', 'Creation of a mobile application for iOS and Android to complement the web portal, focusing on essential features for field employees.', '2023-12-01', '2024-05-31', 'in_progress', 120000.00, NULL, 1, 'medium', '["Mobile", "iOS", "Android", "React Native"]', '{"features": ["Employee Check-in", "Task Management", "Push Notifications", "Offline Mode"], "platforms": ["iOS", "Android"]}', '{"prototype": "2024-01-15", "alpha": "2024-03-15", "beta": "2024-04-30"}', '{"technical": "high", "timeline": "high", "budget": "medium"}'),

(4, 'AI Integration Phase', 'Integration of AI features including Claude AI for automated insights, smart scheduling, and predictive analytics for employee performance.', '2024-01-15', '2024-08-31', 'in_progress', 95000.00, NULL, 4, 'high', '["AI", "Machine Learning", "Claude AI", "Automation"]', '{"features": ["AI Chat Assistant", "Predictive Analytics", "Smart Scheduling", "Automated Reports"], "ai_models": ["Claude AI", "Custom ML Models"]}', '{"research": "2024-02-15", "mvp": "2024-05-15", "full_integration": "2024-08-31"}', '{"technical": "very_high", "timeline": "high", "budget": "medium"}'),

(5, 'Security Enhancement', 'Comprehensive security audit and implementation of advanced security features including multi-factor authentication, encryption, and compliance measures.', '2024-03-01', '2024-07-31', 'planned', 60000.00, NULL, 1, 'high', '["Security", "Compliance", "MFA", "Encryption"]', '{"features": ["Multi-factor Auth", "End-to-end Encryption", "Security Audit", "Compliance Dashboard"], "standards": ["SOC2", "GDPR", "HIPAA"]}', '{"audit": "2024-03-31", "implementation": "2024-06-30", "certification": "2024-07-31"}', '{"technical": "medium", "timeline": "low", "budget": "low"}');

-- Insert Project Members (assign employees to projects)
INSERT INTO project_members (project_id, employee_id, role, join_date, hourly_rate, allocation_percentage, responsibilities) VALUES
-- DFS Portal MVP team
(1, 1, 'Tech Lead', '2023-01-15', 55.00, 100, '["Architecture Design", "Code Review", "Team Leadership"]'),
(1, 2, 'Frontend Developer', '2023-01-15', 40.00, 100, '["UI Development", "Component Library", "User Experience"]'),
(1, 3, 'Backend Developer', '2023-01-15', 42.00, 100, '["API Development", "Database Design", "Backend Services"]'),
(1, 4, 'Product Manager', '2023-01-15', 50.00, 80, '["Requirements", "Stakeholder Management", "Product Strategy"]'),
(1, 6, 'DevOps Engineer', '2023-01-15', 45.00, 60, '["CI/CD Setup", "Infrastructure", "Deployment"]'),

-- Advanced Analytics Module team
(2, 1, 'Tech Lead', '2023-07-01', 55.00, 70, '["Technical Architecture", "Performance Optimization"]'),
(2, 2, 'Frontend Developer', '2023-07-01', 40.00, 90, '["Data Visualization", "Dashboard Development"]'),
(2, 4, 'Product Manager', '2023-07-01', 50.00, 60, '["Analytics Requirements", "User Stories"]'),
(2, 7, 'QA Engineer', '2023-07-01', 35.00, 80, '["Testing Analytics", "Data Validation"]'),

-- Mobile App Development team
(3, 1, 'Technical Advisor', '2023-12-01', 55.00, 40, '["Mobile Architecture", "Technical Guidance"]'),
(3, 2, 'Mobile Developer', '2023-12-01', 40.00, 100, '["React Native Development", "Mobile UI"]'),
(3, 5, 'UI/UX Designer', '2023-12-01', 38.00, 80, '["Mobile Design", "User Experience"]'),
(3, 7, 'QA Engineer', '2023-12-01', 35.00, 60, '["Mobile Testing", "Device Testing"]'),

-- AI Integration Phase team
(4, 1, 'AI Lead', '2024-01-15', 55.00, 80, '["AI Architecture", "Model Integration"]'),
(4, 3, 'Backend Developer', '2024-01-15', 42.00, 70, '["AI API Development", "Data Pipeline"]'),
(4, 4, 'Product Manager', '2024-01-15', 50.00, 90, '["AI Feature Planning", "User Experience"]'),

-- Security Enhancement team
(5, 1, 'Security Lead', '2024-03-01', 55.00, 60, '["Security Architecture", "Code Review"]'),
(5, 6, 'DevOps Engineer', '2024-03-01', 45.00, 80, '["Security Infrastructure", "Compliance"]');

-- Insert Tasks (detailed work items)
INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, estimated_hours, actual_hours, tags, dependencies, progress_percentage, notes) VALUES
-- DFS Portal MVP tasks
(1, 'Setup Project Infrastructure', 'Initialize React TypeScript project with Vite, setup Supabase integration, configure Tailwind CSS and basic project structure.', 1, 1, 'completed', 'high', '2023-01-20', 16, 18, '["setup", "infrastructure"]', '[]', 100, 'Project successfully initialized with all required dependencies.'),

(2, 'Employee Management CRUD', 'Implement complete employee management system with create, read, update, delete operations and form validation.', 1, 2, 'completed', 'high', '2023-02-15', 32, 35, '["frontend", "crud"]', '[1]', 100, 'All CRUD operations working with proper validation and error handling.'),

(3, 'Database Schema Design', 'Design and implement comprehensive database schema for employees, projects, tasks, and relationships.', 1, 3, 'completed', 'high', '2023-01-25', 24, 22, '["database", "backend"]', '[1]', 100, 'Schema implemented with proper constraints and indexes.'),

(4, 'Authentication System', 'Implement user authentication with Supabase Auth, including login, registration, and role-based access control.', 1, 3, 'completed', 'high', '2023-02-10', 20, 24, '["auth", "security"]', '[3]', 100, 'Auth system working with proper role management.'),

(5, 'Project Management Interface', 'Create project management dashboard with project creation, member assignment, and progress tracking.', 1, 2, 'completed', 'medium', '2023-03-15', 28, 32, '["frontend", "projects"]', '[2, 4]', 100, 'Project management interface complete with all features.'),

-- Advanced Analytics Module tasks
(6, 'Real-time Dashboard Framework', 'Develop framework for real-time data visualization using Chart.js and WebSocket connections.', 2, 2, 'completed', 'high', '2023-08-15', 40, 45, '["analytics", "realtime"]', '[]', 100, 'Dashboard framework implemented with excellent performance.'),

(7, 'Custom Report Builder', 'Build flexible report builder allowing users to create custom reports with various filters and export options.', 2, 2, 'completed', 'medium', '2023-09-30', 36, 38, '["reporting", "export"]', '[6]', 100, 'Report builder working with PDF and Excel export.'),

(8, 'Performance Analytics', 'Implement employee performance analytics with charts, trends, and automated insights.', 2, 1, 'completed', 'medium', '2023-10-15', 32, 30, '["analytics", "performance"]', '[6]', 100, 'Performance analytics providing valuable insights.'),

-- Mobile App Development tasks
(9, 'Mobile App Architecture', 'Design React Native architecture and setup development environment for iOS and Android.', 3, 1, 'completed', 'high', '2024-01-15', 24, 26, '["mobile", "architecture"]', '[]', 100, 'Mobile architecture designed with scalability in mind.'),

(10, 'Employee Check-in Feature', 'Develop mobile check-in functionality with GPS tracking and photo capture capabilities.', 3, 2, 'in_progress', 'high', '2024-02-28', 32, 28, '["mobile", "checkin"]', '[9]', 85, 'Check-in feature nearly complete, testing GPS accuracy.'),

(11, 'Push Notification System', 'Implement push notification system for task assignments, reminders, and important updates.', 3, 2, 'planned', 'medium', '2024-03-31', 20, 0, '["mobile", "notifications"]', '[10]', 0, 'Waiting for check-in feature completion.'),

-- AI Integration Phase tasks
(12, 'Claude AI Integration Setup', 'Setup Claude AI API integration and design conversation framework for employee assistance.', 4, 1, 'in_progress', 'high', '2024-03-15', 32, 24, '["ai", "integration"]', '[]', 75, 'API integration working, refining conversation flow.'),

(13, 'Predictive Analytics Model', 'Develop machine learning models for predicting employee performance and project outcomes.', 4, 3, 'planned', 'high', '2024-05-15', 48, 0, '["ai", "ml", "prediction"]', '[12]', 0, 'Waiting for data collection and Claude AI setup.'),

(14, 'AI-Powered Smart Scheduling', 'Implement intelligent scheduling system that optimizes employee assignments based on skills and availability.', 4, 1, 'planned', 'medium', '2024-06-30', 40, 0, '["ai", "scheduling"]', '[12, 13]', 0, 'Design phase, waiting for AI framework completion.'),

-- Security Enhancement tasks
(15, 'Security Audit', 'Comprehensive security audit of the entire application including penetration testing and vulnerability assessment.', 5, 6, 'planned', 'high', '2024-04-15', 32, 0, '["security", "audit"]', '[]', 0, 'Security firm selected, audit scheduled for March.'),

(16, 'Multi-Factor Authentication', 'Implement MFA using TOTP, SMS, and email verification methods.', 5, 1, 'planned', 'high', '2024-05-31', 24, 0, '["security", "mfa"]', '[15]', 0, 'Design approved, implementation starts after audit.');

-- Insert Task Assignments (additional assignments for collaborative tasks)
INSERT INTO task_assignments (task_id, employee_id, assigned_date, role, notes) VALUES
(1, 6, '2023-01-15', 'DevOps Support', 'Assist with CI/CD pipeline setup and deployment configuration.'),
(2, 7, '2023-02-01', 'QA Support', 'Test employee management features and validate form submissions.'),
(5, 4, '2023-02-20', 'Product Owner', 'Define requirements and user stories for project management features.'),
(6, 7, '2023-07-15', 'QA Engineer', 'Test dashboard performance and validate real-time data accuracy.'),
(10, 5, '2024-01-20', 'UX Designer', 'Design mobile check-in user interface and user experience flow.'),
(12, 4, '2024-01-20', 'Product Manager', 'Define AI assistant requirements and conversation scenarios.');

-- Verify data insertion
SELECT 'Sample data insertion completed successfully!' as status;

-- Quick verification queries
SELECT COUNT(*) as employee_count FROM employees;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as assignment_count FROM task_assignments;