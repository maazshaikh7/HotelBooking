import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, useParams } from 'react-router-dom';
import Header from './components/header';
import './BookingPage.css';
import Footer from './components/footer';

const BookingPage = () => {
  const [username, setUsername] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const { roomID, checkIn, checkOut } = useParams();
  const [roomPrice, setRoomPrice] = useState(0);
  const selectedCheckInDate = new Date(checkIn);
  const selectedCheckOutDate = new Date(checkOut);
  const [roomData, setRoomData] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const ServiceCharge = 1000;
  const [accommodates, setAccommodates] = useState(1);
  const [breakfast, setBreakfast] = useState(false); 
  const [lunch, setLunch] = useState(false); 
  const [dinner, setDinner] = useState(false); 
  const [Addons, setAddons] = useState(0)

  const handleAccommodatesChange = (e) => {
    const newAccommodates = parseInt(e.target.value, 10);
    if (newAccommodates >= 1 && newAccommodates <= 5) {
      setAccommodates(newAccommodates);
    }
  }
  const handleBreakfastChange = (e) => {
    const isChecked = e.target.checked;
    setBreakfast(isChecked);
    if(!breakfast){
      setAddons(Addons+500*calculateDays())
    }
    else{
      setAddons(Addons-500*calculateDays())
    }
  }

  const handleLunchChange = (e) => {
    const isChecked = e.target.checked;
    setLunch(isChecked);
    if(!lunch){
      setAddons(Addons+500*calculateDays())
    }
    else{
      setAddons(Addons-500*calculateDays())
    }
  }

  const handleDinnerChange = (e) => {
    const isChecked = e.target.checked;
    setDinner(isChecked);
    if(!dinner){
      setAddons(Addons+500*calculateDays())
    }
    else{
      setAddons(Addons-500*calculateDays())
    }
  }

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/room-details/${roomID}`);
        setRoomData(response.data);
        setRoomPrice(response.data.price)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomID]);

  if (loading) {
    return <p>Loading...</p>;
  }
  const calculateTotalPrice = () => {
    if (selectedCheckInDate && selectedCheckOutDate) {
      const timeDiff = selectedCheckOutDate.getTime() - selectedCheckInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      const totalPrice = nights * roomPrice;
      return totalPrice;
    }
    return 0;
  };
  const calculateDays = () => {
    if (selectedCheckInDate && selectedCheckOutDate) {
      const timeDiff = selectedCheckOutDate.getTime() - selectedCheckInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    }
    return 0;
  };

  const handleConfirmBooking = () => {
    const bookingData = {
      startDate: selectedCheckInDate,
      endDate: selectedCheckOutDate,
      bookedByUsername: username,
      totalCost: calculateTotalPrice(),
      daysOccupied: calculateDays(),
      email: email,
      owner: roomData.owner,

    };
    const TransactionData = {
      startDate: selectedCheckInDate,
      endDate: selectedCheckOutDate,
      bookedByUsername: username,
      totalCost: calculateTotalPrice(),
      daysOccupied: calculateDays(),
      email: email,
      owner: roomData.owner,
      roomID: roomID,
      breakfast: breakfast,
      lunch: lunch,
      dinner: dinner,
    }
    console.log(bookingData)
    
    axios
    .post(`http://localhost:5000/book-room/${roomID}`, bookingData)
    .then((response) => {
      console.log('Booking confirmed:', response.data);
      axios
        .post(`http://localhost:5000/create-transaction/${roomID}`, TransactionData)
        .then((transactionResponse) => {
          console.log('Transaction created:', transactionResponse.data);
          alert("Booking Confirmed");
          CallProfile()
          
        })
        .catch((transactionError) => {
          console.error('Error creating transaction:', transactionError);
        });
    })
    .catch((bookingError) => {
      console.error('Error confirming booking:', bookingError);
    });

  };
  const CallProfile = () =>{
    return <Navigate to="/profile" />
  }
  const isEmailValid = email.length > 0;
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>    
    <Header/>
    <div style={{width:"70vw", marginLeft:"15vw" }}>
      <div>
        <h2 style={{fontWeight:"700", marginTop:"10vh", marginBottom:"-5vh"}}>Confirm And Pay</h2>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px',marginTop:"14vh" }}>
          <h4> <b>Hotel Name : {roomData.title}</b> </h4>
          <hr />
          <h5 style={{fontWeight:"600"}}>Your Holidays</h5>
          <p>From {selectedCheckInDate.toDateString()} to {selectedCheckOutDate.toDateString()}</p>
          <hr></hr>
          <h5 style={{fontWeight:"600"}}>Enter Email For Invoice</h5>
          <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              style={{padding:"5px", outline:"none", border:"0px", borderRadius:"10px"}}
            />
          <hr />
          <h5 style={{ fontWeight: "600" }}>Number of Accommodates (1-5)</h5>
          <input
            type="number"
            value={accommodates}
            onChange={handleAccommodatesChange}
            min="1"
            max="5"
            style={{ padding: "5px", outline: "none", border: "0px", borderRadius: "10px" }}
          />
          <hr />
          <h5 style={{ fontWeight: "600" }}>Add-ons</h5>
          <label>
            <input
              type="checkbox"
              checked={breakfast}
              onChange={handleBreakfastChange}
            /> Breakfast Rs.500/day
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={lunch}
              onChange={handleLunchChange}
            /> Lunch Rs.500/day
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={dinner}
              onChange={handleDinnerChange}
            /> Dinner Rs.500/day
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <div className="InvoiceCon" style={{width:"70%", marginTop:"10vh", border:"0px", borderRadius:"15px", backgroundColor:'white'  }}>
            <h4 style={{fontWeight:"700"}}>Price Details</h4>
            <hr></hr>
            <h6> <b>Price/Night -</b>  Rs. {roomPrice} </h6>
            <h6> <b>Total Stay &nbsp; -</b>  {calculateDays()} Days </h6>
            <h6> <b>Total Cost  &nbsp; -</b>  Rs. {calculateTotalPrice()} </h6>
            <hr></hr>
            <h6> <b>Service Charge &nbsp;-</b>  Rs. {ServiceCharge}</h6>
            <h6><b>Addons Price-</b> Rs {Addons}</h6>
            <h6> <b>Payable Amount -</b>  Rs. {calculateTotalPrice()+ServiceCharge+Addons}</h6>
            <p style={{fontSize:"10px", color:"#FF5252"}}>Taxes may apply at payment</p>
            <hr></hr>

            { isEmailValid ?(
              <button id="confirmbookingbtn" onClick={handleConfirmBooking} style={{width:"100%", border:"0px", padding:"5px"}} >Confirm Booking</button>
            ):(
              <button onClick={handleConfirmBooking} style={{width:"100%", border:"0px", padding:"5px" }} disabled >Confirm Booking</button>
            )

            }
            
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>

  );
}

export default BookingPage;
