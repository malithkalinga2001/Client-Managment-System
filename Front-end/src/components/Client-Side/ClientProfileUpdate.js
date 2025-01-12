import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/CssClientSide/ClientProfileUpdate.css";
import ClientSideBar from "../Client-Side/ClientSideBar";

const ClientProfileUpdate = () => {
  const registerId = localStorage.getItem("registerId")
  // State variables for form inputs and errors
  const [profileData, setProfileData] = useState({
    account_type: "",
    contact_name: "",
    company_name: "",
    address: "",
    work_phone_number: "",
    cell_phone_number: "",
    email: "",
    website_address: "",
  });

  const [errors, setErrors] = useState({
    work_phone_number: "",
    cell_phone_number: "",
  });



  // Fetch existing profile data on component mount (optional)
  useEffect(() => {
    fetch(`http://localhost:8081/clients_register/${registerId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProfileData(data))
      .catch((err) => {
        console.error("Error fetching profile data:", err);
        toast.error("Failed to load profile data. Please try again later.");
      });
  }, [registerId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Phone number validation
  const validatePhoneNumber = (name, value) => {
    const phonePattern = /^[0-9]{10}$/; // Matches exactly 10 digits
    if (!phonePattern.test(value)) {
      return `${
        name === "work_phone_number" ? "Work" : "Cell"
      } Phone Number must be exactly 10 digits.`;
    }
    return ""; // No error
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate phone numbers
    const workPhoneError = validatePhoneNumber(
      "work_phone_number",
      profileData.work_phone_number
    );
    const cellPhoneError = validatePhoneNumber(
      "cell_phone_number",
      profileData.cell_phone_number
    );

    setErrors({
      work_phone_number: workPhoneError,
      cell_phone_number: cellPhoneError,
    });

    // If there are any validation errors, don't submit the form
    if (workPhoneError || cellPhoneError) {
      alert("Please correct the errors before submitting.");
      return;
    }

    // Send updated profile data to the backend
    fetch(`http://localhost:8081/clients_register/${registerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then(({ status, body }) => {
        if (status >= 400 || body.error) {
          throw new Error(body.error || "Error updating profile");
        }
        console.log("Profile updated:", body);
        toast.success("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        if (err.message === "Required fields are missing") {
          toast.error("Required fields are missing");
        } else {
          toast.error("Error updating profile");
        }
      });
  };

  return (
    <div className="client-page-container">
    <div className="client-header-section">
        <h3>Client Management System</h3><br/>
    </div>
    <div className="client-contact-container">
      <ClientSideBar />
      <div className="client-contact-content">
      <p className="profile-breadcrumb"> Home / Update Profile</p>
      <h2 className="profile-title">Update Profile </h2>
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Account Type</label>
              <input
                type="text"
                name="account_type"
                value={profileData.account_type}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                name="contact_name"
                value={profileData.contact_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company_name"
                value={profileData.company_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Work Phone Number</label>
              <input
                type="text"
                name="work_phone_number"
                value={profileData.work_phone_number}
                onChange={handleInputChange}
              />
              {errors.work_phone_number && (
                <p className="error">{errors.work_phone_number}</p>
              )}
            </div>
            <div className="form-group">
              <label>Cell Phone Number</label>
              <input
                type="text"
                name="cell_phone_number"
                value={profileData.cell_phone_number}
                onChange={handleInputChange}
              />
              {errors.cell_phone_number && (
                <p className="error">{errors.cell_phone_number}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Website Address</label>
              <input
                type="text"
                name="website_address"
                value={profileData.website_address}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="update-button">
              Update
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ClientProfileUpdate;