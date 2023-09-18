import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link} from "react-router-dom";
import Navbar from '../../components/Navbar';
function CreatePointBlocant () {
    const { intituleduprojet } = useParams();

    const [pointbloquant, setPointbloquant] = useState('');
    const [datenotif, setDatenotif] = useState('');
    const [datetraitement, setDatetraitement] = useState('');
    const [commentaire, setCommentaire] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const requestData = {
            datenotif: datenotif || null, 
            pointbloquant,
            datetraitement: datetraitement || null,
            commentaire
        };
    
        axios.post(`http://localhost:3001/createpointsbloquants/${intituleduprojet}`, requestData)
        .then(res => {
            navigate(`/pointsbloquants/${intituleduprojet}`);
        }).catch(err => console.log(err));
    }

    return (
        <div><Navbar /> 
                
        
        <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
        <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
            <div>
            <Link to={`/pointsbloquants/${intituleduprojet}`}>
            <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
            </Link>
            </div>
    
            <form onSubmit={handleSubmit}>
                <h2 className="text-primary">Ajouter un point bloquant du projet :{intituleduprojet}</h2>
                <br />
                <div className='mb-2'>
                    <label htmlFor="" >Point bloquant :</label>
                    <input type="text" placeholder="" className='form-control'
                    onChange={(e)=> setPointbloquant(e.target.value)}/>
                </div>
                <div className='mb-2'>
                <label htmlFor="">Date de Notif:</label>
                <input type="date"  className='form-control'
              onChange={(e)=> setDatenotif(e.target.value)} />
                </div>
                <div className='mb-2'>
                <label htmlFor="">Date de Traitement:</label>
                <input type="date"  className='form-control'
              onChange={(e)=> setDatetraitement(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor=""> commentaire :</label>
                    <input type="text" placeholder="" className='form-control' 
                    onChange={(e)=> setCommentaire(e.target.value)}/>
                </div>
                
            
          <br />
         
          <input className=" btn bg-light text-primary font-weight-bold" type="submit" value="Ajouter" />
            
       </form>
        </div>
    </div>
    </div>   
    
    )
}
export default CreatePointBlocant