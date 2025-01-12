// PageThree.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from './Sidebar';
import image1 from '../assets/redashboard.PNG'; 
import '../css/AdminClient.css';



function AdminClient() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // State to track selected client
  const navigate = useNavigate();

  // Fetch clients from backend
  useEffect(() => {
    axios.get('http://localhost:8081/api/clients')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the clients!", error);
      });
  }, []);


  // Handle input changes for the client table
  const handleInputChange = (index, field, value) => {
    const updatedClients = [...clients];
    updatedClients[index][field] = value;
    setClients(updatedClients);
  };

  // Function to handle the Update button click
  const handleUpdateClick = () => {
    navigate('/update'); // Navigate to the PageFour component
  };


  return (
	
    <div className="admin-page-container">
    <div className="admin-header-section">
      <h1>Client Management System</h1>
    </div>
    <div className="admin-main-section">
          <p className="profile-breadcrumb"> Home / Client</p>
          <h2 className="profile-title">Client Management </h2>
          <Sidebar/>
          
		  <table className="clients-table">
            <thead>
              <tr>
                <th>Client Id</th>
                <th>Client Name</th>
                <th>Company Name</th>
                <th>Work-Phone</th>
                <th>Cell-Phone</th>
                <th>Address</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Web Address</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client.registerId}>
                  <td className="client-id">{client.registerId}</td>
                  <td>{client.contact_name} </td>
                  <td>{client.company_name} </td>
                  <td>{client.work_phone_number} </td>
                  <td>{client.cell_phone_number} </td>
                  <td>{client.address} </td>
                  <td>{client.email} </td>
                  <td>{client.account_type}</td>
                  <td>{client.website_address}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="button-set">
            <button className="save-button">Delete</button>
           
          </div>
		  </div>
        </div>
        
        
      
    
  );
}

export default AdminClient;

