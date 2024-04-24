import React, { useState } from "react";
import AdminHeader from "./AdminHeader";

import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch("http://localhost:5000/adminlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                setSignInSuccess(true);
            } else {
                console.log("Sign-in failed");
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    return (
        <div>
            {signInSuccess ? (
                <>
                    <AdminHeader />
                    <h3 style={{ alignItems: "left", textAlign: "start", fontWeight:"bold", marginLeft:"3vw", marginTop:"3vh" }}>Admin Page</h3>
                    <hr></hr>
                    <iframe src="https://app.appsmith.com/app/hotel-management-miniproject/page1-653ca21378dbf40af4db4bf4" frameborder="0" style={{width:"100vw",height:"80vh", padding:"20px",borderRadius:"15px"}}></iframe>
                </>
            ) : (
                <>
                <div style={{marginLeft:"3vw", padding:"20px", fontWeight:"bold", width:"fit-content"}}>
                
                    <div style={{marginTop:"2vh"}}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            style={{padding:"5px 10px"}}
                        />
                    </div>
                    <div style={{marginTop:"2vh"}}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={{padding:"5px 10px"}}
                        />
                    </div>
                    <button onClick={handleSignIn} style={{width:"100%",marginTop:"2vh"}}>Sign In</button>
                </div>
                </>
            )}
            
        </div>
    );
};

export default AdminPage;
