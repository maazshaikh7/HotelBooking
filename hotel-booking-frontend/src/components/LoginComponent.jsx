import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div>
      <h2 style={{marginLeft:"30px",fontWeight:"bold",marginTop:"50px"}}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{width:"300px", padding:"10px",marginLeft:"30px",border:"none",borderRadius:"7px"}}
        />
        <br></br>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{width:"300px", padding:"10px",marginLeft:"30px",border:"none",marginTop:"10px",borderRadius:"7px"}}
        /><br></br>
        <button type="submit"
        style={{width:"300px", padding:"10px",marginLeft:"30px",border:"none",marginTop:"10px",borderRadius:"7px",backgroundColor:"#333",color:"white"}}
        >Login</button>
      </form>
    </div>
  );
};

export default Signin;
