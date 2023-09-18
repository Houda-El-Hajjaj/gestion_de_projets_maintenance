import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
import SidebarV from "../components/SidebarV";
function UpdateOrdreArret() {
    const { intituleduprojet , numordrearret} = useParams();

    const [datearret, setDatearret] = useState('')
    const [cause, setCause]                     = useState('')
    const [datereprise, setDatereprise]       = useState('')
    const [commentaire, setCommentaire]                   = useState('')

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`http://localhost:3001/updateordrearret/${intituleduprojet}/${numordrearret}`)
        .then(result => {console.log(result)
            setDatearret(result.data.datearret)
            setCause(result.data.cause)
            setDatereprise(result.data.datereprise)
            setCommentaire(result.data.commentaire)
        })
        
    }, []) 
    
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put(`http://localhost:3001/updateordrearret/${intituleduprojet}/${numordrearret}`, { datearret, cause, datereprise, commentaire})
        .then(res => {
            navigate(`/ordrearret/${intituleduprojet}`)
        }).catch(err => console.log(err))
    }

    return(
        
        <div >

            <Navbar />
            <br />
            <br />
    <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
            
    <form onSubmit={handleSubmit}>
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
        
    )
}

export default UpdateOrdreArret