import React, { useState,useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function ListCreateOrdreArret() {
    const { intituleduprojet } = useParams();
    
    const [datearret, setDatearret] = useState('');
    const [cause, setCause] = useState('');
    const [datereprise, setDatereprise] = useState('');
    const [commentaire, setCommentaire] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [role, setRole] = useState('');
    
        useEffect(() => {
            axios.get(`http://localhost:3001/getuserrole`)
            .then(result => {
              setRole(result.data.role)
            });
        }, []) 
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const requestData = {
            datearret: datearret || null, 
            cause,
            datereprise,
            commentaire
        };
    
        axios.post(`http://localhost:3001/createordrearret/${intituleduprojet}`, requestData)
        .then(res => {
            const userRole = res.data.userRole;
            if (userRole === 'visitor') {
            navigate(`/listordrearretproject/${intituleduprojet}`);
        } else if (userRole === 'admin') {
            navigate(`/projectdetails/${intituleduprojet}`);
        }
        }).catch(err => console.log(err));
    }
    

    

    return (
        <div>
        <Navbar />
        

    <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>

        <form onSubmit={handleSubmit}>
        <div>
                {role === 'admin' ? (
                            <Link to={`/projectdetails/${intituleduprojet}`}>
                                <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
                            </Link>
                        ) : (
                            <Link to={`/listordrearretproject/${intituleduprojet}`}>
                                <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
                            </Link>
                        )}
                </div>
            <h2 className="text-danger">Ajouter un ordre d'arrêt du projet :{intituleduprojet}</h2>
            <br />
            <div className='mb-2'>
                <label htmlFor="" >Date darret :</label>
                <input type="Date"  className='form-control'
                onChange={(e)=> setDatearret(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor=""> Cause :</label>
                <input type="text"  className='form-control' 
                onChange={(e)=> setCause(e.target.value)}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="">Date de reprise:</label>
                <input type="date"  className='form-control'
              onChange={(e)=> setDatereprise(e.target.value)} />
            </div>
            <div className="className='mb-2'">
          <label htmlFor=''>Commentaire:</label>
          <textarea 
            type='text'
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

export default ListCreateOrdreArret;
