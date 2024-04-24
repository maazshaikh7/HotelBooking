import React, { useState } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';

const CreateHotelForm = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/AllHotelsCreate', hotelData)
      .then((response) => {
        alert("Hotel Craeted")
        console.log('Hotel created successfully');
      })
      .catch((error) => {
        alert(error)
        console.error('Error creating hotel:', error);
      });
  };
  return (
    <>
    <AdminHeader/>
    <div>
      <h2>Create a New Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Hotel Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={hotelData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={hotelData.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Hotel</button>
      </form>
    </div>
    </>
  );
};

export default CreateHotelForm;