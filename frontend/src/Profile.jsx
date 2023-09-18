import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';


function Profile() {
    const [userData, setUserData] = useState({});
    const userId = localStorage.getItem('userId'); // Get user's ID from local storage

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3001/getUserInfo/${userId}`)
                .then(response => {
                    setUserData(response.data); // Set user's data in state
                })
                .catch(err => console.log(err));
        }
    }, [userId]);

    return (
      <div> 
      <Navbar/>
      <div className="d-flex justify-content-center align-items-center vh-100">
        
      <div className="card m-5 shadow p-3 mb-5 rounded">
          <div className="card-body m-5 ">
          <h2 className="card-title mb-5 text-primary">{userData.name} Profile</h2>
          
              <p className="card-text"> <strong>Nom :</strong> {userData.name}</p>
              <p className="card-text"><strong>Email :</strong> {userData.email}</p>
              <p className="card-text"><strong>Role :</strong> {userData.role}</p>
              {/* Add more user data as needed */}
          </div>
      </div>
  </div>
  </div>
    );
}

export default Profile;
