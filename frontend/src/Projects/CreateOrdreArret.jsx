import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
//import SidebarV from "../components/SidebarV";
function CreateOrdreArret() {

    const { intituleduprojet } = useParams();
    
    const [datearret, setDatearret] = useState('')
    const [cause, setCause]                     = useState('')
    const [datereprise, setDatereprise]       = useState('')
    const [commentaire, setCommentaire]                   = useState('')

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:3001/createordrearret/${intituleduprojet}`, { datearret, cause, datereprise, commentaire })
        .then(res => {
            navigate(`/ordrearret/${intituleduprojet}`)
        }).catch(err => console.log(err))
    }

    return(
        <div>
        <Navbar />
        

    <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>

        <form onSubmit={handleSubmit}>
            <h2 className="text-danger">Ajouter un ordre d'arrêt du projet :{intituleduprojet}</h2>
            <br />
            <div className='mb-2'>
                <label htmlFor="" >Date darret :</label>
                <input type="Date" placeholder="" className='form-control'
                onChange={(e)=> setDatearret(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor=""> Cause :</label>
                <input type="text" placeholder="" className='form-control' 
                onChange={(e)=> setCause(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="">Date de reprise:</label>
                <input type="date" placeholder="" className='form-control'
              onChange={(e)=> setDatereprise(e.target.value)} />
            </div>
            <div className="className='mb-2'">
          <label htmlFor=''>Commentaire:</label>
          <textarea 
            type='text'
            placeholder=''
            className='form-control'
            onChange={(e)=> setCommentaire(e.target.value)}
          />
        </div>
        <br />
        
     
      <input className=" btn bg-warning text-danger" type="submit" value="Ajouter" />
        
   </form>
    </div>
</div>
</div>
    )
}

export default CreateOrdreArret