
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import SidebarV from '../components/SidebarV';
import Navbar from "../components/Navbar";

//import ListInfosProject from './ListProjects/ListInfosProject';
//import ListBordPrixProject from './ListProjects/ListBordPrixProject';
//import ListOrdreArretProject from './ListProjects/ListOrdreArretProject';


function ProjectDetails() {
    const { intituleduprojet } = useParams();

    const [infoprojet, setInfoprojet] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3001/listinfosproject/${intituleduprojet}`)
            .then(result => setInfoprojet(result.data))
            .catch(err => console.log(err))
    }, [intituleduprojet]);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleEdit = () => {
        setEditedInfo({
            descriptif: infoprojet.descriptif,
            prestataire: infoprojet.prestataire,
            dateodcbp: infoprojet.dateodcbp,
            datefinalprevis: infoprojet.datefinalprevis
        });
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:3001/listinfosproject/${intituleduprojet}`, editedInfo)
            .then(response => {
                console.log('Project information updated successfully');
                setInfoprojet(editedInfo); // Update the local state with the edited data
                setEditMode(false);
            })
            .catch(error => {
                console.error('Error updating project information:', error);
                // Handle error scenario if needed
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };
      //-------------------BORDPROX-----------------------------------------------------------------------------------
      

    const [bordprix, setBordprix] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/bordprix/${intituleduprojet}`)
        .then(result => setBordprix(result.data))
        .catch(err => console.log(err))
    }, []) 
    
    const handleDeleteB = (intituleduprojet,numbordprix) => {
        axios.delete(`http://localhost:3001/deletebordprix/${intituleduprojet}/${numbordprix}`)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err))
    }
    //------------------------OrdreArret------------------------------------------------------
    

    const [ordrearret, setOrdrearret] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ordrearret/${intituleduprojet}`)
        .then(result => setOrdrearret(result.data))
        .catch(err => console.log(err))
    }, []) 

    const handleDeleteO = (intituleduprojet, numordrearret) => {
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
<br />
<br />
<div>
<SidebarV/>
</div>
<br />
<div className="d-flex flex-column ">
  
        <div className="col ">
            
               <div className="bg-white p-2 rounded border ">
               <h2 className="mb-4 text-primary">Informations du projet: {intituleduprojet}</h2>
                <div className="bg-white p-5 rounded shadow-lg border" >
                    {editMode ? (
                        <>
                            <label htmlFor="">Descriptif :</label>
                            <input
                                type="text"
                                name="descriptif"
                                value={editedInfo.descriptif}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="">Prestataire :</label>
                            <input
                                type="text"
                                name="prestataire"
                                value={editedInfo.prestataire}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="">Date ODC/BP : </label>
                            <input
                                type="date"
                                name="dateodcbp"
                                value={editedInfo.dateodcbp}
                                onChange={handleInputChange}
                            />
                            <label className="" style={{marginLeft : '50px'}} htmlFor="">Date Finalisation previsionnelle : </label>
                            <input
                                type="date"
                                name="datefinalprevis"
                                value={editedInfo.datefinalprevis}
                                onChange={handleInputChange}
                            />
                            <br />
                            <br />
                            <div className="d-flex ">
                            <button className="btn bg-success text-white " onClick={handleSaveEdit}>Save</button>
                            <button className="btn bg-danger text-white mx-5" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mb-2 p-2"><strong className="text-primary">Descriptif :</strong> {infoprojet.descriptif}</p>
                            <p className="mb-2 p-2"><strong className="text-primary">Prestataire :</strong> {infoprojet.prestataire}</p>
                            <p className="mb-2 p-2"><strong className="text-primary">Date ODC/BP :</strong> {formatDate(infoprojet.dateodcbp)}</p>
                            <p className="mb-2 p-2"><strong className="text-primary">Date Finale Prévisionnelle:</strong> {formatDate(infoprojet.datefinalprevis)}</p>
                            <button className="btn btn-light text-white" onClick={handleEdit}>Modifier</button>
                        </>
                    )}
                </div>
         
               </div>
        </div>
    
  
    
       <div className="col">
                   <div className="bg-white p-2 rounded border">
                   <h2 className="text-start text-primary"> I Borderoux de prix </h2>
                  <br />
    
                      <div className="w-100 bg-white rounded p-3 border shadow p-3 mb-5">
                      
                           <div className='d-flex justify-content-between'>
                                <Link to={`/listcreatebordprix/${intituleduprojet}`} className='btn btn-primary'>Ajouter</Link>
                                  
                              
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
                                                            <Link  className='btn btn-warning text-danger'
                                                            onClick={(e) => handleDeleteB(intituleduprojet,onebordprix.num)}> Supprimer </Link>
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

    

  
        
    <div className="col">
                    <div className="bg-white p-2 rounded border">
                    <h2 className="text-start text-danger">I Ordres d'arrets</h2>
                    <div className="w-100 bg-white rounded p-3 border shadow p-3 mb-5">
                    
                    
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
                                                <button className='btn btn-warning text-danger' onClick={(e) => handleDeleteO(intituleduprojet, oneordrearret.num)}>Supprimer</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    
          
                
                    
                    </div>
                   </div>
                </div>  
    </div>                                  



</div>
  


    
  );
}

export default ProjectDetails;
