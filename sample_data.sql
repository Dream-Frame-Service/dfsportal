-- Sample Data for DFS Manager Portal
-- This script will populate all tables with realistic test data

-- Insert sample employees
INSERT INTO employees (employee_id, first_name, last_name, email, phone, position, station, hire_date, salary, is_active, date_of_birth, current_address, mailing_address, reference_name, id_document_type) VALUES
('EMP001', 'John', 'Smith', 'john.smith@dfs.com', '555-0101', 'Store Manager', 'Station Alpha', '2024-01-15', 55000, true, '1985-03-12', '123 Main St, City, State 12345', '123 Main St, City, State 12345', 'Jane Doe', 'Driver License'),
('EMP002', 'Sarah', 'Johnson', 'sarah.johnson@dfs.com', '555-0102', 'Assistant Manager', 'Station Alpha', '2024-02-01', 45000, true, '1990-07-22', '456 Oak Ave, City, State 12345', '456 Oak Ave, City, State 12345', 'Mike Wilson', 'State ID'),
('EMP003', 'Mike', 'Davis', 'mike.davis@dfs.com', '555-0103', 'Cashier', 'Station Alpha', '2024-03-10', 35000, true, '1992-11-05', '789 Pine St, City, State 12345', '789 Pine St, City, State 12345', 'Lisa Brown', 'Driver License'),
('EMP004', 'Lisa', 'Brown', 'lisa.brown@dfs.com', '555-0104', 'Store Manager', 'Station Beta', '2024-01-20', 55000, true, '1988-05-18', '321 Elm St, City, State 12345', '321 Elm St, City, State 12345', 'Tom Green', 'Driver License'),
('EMP005', 'Tom', 'Wilson', 'tom.wilson@dfs.com', '555-0105', 'Cashier', 'Station Beta', '2024-04-01', 35000, true, '1993-09-30', '654 Cedar Rd, City, State 12345', '654 Cedar Rd, City, State 12345', 'Sarah Johnson', 'State ID'),
('EMP006', 'Amanda', 'Garcia', 'amanda.garcia@dfs.com', '555-0106', 'Assistant Manager', 'Station Gamma', '2024-02-15', 45000, true, '1987-12-08', '987 Maple Dr, City, State 12345', '987 Maple Dr, City, State 12345', 'John Smith', 'Driver License');

-- Insert sample vendors
INSERT INTO vendors (vendor_name, contact_person, email, phone, address, category, payment_terms, is_active, station) VALUES
('Coca-Cola Distributors', 'Robert Miller', 'rmiller@cocacola.com', '555-1001', '100 Beverage Blvd, Atlanta, GA 30309', 'Beverages', 'Net 30', true, 'All Stations'),
('Frito-Lay Inc', 'Jennifer Lopez', 'jlopez@fritolay.com', '555-1002', '200 Snack Street, Dallas, TX 75201', 'Snacks', 'Net 15', true, 'All Stations'),
('Shell Oil Company', 'David Anderson', 'danderson@shell.com', '555-1003', '300 Fuel Avenue, Houston, TX 77002', 'Fuel', 'Net 7', true, 'All Stations'),
('Red Bull Distribution', 'Maria Rodriguez', 'mrodriguez@redbull.com', '555-1004', '400 Energy Way, Los Angeles, CA 90210', 'Energy Drinks', 'Net 30', true, 'Station Alpha'),
('Marlboro Tobacco Co', 'James Taylor', 'jtaylor@marlboro.com', '555-1005', '500 Tobacco Road, Richmond, VA 23219', 'Tobacco', 'Net 15', true, 'All Stations'),
('Local Bakery Supply', 'Emily Chen', 'echen@localbakery.com', '555-1006', '600 Fresh Street, Local City, State 12345', 'Food', 'Net 14', true, 'Station Beta');

