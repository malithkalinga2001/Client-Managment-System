// Import dependencies
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();
const JWT_SECRET = 'Adminpanel@1234'; // Replace with a strong secret key


app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 8081;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Client_Management_System" //sql DB name
});

// Check database connection
// Check database connection
db.getConnection()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Database connection failed: ' + err.stack);
    });




// API endpoints

/* ----Admin Side backend apis here...----*/



// Login Route
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password: '********' });

  try {
    // Query the database using async/await with mysql2
    const [results] = await db.execute('SELECT * FROM admin_registration WHERE LOWER(email) = LOWER(?)', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const user = results[0];

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create the JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });

  } catch (error) {
    // Handle any errors
    console.error('Database or bcrypt error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


  // Forgot Password Route
app.post('/ForgotPassword', async (req, res) => {
  const { email, cellPhoneNumber, newPassword, confirmPassword } = req.body;

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
      // Find the user by email in the database
      const [results] = await db.execute('SELECT * FROM admin_registration WHERE LOWER(email) = LOWER(?)', [email]);

      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];

      // Verify phone number
      if (user.cellPhoneNumber !== cellPhoneNumber) {
          return res.status(400).json({ message: 'Phone number does not match' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password in the database
      await db.execute(
          'UPDATE admin_registration SET password = ? WHERE email = ?',
          [hashedPassword, email]
      );

      return res.status(200).json({ message: 'Password reset successful!' });

  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


  // Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });
  
  // Middleware to authenticate JWT
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }



// Get all Payment
app.get('/', async (req, res) => {
  const sql = `
      SELECT 
          p.registerId AS account_id,
          p.invoiceId AS invoice_id,
          c.account_type,
          c.contact_name,
          c.company_name,
          c.cell_phone_number,
          p.paymentId
      FROM payment p
      JOIN clients_register c ON p.registerId = c.registerId
      JOIN invoice i ON p.invoiceId = i.invoiceId
  `;

  try {
      const [result] = await db.execute(sql);
      return res.json(result);
  } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Server error' });
  }
});



// Get Payment view
app.get('/read/:id', async (req, res) => {
  const sql = `
      SELECT 
          c.contact_name AS client_name,
          c.company_name AS company,
          c.cell_phone_number AS contact,
          i.invoiceDate AS invoice_date,
          t.task_name AS task_name,
          p.amount AS amount,
          p.invoiceID
      FROM payment p
      JOIN clients_register c ON p.registerId = c.registerId
      JOIN invoice i ON p.invoiceID = i.invoiceID
      JOIN schedule_task t ON t.registerId = c.registerId 
      WHERE p.paymentId = ?
  `;

  const { id } = req.params;
  console.log(id);

  try {
      const [result] = await db.execute(sql, [id]);
      console,log(result)
      return res.json(result);
  } catch (err) {
      console.error("Error inside server:", err);
      return res.status(500).json({ message: "Error inside server" });
  }
});



// Delete Payment
app.delete('/delete/:id', async (req, res) => {
  const sql = "DELETE FROM payment WHERE paymentId = ?";
  const { id } = req.params;
  console.log(id);

  try {
      const [result] = await db.execute(sql, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Payment not found" });
      }

      return res.json({ message: "Payment deleted successfully", result });
  } catch (err) {
      console.error("Error inside server:", err);
      return res.status(500).json({ message: "Error inside server" });
  }
});



// POST method to change password for a registered user
app.post("/admin/change_password", async (req, res) => {
  const { currentPassword, newPassword } = req.body; // Include currentPassword and newPassword in the request body

  // 1. Get the hashed password from the database
  const selectQuery = "SELECT password FROM admin_registration"; // This should typically be a specific user query

  try {
      const [results] = await db.execute(selectQuery);

      // If no user exists
      if (results.length === 0) {
          return res.status(404).json({ error: "No users found" });
      }

      // Assuming there is only one user, we get the hashed password of the first user.
      const hashedPassword = results[0].password;

      // 2. Compare the current password with the hashed password
      const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

      if (!isMatch) {
          return res.status(400).json({ error: "Current password is incorrect" });
      }

      // 3. Hash the new password before saving
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // 4. Update the password in the database
      const updateQuery = "UPDATE admin_registration SET password = ? WHERE password = ?";

      const [data] = await db.execute(updateQuery, [hashedNewPassword, hashedPassword]);

      if (data.affectedRows === 0) {
          return res.status(400).json({ error: "Password update failed" });
      }

      return res.status(200).json("Password updated successfully");
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error processing password change", details: err });
  }
});


// API Endpoints for Task Management

// GET method to fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM schedule_task');

    // Map registerId to clientId before sending the response
    const formattedResults = results.map(task => ({
      ...task,
      clientId: task.registerId // Map registerId to clientId
    }));

    res.json(formattedResults);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch all clients
app.get('/api/clients', async (req, res) => {
  const query = "SELECT * FROM clients_register";
  
  try {
    const [result] = await db.execute(query);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Delete client data
app.delete('/api/clients/:registerId', async (req, res) => {
  const { registerId } = req.params;
  const query = "DELETE FROM clients_register WHERE registerId = ?";
  
  try {
    const [result] = await db.execute(query, [registerId]);
    return res.status(200).json("Client deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET method to fetch all employees
app.get('/all_employee', async (req, res) => {
  let sql = "SELECT * FROM client_management_system.admin_registration;";
  
  try {
    const [data] = await db.execute(sql);

    const formattedDate = data.map(employee => ({
      ...employee,
      registration_date: new Date(employee.registration_date).toISOString().split('T')[0] // Formats to 'YYYY-MM-DD'
    }));

    return res.json(formattedDate);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// PUT method to update an employee
app.put('/all_employee/:adminRegId', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const query = `
    UPDATE client_management_system.admin_registration 
    SET 
        admin_name = ?, 
        user_name = ?, 
        email = ?, 
        password = ?, 
        contact_number = ?, 
        registration_date = ?, 
        account_status = ? 
    WHERE 
        adminRegId = ?
  `;

  const values = [
    req.body.admin_name,
    req.body.user_name,
    req.body.email,
    req.body.password,
    req.body.contact_number,
    req.body.registration_date,
    req.body.account_status,
    req.params.adminRegId  // Use adminRegId from URL params
  ];

  try {
    const [result] = await db.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json("Employee updated successfully");
  } catch (err) {
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET method to fetch all clients
app.get('/clients', async (req, res) => {
  const sql = "SELECT * FROM client_management_system.clients_register;";
  
  try {
    // Use 'execute' for promises-based query execution
    const [results] = await db.execute(sql);
    res.status(200).json(results); // Send the results as a JSON response
  } catch (err) {
    console.error("Error fetching clients:", err.message);
    res.status(500).json({ message: "Error fetching clients", details: err.message });
  }
});



// Save New Invoice
app.post("/invoice", async (req, res) => {
  console.log("Received request to /invoice with body:", req.body); // Log the incoming request body

  const sql = `
      INSERT INTO invoice (invoiceID, registerId, accountID, totalCost, invoiceDate, description)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    req.body.invoiceID,
    req.body.registerId,
    req.body.accountID, // Ensure this matches the database schema
    req.body.totalCost,
    req.body.invoiceDate, // Ensure this matches the database schema
    req.body.description || null, // Optional field; defaults to null if not provided
  ];

  console.log("Prepared SQL query:", sql); // Log the SQL query
  console.log("Query values:", values); // Log the values being inserted into the query

  try {
    // Ensure you're using a proper database library like mysql2/promise
    const [result] = await db.query(sql, values);
    console.log("Database query result:", result); // Log the result of the query

    // Return success response with inserted data details
    return res.status(201).json({
      success: true,
      message: "Invoice added successfully",
      data: {
        invoiceID: req.body.invoiceID,
        registerId: req.body.registerId,
        accountID: req.body.accountID,
        totalCost: req.body.totalCost,
        invoiceDate: req.body.invoiceDate,
        description: req.body.description || null,
        insertId: result.insertId, // Include the auto-generated ID if applicable
      },
    });
  } catch (err) {
    console.error("Error inserting invoice data:", err.message); // Log the error message
    console.error("Error details:", err); // Log the full error object for more details

    // Respond with error details
    return res.status(500).json({
      success: false,
      message: "Error inserting data into database",
      details: err.message,
    });
  }
});



// Save New Service
app.post('/service', async (req, res) => {
  const { invoiceID, service_description, cost } = req.body;
  // Validate input fields
  if ( !invoiceID || !service_description || cost === undefined) {
      return res.status(400).json({
          message: 'All required fields must be filled.',
          missingFields: [
              !invoiceID && 'invoiceID',
              !service_description && 'service_description',
              cost === undefined && 'cost'
          ].filter(Boolean) // Filters out falsy values
      });
  }

  // Insert service into the database
  const sql = 'INSERT INTO Service ( invoiceID, service_description, cost) VALUES ( ?, ?, ?)';
  const values = [invoiceID, service_description, cost];
  try {
      const [result] = await db.query(sql, values);
      res.status(200).json({
          message: 'Service added successfully.',
          data: result
      });
  } catch (err) {
      console.error('Error adding service:', err);
      res.status(500).json({
          message: 'Failed to add service.',
          error: err.message
      });
  }
});

app.delete('/invoice/:id', async (req, res) => {
  const sql = "DELETE FROM invoice WHERE invoiceID = ?";
  const id = req.params.id;
  
  console.log(`Deleting invoice with ID: ${id}`);

  // Check if the ID is valid before proceeding
  if (!id) {
      return res.status(400).json({ message: "Invoice ID is required" });
  }

  try {
      const [result] = await db.execute(sql, [id]);  // Using 'execute' method with promises

      // Check if any rows were affected (i.e., if the invoice was actually deleted)
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Invoice not found" });
      }

      // Return success response
      return res.status(200).json({
          message: "Invoice deleted successfully",
          data: result,
      });
  } catch (err) {
      console.error("Error inside server:", err.message);
      return res.status(500).json({ message: "Error inside server", details: err.message });
  }
});

// Get all invoices
app.get("/invoice", async (req, res) => {
  const query = "SELECT * FROM invoice"; // Replace 'invoice' with your table name
  try {
    // Use async/await to handle the query
    const [results] = await db.query(query);
    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Failed to fetch invoices:", err.message);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});
 
app.put("/admin_register/:email", async (req, res) => {
  const email = req.params.email; // Get email from route params
  const { admin_name, user_name, contact_number, registration_date } = req.body;

  // Check if all required fields are present
  if (!admin_name || !user_name || !contact_number || !registration_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // SQL query to update the user's information
  const updateSql = `
    UPDATE admin_registration 
    SET admin_name = ?, user_name = ?, contact_number = ?, registration_date = ?
    WHERE email = ?
  `;

  const values = [admin_name, user_name, contact_number, registration_date, email];
  console.log(values)

  try {
    // Execute the update query
    const [updateResult] = await db.execute(updateSql, values);

    // Check if any rows were affected
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the updated user data
    const selectSql = "SELECT * FROM admin_registration WHERE email = ?";
    const [updatedResult] = await db.execute(selectSql, [email]);

    // Return the updated user data
    res.json({
      success: "User info updated successfully",
      updatedUser: updatedResult[0],
    });
  } catch (err) {
    console.error("Error updating user info: ", err);
    return res.status(500).json({ message: "Error updating user info", details: err });
  }
});
app.get("/admin_register/:email", async (req, res) => {
  const email = req.params.email; // Extract email from URL parameter

  try {
    const selectSql = "SELECT * FROM admin_registration WHERE email = ?";
    const [result] = await db.execute(selectSql, [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: result[0] }); // Send the user data in response
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ message: "Error fetching user info", details: err });
  }
});









/* ----Client Side Backend apis here...----- */

// POST method to change password for a registered user
app.post("/change_password", async (req, res) => {
  const { currentPassword, newPassword, registerId } = req.body;

  if (!registerId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // 1. Get the hashed password from the database
    const [results] = await db.execute(
      "SELECT password FROM clients_register WHERE registerId = ?",
      [registerId]
    );

    // If user does not exist
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = results[0].password;

    // 2. Compare the current password with the hashed password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // 3. Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the password in the database
    const [updateResult] = await db.execute(
      "UPDATE clients_register SET password = ? WHERE registerId = ?",
      [hashedNewPassword, registerId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: "Password update failed" });
    }

    return res.status(200).json("Password updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});


// Api for Send email from client side
const nodemailer = require('nodemailer');
const { log } = require('console');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'niwaofficial1@gmail.com',  // Your Gmail address
    pass: 'spef knhn enzb rcsq',     // Your Gmail 'App Password'
  },
});

// Endpoint to send emails
app.post('/send_emails', (req, res) => {
  const { fromEmail, fromName, toEmails, message } = req.body;

  // Validate input
  if (!fromEmail || !fromName || !toEmails || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

 // Construct the HTML email content with proper styling
 const emailContent = `
 <div style="font-family: Arial, sans-serif; color: #333;">
   <p>Dear Recipient,</p>
   <p>You have received a new message from the <strong>Client Management System (CMS)</strong>.</p>
   
   <p><strong style="color: #007BFF;">Please find the details below:</strong></p>
   
   <hr style="border: 1px solid #ddd;" />
   
   <p><strong>Sender Information:</strong></p>
   <ul>
     <li><strong>Name:</strong> ${fromName}</li>
     <li><strong>Email:</strong> <a href="mailto:${fromEmail}" style="color: #007BFF;">${fromEmail}</a></li>
   </ul>
   
   <p><strong>Message:</strong></p>
   <blockquote style="border-left: 3px solid #007BFF; padding-left: 10px; color: #555;">
     ${message}
   </blockquote>
   
   <hr style="border: 1px solid #ddd;" />
   
   <p>We kindly request you to review the above message at your earliest convenience.</p>
   
   <p>Best regards,</p>
   <p><strong style="color: #007BFF;">Client Management System (CMS) Team</strong></p>
   
   <br />
   <p style="font-size: 0.9em; color: #888;">---<br />
   <em>This is an automated message. Please do not reply directly to this email.</em></p>
 </div>
`;

    const mailOptions = {
    from: fromEmail,  // Sender's email address
    to: toEmails,     // Array of recipient emails
    subject: 'New Message from Client Management System (CMS)',
    html: emailContent, // Set content as HTML
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.json({ success: `Emails sent to: ${toEmails.join(', ')}` });
  });
});



// For Signup
// POST method to add a new user with hashed password
app.post("/add_user", async (req, res) => {
  const {
    email,
    website_address,
    password,
    account_type,
    company_name,
    contact_name,
    address,
    work_phone_number,
    cell_phone_number,
  } = req.body;

  try {
    // 1. Check if the email already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM clients_register WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert the new user into the database
    const insertQuery = `
      INSERT INTO clients_register 
      (email, website_address, password, account_type, company_name, contact_name, address, work_phone_number, cell_phone_number) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      email,
      website_address,
      hashedPassword,
      account_type,
      company_name,
      contact_name,
      address,
      work_phone_number,
      cell_phone_number,
    ];

    const [insertResult] = await db.execute(insertQuery, values);

    if (insertResult.affectedRows === 1) {
      return res.status(201).json({ success: "User added successfully" });
    }

    // Fallback response if insertion failed
    return res.status(500).json({ message: "Failed to add user" });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
});



// Fetch user information based on user ID
app.get("/get_user_info", async (req, res) => {
  const { registerId } = req.query;

  if (!registerId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const [result] = await db.execute("SELECT * FROM clients_register WHERE registerId = ?", [registerId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result[0]);
  } catch (error) {
    console.error("Error retrieving user info: ", error);
    return res.status(500).json({ message: "Error retrieving user info", details: error.message });
  }
});



// Login endpoint with hashed password comparison
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("Login attempt with email: ", email);

    // Query the database to find the user by email
    const [result] = await db.execute("SELECT * FROM clients_register WHERE email = ?", [email]);

    // If no user is found, return an unauthorized response
    if (result.length === 0) {
      console.log("No user found with email: ", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];
    console.log("User found: ", { email: user.email, registerId: user.registerId });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log("Password match for email: ", email);

      // Respond with success and include some user details
      return res.json({
        success: "Login successful",
        user: {
          registerId: user.registerId,
          email: user.email,
          account_type: user.account_type,
          company_name: user.company_name,
        },
      });
    } else {
      console.log("Password mismatch for email: ", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
});



app.post('/reset_password', async (req, res) => {
  const { email, cell_phone_number, newPassword } = req.body;

  if (!email || !cell_phone_number || !newPassword) {
    return res.status(400).json({ message: 'Email, phone number, and new password are required.' });
  }

  try {
    // Check if the user exists with the given email and phone number
    const [results] = await db.execute(
      'SELECT * FROM clients_register WHERE email = ? AND cell_phone_number = ?',
      [email, cell_phone_number]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or phone number.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.execute('UPDATE clients_register SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.status(200).json({ message: 'Password successfully updated.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});




//client -invoice view pages

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  const query = `
    SELECT i.invoiceID, i.invoiceDate, c.company_name 
    FROM invoice i 
    JOIN clients_register c ON i.registerId = c.registerId
  `;

  try {
    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Get invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;

  const sqlQuery = `
    SELECT 
        c.company_name,
        c.cell_phone_number AS contact_no,
        c.account_type,
        c.email,
        i.invoiceDate,
        GROUP_CONCAT(
            JSON_OBJECT('service_description', s.service_description, 'cost', s.cost)
        ) AS services
    FROM 
        invoice AS i
    JOIN 
        clients_register AS c ON i.registerId = c.registerId
    LEFT JOIN 
        service AS s ON i.invoiceID = s.invoiceID
    WHERE 
        i.invoiceID = ?
    GROUP BY 
        i.invoiceID
  `;

  try {
    const [results] = await db.execute(sqlQuery, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Parse the services field from a string to an array
    const invoice = results[0];
    invoice.services = JSON.parse(`[${invoice.services || ''}]`);

    res.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Payment Routes
app.post('/api/payment', async (req, res) => {
  const { cardHolderName, cardNumber, expiry, cvc, invoiceId, registerId, total_cost } = req.body;

  // Validate required fields
  if (!cardHolderName || !cardNumber || !expiry || !cvc || !invoiceId || !registerId || !total_cost) {
    return res.status(400).json({ error: 'All payment fields are required' });
  }

  const payment_status = 'Completed';
  const payment_date = new Date();

  const query = `
    INSERT INTO Payment (invoiceID, registerId, card_holders_name, card_number, expiry, cvc, amount, payment_status, payment_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [invoiceId, registerId, cardHolderName, cardNumber, expiry, cvc, total_cost, payment_status, payment_date];

  try {
    // Execute query with mysql2/promise
    const [result] = await db.execute(query, values);

    res.status(200).json({
      message: 'Payment processed successfully',
      paymentId: result.insertId,
    });
  } catch (err) {
    console.error('Error inserting payment:', err);
    res.status(500).json({ error: 'Failed to process payment', details: err });
  }
});



//get payment
app.get('/api/payments/view', async (req, res) => {
  const { registerId } = req.query;

  // Validate input
  if (!registerId) {
    return res.status(400).json({ error: 'Register ID is required' });
  }

  const query = `
    SELECT 
      p.invoiceID,
      c.contact_name,
      c.company_name,
      i.invoiceDate  
    FROM 
      Payment p
    JOIN 
      clients_register c ON p.registerId = c.registerId
    JOIN 
      invoice i ON p.invoiceID = i.invoiceID
    WHERE 
      p.registerId = ?
  `;

  try {
    // Execute the query with mysql2/promise
    const [results] = await db.execute(query, [registerId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching payment records:', err);
    res.status(500).json({ error: 'Failed to retrieve payment records', details: err });
  }
});


//get invoice id 
app.get("/invoices", async (req, res) => {
  const { registerId } = req.query;
  console.log(registerId);

  // Validate input
  if (!registerId) {
    return res.status(400).json({ message: "registerId is required" });
  }

  // SQL Query to fetch invoice IDs related to the registerId
  const query = `SELECT invoiceID FROM invoice WHERE registerId = ?`;

  try {
    // Execute the query using async/await
    const [results] = await db.execute(query, [registerId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No invoices found for this registerId" });
    }

    // Extract invoice IDs and return them
    const invoiceIds = results.map(row => row.invoiceID);
    res.status(200).json(invoiceIds);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: "Server error", details: err });
  }
});


// Get amount by invoiceId
app.get("/invoices/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;

  // SQL Query to fetch the total_cost related to the invoiceId
  const query = `SELECT totalCost FROM invoice WHERE invoiceID = ?`;

  try {
    // Execute the query using async/await
    const [results] = await db.execute(query, [invoiceId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Send the total_cost back to the client
    const total_cost = results[0].totalCost;
    res.status(200).json({ total_cost });
  } catch (err) {
    console.error('Error fetching invoice amount:', err);
    return res.status(500).json({ message: 'Server error', details: err });
  }
});



// CLIENT TASK SCHEDULE

app.post("/schedule_task", async (req, res) => {
  const { task_name, task_description, budget_info, task_date, registerId } = req.body;

  // Validate input
  if (!task_name || !task_description || !budget_info || !task_date || !registerId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO schedule_task (task_name, description, budget_info, deadline, registerId) VALUES (?, ?, ?, ?, ?)";
  const values = [task_name, task_description, budget_info, task_date, registerId];

  try {
    // Execute query using async/await
    const [result] = await db.execute(sql, values);

    // Respond with success message
    res.status(201).json({ message: "Task scheduled successfully" });
  } catch (err) {
    console.error("Error inserting task:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err });
  }
});

// Fetch individual user data based on registerId
app.get("/clients_register/:registerId", async (req, res) => {
  const registerId = req.params.registerId;

  // Validate registerId
  if (!registerId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = "SELECT * FROM clients_register WHERE registerId = ?";

  try {
    // Fetch user data from the database using async/await
    const [result] = await db.execute(sql, [registerId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.json(result[0]);
  } catch (err) {
    console.error("Error retrieving user info: ", err);
    return res.status(500).json({ message: "Error retrieving user info", details: err });
  }
});


//CLIENT PROFILE UPDATE

app.put("/clients_register/:registerId", async (req, res) => {
  const registerId = req.params.registerId;
  const {
    email,
    website_address,
    account_type,
    company_name,
    contact_name,
    address,
    work_phone_number,
    cell_phone_number,
  } = req.body;

  // Check if all required fields are present
  if (
    !email ||
    !website_address ||
    !account_type ||
    !company_name ||
    !contact_name ||
    !address ||
    !work_phone_number ||
    !cell_phone_number
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // SQL query to update the user's information
  const updateSql = `
    UPDATE clients_register 
    SET email = ?, website_address = ?, account_type = ?, company_name = ?, contact_name = ?, address = ?, work_phone_number = ?, cell_phone_number = ?
    WHERE registerId = ?
  `;

  const values = [
    email,
    website_address,
    account_type,
    company_name,
    contact_name,
    address,
    work_phone_number,
    cell_phone_number,
    registerId,
  ];

  try {
    // Execute the update query
    const [updateResult] = await db.execute(updateSql, values);

    // Check if any rows were affected
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the updated user data
    const selectSql = "SELECT * FROM clients_register WHERE registerId = ?";
    const [updatedResult] = await db.execute(selectSql, [registerId]);

    // Return the updated user data
    res.json({
      success: "User info updated successfully",
      updatedUser: updatedResult[0],
    });
  } catch (err) {
    console.error("Error updating user info: ", err);
    return res.status(500).json({ message: "Error updating user info", details: err });
  }
});


// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

