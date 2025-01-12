import React, { useState } from 'react';
import ClientSideBar from './ClientSideBar'; // Assuming you've created the Sidebar component
import { toast, ToastContainer } from 'react-toastify' // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';
import '../../css/CssClientSide/ClientTask.css';



const ClientTask = () => {
  // State for form inputs
const [taskData, setTaskData] = useState({
    task_name: '',
    deadline: '',
    description: '',
    budget_info: '',
});

  // State for storing success/error messages
const [message, setMessage] = useState('');

const registerId = localStorage.getItem('registerId');

  // Handle input change
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
    ...prevData,
    [name]: value,
    }));
};

  // Validation function
const validateForm = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Check if deadline is a past date
    if (taskData.deadline < today) {
    setMessage('Deadline cannot be a past date');
    return false;
    }

    // Check if budget_info is a positive number
    if (isNaN(taskData.budget_info) || parseFloat(taskData.budget_info) <= 0) {
    setMessage('Budgetary information must be a positive number');
    return false;
    }

    return true;
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
        return; // If form is invalid, exit the function
    }

    try {
        const response = await fetch('http://localhost:8081/schedule_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task_name: taskData.task_name,
            task_description: taskData.description, // Ensure correct field name
            budget_info: taskData.budget_info,
            task_date: taskData.deadline, // Ensure correct field name
            registerId: registerId // Replace with actual registerId if available
          }),
        });
  
        console.log('Response status:', response.status); // Log response status
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('Response data:', responseData); // Log response data
          toast.success('Task saved successfully!');
        } else {
          console.error('Failed to save task:', response.statusText); // Log error status text
          toast.error('Failed to save task.');
        }
      } catch (error) {
        console.error('An error occurred:', error); // Log error
        toast.error('An error occurred while saving the task.');
      }
    };
const today = new Date().toISOString().split('T')[0];

return (
    <div className="client-task-container">
         <div className="client-header-section">
                <h3>Client Management System</h3><br/>
         </div>
        <div className="client-contact-container">
             <ClientSideBar/>
       <div className="client-task-main-content">
       <p className="profile-breadcrumb"> Home / Task</p>
       <h2 className="profile-task-title">Schedule Task </h2>
      
        <form className="client-task-form" onSubmit={handleSubmit}>
        <div className="client-task-form-group">
            <label>Task Name</label>
            <input 
            type="text" 
            name="task_name" 
            value={taskData.task_name} 
            onChange={handleInputChange} 
            required 
            />
        </div>
        <div className="client-task-form-group">
            <label>Deadline</label>
            <input 
            type="date" 
            name="deadline" 
            value={taskData.deadline} 
            onChange={handleInputChange} 
              min={today} // Disable past dates
            required 
            />
        </div>
        <div className="client-task-form-group">
            <label>Task Description</label>
            <textarea 
            rows="4" 
            name="description" 
            value={taskData.description} 
            onChange={handleInputChange} 
            required 
            />
        </div>
        <div className="client-task-form-group">
            <label>Budgetary Information</label>
            <input 
            type="text" 
            name="budget_info" 
            value={taskData.budget_info} 
            onChange={handleInputChange} 
            required 
            />
        </div>
        <button type="submit" className="client-task-save-button">Save</button>
        {message && <p className="client-task-message">{message}</p>}
        </form>
        <ToastContainer />
        <p className="client-task-footer-text">Contact us to track your task</p>
    </div>
    </div>
    </div>
    
);
};

export default ClientTask;
