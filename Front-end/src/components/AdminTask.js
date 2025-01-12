// PageTwo.js

import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from './Sidebar';
import image1 from '../assets/redashboard.PNG'; 
import '../css/AdminTask.css';

function AdminTask() {

// State to manage tasks, search input, and filtered tasks
const [tasks, setTasks] = useState([]);
const [searchTerm, setSearchTerm] = useState(''); // State to manage search term
const [filteredTasks, setFilteredTasks] = useState([]); // State to manage filtered tasks

// Fetch tasks from backend on component mount
useEffect(() => {
  fetch('http://localhost:8081/tasks')
    .then(response => response.json())
    .then(data => {
      setTasks(data);
      setFilteredTasks(data); // Initialize filteredTasks with all tasks
    })
    .catch(error => console.error('Error fetching tasks:', error));
}, []);

// Delete a task
const deleteTask = (taskId) => {
  fetch(`http://localhost:8081/tasks/${taskId}`, {
    method: 'DELETE',
  })
    .then(() => {
      setTasks(tasks.filter(task => task.taskId !== taskId));
      setFilteredTasks(filteredTasks.filter(task => task.taskId !== taskId));
    })
    .catch(error => console.error('Error deleting task:', error));
};

// Search tasks by taskId when search button is clicked
const handleSearch = () => {
  if (searchTerm === '') {
    setFilteredTasks(tasks); // If search term is empty, show all tasks
  } else {
    const filtered = tasks.filter(task => 
      task.taskId.toString().includes(searchTerm) // Matching taskId only
    );
    setFilteredTasks(filtered); // Update filteredTasks with the search results
  }
};

  return (
	  
    <div className="admin-page-container">
    <div className="admin-header-section">
      <h1>Client Management System</h1>
    </div>
    <div className="admin-main-section">
          <p className="profile-breadcrumb"> Home / Tasks</p>
          <h2 className="profile-title">Manage Tasks </h2>
         <Sidebar/>
		  
		{/* Search Field and Button */}
    <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by Task ID..." // Updated placeholder for taskId
            value={searchTerm} // Bind search term state to input field
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          />
          <button className="search-button" onClick={handleSearch}>Search</button> {/* Trigger search on click */}
        </div>

        {/* Task Management Table */}
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Id</th>
              <th>Client Id</th>
              <th>Task Name</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Budget Info</th>
            </tr>
          </thead>
          <tbody>
            {/* Generate rows for the filtered tasks */}
            {filteredTasks.map((task, index) => (
              <tr key={index}>
                <td className="task-id">{task.taskId}</td> {/* Task ID column */}
                <td>{task.clientId}</td> {/* Client ID column, showing registerId data */}
                <td>{task.task_name}</td>
                <td>{task.description}</td>
                <td>{new Date(task.deadline).toLocaleDateString()}</td> {/* Format deadline to show only date */}
                <td>{task.budget_info}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Button inside the white box */}
        <button className="delete-button" onClick={() => deleteTask(tasks[0]?.taskId)}>Delete</button>
      </div>
		  </div>
           
        
        
        
     
   
  );
}

export default AdminTask;


