import React, { useState } from 'react';
import axios from 'axios';
import zxcvbn from 'zxcvbn'; // Import the password strength library
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import './LoginPage.css';

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rePassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationError, setRegistrationError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      // Calculate and update the password strength score
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (formData.password !== formData.rePassword) {
      setRegistrationError('Passwords do not match');
      return;
    }

    // Check if the password is strong enough
    if (passwordStrength < 3) {
      setRegistrationError('Password is too weak. Try a stronger password.');
      return;
    }

    // If the password is strong and passwords match, attempt registration
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username: formData.username,
        password: formData.password,
      });
      console.log(response.data);

      // Redirect to the login page upon successful registration
      navigate('/login'); // You can use React Router for better routing
    } catch (error) {
      setRegistrationError('Registration failed. Please try again.'); // Display a generic error message
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
    <Header/>
    <div>
      
      <br />
      <div style={{margin:"10vh 37vw"}}>
      <h2>  <b>Signup</b> </h2> <br />
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input-box"
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-box"
        />
        <br />
        <input
          type="password"
          name="rePassword"
          placeholder="Re-enter Password"
          value={formData.rePassword}
          onChange={handleChange}
          className="input-box"
        />
        <br />
        

        {/* Display a message for unsuccessful registration */}
        {registrationError && <p className="error-message">{registrationError}</p>}

        {/* Display the password strength */}
        {passwordStrength > 0 && (
          <p>Password Strength: {passwordStrength === 4 ? 'Strong' : 'Weak'}</p>
        )}

        <button type="submit" className="login_button">Sign Up</button>
      </form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Signup;
