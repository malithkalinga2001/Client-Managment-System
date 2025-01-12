import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './ClientSideBar';
import '../../css/CssClientSide/Contact.css';
import invoiceCss from '../../css/CssClientSide/ClientInvoice.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function ClientInvoiceView() {
  const [invoice, setInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // To hold filtered results
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/api/invoices')
      .then(response => {
        console.log(response.data);
        setInvoice(response.data);
        setFilteredInvoices(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the invoices!', error);
      });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Filter invoices based on search query
    const results = invoice.filter(invoice =>
      invoice.invoiceId.toString().includes(searchQuery) ||
      (invoice.company_name && invoice.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredInvoices(results);
    console.log('Filtered Invoices:', results);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', height: '100vh' }}>
    {/* <div className="client-page-container"> */}
      <div className="client-header-section">
        <h3>Client Management System</h3>
        <br />
      </div>
      <Sidebar />
      <div className="client-contact-content">
        <p className="profile-breadcrumb"> Home / Invoices</p>
        <h2 className="profile-title">Invoice </h2>
         
        <div className={`container col-12   custom-container  ${invoiceCss.container}`}>
         
         <div className=" d-flex align-items-center col-md-4 mt-5">
           <input
             className="form-control me-4 mt-3 "
             type="search"
             placeholder="Invoice Id / name"
             aria-label="Search"
             value={searchQuery}
             onChange={handleSearchInputChange}
           />
        

         <form className="d-flex mt-1 " role="search" onSubmit={handleSearch}>
           <button className="btn btn-primary " type="submit">Search</button>
         </form>
         </div>

              <table className="table table-responsive table-bordered table-hover col-12">
                <thead className="table-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Creation Date</th>
                    
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice, index) => (
                      <tr key={invoice.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{invoice.invoiceID}</td>
                        <td>{invoice.company_name}</td>
                        <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td> {/* Format date */}
                        
                        <td>
                          <Link to={`/serviceInvoice/${invoice.invoiceID}`} className="btn btn-primary"style={{ textDecoration: 'none' }}>View</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      // </div>
   
  );
}
