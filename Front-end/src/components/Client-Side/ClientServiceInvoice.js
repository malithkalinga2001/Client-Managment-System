import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams,Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Sidebar from './ClientSideBar';
import '../../css/CssClientSide/Contact.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ClientServiceInvoice() {
    const componentPDF = useRef(); // Ref for printable content
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/invoices/${id}`)
            .then(response => {
                setInvoice(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the invoice details!', error);
            });
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => componentPDF.current, // Ensure this is the wrapper element
        documentTitle: 'Invoice Details',
        onAfterPrint: () => alert('Print successful!'),
    });

    if (!invoice) return <div>Loading ....</div>;

    const totalCost = invoice.services ? invoice.services.reduce((sum, service) => sum + service.cost, 0) : 0;

    return (
        <div  style={{ backgroundColor: '#f5f7fa', height: '100vh' }}>
            <div className="client-page-container">
                <div className="client-header-section">
                    <h3>Client Management System</h3><br />
                </div>
                <Sidebar />
                <div className="client-contact-content">
                    <p className="profile-breadcrumb">Home / Invoices/ View invoice</p>
                    <h2 className="profile-title">Invoice </h2>

                    {/* Wrap everything to be printed inside the ref */}
                    <div ref={componentPDF} className="container col-12 custom-container">
                       
                        <table className="table table-bordered print-table" style={{ marginBottom: '40px' }}>
                            <thead className="table-light">
                                <tr>
                                    <th colSpan="4" className="text-center text-white" style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}>Client Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="bg-light text-dark">Company Name</th>
                                    <td>{invoice.company_name}</td>
                                    
                                </tr>
                                <tr>
                                    <th className="bg-light text-dark">Contact No</th>
                                    <td>{invoice.contact_no}</td>
                                    <th className="bg-light text-dark">Email</th>
                                    <td><a href={`mailto:${invoice.email}`}>{invoice.email}</a></td>
                                </tr>
                                <tr>
                                    <th className="bg-light text-dark">Account ID</th>
                                    <td>{invoice.account_type}</td>
                                    <th className="bg-light text-dark">Invoice Date</th>
                                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="table table-bordered print-table ">
                            <thead className="table-light">
                                <tr>
                                    <th colSpan="3" className="text-center text-white" style={{ marginTop: '40px', backgroundColor: '#3498db', borderColor: '#3498db' }}>Service Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="bg-light text-dark">No</th>
                                    <th className="bg-light text-dark">Service</th>
                                    <th className="bg-light text-dark">Cost</th>
                                </tr>

                                {/* Map over the invoice.services array */}
                                {invoice.services && invoice.services.map((service, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{service.service_description}</td>
                                        <td>${service.cost.toFixed(2)}</td>
                                    </tr>
                                ))}

                                <tr>
                                    <th colSpan="2" className="bg-light text-dark text-center"><strong>Grand Total</strong></th>
                                    <th>${totalCost.toFixed(2)}</th>
                                </tr>
                            </tbody>
                        </table>
                       
                    </div>

                    <form className="mt-3 d-flex justify-content-center align-items-center">
                        <button className="btn" type="button" onClick={() => handlePrint()}>
                       
                            <img className='print_button' src='../print.png' alt="icon" style={{ width: "8vh", height: "8vh" }} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
