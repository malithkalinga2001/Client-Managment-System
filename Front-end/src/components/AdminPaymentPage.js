import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../css/AdminPayment.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PaymentTable = () => {

  const[data, setData]=useState([])

  useEffect(()=>{
    axios.get('http://localhost:8081/')
    .then(res => {
      console.log(res.data);
      setData(res.data)
    })
    .catch(err=> console.log(err));
  },[])

 


  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete payment`)) {
      axios.delete('http://localhost:8081/delete/'+id)
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err))
    }
  };

  const navigate = useNavigate();

  const handleClick = (paymentId) => {  
    navigate(`/read/${paymentId}`);  // Navigate to the new page
  };
  

  return (
    <div className="pay-page-container">
        <div className="pay-header-section">
          <h1>Client Management System</h1>
        </div>
   <div className="pay-main-section">
          <p className="profile-breadcrumb"> Home / Payment</p>
          <h2 className="profile-title" >Payment </h2>
          { <Sidebar /> }
   
      <div className="payment-table-container">
      <table className="payment-table">
        <thead> 
          <tr>
            <th>No</th>
            <th>Account ID</th>
            <th>Invoice ID</th>
            <th>Account Type</th>
            <th>Contact Name</th>
            <th>Company</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((client,index) => (
            <tr key={index}>
              <td className="client-id">{index + 1}</td> 
              <td>{client.account_id}</td> 
              <td>{client.invoice_id}</td> 
              <td>{client.account_type}</td> 
              <td>{client.contact_name}</td> 
              <td>{client.company_name}</td> 
              <td>{client.cell_phone_number}</td>  
              <td>
                <button  id="delete-button" onClick={() => handleDelete(client.paymentId)} /*style={{ backgroundColor: 'red', color: 'white' }}*/>
                  Delete
                </button>
                <button id="view-button"onClick={() => handleClick(client.paymentId)} /*style={{ backgroundColor: 'blue', color: 'white' }}*/>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
      </div>
      
      
  );
};

export default PaymentTable;