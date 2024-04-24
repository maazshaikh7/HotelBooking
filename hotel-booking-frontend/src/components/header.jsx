/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Header() {

  return (
        <div id="Header">
            <nav  className="navbar navbar-expand-lg navbar-light bg-light bg-white px-lg-3 py-lg-2shadow-sm sticky top ">
                <div  className="container-fluid">
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
                                <a className="nav-link me-2" href="/allHotels">Rooms</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" href="/">Contact us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" href="/landingpage">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-2" href="/profile">Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
  );
}
