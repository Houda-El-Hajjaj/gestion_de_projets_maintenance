import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function CreateProject ( ) {
    const [intituleduprojet, setIntituleduprojet]= useState('')
    const [descriptif, setDescriptif] = useState('')
    const [prestataire, setPrestataire] = useState('')
    const [dateodcbp, setDateodcbp] = useState('')
    const [datefinalprevis, setDatefinalprevis] = useState('')

    const navigate = useNavigate();
    const navig = useNavigate();
    axios.defaults.withCredentials = true;

    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/userslist', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                const { success, users } = response.data;
                if (success) {
                    setUsers(users);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const projectData = {
            intituleduprojet,
            descriptif,
            prestataire,
            dateodcbp,
            datefinalprevis,
            createur: selectedUser // Using selectedUser for assigned user
        };
        
        axios.post('http://localhost:3001/createprojectadmin', projectData, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                navigate('/projectslist'); 
            })
            .catch(error => {
                console.log(error);
            });
    };
    

    return (
        <div>
        <Navbar />
        

    <div className='d-flex flex-column vh-100  bg-secondary justify-content-center align-items-center'> 

    <div className='d-flex justify-content-between'>
             <Link to="/dashboard">
                     <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-5"></i>
                 </Link>
               <h2 className='mb-5 text-primary'>1 - Informations sur le projet :
               </h2>
        </div>

    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'> 
        <form onSubmit={handleSubmit}>
            
            <div className='mb-2'>
                <label htmlFor="" >Intitulé de projet :</label>
                <input type="text" placeholder="" className='form-control'
                onChange={(e)=> setIntituleduprojet(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="">Descriptif :</label>
                <input type="text" placeholder="" className='form-control' 
                onChange={(e)=> setDescriptif(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="">Prestataire :</label>
                <input type="text" placeholder="" className='form-control'
               onChange={(e)=> setPrestataire(e.target.value)} />
            </div>
            <div className='row'>
        <div className='col-md-6 mb-2'>
          <label htmlFor=''>Date ODC/BP :</label>
          <input
            type='date'
            placeholder=''
            className='form-control'
            onChange={(e) => setDateodcbp(e.target.value)}
          />
        </div>
        <div className='col-md-6 mb-2'>
          <label htmlFor=''>Date de finalisation Prévisionelle:</label>
          <input
            type='date'
            placeholder=''
            className='form-control'
            onChange={(e) => setDatefinalprevis(e.target.value)}
          />
        </div>
        <div className='col-md-6 mb-2'>
            <label htmlFor=''>Affecter ce projet à:</label>
            <select
                name="users"
                id="users"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)} // Changed setUsers to setSelectedUser
                >
                    <option value="">Select User</option>
                    {users.map((user, index) => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
            </select>
        </div>
      </div>
      <br />
      <input className="bg-primary" type="submit" value="Ajouter" />
        
        </form>
    </div>
    </div>
    
</div>



    );
}

export default CreateProject