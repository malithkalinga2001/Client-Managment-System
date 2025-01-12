import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/invoice.css'; // Corrected path to invoice.css


const PrintPage = ({ invoice }) => {
  const navigate = useNavigate();

  return (
    <div className="main">
      <h2>Invoice Print Preview</h2>
      <p>Invoice ID: {invoice?.invoiceID}</p>
      <p>Client Reg ID: {invoice?.clientRegID}</p>
      <p>Account ID: {invoice?.accountID}</p>
      <p>Invoice Date: {invoice?.invoiceDate}</p>
      <p>Total Cost: {invoice?.totalCost}</p>

      <h3>Services</h3>
      {invoice?.services?.map((service, index) => (
        <div key={index}>
          <p>{service.description} - ${service.cost}</p>
        </div>
      ))}

      <div className="button-container">
        <button onClick={() => window.print()} className="print-button">
          Print Invoice
        </button>
        <button onClick={() => navigate('/')} className="back-button">
          Go Back to Add Invoice
        </button>
      </div>
    </div>
  );
};

export default PrintPage;
