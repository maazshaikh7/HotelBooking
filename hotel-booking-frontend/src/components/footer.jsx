import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Explore <span className="arrow-icon"><i className="bi bi-caret-down-fill"></i></span></h3>
          <ul>
            <li><a href="/homes">Homes</a></li>
            <li><a href="/experiences">Experiences</a></li>
            <li><a href="/restaurants">Restaurants</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>About <span className="arrow-icon"><i className="bi bi-caret-down-fill"></i></span></h3>
          <ul>
            <li><a href="/about-us">About us</a></li>
            <li><a href="/newsroom">Newsroom</a></li>
            <li><a href="/investors">Investors</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Support <span className="arrow-icon"><i className="bi bi-caret-down-fill"></i></span></h3>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/cancellation">Cancellation options</a></li>
            <li><a href="/neighborhood-support">Neighborhood Support</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Host <span className="arrow-icon"><i className="bi bi-caret-down-fill"></i></span></h3>
          <ul>
            <li><a href="/hosting">Host your home</a></li>
            <li><a href="/hosting-experiences">Host an experience</a></li>
            <li><a href="/resource-center">Resource Center</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#"><i className="bi bi-facebook"></i></a>
          <a href="#"><i className="bi bi-twitter"></i></a>
          <a href="#"><i className="bi bi-instagram"></i></a>
        </div>
        <div className="footer-legal">
          <p>&copy; {new Date().getFullYear()} Hotel, Inc. All rights reserved</p>
          <p><a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/sitemaps">Sitemaps</a></p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;