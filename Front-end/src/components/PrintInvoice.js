// src/components/PrintInvoice.js

import React from 'react';
import '../css/invoice.css';

const PrintInvoice = ({ invoice }) => {
  return (
    <div className="main">
      <h2>Invoice Details - #{invoice._id}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Name</th>
              <th>Contact Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{invoice.companyName}</td>
              <td>{invoice.contactName}</td>
              <td>{invoice.contactNumber}</td>
              <td>{invoice.email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Service Details</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((service, index) => (
              <tr key={index}>
                <td>{service.description}</td>
                <td>{service.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => window.print()}>Print</button>
    </div>
  );
};

export default PrintInvoice;
