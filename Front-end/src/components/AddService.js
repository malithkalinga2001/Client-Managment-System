import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/invoice.css';
import '../css/AdminTask.css';
import Sidebar from './Sidebar';
import { serviceState } from "../utils/index.js";
import { useSnapshot } from "valtio";

const AddService = () => {
  const state = useSnapshot(serviceState);
  const navigate = useNavigate();

  // State for managing service details in the first table (form)
  const [formServices, setFormServices] = useState({
    description: '',
    cost: ''
  });

  const [nextId, setNextId] = useState(1); // Start ID tracking from 1

  // Function to handle changes in input fields for the first table (form)
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormServices((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = (e) => {
    e.preventDefault(); // Prevent form submission
    const id = nextId; // Use the tracked ID
    serviceState.addService({ id, ...formServices });
    setFormServices({ description: "", cost: "" }); // Reset form
    setNextId(id + 1); // Increment the ID for the next service
  };

  const handleRemoveService = (id) => {
    serviceState.removeService(id);
    // Optional: Recalculate IDs (if services need renumbering after deletion)
    setNextId(state.services.length > 0 ? Math.max(...state.services.map(s => s.id)) + 1 : 1);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-section">
        <h1>Client Management System</h1>
      </div>
      <div className="admin-main-section">
        <p className="profile-breadcrumb">Home / Invoice / Add Service</p>
        <h2 className="profile-title">Add Service</h2>
        <Sidebar />
        <form>
          {/* Service Input Table (First Table) */}
          <table className='first-table'>
            <thead>
              <tr>
                <th>Description</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={formServices.description}
                    onChange={handleFormInputChange}
                    placeholder="Service Description"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="cost"
                    value={formServices.cost}
                    onChange={handleFormInputChange}
                    placeholder="Cost"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Form buttons */}
          <div className="form-button-container">
            <button className="add-service-btn" type="submit" onClick={handleAddService}>
              Add
            </button>
            <button className="add-service-btn" type="button" onClick={() => setFormServices({ description: "", cost: "" })}>
              Reset
            </button>
            <br />
          </div>
        </form>

        {/* Display Table (Second Table) */}
        <div>
          <table className="tasks-table">
            <thead>
              <br />
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.description}</td>
                  <td>{service.cost}</td>
                  <td>
                    <button onClick={() => handleRemoveService(service.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-service-btn" onClick={() => navigate('/add-invoice')} style={{width:"140px",height:"70px"}}>
            Back to Invoice
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default AddService;
