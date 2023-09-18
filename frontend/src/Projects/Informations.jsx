import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
//import SidebarV from "../components/SidebarV";
import './Informations.css'


function Informations () {
    const [suc, setSuc] = useState('');

    const [intituleduprojet, setIntituleduprojet]= useState('')
    const [descriptif, setDescriptif] = useState('')
    const [prestataire, setPrestataire] = useState('')
    const [dateodcbp, setDateodcbp] = useState('')
    const [datefinalprevis, setDatefinalprevis] = useState('')

    const navigate = useNavigate();
    const navig = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/informations')
            .then(res => {
                if (res.data === "Success"){
                    setSuc("Succeeded OK");
                } else {
                    navigate('/dashboard');
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/informations', { intituleduprojet, descriptif, prestataire, dateodcbp, datefinalprevis })
        .then(res => {
            const projectId = res.data.project._id; 
            navigate(`/bordprix/${intituleduprojet}`)
        }).catch(err => console.log(err))
    }


    return (
        <div>
        <Navbar />
        

    <div className='d-flex flex-column vh-100  bg-secondary justify-content-center align-items-center'> 

    <div className='d-flex justify-content-between'>
             <Link to="/home">
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
      </div>
      <br />
      <input className="bg-primary" type="submit" value="Ajouter" />
        
        </form>
    </div>
    </div>
    
</div>



    );
}

export default Informations