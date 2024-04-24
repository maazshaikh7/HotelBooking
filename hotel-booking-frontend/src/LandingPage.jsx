import { useState, useEffect } from "react";
import './Landing.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useTypingText } from "./components/TypingEffect";
import { useNavigate } from 'react-router-dom';
import GlbViewer from './components/RotatingRoom.jsx';
import Signin from "./components/LoginComponent";
import axios from 'axios';
import Footer from "./components/footer";

function LandingPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/landingpagerooms')
          .then((response) => {
            setRooms(response.data);
            console.log(rooms)
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching hotel data:', error);
          });
      }, []);

    if (localStorage.getItem('username')) {
        // Remove the item from local storage
        localStorage.removeItem('username');
        console.log(`Item removed from local storage.`);
    } else {
        console.log(`Item does not exist in local storage.`);
    }

    const scrollToLoginSection = () => {
        const loginSection = document.getElementById('loginsection');
        
        if (loginSection) {
          loginSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    const scrollToAmenitiesSection = () => {
        const AmenitiesSection = document.getElementById('AmenitiesSection');
        AmenitiesSection.scrollIntoView({behavior:'smooth'});
    }
    const GoToRegisterPage = () => {
        navigate('/register')
    }
    const scrollToContactUsSection = () =>{
        const SrcollContactUs = document.getElementById('footersection')
        SrcollContactUs.scrollIntoView({behavior:'smooth'});
    }
    const { word, stop, start } = useTypingText(
        ['Villa', 'Cottage', 'Condo', 'Apartment', 'House', 'Mansion'],
        130,
        20
      );

      const [scrollY, setScrollY] = useState(0);

        useEffect(() => {
            const handleScroll = () => {
            setScrollY(window.scrollY);
            };

            window.addEventListener("scroll", handleScroll);

            return () => {
            window.removeEventListener("scroll", handleScroll);
            };
        }, []);
        const parallaxAmount = 0.2; 

    return (
        <div className="landing-page">
            
        <div className="section" >
            <div id="section1topnavbar">
            <nav id="section1topnavbar" className="navbar navbar-expand-lg navbar-light bg-light bg-white px-lg-3 py-lg-2shadow-sm sticky top ">
                <div className="container-fluid">
                    <a className="navbar-brand me-5 fw-bold fs-3 h-font" href="index.html">HOTEL</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active me-2" aria-current="page" href="/landingpage">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" href="/allHotels">Room</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" onClick={scrollToAmenitiesSection}>Facilities</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" onClick={scrollToContactUsSection}>Contact us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" onClick={scrollToContactUsSection}>About</a>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <button type="button" className="btn btn-outline-dark shadow-none me-lg-3 me-2" data-bs-toggle="modal" data-bs-target="#loginModal"  onClick={scrollToLoginSection}>
                                Login
                            </button>
                            <button type="button" className="btn btn-outline-dark shadow-none " data-bs-toggle="modal" data-bs-target="#registerModal" onClick={GoToRegisterPage}>
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
            </div>

            <div id="firstcon" >
                <div>
                    <h2>Open The </h2>
                    <h2>Door For A </h2>
                    <h2>Spacious </h2>
                    <h2>Living - </h2>
                    <h2>{word}</h2>
                    <img style={{
                        position: "absolute",
                        marginTop: -670 + scrollY * parallaxAmount, // Apply parallax effect
                        zIndex: 2,
                        pointerEvents: "none",
                        transition: "transform 0.3s ease-out",
                        }} src={require("./assets/houseimglanding.png")} alt="image" />
                </div>
            </div>
            </div>

            <div>
                <div id="rownavbarcontainer" className="row" style={{ position: 'relative', width:"30vw",marginLeft: "35vw" }}>
                    <div id="rownavbarcontainer" className="col-lg-12 shadow p-4 rounded">
                        
                        <div className="row align-items-end">
                            <div className="col-lg-3 mb-3" style={{paddingLeft:"50px"}}>
                                <a id="link" href="/Profile" >Booking</a>
                            </div>

                            <div className="col-lg-3 mb-3" style={{paddingLeft:"140px"}}>
                                <a id="link" href="/allHotels">Rooms</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div  >
                <div style={{ position: 'relative'  }}>
                <div className="container" style={{ position: 'relative' }}/>
                    <div className="row" style={{backgroundColor: "#CAC7B9",height:"100vh",padding:"30px",borderRadius:"50px",width:"95vw",marginLeft:"2.5vw",marginBottom:"10px"}}>

                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">
                            <div id="secondcon" style={{
                                                        position: "relative",
                                                        marginLeft: 10,
                                                        marginTop:  scrollY * parallaxAmount,
                                                        zIndex: 2,
                                                        pointerEvents: "none",
                                                        transition: "transform 0.3s ease-out",
                                                        
                            }}>
                                <h2>OUR</h2>
                                <h2>FEATURED</h2>
                                <h2>HOTELS</h2>
                            </div>
                        </div>
                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">

                            
                        </div>


                        {rooms.map((room, index) => (
                            <div key={index} className="col-lg-3 col-md-6 ny-3">
                                <div id="cardborder0shadow" className="card border-0 shadow">
                                <img src={room.photo} className="card-img-top" alt="Hotel Image" style={{borderRadius:"10px"}} />
                                <div className="card-body">
                                    <h5>{room.name}</h5>
                                    <h6 className="mb-4">₹{room.price} per night</h6>
                                    <div className="features mb-4">
                                    <h6 className="mb-1">Features</h6>
                                    <span className="badge rounded-pill bg-light text-dark text-wrap">{room.hotel_layout}</span>
                                    </div>
                                    <div className="features mb-4">
                                    <h6 className="mb-1">Amenities</h6>
                                    {room.amenities.map((amenity, index) => (
                                        <span key={index} className="badge rounded-pill bg-light text-dark text-wrap">{amenity}</span>
                                    ))}
                                    </div>
                                    <div className="rating mb-4">
                                    <h6 className="mb-1">Rating</h6>
                                    <span className="badge rounded-pill bg-light">
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                    </span>
                                    </div>
                                    <div className="d-flex justify-content-evenly mb-2">
                                    <a className="btn btn-sm text-white custom-bg shadow-none" disabled>Book Now</a>
                                            <a href={`/hotel/${room.RoomID}`} className="btn btn-sm btn-outline-dark shadow-none">More details</a>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))}
                    </div>
                </div>

                <div className="section1" style={{backgroundColor:"#333333",padding:"30px",borderRadius:"50px",width:"95vw",marginLeft:"2.5vw"}} >
                    <div style={{ display: 'flex' }}>
                    
                        <div id="rotating-model" style={{ flex: 1 }}>
                            <GlbViewer />
                        </div>
                            <div id="hotelamenties" style={{ flex: 1, textAlign:"start" ,padding: "20px" }}>
                                <h2>Get Details About The Hotel</h2>
                                <br></br>
                                <img src={require("./assets/amenitiesicons.png")} alt="" style={{filter: "hue-rotate(180deg)"}} />
                                
                            </div>
                        </div>
                    </div >
                </div>

                
                <div id="AmenitiesSection" className="container" />
                    <div className="row" style={{backgroundColor: "#CAC7B9",height:"100vh",padding:"30px",borderRadius:"50px",width:"95vw",marginLeft:"2.5vw",marginBottom:"10px"}}>
                        <p><h1 style={{ fontFamily:"Inter"}}><b>WE PROVIDE</b></h1></p>
                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">
                            <div id="cardborder0shadow" class="card border-0 shadow" >
                                <div class="card-body"> 
                                    <h5>Hotel Booking </h5>
                                    <h6 class="mb-4">Experience Seamless Hotel Booking</h6>
                                    <div class="features mb-4">
                                        <h6 class="mb-1">Features</h6>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Extensive Search Options
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Real-Time Availability
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Detailed Hotel Profiles
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Secure and Convenient Booking
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Best Price Guarantee
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        24/7 Customer Support
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>	

                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">
                            <div id="cardborder0shadow" class="card border-0 shadow" >
                                <div class="card-body"> 
                                    <h5> Registeration of Rooms </h5>
                                    <h6 class="mb-4">Effortless Registration of Rooms</h6>
                                    <div class="features mb-4">
                                        <h6 class="mb-1">Features</h6>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Quick and Easy Sign-Up
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Social Media Integration
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Email Verification
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Personalized User Profiles
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Subscribe to News and Updates
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Enhanced Security Measures
                                        </span>
                                    </div>
                                </div>	
                            </div>
                        </div>

                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">
                            <div id="cardborder0shadow" class="card border-0 shadow" >
                                <div class="card-body"> 
                                    <h5>Hotel Services </h5>
                                    <h6 class="mb-4">Experience Exceptional Hotel Services</h6>
                                    <div class="features mb-4">
                                        <h6 class="mb-1">Features</h6>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Room Service Excellence
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        24/7 Concierge Assistance
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Fine Dining Restaurants
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Fitness and Recreation Facilities
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Housekeeping Excellence
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Eco-Friendly Initiatives
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="cardcon" class="col-lg-3 col-md-6 ny-3">
                            <div id="cardborder0shadow" class="card border-0 shadow" >
                                <div class="card-body"> 
                                    <h5> Facilities </h5>
                                    <h6 class="mb-4">Discover Our Hotel Facilities</h6>
                                    <div class="features mb-4">
                                        <h6 class="mb-1">Features</h6>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Luxurious Accommodations
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Spectacular Dining Options
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Versatile Event Spaces
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Refreshing Pool and Spa
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Business Center and Wi-Fi
                                        </span>
                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                        Child-Friendly Amenities
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                


                <div className="section1" style={{backgroundColor:"#EAEAE6",padding:"30px",borderRadius:"50px",width:"95vw",marginLeft:"2.5vw",marginBottom:"10px"}}>
                    <div id="loginsection">
                        <Signin />
                    </div>
                </div>
                <div id="footersection"></div>
                <Footer />
            </div>	
        );}


export default LandingPage;
