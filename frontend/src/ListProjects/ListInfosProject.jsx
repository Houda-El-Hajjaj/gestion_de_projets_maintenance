import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function ListInfosProject() {
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

  return (
    <div>
     <Navbar /> 
      <div className="container text-center mt-4">
      <div>
        <Link to={`/listprojects`}>
        <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
        </Link>
      </div> 
        <h2 className="mb-4 text-primary">Informations du projet: {intituleduprojet}</h2>
    <div className="bg-white p-5 rounded  border" style={{ width: "100%" }}>
          {editMode ? (
            <>
              <input
                type="text"
                name="descriptif"
                value={editedInfo.descriptif}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="prestataire"
                value={editedInfo.prestataire}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="dateodcbp"
                value={editedInfo.dateodcbp}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="datefinalprevis"
                value={editedInfo.datefinalprevis}
                onChange={handleInputChange}
              />
              <div className="d-flex justify-content-between">
              <button className="btn btn-light text-white " onClick={handleSaveEdit}>Save</button>
              <button className="btn btn-danger text-white" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 p-2"><strong className="text-primary">Descriptif :</strong> {infoprojet.descriptif}</p>
              <p className="mb-2 p-2"><strong className="text-primary">Prestataire :</strong> {infoprojet.prestataire}</p>
              <p className="mb-2 p-2"><strong className="text-primary">Date ODC/BP :</strong> {formatDate(infoprojet.dateodcbp)}</p>
              <p className="mb-2 p-2"><strong className="text-primary">Date Finale Prévisionnelle:</strong> {formatDate(infoprojet.datefinalprevis)}</p>
              <button className="btn bg-light text-primary" onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
        <br />
        <div className="d-flex justify-content-between">
        <Link className="btn btn-primary text-white " to={`/listbordprixproject/${intituleduprojet}`}>
           Voir Bordereau de prix de ce projet
        </Link>
        <br></br>
        <Link className="btn btn-primary text-white mx-2" to={`/listordrearretproject/${intituleduprojet}`}>
           Voir Ordre d'arrêt de ce projet
        </Link>
        </div>
      </div>
    </div>
  );
}

export default ListInfosProject;
