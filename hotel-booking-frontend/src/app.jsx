
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelList from './HotelList.jsx';
import HotelDetail from './HotelDetails.jsx'
import RoomForm from './addhotel.jsx'
import LandingPage from './LandingPage.jsx';
import Signin from './Login.jsx';
import Signup from './Register.jsx';
import GlbViewer from './components/RotatingRoom.jsx';
import ProfilePage from './profile.jsx';
import BookingPage from './BookingPage.jsx';
import FeedbackForm from './Feedback.jsx';
import Invoice from './Invoice.jsx';
import CreateHotelForm from './AdminPages/CreateAllHotel.jsx';
import AdminPage from './AdminPages/AdminPage.jsx';
import AllHotels from './AllHotels.jsx';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/allhotels/:parentHotel" element={<HotelList />} />
        <Route path="/hotel/:roomID" element={<HotelDetail />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<LandingPage/>} />
        <Route path="/landingpage" element={<LandingPage/>} />
        <Route path="/addroom" element={<RoomForm />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/rotatingModel" element={<GlbViewer />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/book/:roomID/:checkIn/:checkOut" element={<BookingPage />} />
        <Route path="/feedback/:roomID" element={<FeedbackForm />} />
        <Route path="/invoice/:bookingID" element={<Invoice />} />
        <Route path="/createAllHotel" element={<CreateHotelForm />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/allHotels" element={<AllHotels />} />

      </Routes>
    </Router>
  );
}

export default App;