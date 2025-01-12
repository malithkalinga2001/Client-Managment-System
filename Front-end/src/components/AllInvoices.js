import React, {useState,useEffect}from 'react';
import {toast} from "react-toastify";
import axios from "axios"; // Import Axios for API calls
import { useSnapshot } from "valtio";
import Sidebar from './Sidebar';
import '../css/AdminPayment.css';


const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Fetch payments from the API
  useEffect(() => {
      axios
          .get("http://localhost:8081/invoice")
          .then((response) => {
              if (Array.isArray(response.data.data)) {
                  setInvoices(response.data.data);
              } else {
                  setError("Invalid response format. Expected an array.");
              }
              setLoading(false);
          })
          .catch((err) => {
              setError("Failed to fetch invoices.");
              setLoading(false);
              toast.error("Error fetching invoices");
          });
  }, []);
  // Handle Delete Payment
  const handleDelete = (invoiceID) => {
      if (window.confirm("Are you sure you want to delete this invoice?")) {
          axios
              .delete(`http://localhost:8081/invoice/${invoiceID}`)
              .then(() => {
                  setInvoices((prevInvoices) =>
                      prevInvoices.filter((invoice) => invoice.invoiceID !== invoiceID)
                  );
                  toast.success("Invoice deleted successfully.");
              })
              .catch((error) => {
                  toast.error("Failed to delete invoice.");
              });
      }
  };


  return (
    <div className="pay-page-container">
        <div className="pay-header-section">
          <h1>Client Management System</h1>
        </div>
   <div className="pay-main-section">
          <p className="profile-breadcrumb"> Home / Payment</p>
          <h2 className="profile-title" >All Invoice </h2>
          { <Sidebar /> }
   
      <div className="payment-table-container">
        {invoices.length > 0 ? (
          <table  className="payment-table">
            <thead>
              <tr>
                <th> ID</th>
                <th>Client ID</th>
                <th>Account ID</th>
                <th>Invoice Date</th>
                <th>Total Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoiceID}>
                  
                  <td>{invoice.invoiceID}</td>
                  <td>{invoice.registerId}</td>
                  <td>{invoice.accountID}</td>
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>

                  <td>{invoice.totalCost}</td>
                  <td>
                    <button onClick={() => handleDelete(invoice.invoiceID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AllInvoices;
