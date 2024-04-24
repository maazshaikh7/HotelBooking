import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'
import Header from './components/header';
import Footer from './components/footer';

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: formData.username,
        password: formData.password,
      });
      if (response.status === 200) {
        // Login successful, store username in local storage
        localStorage.setItem('username', formData.username);
        navigate('/allHotels');
        console.log('Login successful');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  const GoToRegister = () =>{
    navigate('/register')
  }

  return (
    <div>
      <Header/>
    <div className='bbbbody' style={{display:"flex"}} >
      
      <div style={{margin:"10vh auto"}}>
      <h2> <b> Login</b></h2>
      <h5 className="sub-heading"></h5>
      <form onSubmit={handleSubmit} className='' >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input-box"

        /> <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-box"

        />  <br />

        <button type="submit" className="login_button">Login</button><br></br>
        <button onClick={GoToRegister} className="login_button">Register</button>

      </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Signin;
