import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './hotellist.css';
import { Link } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import StarRating from './components/StarRating';
import { useParams } from 'react-router-dom';

const HotelList = () => {
  const { parentHotel } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('priceHighToLow');
  const [username, setUsername] = useState('');

  const handleCategoryClick = (category) => {
    console.log('Selected category:', category);
    setSelectedCategory(category);
  };
  

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    else{
      navigate('/login')
    }
  }, []);

  const sortRooms = (sortBy) => {
    const sortedRooms = [...rooms];

    switch (sortBy) {
      case 'priceLowToHigh':
        sortedRooms.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedRooms.sort((a, b) => b.price - a.price);
        break;
      case 'ratingHighToLow':
        sortedRooms.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLowToHigh':
        sortedRooms.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    setRooms(sortedRooms);
  };


  useEffect(() => {
    axios.get(`http://localhost:5000/allhotels/${parentHotel}`)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hotel data:', error);
      });
  }, []);





  return (
    <div className="body">
      <div>
        <Header />
      </div>
      <div className="Headinglist">
        <div className="HeadingHotel">
        </div>
        <section id="sectionnavbar" className="category-section">
          <div id="scrollable-buttons">
          {[  'Work Area', 'Double Bed', 'Single Bed', 'Balcony', 'Kitchen', 'Two Room', 'One Room'
          ].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
          </div>


            <div id="sorting-dropdown">
            <select
          onChange={(e) => {
            setSortBy(e.target.value); // Update the selected sorting option in your state
            sortRooms(e.target.value); // Call the sorting function based on the selected option
          }}
          value={sortBy}
        >
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="ratingHighToLow">Rating: High to Low</option>
          <option value="ratingLowToHigh">Rating: Low to High</option>
        </select>
            </div>
        </section>

        <div className="hotel-grid">
              {rooms.length > 0 ? (
                rooms.filter((room) => !selectedCategory || room.categories.includes(selectedCategory)).map((room) => (
                  <div key={room.id} >
                  <div >
                    <div id="cardborder0shadow" className="card border-0 shadow">
                      <img
                        id="imgcon"
                        src={room.photos}
                        alt="{`data:image/jpeg;base64,${room.image}`}"
                        height={250}
                      />
                      <h2 id="heading2">Price: {room.price}/night</h2>
                      <div style={{marginLeft:"10px"}}>
                      <StarRating value={room.rating} onChange={() => {}}/>
                      </div>
                      
                      <h4 id="heading3">Location: {room.location}</h4>
                      <Link id="roomlink" to={`/hotel/${room.roomID}`}> <t></t> Book Now
                      </Link>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                // Loading skeleton for each room
                [...Array(4)].map((_, index) => (
                  <div className="hotel-grid">
                  <div id="cardborder0shadow" className="card border-0 shadow">
                      <div class="movie--isloading">
                        <div class="loading-image"></div>
                        <div class="loading-content">
                          <div class="loading-text-container">
                            <div class="loading-main-text"></div>
                            <div class="loading-sub-text"></div>
                          </div>
                          <div class="loading-btn"></div>
                        </div>
                      </div>
                </div>
                </div>
                ))
              )}
            </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HotelList;
