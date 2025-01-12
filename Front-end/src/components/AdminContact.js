import React, { useState, useEffect } from 'react';
import "../css/AdminContact.css"; // Corrected CSS import path
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import axios from 'axios'; // Import axios
import sending from '../img/sending.gif'; // Check if this image path is correct
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Sidebar from './Sidebar';
import '../css/CssClientSide/Contact.css';

const AdminContact = () => {
    const [emailAddresses, setEmailAddresses] = useState('');
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [loading, setLoading] = useState(false); // State for loading
  
    useEffect(() => {
      // Fetch logged-in user's info
      const registerId = localStorage.getItem('registerId');
      axios.get(`http://localhost:8081/get_user_info?registerId=${registerId}`)
        .then((res) => {
          setUserEmail(res.data.email);
          setUserName(res.data.contact_name || res.data.company_name); // Adjust based on your data
        })
        .catch((err) => console.error('Error fetching user info:', err));
    }, []);
  
    const handleSendEmail = async (e) => {
      e.preventDefault();
      setLoading(true); // Set loading to true
  
      try {
        const response = await axios.post('http://localhost:8081/send_emails', {
          fromEmail: userEmail,
          fromName: userName,
          toEmails: emailAddresses.split(',').map(email => email.trim()), // Ensure emails are trimmed
          message,
        });
  
        // Set the success message
        const recipientEmails = emailAddresses.split(',').map(email => email.trim()).join(', ');
        setSuccessMessage(`Emails sent successfully to ${recipientEmails}`);
        
        // Clear the input fields
        setEmailAddresses('');
        setMessage('');
  
        // Hide the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
  
      } catch (err) {
        console.error('Error sending emails:', err);
        alert('Failed to send emails');
      } finally {
        setLoading(false); // Reset loading to false after request completion
      }
    };
  
    return (
      <div className="client-page-container">
        <div className="client-header-section">
            <h3>Client Management System</h3><br/>
        </div>
        <div className="client-contact-container">
          <Sidebar />
          <div className="client-contact-content">
          <p className="profile-breadcrumb"> Home / Contact</p>
          <h2 className="profile-title">Admin Contact </h2>
            <div className="client-send-message">
              <h2>Send Email</h2>
              <form onSubmit={handleSendEmail}>
                <div>
                  <label>To (Multiple Emails): </label>
                  <input
                    type="text"
                    placeholder="Enter comma-separated emails"
                    value={emailAddresses}
                    onChange={(e) => setEmailAddresses(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Message: </label>
                  <textarea
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="client-spinner"></span> // Spinner for loading
                  ) : (
                    'Send Email'
                  )}
                </button>
              </form>
              {/* Show success message */}
              {successMessage && <div className="client-success-message">{successMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default AdminContact;
