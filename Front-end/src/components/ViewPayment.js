import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../css/ViewPayment.css'; // Ensure the updated CSS is linked
import axios from 'axios';


const ViewPayment = () => {
  const { id } = useParams(); // Get accountId from URL

  // Simulate fetching payment details (Replace this with actual API call if needed)
  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
     axios.get('http://localhost:8081/read/'+ id)
     .then(res => {
        console.log(res)
        setPaymentDetails(res.data[0])


  })
     .catch(err => console.log(err))
  }, []);

  console.log(paymentDetails.invoiceDate);

  const formatValue = (value) => {
    if (value === null && value === undefined) return'No data available';

    // For invoiceId and amount, ensure they are displayed as strings
  if (typeof value === 'number') return value.toString(); // Convert numbers to string for display
  
  // If it's a date string
  const date = new Date(value);
  return !isNaN(date) ? date.toLocaleDateString('en-GB') : value; // Format date if valid
  };

  const handlePrint = () => {
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="pay-page-container">
        <div className="pay-header-section">
          <h1>Client Management System</h1>
        </div>
        <div className="pay-main-section">
          <p className="profile-breadcrumb">Home / Payment / View Payment</p>
          <h2 className="profile-title">Payment Details</h2>
          <Sidebar/>
            {paymentDetails ? (
              <div className="payment-details">
                <h3> Invoice {paymentDetails.invoiceId}</h3>
                <div className="bill">
                  <div className="bill-item">
                    <span className="bill-label">Invoice ID:</span>
                    <span className="bill-value">{formatValue(paymentDetails.invoiceID)}</span>
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Client name:</span>
                    <span className="bill-value">{formatValue(paymentDetails.client_name)}</span>
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Company:</span>
                    <span className="bill-value">{formatValue(paymentDetails.company)}</span>
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Contact:</span>
                    <span className="bill-value">{formatValue(paymentDetails.contact)}</span>
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Invoice Date:</span>
                    <span className="bill-value">{formatValue(paymentDetails.invoice_date)}</span>
                    

                    
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Task Name:</span>
                    <span className="bill-value">{formatValue(paymentDetails.task_name)}</span>
                  </div>
                  <div className="bill-item">
                    <span className="bill-label">Amount:</span>
                    <span className="bill-value">{formatValue(paymentDetails.amount)}</span>
                  </div>
                  
                </div>
                {/* Print Button */}
                <button onClick={handlePrint} className="print-button">Print Invoice</button>
              </div>
            ) : (
              <p>Loading payment details...</p>
            )}
          </div>
        </div>
     

  );
};

export default ViewPayment;