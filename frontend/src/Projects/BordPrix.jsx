import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
import './BordPrix.css';

function BordPrix() {
    const { intituleduprojet } = useParams();

    const [bordprix, setBordprix] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/bordprix/${intituleduprojet}`)
        .then(result => setBordprix(result.data))
        .catch(err => console.log(err))
    }, []) 
    
  
    const handleDelete = (intituleduprojet,numbordprix) => {
        axios.delete(`http://localhost:3001/deletebordprix/${intituleduprojet}/${numbordprix}`)
        .then(res => {console.log(res)
            window.location.reload()})
        .catch(err => console.log(err))
    }


    return (
        <div>
            <Navbar />
            
        <div className='d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center'>
            

        <div className='d-flex justify-content-between'>
           
             <h2 className='mb-5 text-primary'> 2- Borderoux de prix du projet : {intituleduprojet} </h2>
        </div>
        
        <div className='w-100 h-80 bg-white rounded p-3 border shadow p-3 mb-5 '>
            <div className='d-flex justify-content-between'>
            <Link to={`/createbordprix/${intituleduprojet}`}className='btn btn-primary'> Ajouter + </Link>
            <Link to={`/ordrearret/${intituleduprojet}`} className='btn bg-light text-primary'>  Ajouter un Ordre d’arrêt/reprise  </Link>
            </div>
            
            <table className='table'>
                <thead>
                    <tr>
                    <th>Num</th>
                                <th>Designation</th>
                                <th>U</th>
                                <th>Quantity</th>
                                <th>P.U</th>
                                <th>P.T</th>
                                <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        bordprix.map((onebordprix) => {
                            return (
                                <tr  key={onebordprix.num}>
                                    <td>{onebordprix.num}</td>
                                    <td>{onebordprix.designation}</td>
                                    <td>{onebordprix.quantity}</td>
                                    <td>{onebordprix.U}</td>
                                    <td>{onebordprix.pu}</td>
                                    <td>{onebordprix.pt}</td>
                                    <td>

                                <div className="d-flex">
                                    
                                    <Link to={`/updatebordprix/${intituleduprojet}/${onebordprix.num}`} className='btn btn-info mx-2 text-success'> Modifier </Link>  
                                    <Link to={`/bordprix/${intituleduprojet}`} className='btn btn-warning text-danger'
                                    onClick={(e) => handleDelete(intituleduprojet,onebordprix.num)}> Supprimer </Link>
                                   </div>
                                </td>
                                

                            </tr>
                            );
                        })
                    }
                    
                </tbody>

            </table>

        </div>

    </div>
    </div>
    );
}

export default BordPrix;
