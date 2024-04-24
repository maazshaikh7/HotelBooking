import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import StarRating from './components/StarRating';
import './feedback.css'
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';

function FeedbackForm() {
    const navigate = useNavigate()
  const { roomID } = useParams();
  const [feedback, setFeedback] = useState({
    cleanlinessRating: 0,
    serviceRating: 0,
    comfortRating: 0,
    locationRating: 0,
    valueRating: 0,
    feedbackText: '',
    suggestions: '',
  });

  const submitFeedback = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/feedback/${roomID}`, feedback);
      console.log('Feedback submitted successfully:', response.data);
      navigate("/profile")
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleRatingChange = (ratingName, ratingValue) => {
    setFeedback({ ...feedback, [ratingName]: ratingValue });
  };

  const handleTextChange = (textName, textValue) => {
    setFeedback({ ...feedback, [textName]: textValue });
  };

  return (
    <>
    <Header/>
    <div id="Fdiv" style={{marginTop:"100px"}}>
      <h2 id='Fh2'>Feedback for Room You Recently Visited</h2>
      <div>
        <label id="Flabel">Cleanliness</label>
        <StarRating value={feedback.cleanlinessRating} onChange={(value) => handleRatingChange('cleanlinessRating', value)} />
      </div>
      <div>
        <label id="Flabel"> Service</label>
        <StarRating value={feedback.serviceRating} onChange={(value) => handleRatingChange('serviceRating', value)} />
      </div>
      <div>
        <label id="Flabel">Comfort</label>
        <StarRating value={feedback.comfortRating} onChange={(value) => handleRatingChange('comfortRating', value)} />
      </div>
      <div>
        <label id="Flabel">Location</label>
        <StarRating value={feedback.locationRating} onChange={(value) => handleRatingChange('locationRating', value)} />
      </div>
      <div>
        <label id="Flabel">Value</label>
        <StarRating value={feedback.valueRating} onChange={(value) => handleRatingChange('valueRating', value)} />
      </div>
      <div>
        <label id="Flabel">Feedback</label>
        <textarea id="#Ftextarea" value={feedback.feedbackText} onChange={(e) => handleTextChange('feedbackText', e.target.value)} />
      </div>
      <div>
        <label id="Flabel">Suggestions</label>
        <textarea id="#Ftextarea" style={{maxHeight:"50px", maxWidth:"200px"}} value={feedback.suggestions} onChange={(e) => handleTextChange('suggestions', e.target.value)} />
      </div>
      <button id="Fbutton" onClick={submitFeedback}>Submit Feedback</button>
    </div>
    <Footer/>
    </>
  );
}

export default FeedbackForm;
