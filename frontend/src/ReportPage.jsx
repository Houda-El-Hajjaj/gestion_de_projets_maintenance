import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
 // Import the PDF report component you previously create

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';


function ReportPage() {
  const { intituleduprojet } = useParams();
  const [infoprojet, setInfoprojet] = useState({});

  const [etatavancement, setEtatavancement] = useState([]);
  const [responsableName, setResponsableName] = useState('');

  const [projectandavancement, setprojectandavancement] = useState([]);

  const sumMontantRealised = etatavancement.reduce(
    (total, item) => total + (parseFloat(item.montantrealised) || 0),
    0
);
const sumMontantTotal = etatavancement.reduce(
    (total, item) => total + parseFloat(item.montanttotal),
    0
);
const pourcentageAvancementProjet = (sumMontantRealised / sumMontantTotal) * 100;

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};


useEffect(() => {
    axios.get(`http://localhost:3001/etatavancement/${intituleduprojet}`)
    .then(result => setEtatavancement(result.data))
    .catch(err => console.log(err))
}, []) 

useEffect(() => {
    axios.get(`http://localhost:3001/latestprojects`)
    .then(result => setprojectandavancement(result.data.latestProjects))
    .catch(err => console.log(err))
}, []) 


useEffect(() => {
    axios
      .get(`http://localhost:3001/listinfosproject/${intituleduprojet}`)
      .then((result) => {
        setInfoprojet(result.data);
        // Extract the responsible user's ID from the project details
        const responsableUserId = result.data.createur;
        // Fetch the responsible user's details
        axios
          .get(`http://localhost:3001/getUserInfo/${responsableUserId}`)
          .then((userResult) => {
            // Set the responsible user's name
            setResponsableName(userResult.data.name);
          })
          .catch((userErr) => console.log(userErr));
      })
      .catch((err) => console.log(err));
  }, [intituleduprojet]);
  

 
  const [bordprix, setBordprix] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/bordprix/${intituleduprojet}`)
        .then(result => setBordprix(result.data))
        .catch(err => console.log(err))
    }, []) 

    const [ordrearret, setOrdrearret] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ordrearret/${intituleduprojet}`)
        .then(result => setOrdrearret(result.data))
        .catch(err => console.log(err))
    }, []) 
    useEffect(() => {
    
        // Send the pourcentageAvancementProjet to the server
        axios.post(`http://localhost:3001/updatepourcentageavancementprojet/${intituleduprojet}`, { pourcentageAvancementProjet })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }, [sumMontantRealised, sumMontantTotal]);



    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Rapport du projet : ${intituleduprojet}`, 10, 10); // Title
        
        // Calculate the width of the page
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Get the current date
        const downloadDate = new Date().toLocaleDateString();
        
        // Calculate the X-coordinate to position the date on the right
        const dateXCoordinate = pageWidth - doc.getStringUnitWidth(downloadDate) * 12 - 10; // Adjust the margin as needed
        
        doc.setFontSize(10);
        doc.text(`Date De Téléchargement: ${downloadDate}`, dateXCoordinate, 20); // Date of Download
        // Project Details Section
        doc.setFontSize(14);
        doc.text('Project Details', 10, 20);

        doc.setFontSize(10);
        doc.text(`Intituleduprojet: ${intituleduprojet}`, 10, 30);
        doc.text(`Descriptif: ${infoprojet.descriptif}`, 10, 40);
        doc.text(`Prestataire: ${infoprojet.prestataire}`, 10, 50);
        doc.text(`Date ODC/BP: ${formatDate(infoprojet.dateodcbp)}`, 10, 60);
        doc.text(`Date Finale Prévisionnelle: ${formatDate(infoprojet.datefinalprevis)}`, 10, 70);

        // Project creator
        doc.setFontSize(10);
        doc.text(`Responsable: ${responsableName}`, 10, 80);
        
        
        // Add "Bordereaux de Prix" Table
        doc.setFontSize(14);
        doc.text('Bordereaux de Prix :', 10, 90);
        doc.autoTable({
            startY: 95,
            head: [['Num', 'Designation', 'U', 'Quantity', 'P.U', 'P.T']],
            body: bordprix.map(onebordprix => [
                onebordprix.num,
                onebordprix.designation,
                onebordprix.U,
                onebordprix.quantity,
                onebordprix.pu,
                onebordprix.pt
            ])
        });
        
        // Add "Ordres d'Arrêt" Table
        doc.setFontSize(14);
        doc.text('Ordres d\'Arrêt :', 10, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Num', 'Date d\'arrêt', 'Cause', 'Date de Reprise', 'Commentaire']],
            body: ordrearret.map(oneordrearret => [
                oneordrearret.num,
                formatDate(oneordrearret.datearret),
                oneordrearret.cause,
                formatDate(oneordrearret.datereprise),
                oneordrearret.commentaire
            ])
        });
        
        // Add "Etat d'Avancement" Table
        doc.setFontSize(14);
        doc.text('Etat d\'Avancement :', 10, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Num', 'Designation', 'U', 'Quantité', 'Quantité Réalisée', '% Réalisation', 'Montant Total', 'Montant Réalisé', '% Réalisation Montant', 'Commentaire']],
            body: etatavancement.map(etat => [
                etat.num,
                
                etat.designation, 
                etat.U,
                etat.quantity,
                etat.quantityrealised,
                etat.pourcentagerealised,
                etat.montanttotal,
                etat.montantrealised,
                etat.pourcentagerealisedmontant,
                etat.commentaire
                
            ])
            
        });
        
        doc.setFontSize(14);
        doc.text('Etat Final du projet:', 10, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Total du montant total', 'Total du montant réalisé', `Pourcentage de l'avancement du projet`]],
            body: projectandavancement.filter(projectData => projectData.project.intituleduprojet === intituleduprojet)
            .map(projectData => [
              projectData.avancementProject.montantTotalSum,
              projectData.avancementProject.montantRealisedSum,
              projectData.avancementProject.pourcentageAvancementProjet
            ])
            
        });

        doc.save('project_details.pdf');
    };

  return (
    <div>
     
      <div className="d-flex flex-column ">
        <div className="col">
          <div className="bg-white p-2 rounded border ">
            <h2 className="mb-4 text-primary">
              Rapport du projet: {intituleduprojet}
            </h2>
            <div className="bg-white p-5 rounded  border">
              {/* Display Project Details */}
              <p className="mb-2 p-2">
                <strong className="text-primary">Descriptif :</strong>{" "}
                {infoprojet.descriptif}
              </p>
              <p className="mb-2 p-2">
                <strong className="text-primary">Prestataire :</strong>{" "}
                {infoprojet.prestataire}
              </p>
              <p className="mb-2 p-2">
                <strong className="text-primary">Date ODC/BP :</strong>{" "}
                {formatDate(infoprojet.dateodcbp)}
              </p>
              <p className="mb-2 p-2">
                <strong className="text-primary">
                  Date Finale Prévisionnelle:
                </strong>{" "}
                {formatDate(infoprojet.datefinalprevis)}
              </p>
              <Link to={`/projectslist`}>
                <button className="btn bg-primary text-white mx-2">
                 revenir à la liste des projets 
                </button>

              </Link>
              <button className="btn btn-success text-info" onClick={generatePDF}>Télécharger le rapport
              <FontAwesomeIcon icon={faDownload} /></button>
            </div>
          </div>
        </div>

        {/* Display Borderoux de prix */}
        <div className="col">
          <div className="bg-white p-2 rounded border">
            <h2 className="text-start text-primary">  Borderoux de prix </h2>
            <br />
            <div className="w-100 bg-white rounded p-3 border ">
              {/* Add Borderoux de prix table */}
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
                                                  
                                                      </td>
                                                  </tr>
                                              );
                                          })
                                      }
                                  </tbody>
                              </table>
              {/* Display the table here, similar to ProjectDetails */}
            </div>
          </div>
        </div>

        {/* Display Ordres d'arrets */}
        <div className="col">
          <div className="bg-white p-2 rounded border">
            <h2 className="text-start text-danger"> Ordres d'arrets / reprise</h2>
            <div className="w-100 bg-white rounded p-3 border">
              {/* Add Ordres d'arrets table */}
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
                
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    
              {/* Display the table here, similar to ProjectDetails */}
            </div>
          </div>
        </div>

        {/* Display Avancement du projet */}
        <div className="col">
          <div className="bg-white p-2 rounded border">
            <h2 className="text-start text-success">Etat d'Avancement </h2>
            <div className="w-100 bg-white rounded p-3  ">
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

        {/* Display PDF Report */}
       
      </div>
    </div>
  );
}

export default ReportPage;