import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminChangePassword from './components/AdminChangePassword';
import AdminProfile from './components/AdminProfile';
import Dashboard from './components/Dashboard';
import MainDashboard from './components/MainDashboard';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import AdminClient from './components/AdminClient';
import AdminTask from './components/AdminTask';
import AdminContact from './components/AdminContact';

// Invoice Management Components
import AddInvoice from './components/AddInvoice'; 
import AllInvoices from './components/AllInvoices'; 
import PrintPage from './components/PrintPage';
import PrintInvoice from './components/PrintInvoice';
import SendClientPage from './components/SendClientPage';
import AddService from './components/AddService';
import Sidebar from './components/Sidebar'; 
import './css/invoice.css'; 

import AdminPaymentPage from './components/AdminPaymentPage';
import ViewPayment from './components/ViewPayment';

// Client-Side Pages
import ClientLogin from './components/Client-Side/ClientLogin';
import ClientSignUp from './components/Client-Side/ClientSignUp';
import ClientForgotPassword from './components/Client-Side/ClientForgotPassword';
import ClientContact from './components/Client-Side/ClientContact';
import ClientDashboard from './components/Client-Side/ClientDashboard';

// Client-Side Invoice Pages
import ClientInvoiceView from './components/Client-Side/ClientInvoiceView';
import ClientServiceInvoice from './components/Client-Side/ClientServiceInvoice';
import ClientChangePassword from './components/Client-Side/ClientChangePassword';

import Payment from './components/Client-Side/ClientPaymentPage';
import BillsPage from './components/Client-Side/ClientBillsPage';

import ClientTask from'./components/Client-Side/ClientTask';
import ClientProfileUpdate from './components/Client-Side/ClientProfileUpdate';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<MainDashboard />} />
        <Route path="/admin-login" element={<Login />} />

        {/* Admin-Side Routes */}
        <Route path="/admin-change-password" element={<AdminChangePassword />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-client" element={<AdminClient />} />
        <Route path="/admin-task" element={<AdminTask />} />
        <Route path="/admin-contact" element={<AdminContact />} />
       

        {/* Invoice Management Routes */}
        <Route path="/add-invoice" element={<AddInvoice />} />
        <Route path="/all-invoices" element={<AllInvoices />} />
        <Route path="/contact-client" element={<SendClientPage />} />
        <Route path="/print-page" element={<PrintPage />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/print-invoice" element={<PrintInvoice />} />

        {/* Admin Payment Routes */}
        <Route path="/AdminPayment" element={<AdminPaymentPage />} />
        <Route path="/read/:id" element={<ViewPayment />} />

        {/* Client-Side Routes */}
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/client-signup" element={<ClientSignUp />} />
        <Route path="/client-forgot-password" element={<ClientForgotPassword />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/client-contact" element={<ClientContact />} />

        {/* Client-Side Invoice Routes */}
        <Route path="/clientInvoice" element={<ClientInvoiceView />} />
        <Route path="/serviceInvoice/:id" element={<ClientServiceInvoice />} />
        <Route path="/ClientChangePass" element={<ClientChangePassword />} />
          
            {/* Client-Side Payment Routes */}
        <Route path="/client-payment" element={<Payment />} />
        <Route path="/client-bill/:id" element={<BillsPage />} />
          
           {/* Client-Side Task Routes */}
        <Route path="/client-task" element={<ClientTask />} />
        <Route path="/client-profile-update" element={<ClientProfileUpdate />} />

      </Routes>
    </Router>
  );
}

export default App;
