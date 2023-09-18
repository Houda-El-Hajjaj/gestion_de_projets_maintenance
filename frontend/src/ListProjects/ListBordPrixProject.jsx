import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function ListBordPrixProject() {
    const { intituleduprojet } = useParams();

    const [bordprix, setBordprix] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/bordprix/${intituleduprojet}`)
        .then(result => setBordprix(result.data))
        .catch(err => console.log(err))
    }, []) 
    
    const handleDelete = (intituleduprojet,numbordprix) => {
        axios.delete(`http://localhost:3001/deletebordprix/${intituleduprojet}/${numbordprix}`)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err))
    }

 

    return (
       <div>
            <Navbar />
            
        <div className='d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center'>
            

        <div className='d-flex justify-content-between'>
           
             <h2 className='mb-5 text-primary'>  Borderoux de prix du projet : {intituleduprojet} </h2>
        </div>
        
        <div className='w-100 bg-white rounded p-3 border shadow p-3 mb-5 '>
                <div>
                <Link to={`/listinfosproject/${intituleduprojet}`}>
                <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
                </Link>
                </div>
            <div className='d-flex justify-content-between'>
                <Link to={`/listcreatebordprix/${intituleduprojet}`} className='btn btn-primary'>Add</Link>
                <Link to={`/listordrearretproject/${intituleduprojet}`} className='btn bg-light text-primary'>Ordre d'arret</Link>
                    
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Num</th>
                                <th>Designation</th>
                                <th>U</th>
                                <th>Quantity</th>
                                <th>P.U</th>
                                <th>P.T</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bordprix.map((onebordprix) => {
                                    return (
                                        <tr key={onebordprix.num}>
                                            <td>{onebordprix.num}</td>
                                            <td>{onebordprix.designation}</td>
                                            <td>{onebordprix.U}</td>
                                            <td>{onebordprix.quantity}</td>
                                            <td>{onebordprix.pu}</td>
                                            <td>{onebordprix.pt}</td>
                                            <td>
                                                <div className="d-flex">
                                    
                                                  <Link to={`/listupdatebordprix/${intituleduprojet}/${onebordprix.num}`} className='btn btn-info mx-2 text-success'> Modifier </Link>  
                                                  <Link to={`/listbordprixproject/${intituleduprojet}`} className='btn btn-warning text-danger'
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

export default ListBordPrixProject;
