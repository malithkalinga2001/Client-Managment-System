import React, { useState } from "react"; 
import axios from 'axios';
import { useNavigate ,Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import '../../css/CssClientSide/ClientCommon.css';


function ClientSignUp() {
  const [values, setValues] = useState({
    email: '',
    contact_name: '',
    website_address: '',
    password: '',
    confirmPassword: '',
    account_type: '',
    company_name: '',
    address: '',
    work_phone_number: '',
    cell_phone_number: ''
  });

  const navigate = useNavigate();

  // Function to reset the form fields
  const resetForm = () => {
    setValues({
      email: '',
      contact_name: '',
      website_address: '',
      password: '',
      confirmPassword: '',
      account_type: '',
      company_name: '',
      address: '',
      work_phone_number: '',
      cell_phone_number: ''
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match."); // Show error toast
      return;
    }

    // Create a copy of values without the confirmPassword field
    const { confirmPassword, ...dataToSubmit } = values;

    axios.post('http://localhost:8081/add_user', dataToSubmit)
      .then((res) => {
        toast.success("User successfully registered!"); // Show success toast
        resetForm(); // Clear the input fields

        // After 5 seconds, navigate to the dashboard
        setTimeout(() => {
          navigate('/client-login');
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Registration failed. Please try again."); // Show error toast
      });
  }

  return (
    <div className="client-sign-up">
      <h2>CMS</h2>
      <h4 className="client-center-texts">Client Account Creation</h4>
      <form onSubmit={handleSubmit}>
        <select
          style={{ height: '40px', marginBottom: '15px' }}
          value={values.account_type} // Set value for controlled component
          onChange={(e) => setValues({ ...values, account_type: e.target.value })}
          required
        >
          <option value="">Account Type</option>
          <option value="Business">Business</option>
          <option value="Personal">Personal</option>
        </select>

        <input
          type="text"
          placeholder="User Name"
          value={values.contact_name} // Set value for controlled component
          onChange={(e) => setValues({ ...values, contact_name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Company Name"
          value={values.company_name} // Set value for controlled component
          onChange={(e) => setValues({ ...values, company_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={values.address} // Set value for controlled component
          onChange={(e) => setValues({ ...values, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Work Phone Number"
          value={values.work_phone_number} // Set value for controlled component
          onChange={(e) => setValues({ ...values, work_phone_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Cell Phone Number"
          value={values.cell_phone_number} // Set value for controlled component
          onChange={(e) => setValues({ ...values, cell_phone_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Web Site Address"
          value={values.website_address} // Set value for controlled component
          onChange={(e) => setValues({ ...values, website_address: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={values.email} // Set value for controlled component
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={values.password} // Set value for controlled component
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={values.confirmPassword} // Set value for controlled component
          onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
          required
        />

        <button type="submit">Create Account</button>
      </form>
      
      {/* Toast container for notifications */}
      <ToastContainer />

      <div className="client-center-links">
        <a className="client-forgot-password" href="/client-forgot-password">Forgot Password</a>
        <Link> | </Link>
        <a className="client-back-to-home" href="/client-login">Back to Login</a>
      </div>
    </div>
  );
}

export default ClientSignUp;
