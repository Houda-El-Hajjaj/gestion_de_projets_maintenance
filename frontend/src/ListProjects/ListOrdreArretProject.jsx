import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function ListOrdreArretProject() {
    const { intituleduprojet } = useParams();

    const [ordrearret, setOrdrearret] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ordrearret/${intituleduprojet}`)
        .then(result => setOrdrearret(result.data))
        .catch(err => console.log(err))
    }, []) 

    const handleDelete = (intituleduprojet, numordrearret) => {
        axios.delete(`http://localhost:3001/deleteordrearret/${intituleduprojet}/${numordrearret}`)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err))
    }

    const tableContainerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Adjust this value based on your layout
    };

    return (
        <div>
        <Navbar />
        
    <div className='d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center'>
        

    <div className='d-flex justify-content-between'>
                
         <h2 className='mb-5 text-danger'> Ordres d'arrêts du projet  : {intituleduprojet} </h2>
    </div>
    
    <div className='w-100 bg-white rounded p-3 border shadow p-3 mb-5 '>
                <div>
                <Link to={`/listinfosproject/${intituleduprojet}`}>
                <i className="bi bi-arrow-left-circle-fill text-danger fs-2 mx-2"></i>
                </Link>
                </div> 
                        <Link className="btn btn-warning text-danger" to={`/listcreateordrearret/${intituleduprojet}`}>
                            Ajouter
                        </Link>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Num</th>
                                    <th>Date d'arrêt</th>
                                    <th>Cause</th>
                                    <th>Date de Reprise</th>
                                    <th>Commentaire</th>
                                </tr>
                            </thead>
                            <tbody>
                            {ordrearret.map((oneordrearret) => {
                                const formatDate = (dateString) => {
                                    if (!dateString) {
                                        return ""; 
                                    }
                                    
                                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                                    return new Date(dateString).toLocaleDateString(undefined, options);
                                };
                            

                            return (
                              <tr key={oneordrearret.num}>
                                  <td>{oneordrearret.num}</td>
                                  <td>{formatDate(oneordrearret.datearret)}</td>
                                  <td>{oneordrearret.cause}</td>
                                  <td>{formatDate(oneordrearret.datereprise)}</td>
                                  <td>{oneordrearret.commentaire}</td>
                                  <td>
                                     <Link className='btn btn-info mx-2 text-success' to={`/listupdateordrearret/${intituleduprojet}/${oneordrearret.num}`}>
                                     Modifier
                                     </Link>
                                    <button className='btn btn-warning text-danger' onClick={(e) => handleDelete(intituleduprojet, oneordrearret.num)}>Supprimer</button>
                                  </td>
                              </tr>
                            );
                            })}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        
    );
}

export default ListOrdreArretProject;