-- Insert sample products
INSERT INTO products (product_name, product_code, category, price, quantity_in_stock, minimum_stock, supplier, description, department, bar_code_case, bar_code_unit, case_price, unit_per_case, unit_price, retail_price, overdue) VALUES
('Coca-Cola 12oz Cans', 'CC12OZ', 'Beverages', 1.99, 144, 24, 'Coca-Cola Distributors', 'Classic Coca-Cola 12oz aluminum cans', 'Convenience Store', '1234567890123', '1234567890124', 23.88, 24, 0.99, 1.99, false),
('Pepsi 20oz Bottles', 'PEPSI20OZ', 'Beverages', 2.49, 48, 12, 'Coca-Cola Distributors', 'Pepsi Cola 20oz plastic bottles', 'Convenience Store', '2345678901234', '2345678901235', 29.88, 24, 1.25, 2.49, false),
('Lays Classic Chips', 'LAYS001', 'Snacks', 1.79, 72, 12, 'Frito-Lay Inc', 'Original flavor potato chips', 'Convenience Store', '3456789012345', '3456789012346', 21.48, 12, 1.79, 3.99, false),
('Red Bull Energy Drink', 'RB001', 'Energy Drinks', 3.99, 24, 6, 'Red Bull Distribution', '8.4oz Red Bull energy drink', 'Convenience Store', '4567890123456', '4567890123457', 95.76, 24, 3.99, 4.99, false),
('Marlboro Red Pack', 'MARL001', 'Tobacco', 8.99, 200, 50, 'Marlboro Tobacco Co', 'Marlboro Red cigarettes pack', 'Convenience Store', '5678901234567', '5678901234568', 179.80, 20, 8.99, 12.99, false),
('Regular Gasoline', 'GAS87', 'Fuel', 3.45, 5000, 1000, 'Shell Oil Company', '87 Octane Regular Unleaded', 'Fuel', '', '', 0, 1, 3.45, 3.45, false),
('Premium Gasoline', 'GAS93', 'Fuel', 3.75, 3000, 800, 'Shell Oil Company', '93 Octane Premium Unleaded', 'Fuel', '', '', 0, 1, 3.75, 3.75, false),
('Diesel Fuel', 'DIESEL', 'Fuel', 3.85, 2000, 500, 'Shell Oil Company', 'Ultra Low Sulfur Diesel', 'Fuel', '', '', 0, 1, 3.85, 3.85, false),
('Fresh Donuts', 'DONUT001', 'Food', 1.25, 36, 6, 'Local Bakery Supply', 'Fresh glazed donuts', 'Convenience Store', '6789012345678', '6789012345679', 15.00, 12, 1.25, 2.50, false),
('Coffee 16oz', 'COFFEE16', 'Beverages', 1.99, 100, 20, 'Local Bakery Supply', 'Fresh brewed coffee 16oz', 'Convenience Store', '', '', 0, 1, 1.99, 1.99, false);

-- Insert sample orders
INSERT INTO orders (order_number, vendor_id, order_date, expected_delivery, station, total_amount, status, notes) VALUES
('ORD-2025-001', 1, '2025-06-01', '2025-06-05', 'Station Alpha', 500.00, 'Delivered', 'Regular beverage restock'),
('ORD-2025-002', 2, '2025-06-02', '2025-06-06', 'Station Alpha', 300.50, 'Pending', 'Snack inventory replenishment'),
('ORD-2025-003', 3, '2025-06-03', '2025-06-07', 'All Stations', 15000.00, 'Shipped', 'Weekly fuel delivery'),
('ORD-2025-004', 4, '2025-06-04', '2025-06-08', 'Station Beta', 250.75, 'Processing', 'Energy drink promotion stock'),
('ORD-2025-005', 5, '2025-06-05', '2025-06-09', 'Station Gamma', 800.25, 'Confirmed', 'Tobacco products monthly order'),
('ORD-2025-006', 6, '2025-06-06', '2025-06-10', 'Station Beta', 120.00, 'Pending', 'Fresh bakery items delivery');

-- Insert sample licenses and certificates
INSERT INTO licenses_certificates (license_name, license_number, issuing_authority, issue_date, expiry_date, station, category, status) VALUES
('Business License', 'BL-2024-001', 'City Business Department', '2024-01-01', '2025-12-31', 'Station Alpha', 'Business', 'Active'),
('Tobacco Retail License', 'TRL-2024-001', 'State Revenue Department', '2024-01-01', '2025-12-31', 'Station Alpha', 'Tobacco', 'Active'),
('Food Service Permit', 'FSP-2024-001', 'Health Department', '2024-01-01', '2024-12-31', 'Station Alpha', 'Food', 'Expiring Soon'),
('Fuel Dealer License', 'FDL-2024-001', 'Environmental Agency', '2024-01-01', '2026-12-31', 'Station Alpha', 'Fuel', 'Active'),
('Business License', 'BL-2024-002', 'City Business Department', '2024-01-01', '2025-12-31', 'Station Beta', 'Business', 'Active'),
('Tobacco Retail License', 'TRL-2024-002', 'State Revenue Department', '2024-01-01', '2025-12-31', 'Station Beta', 'Tobacco', 'Active'),
('Business License', 'BL-2024-003', 'City Business Department', '2024-01-01', '2025-12-31', 'Station Gamma', 'Business', 'Active'),
('Lottery Retailer License', 'LRL-2024-001', 'State Lottery Commission', '2024-01-01', '2025-12-31', 'Station Gamma', 'Lottery', 'Active');

