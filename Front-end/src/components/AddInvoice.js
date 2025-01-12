import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/invoice.css'; 
import '../css/AdminTask.css';
import Sidebar from './Sidebar';
import { serviceState } from "../utils/index.js";
import { toast } from "react-toastify";
import axios from "axios"; // Import Axios for API calls
import { useSnapshot } from "valtio";

const AddInvoice = () => {
  const navigate = useNavigate();
  const state = useSnapshot(serviceState);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [formData, setFormData] = useState({
    invoiceID: "",
    registerId: "",
    accountID: "",
    invoiceDate: "",
    totalCost: state.totalCost,
    description: state.services.map((s) => s.description).join(", "), // Optional description aggregation
  });

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveInvoice = async () => {
    if (state.services.length === 0) {
      toast.error("No services added to the invoice.");
      return;
    }

    try {
      // Step 1: Create the invoice
      const invoiceResponse = await axios.post("http://localhost:8081/invoice", formData);
   
      const createdInvoice = invoiceResponse.data.data;

      if (createdInvoice) {
        formData.invoiceID = createdInvoice.invoiceID; // Use actual invoice ID

        // Step 2: Save all services for this invoice
        const servicePromises = state.services.map((service) => {
          const serviceData = {
            invoiceID: formData.invoiceID,
            service_description: service.description,
            cost: service.cost,
          };
          return axios.post("http://localhost:8081/service", serviceData);
        });

        // Step 3: Wait for all service saving to complete
        await Promise.all(servicePromises);
      }

      toast.success("Invoice and services saved successfully!");
      clearFields();
    } catch (error) {
      // Enhanced error logging
      console.error("Error creating invoice and saving services:", error);

      if (error.response) {
        console.error("Error Response:", error.response);
        toast.error(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else {
        toast.error("Network error or server unreachable");
      }
    }
  };

  const clearFields = () => {
    setFormData({
      invoiceID: "",
      registerId: "",
      contact_name: "",
      accountID: "",
      invoiceDate: "",
      totalCost: 0.0, // Reset total cost to 0.0
      description: "", // Clear description as well
    });
    serviceState.services = []; // Clear all services from the state
  };

  return (
    <div className="invoice-page-container">
      <div className="invoice-header-section">
        <h1>Client Management System</h1>
      </div>
      <div className="invoice-main-section">
        <p className="profile-breadcrumb"> Home / Invoice</p>
        <h2 className="profile-title">Add Invoice Details </h2>
        <Sidebar />
        <form >
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client Registration ID</th>
                  <th>Account ID</th>
                  <th>Invoice Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      name="invoiceID"
                      value={formData.invoiceID}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="registerId"
                      value={formData.registerId}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="accountID"
                      value={formData.accountID}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="service" style={{marginTop:"8px"}}>Service Details</h3>
          <button
            type="button"
            className="action-button"
            onClick={() => navigate('/add-service')}
          >
            Add Service
          </button>

          <div  style={{marginTop:"20px"}}>
            <h4 className="total-cost">Total Cost: {formData.totalCost}</h4>
          </div>

          <div className="button-container">
            <button type="submit" className="action-button">Send to Client</button>
            <button
              type="button"
              className="action-button"
              onClick={() => navigate('/all-invoices')}
            >
              All Invoices
            </button>
            <button
              type="button"
              className="action-button"
              onClick={saveInvoice}
            >
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoice;
