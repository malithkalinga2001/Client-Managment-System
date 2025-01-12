-- Create the Client Management System database
CREATE DATABASE Client_Management_System;
USE Client_Management_System;

-- Table: clients_register (Registering clients)
CREATE TABLE clients_register (
    registerId INT AUTO_INCREMENT PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    address TEXT,
    work_phone_number VARCHAR(20),
    cell_phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,  -- Ensure unique email for clients
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords
    website_address VARCHAR(100)
);

-- Table: schedule_task (Linked to clients_register)
CREATE TABLE schedule_task (
    taskId INT AUTO_INCREMENT PRIMARY KEY,
    registerId INT NOT NULL,  
    task_name VARCHAR(50),
    deadline DATE NOT NULL,  -- Use DATE for better data accuracy
    description TEXT,
    budget_info VARCHAR(255),
    FOREIGN KEY (registerId) REFERENCES clients_register(registerId) ON DELETE CASCADE
);

-- Table: Invoice (Linked to clients_register)
CREATE TABLE Invoice (
    invoiceId INT AUTO_INCREMENT PRIMARY KEY,
    registerId INT NOT NULL,  -- Foreign Key to clients_register
    invoice_date DATETIME NOT NULL,  -- Capturing both date and time
    contact_name VARCHAR(100) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,  -- Storing total cost for the invoice
    FOREIGN KEY (registerId) REFERENCES clients_register(registerId) ON DELETE CASCADE
);

-- Table: Services (Linked to Invoice)
CREATE TABLE services (
    serviceId INT AUTO_INCREMENT PRIMARY KEY,
    invoiceId INT NOT NULL,  -- Foreign Key to Invoice
    service_description VARCHAR(255) NOT NULL,  -- Description of the service
    cost DECIMAL(10, 2) NOT NULL,  -- Cost of the service
    FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId) ON DELETE CASCADE
);

-- Table: Payment (Linked to Invoice and clients_register)
CREATE TABLE Payment (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    invoiceId INT NOT NULL,  
    registerId INT NOT NULL,  
    card_holders_name VARCHAR(50) NOT NULL,
    card_number VARCHAR(20) NOT NULL,  -- Reduced length to more reasonable size for storing card numbers
    expiry DATE NOT NULL,
    cvc VARCHAR(4) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId) ON DELETE CASCADE,
    FOREIGN KEY (registerId) REFERENCES clients_register(registerId) ON DELETE CASCADE
);


-- Table: admin_registration (Stores admin registration details)
CREATE TABLE admin_registration (
    adminRegId INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) UNIQUE NOT NULL,  -- Ensuring unique admin usernames
    email VARCHAR(100) UNIQUE NOT NULL,  -- Ensuring email is unique across admins
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords
    contact_number VARCHAR(20),
    registration_date DATE NOT NULL,
    account_status VARCHAR(50) DEFAULT 'Active' -- Account status to manage active/inactive admins
);
