
import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './components/header';
import Footer from './components/footer';
import './invoice.css'

const Invoice = () => {
    const { bookingID } = useParams();
    const [pdfData, setPdfData] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
  
    useEffect(() => {
        downloadInvoice();
    }, [bookingID]);
  
    const downloadInvoice = async () => {
  
      try {
        // Fetch additional data from the database based on bookingID
        const response = await axios.get(`http://localhost:5000/InvoiceInfo/${bookingID}`);
        setInvoiceData(response.data);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

  return (
    <div>
      <Header/>
      
      {invoiceData && (
        <div className='invoicecon'>
          <h2><b>Invoice </b> </h2>
          <hr />
          <p><b>Booking ID: </b> {invoiceData.bookingID}</p>
          <p><b>Check In: </b> {invoiceData.startDate}</p>
          <p><b>Check Out: </b> {invoiceData.endDate}</p>
          <p><b>Address: </b> {invoiceData.address}</p>
          <p><b>Seller Phone Number: </b> {invoiceData.sellerphonenumber}</p>
        </div>
      )}
    </div>
  );
};

export default Invoice;
