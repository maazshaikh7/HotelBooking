// RoomForm.js
import React, { useState,useEffect,useRef } from 'react';
import './AddHotel.css';
import Header from './components/header';
import Footer from './components/footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './assets/mark.png'; // Import the image
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router';
import axios from 'axios';
import AdminHeader from './AdminPages/AdminHeader';

const RoomForm = () => {
  const [hotels, setHotels] = useState([]); // State to store the list of hotels
  const [selectedHotel, setSelectedHotel] = useState('');
  const navigate = useNavigate()
  const [owner, setOwner]= useState('')
  const [markerPlaced, setMarkerPlaced] = useState(false);
  const [infoFilled, setinfoFilled] =useState(false);


  useEffect(() => {
    axios.get('http://localhost:5000/AllHotels')
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  const [formData, setFormData] = useState({
    room_layout:'',
    unique:'',
    title: '',
    description: '',
    price: '',
    amenities: [],
    photos: [],
    location: '',
    sellerphonenumber:'',
    categories: [],
    address:'',
    latitude: '',
    longitude: '',
    owner:'',
    parentHotel: '',
  });
  useEffect(() => {
    console.log(formData);
     // This will log the updated formData
  }, [formData]);

  const handleCategoryChange = (e) => {
    const { name, value, checked } = e.target;
  
    if (checked) {
      // If the category is checked, add it to the form data
      setFormData({
        ...formData,
        [name]: [...formData[name], value],
      });
    } else {
      // If the category is unchecked, remove it from the form data
      setFormData({
        ...formData,
        [name]: formData[name].filter((item) => item !== value),
      });
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [successMessage, setSuccessMessage] = useState(null);

  const handleAmenitiesChange = (e) => {
    const { name, value } = e.target;
    const updatedAmenities = formData.amenities.slice();
    if (e.target.checked) {
      updatedAmenities.push(value);
    } else {
      const index = updatedAmenities.indexOf(value);
      if (index !== -1) {
        updatedAmenities.splice(index, 1);
      }
    }
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handlePhotoChange = async (e) => {
    const photos = e.target.files;
    const photoStrings = [];
  
    // Configuration for image compression
    const options = {
      maxSizeMB: 0.2, // Adjust the compression size as needed
      maxWidthOrHeight: 800, // Adjust the dimensions as needed
    };
  
    // Iterate through the selected photos
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
  
      try {
        // Compress the image using the imageCompression library
        const compressedPhoto = await imageCompression(photo, options);
  
        // Convert the compressed image to a base64 string
        const reader = new FileReader();
  
        reader.onload = (event) => {
          // When the reader is done, add the base64 string to the array
          photoStrings.push(event.target.result);
  
          // Check if all photos have been processed
          if (photoStrings.length === photos.length) {
            // Now you have an array of base64-encoded image strings
            // You can set this in your form data or send it to the backend.
            setFormData({ ...formData, photos: photoStrings });
          }
        };
  
        // Read the compressed image as a Data URL (base64)
        reader.readAsDataURL(compressedPhoto);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (!selectedHotel) {
      alert('Please select a hotel for the room.');
      return;
    }
    if(selectedHotel){
      setFormData({
        ...formData,
        parentHotel: selectedHotel, // Set the parentHotel here
    });
    }
    e.preventDefault();
    const requiredFields = ['title', 'description', 'price', 'location', 'sellerphonenumber', 'categories', 'address', 'latitude', 'longitude'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
      else{
        setinfoFilled(true);
      }
    }
    console.log(owner)
    
    if (!markerPlaced) {
      alert('Please place a marker on the map');
      return;
    }
    if(infoFilled){
      setFormData({
        ...formData,
        owner: owner,
      });
      try {
        const response = await fetch('http://localhost:5000/roomsadd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        alert(response.data.message);
        if (response.ok) {
          alert("Room Added Successfully");
          console.log('Room added successfully');
          alert("room added")
          navigate('/')
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const mapRef = useRef(null);
  const pinRef = useRef(null);
  const [lat, setLat] = useState(40);
  const [lng, setLng] = useState(0);

  
  
  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [lat, lng],
        zoom: 3,
      });

      // Create the tile layer with correct attribution
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Event listener for map click
    mapRef.current.on('click', (ev) => {
      setLat(ev.latlng.lat);
      setLng(ev.latlng.lng);
      setFormData((prevFormData) => ({
        ...prevFormData,
        latitude: ev.latlng.lat,
        longitude: ev.latlng.lng,
      }));
      setMarkerPlaced(true);
      if (!pinRef.current) {
        pinRef.current = L.marker(ev.latlng, {
          icon: L.icon({
            iconUrl:  markerIcon, // Replace with the correct path
            iconSize: [41, 41],
            iconAnchor: [12, 41],
          }),
          riseOnHover: true,
          draggable: true,
        });
        pinRef.current.addTo(mapRef.current);
        pinRef.current.on('drag', (ev) => {
          setLat(ev.latlng.lat);
          setLng(ev.latlng.lng);
        });
      } else {
        pinRef.current.setLatLng(ev.latlng);
      }
    });
  }, [lat, lng]);


  return (
    <div className='AddHotelCon'>
    <div>
        <AdminHeader />
    </div>
    <form onSubmit={handleSubmit} className="room-form">
    <h1>Rent Your Room</h1>
    <input
        type="text"
        name="title"
        placeholder="Room Name"
        value={formData.title}
        onChange={handleChange}
        className="room-input"
    />
    <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="room-input"
    />
        <textarea
        name="address"
        placeholder="Room's Address"
        value={formData.address}
        onChange={handleChange}
        className="room-input"
    />
    <input
        type="number"
        name="price"
        placeholder="Price/Day"
        value={formData.price}
        onChange={handleChange}
        className="room-input"
    />
    <div className='seller-section'>
        <h3>Seller Details</h3>
        <input
        type="number"
        name="sellerphonenumber"
        placeholder="Phone Number"
        value={formData.sellerphonenumber}
        onChange={handleChange}
        className="room-input"
    />
    </div>
    <div className="amenities-section">
        <h3>Amenities</h3>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Wi-Fi"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> Wi-Fi
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Free parking on premises"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> Free parking on premises
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="TV"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> TV
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Kitchen"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        />
        Kitchen
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Garden view"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> 
        Garden view
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Air conditioning"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> 
        Air conditioning
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Dedicated workspace"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> 
        Dedicated workspace
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="Fire extinguisher and First Aid Kit"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> 
        Fire extinguisher and First Aid Kit
        </label>
        <label className="amenity-label">
        <input
            type="checkbox"
            name="amenities"
            value="24/7 Security"
            onChange={handleAmenitiesChange}
            className="amenity-checkbox"
        /> 
        24/7 Security
        </label>
    </div>
    <div className="photo-section">
        <h3>Upload Photos</h3>
        <input
        type="file"
        name="photos"
        multiple
        onChange={handlePhotoChange}
        className="photo-input"
        />
        <div className="photo-preview">
        {formData.photos.map((photo, index) => (
            <img
            key={index}
            src={photo}
            alt={`Room Photo ${index + 1}`}
            className="photo-thumbnail"
            />
        ))}
        </div>
    </div>
        <div className="category-sectionn">
    <h3>Category</h3>
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="One Room"
        onChange={handleCategoryChange}
        />
        One Room
    </label> <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Two Room"
        onChange={handleCategoryChange}
        />
        Two Room 
    </label>  <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Kitchen"
        onChange={handleCategoryChange}
        />
        Kitchen
    </label>          <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Balcony"
        onChange={handleCategoryChange}
        />
        Balcony 
    </label>      <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Single Bed"
        onChange={handleCategoryChange}
        />
        Single Bed 
    </label>      <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Double Bed"
        onChange={handleCategoryChange}
        />
        Double Bed
    </label>      <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value="Work Area"
        onChange={handleCategoryChange}
        />
        Work Area
    </label>      <br />
    <label className="category-label">
        <input
        type="checkbox"
        name="categories"
        value=""
        onChange={handleCategoryChange}
        />
        Three Room
    </label>      
    </div>
    <br></br>

    <br />
    <br />
    <br />
    <br />
    <br />
    <div>
    <h3>Location</h3>
    <input
        type="text"
        name="location"
        placeholder="A short one word laction"
        value={formData.location}
        onChange={handleChange}
        className="room-input"
    />
    </div>

    <select
          name="selectedHotel"
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className="room-input"
        >
          <option value="" onChange={handleChange}>Select a Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.allhotelID} value={hotel.allhotelID}>
              {hotel.name}
            </option>
          ))}
        </select>

    <div id="map" style={{ height: '70vh', width: '100%',borderRadius:"20px" }}></div>

      <button type="submit" className="submit-button">Add Room</button>
    </form>

    <div>
        <Footer />
    </div>
    </div>
  );
};

export default RoomForm;
