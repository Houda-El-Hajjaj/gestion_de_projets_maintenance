import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";


function ListUpdateOrdreArret() {
    const { intituleduprojet, numordrearret } = useParams();

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

    useEffect(() => {
        axios.get(`http://localhost:3001/updateordrearret/${intituleduprojet}/${numordrearret}`)
            .then(result => {
                console.log(result);
                const updateddatearret = result.data.datearret || '';
                const updatedcause = result.data.cause || '';
                const updateddatereprise = result.data.datereprise || '';
                const updatedcommentaire = result.data.commentaire || '';
    
                setDatearret(updateddatearret);
                setCause(updatedcause);
                setDatereprise(updateddatereprise);
                setCommentaire(updatedcommentaire);
            });
    
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/updateordrearret/${intituleduprojet}/${numordrearret}`, { datearret, cause, datereprise, commentaire })
            .then(res => {
                const userRole = res.data.userRole;
            if (userRole === 'visitor') {
            navigate(`/listordrearretproject/${intituleduprojet}`);
        } else if (userRole === 'admin') {
            navigate(`/projectdetails/${intituleduprojet}`);
        }
            }).catch(err => console.log(err));
    };

    const centeredContentStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };

    const formContainerStyle = {
        textAlign: 'center',
        maxWidth: '400px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f8f8f8',
    };

    return (
        <div >

        <Navbar />
        <br />
        <br />
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
        <h2 className="text-success">Modifier l'ordre d'arrêt du projet : {intituleduprojet}</h2>
        <br />
            <div className='mb-2'>
            <label htmlFor="" >Date d'arret :</label>
            <input type="date" placeholder="" className='form-control'
             onChange={(e)=> setDatearret(e.target.value)}
            value={datearret}
        />
            </div>

        <div className='mb-2'>
            <label htmlFor="" >Cause:</label>
            <input type="text" placeholder="" className='form-control'
        onChange={(e)=> setCause(e.target.value)}
        value={cause}
        />
         </div>

         <div className='mb-2'>
            <label htmlFor="" >Date de reprise :</label>
            <input type="date" placeholder="" className='form-control'
        onChange={(e)=> setDatereprise(e.target.value)}
        value={datereprise}
        />
         </div>

        
       
        <div className='mb-2'>
            <label htmlFor="" >Commentaire:</label>
            <textarea type="text" placeholder="" className='form-control'
        onChange={(e)=> setCommentaire(e.target.value)}
        value={commentaire}
        />
        </div>
        <br />
        <input className=" btn btn-lg bg-info text-success" type="submit" value="Update" />
     </form>
        </div>
        </div>
        </div>
    );
}

export default ListUpdateOrdreArret;