-- Insert sample daily sales reports (enhanced)
INSERT INTO daily_sales_reports_enhanced (report_date, station, employee_name, cash_collection_on_hand, total_short_over, credit_card_amount, debit_card_amount, mobile_amount, cash_amount, grocery_sales, ebt_sales, lottery_net_sales, scratch_off_sales, lottery_total_cash, regular_gallons, super_gallons, diesel_gallons, total_gallons, total_sales, employee_id, shift) VALUES
('2025-06-07', 'Station Alpha', 'John Smith', 500.00, -5.50, 1250.75, 800.25, 150.00, 300.00, 450.50, 75.25, 200.00, 150.00, 350.00, 850.5, 320.2, 180.8, 1351.5, 2501.00, 'EMP001', 'DAY'),
('2025-06-07', 'Station Alpha', 'Mike Davis', 350.00, 2.25, 950.50, 600.75, 100.00, 250.00, 320.25, 50.00, 175.50, 125.75, 301.25, 620.3, 280.7, 145.2, 1046.2, 1901.25, 'EMP003', 'NIGHT'),
('2025-06-07', 'Station Beta', 'Lisa Brown', 475.00, -3.00, 1100.25, 750.50, 125.00, 275.00, 400.75, 60.50, 180.25, 140.00, 320.25, 720.8, 300.5, 160.3, 1181.6, 2250.75, 'EMP004', 'DAY'),
('2025-06-06', 'Station Alpha', 'Sarah Johnson', 525.00, 0.00, 1300.00, 850.25, 175.00, 325.00, 475.25, 80.00, 220.50, 165.75, 386.25, 900.2, 350.8, 200.5, 1451.5, 2650.25, 'EMP002', 'DAY'),
('2025-06-06', 'Station Beta', 'Tom Wilson', 400.00, -8.75, 1050.75, 700.00, 90.00, 200.00, 350.00, 45.25, 160.75, 120.50, 281.25, 680.5, 260.3, 140.8, 1081.6, 2040.75, 'EMP005', 'NIGHT'),
('2025-06-05', 'Station Alpha', 'John Smith', 550.00, 1.50, 1400.50, 900.75, 200.00, 350.00, 500.25, 85.50, 240.75, 180.25, 421.00, 950.7, 380.2, 220.3, 1551.2, 2801.50, 'EMP001', 'DAY');

-- Insert sample daily sales reports (basic)
INSERT INTO daily_sales_reports (report_date, station, total_sales, cash_sales, credit_card_sales, fuel_sales, convenience_sales, employee_id) VALUES
('2025-06-07', 'Station Alpha', 4402.25, 550.00, 2050.00, 3200.25, 1202.00, 'EMP001'),
('2025-06-07', 'Station Beta', 2250.75, 275.00, 1850.75, 1800.50, 450.25, 'EMP004'),
('2025-06-06', 'Station Alpha', 2650.25, 325.00, 2150.25, 2100.00, 550.25, 'EMP002'),
('2025-06-06', 'Station Beta', 2040.75, 200.00, 1750.75, 1650.50, 390.25, 'EMP005'),
('2025-06-05', 'Station Alpha', 2801.50, 350.00, 2300.25, 2250.75, 550.75, 'EMP001'),
('2025-06-05', 'Station Gamma', 1950.25, 280.00, 1500.25, 1400.00, 550.25, 'EMP006');

-- Insert some tasks for project management
INSERT INTO tasks (task_name, description, assignee_id, due_date, priority, status, station, created_by) VALUES
('Inventory Count - Beverages', 'Complete physical count of all beverage inventory', 1, '2025-06-15', 'High', 'In Progress', 'Station Alpha', 1),
('License Renewal - Food Service', 'Renew food service permit before expiration', 4, '2025-06-30', 'Critical', 'Pending', 'Station Alpha', 1),
('Staff Training - New POS System', 'Train all staff on updated point of sale system', 2, '2025-06-20', 'Medium', 'Not Started', 'All Stations', 1),
('Fuel Tank Inspection', 'Quarterly fuel tank safety inspection', 6, '2025-06-25', 'High', 'Scheduled', 'Station Gamma', 4),
('Vendor Meeting - Coca Cola', 'Quarterly business review with Coca Cola distributor', 1, '2025-06-18', 'Medium', 'Scheduled', 'Station Alpha', 1),
('Equipment Maintenance - Coffee Machine', 'Routine maintenance on coffee brewing equipment', 5, '2025-06-12', 'Low', 'In Progress', 'Station Beta', 4);

-- Insert some projects
INSERT INTO projects (project_name, description, start_date, end_date, status, station, created_by) VALUES
('Q2 2025 Store Renovation', 'Complete renovation of Station Alpha including new flooring and lighting', '2025-06-01', '2025-07-31', 'Active', 'Station Alpha', 1),
('New POS System Implementation', 'Deploy and train staff on new point of sale system across all locations', '2025-06-10', '2025-07-10', 'Active', 'All Stations', 1),
('Fuel Tank Upgrade Project', 'Replace aging fuel storage tanks with new environmentally compliant units', '2025-07-01', '2025-09-30', 'Planning', 'Station Beta', 4),
('Digital Signage Installation', 'Install digital menu boards and promotional displays', '2025-06-15', '2025-07-15', 'Planning', 'Station Gamma', 6),
('Security System Upgrade', 'Upgrade surveillance cameras and alarm systems', '2025-06-20', '2025-08-20', 'Active', 'All Stations', 1);

COMMIT;
