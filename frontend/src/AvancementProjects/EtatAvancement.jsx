import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
import SidebarV from "../components/SidebarV";
function EtatAvancement () {

    const { intituleduprojet } = useParams();

    const [etatavancement, setEtatavancement] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/etatavancement/${intituleduprojet}`)
        .then(result => setEtatavancement(result.data))
        .catch(err => console.log(err))
    }, []) 

    const handleDelete = (intituleduprojet,numetatavancement) => {
        axios.delete(`http://localhost:3001/deleteetatavancement/${intituleduprojet}/${numetatavancement}`)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err))
    }
    const sumMontantRealised = etatavancement.reduce(
        (total, item) => total + (parseFloat(item.montantrealised) || 0),
        0
    );
    const sumMontantTotal = etatavancement.reduce(
        (total, item) => total + parseFloat(item.montanttotal),
        0
    );
    const pourcentageAvancementProjet = (sumMontantRealised / sumMontantTotal) * 100;

    useEffect(() => {
    
        // Send the pourcentageAvancementProjet to the server
        axios.post(`http://localhost:3001/updatepourcentageavancementprojet/${intituleduprojet}`, { pourcentageAvancementProjet })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }, [sumMontantRealised, sumMontantTotal]);

    const [role, setRole] = useState('');
    
    useEffect(() => {
        axios.get(`http://localhost:3001/getuserrole`)
        .then(result => {
          setRole(result.data.role)
        });
    }, []) 
    return (
       <div>
        {role === 'visitor' ? (
        null
      ) : (
        <SidebarV />
      )}
        <div className='d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center'>
            

        <div className='d-flex justify-content-between'>
           
             <h2 className='mb-5 text-primary'>  Etat d'avancement du projet : {intituleduprojet} </h2>
        </div>
        
        <div className='w-55 bg-white rounded p-3 border shadow p-3 mb-5 '>
            
            <div className='d-flex justify-content-between'>
            <div>
            {role == 'visitor' ? (
            <Link to={`/listprojects`}>
            <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
            </Link>
             ) : (
            <Link to={`/projectslist`}>
            <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
            </Link>        
            )}
            </div>
                <Link to={`/pointsbloquants/${intituleduprojet}`} className='btn bg-light text-primary'>Points Bloquants</Link>
                    
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Num</th>
                                <th>Designation</th>
                                <th>U</th>
                                <th>Quantité</th>
                                <th>Quantité Réalisée</th>
                                <th>% Réalisation </th>
                                <th>Montant Total</th>
                                <th>Montant Réalisé</th>
                                <th>% Réalisation Montant</th>
                                <th>Commentaire</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                etatavancement.map((oneetatavancement) => {
                                    return (
                                        <tr key={oneetatavancement.num}>
                                            <td>{oneetatavancement.num}</td>
                                            <td>{oneetatavancement.designation}</td>
                                            <td>{oneetatavancement.U}</td>
                                            <td>{oneetatavancement.quantity}</td>
                                            <td>{oneetatavancement.quantityrealised}</td>
                                            <td>
                                                {oneetatavancement.pourcentagerealised !== null &&
                                                oneetatavancement.pourcentagerealised !== undefined
                                                    ? `${oneetatavancement.pourcentagerealised}%`
                                                    : '0%'}
                                            </td>
                                            <td>{oneetatavancement.montanttotal}</td>
                                            <td>{oneetatavancement.montantrealised}</td>
                                            <td>
                                                {oneetatavancement.pourcentagerealisedmontant !== null &&
                                                oneetatavancement.pourcentagerealisedmontant !== undefined
                                                    ? `${oneetatavancement.pourcentagerealisedmontant}%`
                                                    : '0%'}
                                            </td>
                                            <td>{oneetatavancement.commentaire}</td>
                                            <td>
                                                <div className="d-flex">
                                    
                                                  <Link to={`/updateetatavancement/${intituleduprojet}/${oneetatavancement.num}`} className='btn btn-info mx-1 text-success'> Modifier </Link>  
                                                  <Link to={`/etatavancement/${intituleduprojet}`} className='btn btn-warning text-danger'
                                                  onClick={(e) => handleDelete(intituleduprojet,oneetatavancement.num)}> Supprimer </Link>
                                                  <Link to={`/photos/${intituleduprojet}/${oneetatavancement.num}`} className='btn btn-info mx-1 text-success'> Photos </Link>  
                                                 </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                                        <tr>
                                            <td colSpan="6">Total:</td>
                                            <td>{sumMontantTotal.toFixed(2)}</td>
                                            <td>{sumMontantRealised.toFixed(2)}</td>
                                            <td colSpan="2"></td>
                                            <td className="text-end" style={{ fontSize: '18px', color: 'red' }}>
                                                Pourcentage Avancement Projet: {pourcentageAvancementProjet.toFixed(2)}%
                                            </td>
                                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EtatAvancement