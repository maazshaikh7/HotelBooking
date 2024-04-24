import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './hotellist.css';
import { Link } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminPages/AdminHeader';
import './Allhotels.css'

const AllHotels = () => {
    const navigate= useNavigate();
    const [hotels, setHotels] = useState([]);
    const [username, setUsername]= useState('')
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
        setUsername(storedUsername);
        }
        else{
        navigate('/login')
        }
    }, []);


    useEffect(() => {
        axios.get('http://localhost:5000/AllHotels')
          .then((response) => {
            setHotels(response.data);
          })
          .catch((error) => {
            console.error('Error fetching hotel data:', error);
          });
      }, []);
      

    return (
        <div className="AllHotelbody">
        <div>
            <Header />
        </div>
        <h2 style={{marginLeft:"3vw", marginTop:"2vh",fontWeight:"bold"}}>Choose A Hotel</h2>
        <hr></hr>
        <div id="allhotels" className="hotel-grid">
          
            {hotels.map((hotel) => (
            <div key={hotel.allhotelID} className="hotel-card" id="cardborder0shadow" style={{backgroundColor:"#F5F5F5", width:"300px"}}>
                <h3 style={{fontWeight:"bold"}}>Hotel Name <br></br>{hotel.name}</h3>
                <hr></hr>
                <p> <b>Location:</b>  {hotel.location}</p>
                <p> <b>Number of Rooms:</b>  {hotel.numberOfRooms}</p>
                <Link to={`/allhotels/${hotel.allhotelID}`} id="LinkDetails">View Hotel</Link>
            </div>
            ))}
        </div>

        <div>
            <Footer />
        </div>
        </div>
  );
};

export default AllHotels;
