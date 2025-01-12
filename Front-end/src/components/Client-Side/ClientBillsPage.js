// billsPage.js
import React, { useEffect, useState } from 'react';
import Sidebar from './ClientSideBar'; // Assuming you already have a Sidebar component
import '../../css/CssClientSide/billsPage.css'; // Import the separate CSS file for this page
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BillsPage = () => {
  const registerId = localStorage.getItem('registerId'); // Get the logged-in user's registerId from local storage

  const [payments, setPayments] = useState([]); // State to hold payment records
  

  useEffect(() => {
    axios.get(`http://localhost:8081/api/payments/view?registerId=${registerId}`)
    .then(res => {
       console.log(res)
       setPayments(res.data)

 })
    .catch(err => console.log(err))
 }, [registerId]);

  return (
    <div className="client-page-container">
    <div className="client-header-section">
        <h3>Client Management System</h3><br/>
    </div>
    <div className="client-contact-container">
        <Sidebar />
    <div className="client-contact-content">
    <p className="profile-breadcrumb"> Home / Payment / View</p>
    <h2 className="profile-title">My Payments</h2>
        <table className="table table-responsive table-bordered table-hover col-12">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Invoice ID</th>
              <th>Company Name</th> {/* Updated Header */}
              <th>Contact Name</th> {/* New Header */}
              <th>Invoice Date</th>
              
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payments, index) => (
                <tr key={payments.invoiceId}>
                  <td>{index + 1}</td>
                  <td>{payments.invoiceID}</td>
                  <td>{payments.company_name}</td> {/* Adjusted to access company name */}
                  <td>{payments.contact_name}</td> {/* Adjusted to access contact name */}
                  <td>{new Date(payments.invoiceDate).toLocaleDateString()}</td> {/* Format only the date */}

                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default BillsPage;