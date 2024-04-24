import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Hoteldetails.css';
import Header from './components/header';
import Footer from './components/footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from './assets/mark.png';
import { useNavigate } from 'react-router-dom';
import StarRating from './components/StarRating';

const RoomDetail = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const currentDate = new Date();
  const [existingBookings, setExistingBookings] = useState([]);
  const [ notLoggedIn, setNotLoggedIn ] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setNotLoggedIn(false);
    }
  }, []);

  const [room, setRoom] = useState(null);
  const { roomID } = useParams();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomPrice, setRoomPrice] = useState(0);
  const [isvalid , setValid] =useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/hotel/${roomID}`)
      .then((response) => {
        console.log(response.data); // Log the response data
        setRoom(response.data);
        if (response.data) {
          setRoomPrice(response.data.price)
          console.log(response.data.bookings)
          if (Array.isArray(response.data.bookings)) {
            setExistingBookings(response.data.bookings);
            console.log("IS AN ARRAY")
          } else {
            console.error("Data received is not an array:", response.data.bookings);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
      });
  }, [roomID]);

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
  };
  
  const handleCheckOutChange = (date) => {
    setCheckOutDate(date);
  };

  const calculateTotalCharges = () => {
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      const numberOfDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      console.log(numberOfDays);
  
      const totalCharges = numberOfDays * roomPrice;
      console.log(totalCharges);
      return totalCharges;
    }
    return 0;
  };
  
  const calculateTotalDays = () => {
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      const numberOfDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      console.log(numberOfDays);
      return numberOfDays;
    }
    return 0;
  };
  
  const handleReserveClick = () => {

    const formattedCheckInDate = checkInDate.toISOString();
    const formattedCheckOutDate = checkOutDate.toISOString();
    const isValidReservation = isReservationValid(
      new Date(formattedCheckInDate),
      new Date(formattedCheckOutDate),
      existingBookings
    );
    console.log("isvalid : "+isReservationValid);
    if (isValidReservation){
      const bookingURL = `/book/${roomID}/${formattedCheckInDate}/${formattedCheckOutDate}`;
      navigate(bookingURL);
    }
    else{
      alert("Hotel Already Booked for the given dates, Apply another dates.")
    }
    
  }

  const isReservationValid = (checkInDate, checkOutDate, existingBookings) => {
    for (const booking of existingBookings) {
      const existingCheckIn = new Date(booking.startDate);
      const existingCheckOut = new Date(booking.endDate);
      existingCheckIn.setHours(0, 0, 0, 0);
      existingCheckOut.setHours(0, 0, 0, 0);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
  
      if (checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut) {
        
        console.log(checkInDate);
        console.log(existingCheckIn);
        console.log(checkInDate<=existingCheckIn);
        console.log(checkOutDate);
        console.log(existingCheckOut);
        console.log(checkOutDate >= existingCheckOut);
        console.log(checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut);
        console.log("Conflict found");
        
        return false;
      }
    }
  
    console.log("Reservation is valid");
    return true;
  };
  

  return (
    <div className='body'>
    <div>
      <Header />
    </div>
      <div >
        {
          notLoggedIn ? (
            <h6 > <a href="/login" style={{textDecoration:"none"}}>  <b>Please Login</b> </a>  </h6>
          ):(
            <h6></h6>
          )
        }
        {room ? (
          <div style={{ width:"70vw", margin:"20px auto", textAlign:"left"}} >
            <div style={{marginTop:"10px"}}>
              <p  style={{fontSize:"48px", fontWeight:"bolder"}}>{room.title}</p>
              <p style={{marginTop:"-20px", fontSize:"20px"}}>Location: {room.location}</p>
            </div>

            <div style={{ borderRadius:"20px",border:"0px",maxHeight:"390px", maxWidth:"585px"}} >
              <img className="room-image" src={room.photos} alt={room.title} style={{borderRadius:"20px",border:"0px",maxHeight:"400px", maxWidth:"600px"}} />
            </div>
          <div>

          <h4 style={{marginTop:"30px", fontSize:"24px", fontWeight:"bold"}}>Place to stay hosted by Our Hotel </h4>
          <br />

          <div>
              <StarRating value={room.rating} onChange={() => {}}/>
          </div>
          

          <hr id='hrstyle'></hr>

          <div className="column" >
            <h6 style={{fontWeight:"bold", fontSize:"18px"}}> <img src={require("./assets/cancellationicon.png")} alt="cancellationicon" style={{height:"40px"}}/> Free cancellation before 2 days of check-in</h6>
            <p>{room.unique}</p>
            <hr></hr>
            <h6 style={{fontWeight:"bold", fontSize:"18px"}}>Description By Owner</h6>
            <p>{room.description}</p>
            <hr></hr>
          </div>

          <div className="column" >
            <div className="datescontainer">
            <div style={{ display: "inline-block", marginRight: "20px" }}>
                <p style={{ fontSize: "16px", fontWeight: "500" }}>Check-In Date:</p>
                <DatePicker
                  selected={checkInDate}
                  onChange={handleCheckInChange}
                  className="custom-datepicker"
                />
              </div>

              <div style={{ display: "inline-block" }}>
                <p style={{ marginTop: "10px", fontSize: "16px", fontWeight: "500" }}>
                  Check-Out Date:
                </p>
                <DatePicker
                  selected={checkOutDate}
                  onChange={handleCheckOutChange}
                  className="custom-datepicker"
                />
              </div>
              <hr style={{width:"100%"}}></hr>
                { checkInDate && checkOutDate ? (
                  <div>
                    <p>Number of Days: {calculateTotalDays()} days</p>
                    <p>Total Charges: ${calculateTotalCharges()}</p>
                    {isvalid ? (
                      <button id="reservebutton" type="button" onClick={handleReserveClick}>
                        Reserve Now
                      </button>
                    ) : (
                      <button id="dreservebutton" type="button" disabled>
                        Reserve Now
                      </button>
                    )}
                    <p style={{fontSize:"10px"}}>You can reserve now</p>
                    
                  </div>
                ) : (
                  <div>

                    <p>Number of Days: 0 days</p>
                    <p>Total Charges: $0</p>
                    <button id="dreservebutton" type="button" disabled>Reserve Now</button>
                    <p style={{fontSize:"10px", color:"#FF5252", fontWeight:"bold"}}>Please enter dates to reserve</p>
                  </div>
                )}
            </div>
          </div>

          <hr></hr>

          <div style={{textAlign:"left"}}>
            <h5 style={{ textAlign:"left",fontWeight:"bold", fontSize:"18px",marginTop:"50px"}}> <br /> Amenities</h5>
            <ul >
              {room.amenities.map((amenity, index) => (
                <li className="amenity-item" key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          <hr></hr>
          <div>
            <h5 style={{fontWeight:"bold", fontSize:"18px"}}>Hotel Location</h5>
              <h6><b>Address:</b> {room.address} </h6>   
                <MapContainer center={[room.latitude,room.longitude]} zoom={13} style={{ height: '400px',borderRadius:"20px", marginTop:"30px" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    
                  />
                  <Marker position={[room.latitude,room.longitude]}   icon={
                      L.icon({
                        iconUrl: markerIcon, // Replace with the path to your PNG icon
                        iconSize: [41, 41], // Set the size of your custom icon
                        iconAnchor: [12, 41],
                      })
                    }>
                                      <Popup>
                      {room.title}
                    </Popup>
                  </Marker>
                </MapContainer>

            </div>
            <hr></hr>
            <div>
              <h6 style={{fontWeight:"bold", fontSize:"18px"}}>Contact Number:{room.sellerphonenumber}</h6>
            </div>
          </div>


          </div>
        ) : (
          <p className="loading-message" style={{marginTop:"35vh", marginLeft:"60vw", scale:"2"}}>
              <section class="loader">
                <div>
                  <div>
                    <span class="one h6"></span>
                    <span class="two h3"></span>
                  </div>
                </div>

                <div>
                  <div>
                    <span class="one h1"></span>
                  </div>
                </div>

                <div>
                  <div>
                    <span class="two h2"></span>
                  </div>
                </div>
                <div>
                  <div>
                    <span class="one h4"></span>
                  </div>
                </div>
              </section>
          </p>
        )}
      </div>
      <div>
          <Footer />
      </div>
      </div>
  );
};

export default RoomDetail;
