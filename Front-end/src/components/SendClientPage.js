// src/components/SendClientPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const SendClientPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main">
      <h2>Invoice Sent to Client Successfully!</h2>
      <button onClick={() => navigate('/')}>Go Back to Add Invoice</button>
    </div>
  );
};

export default SendClientPage;
