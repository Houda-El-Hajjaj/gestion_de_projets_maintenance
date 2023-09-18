import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function UpdateEtatAvancement () {
    const { intituleduprojet, numetatavancement } = useParams();

    const [quantityrealised, setQuantityrealised] = useState('');
    const [commentaire, setCommentaire] = useState('');

    const [image, setImage] = useState(null)

    const [designation, setDesignation] = useState('');
    const [U, setU] = useState('');
    const [quantite, setQuantite] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/updateetatavancement/${intituleduprojet}/${numetatavancement}`)
            .then(result => {
                console.log(result);
                setDesignation(result.data.designation);
                setU(result.data.U);
                setQuantite(result.data.quantity);
                setQuantityrealised(result.data.quantityrealised);
                setCommentaire(result.data.commentaire)
            });

    }, [intituleduprojet, numetatavancement]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('quantityrealised', quantityrealised);
        formData.append('commentaire', commentaire);
    
        try {
            await axios.put(`http://localhost:3001/updateetatavancement/${intituleduprojet}/${numetatavancement}`, formData);
    
            navigate(`/etatavancement/${intituleduprojet}`);
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <div>
            <Navbar />
            <br />
            <br />
            <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
                <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
                <div>
            <Link to={`/etatavancement/${intituleduprojet}`}>
            <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
            </Link>
            </div>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-success">Modifier l'état d'avancement du projet {intituleduprojet} </h2>
                        <br />
                        <div className='mb-2'>
                            <label htmlFor="" >Designation : {designation}</label>
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="" >U : {U}</label>
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="" >Quantité : {quantite}</label>
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="" >Quantité Réalisée :</label>
                            <input type="number" placeholder="" className='form-control'
                                onChange={(e)=> setQuantityrealised(e.target.value)}
                                value={quantityrealised}
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="" > Commentaire :</label>
                            <textarea type="text" placeholder="" className='form-control'
                                onChange={(e)=> setCommentaire(e.target.value)}
                                value={commentaire}
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="">Image :</label>
                            <input type="file" className='form-control' accept="image/*" onChange={handleImageChange} />
                        </div>
                        <br />
                        <input className="btn btn-lg bg-info text-success" type="submit" value="Update" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateEtatAvancement;
