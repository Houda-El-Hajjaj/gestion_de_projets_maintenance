import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from '../../components/Navbar';
import SidebarV from "../../components/SidebarV";
function PointsBlocants () {
    const { intituleduprojet } = useParams();

    const [pointsblocants, setPointsblocants] = useState([]);

    const [role, setRole] = useState('');
    
    useEffect(() => {
        axios.get(`http://localhost:3001/getuserrole`)
        .then(result => {
          setRole(result.data.role)
        });
    }, []) 

    useEffect(() => {
        axios.get(`http://localhost:3001/pointsbloquants/${intituleduprojet}`)
        .then(result => setPointsblocants(result.data))
        .catch(err => console.log(err))
    }, []) 

    const handleDelete = (intituleduprojet,numpointbloquant) => {
        axios.delete(`http://localhost:3001/deletepointsbloquants/${intituleduprojet}/${numpointbloquant}`)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err))
    }


    return (
        <div>
             {role === 'visitor' ? (
        null
      ) : (
        <SidebarV />
      )}
             
         <div className='d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center'>
         
 
         <div className='d-flex justify-content-between'>
            
              <h2 className='mb-5 text-primary'>  Points Bloquants de l'avancement du projet : {intituleduprojet} </h2>
         </div>
         
         <div className='w-100 bg-white rounded p-3 border shadow p-3 mb-5 '>
             <div className='d-flex justify-content-between'>
             <Link to={`/etatavancement/${intituleduprojet}`}>
                     <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
             </Link>
                 <Link to={`/createpointsbloquants/${intituleduprojet}`} className='btn btn-primary'>Add</Link>
                 
                     
                     </div>
                     <table className="table">
                         <thead>
                             <tr>
                                 <th>Num</th>
                                 <th>Point Bloquant</th>
                                 <th>Date de Notification</th>
                                 <th>Date de Traitement</th>
                                 <th>Commentaire</th>
                             </tr>
                         </thead>
                         <tbody>
                         {
                                pointsblocants.map((onepointsblocants) => {
                                    const formatDate = (dateString) => {
                                        if (!dateString) {
                                            return ""; 
                                        }
                                        
                                        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                                        return new Date(dateString).toLocaleDateString(undefined, options);
                                    };


                                    return (
                                        <tr key={onepointsblocants.num}>
                                            <td>{onepointsblocants.num}</td>
                                            <td>{onepointsblocants.pointbloquant}</td>
                                            <td>{formatDate(onepointsblocants.datenotif)}</td>
                                            <td>{formatDate(onepointsblocants.datetraitement)}</td>
                                            <td>{onepointsblocants.commentaire}</td>
                                            <td>
                                                <div className="d-flex">
                                    
                                                  <Link to={`/updatepointsbloquants/${intituleduprojet}/${onepointsblocants.num}`} className='btn btn-info mx-2 text-success'> Modifier </Link>  
                                                  <Link to={`/pointsbloquants/${intituleduprojet}`} className='btn btn-warning text-danger'
                                                  onClick={(e) => handleDelete(intituleduprojet,onepointsblocants.num)}> Supprimer </Link>
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
export default PointsBlocants