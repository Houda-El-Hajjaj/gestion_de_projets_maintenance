import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from '../../components/Navbar';
function UpdatePointBlocant () {
    const { intituleduprojet, numpointblocant } = useParams();

    const [pointbloquant, setPointbloquant] = useState('');
    const [datenotif, setDatenotif] = useState('');
    const [datetraitement, setDatetraitement] = useState('');
    const [commentaire, setCommentaire] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`http://localhost:3001/updatepointsbloquants/${intituleduprojet}/${numpointblocant}`)
            .then(result => {
                console.log(result);
                const updatedPointbloquant = result.data.pointbloquant || '';
                const updatedDatenotif = result.data.datenotif || '';
                const updatedDatetraitement = result.data.datetraitement || '';
                const updatedCommentaire = result.data.commentaire || '';
    
                setPointbloquant(updatedPointbloquant);
                setDatenotif(updatedDatenotif);
                setDatetraitement(updatedDatetraitement);
                setCommentaire(updatedCommentaire);
            });
    
    }, [intituleduprojet, numpointblocant]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/updatepointsbloquants/${intituleduprojet}/${numpointblocant}`, { pointbloquant, datenotif, datetraitement, commentaire })
            .then(res => {
                navigate(`/pointsbloquants/${intituleduprojet}`);
            }).catch(err => console.log(err));
    };
    
    return (
        <div >

        <Navbar />
        <br />
        <br />
<div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
<div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
<div>
            <Link to={`/pointsbloquants/${intituleduprojet}`}>
            <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
            </Link>
            </div>
        
<form onSubmit={handleSubmit}>
        <h2 className="text-success">Modifier le point blocant du projet : {intituleduprojet} </h2>
        <br />
            <div className='mb-2'>
            <label htmlFor="" >Point Bloquant :</label>
            <input type="text" placeholder="" className='form-control'
             onChange={(e)=> setPointbloquant(e.target.value)}
             value={pointbloquant}

        />
            </div>

         <div className='mb-2'>
            <label htmlFor="" >Date de notif :</label>
            <input type="date" placeholder="" className='form-control'
            onChange={(e)=> setDatenotif(e.target.value)}
            value={datenotif}
        />
         </div>

         <div className='mb-2'>
            <label htmlFor="" >Date de traitement :</label>
            <input type="date" placeholder="" className='form-control'
            onChange={(e)=> setDatetraitement(e.target.value)}
            value={datetraitement}
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
export default UpdatePointBlocant