import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './ClientSideBar';
import '../../css/CssClientSide/payment.css';
import { toast, ToastContainer } from 'react-toastify' // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [total_cost, setAmount] = useState(''); // Holds the amount for the selected invoice

  const navigate = useNavigate();

  const registerId = localStorage.getItem('registerId'); // Get the logged-in user's registerId from local storage
  
  
  useEffect(() => {
    if (registerId) {
      // Fetch invoice IDs related to this registerId from the backend
      fetch(`http://localhost:8081/invoices?registerId=${registerId}`)
        .then(response => response.json())
        .then(data => {
          setInvoices(data); // Assuming data is an array of invoice IDs
        })
        .catch(error => console.error('Error fetching invoices:', error));
    }
  }, [registerId]); // Run the effect when registerId is available


  // Fetch amount when the invoiceId changes
  useEffect(() => {
    const fetchInvoiceAmount = async () => {
      if (invoiceId) {
        try {
          const response = await fetch(`http://localhost:8081/invoices/${invoiceId}`);
          if (!response.ok) {
            throw new Error('Error fetching invoice amount');
          }
          const data = await response.json();
          setAmount(data.total_cost);
        } catch (error) {
          console.error('Error fetching invoice amount:', error);
        }
      }
    };

    fetchInvoiceAmount();
  }, [invoiceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
   

    const paymentData = {
        cardHolderName,
        cardNumber,
        expiry,
        cvc,
        invoiceId,
        registerId,
        total_cost, // Include invoice ID in payment data
    };

    fetch('http://localhost:8081/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
    .then(response => response.json())
    .then(data => {
        setCardHolderName('');
        setCardNumber('');
        setExpiry('');
        setCvc('');
        setInvoiceId('');
        toast.success('Payment successfully!');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/client-bill/:id'); // Navigate to login page
        }, 3000);
        
        
    })
    .catch(error => console.error('Error submitting payment:', error));
    
     
  };

  return (
    <div className="client-page-container">
      <div className="client-header-section">
          <h3>Client Management System</h3><br/>
      </div>
      <div className="client-contact-container">
          <Sidebar />
      <div className="client-contact-content">
      <p className="profile-breadcrumb"> Home / Payment</p>
      <h2 className="profile-title">Let's Make Payment</h2>
        <div className="payment-content">
          <form className="payment-form" onSubmit={handleSubmit}>
            {/* Move Select Invoice Above Card Holder Name */}
            <div className="payment-form-group">
              <label>Select Invoice</label>
              <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} required>
                <option value="">Select Invoice</option>
                {invoices.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            <div className="payment-form-group">
              <label>Card Holder's name</label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="Enter Card Holder's Name"
                required
              />
            </div>

            <div className="payment-form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter Card Number"
                required
                pattern="\d{16}" // Regex for 16 digits
              />
            </div>

            <div className="payment-form-group-row">
              <div className="payment-form-group">
                <label>Expiry</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                  pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$" // Regex for MM/YY
                />
              </div>
              <div className="payment-form-group">
                <label>CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  required
                  pattern="\d{3}" // Regex for 3 digits
                />
              </div>

              <div className="payment-summary">
            <p>You're paying :</p>
            <h4>Rs.{total_cost !== null ? total_cost: '0.00'}.00</h4>
              {/* Uncomment these lines if you want to show discounts, tax, and total */}
              {/* <p>Discounts & Offers: $0.00</p>
              <p>Tax: $0.00</p>
              <p>Total: $450.00</p> */}
               
            </div>

            </div>

            
             <button type="submit" className="payment-button">Pay Now</button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Payment;



