import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './Photos.css';

function Photos() {
    const { intituleduprojet, numetatavancement } = useParams();
    const [photoavancement, setPhotoAvancement] = useState([]);
    const [newimage, setNewimage] = useState(null);
    const [newcommentaire, setNewcommentaire] = useState(null);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchPhotos();
    }, [intituleduprojet, numetatavancement]);

    const fetchPhotos = () => {
        axios.get(`http://localhost:3001/photos/${intituleduprojet}/${numetatavancement}`)
            .then(result => {
                const photosWithFixedURLs = result.data.map(photo => ({
                    ...photo,
                    url: photo.url.replace(/\\/g, '/')
                }));
                setPhotoAvancement(photosWithFixedURLs);
            })
            .catch(err => console.log(err));
    }

    const handlePhoto = (e) => {
        setNewimage(e.target.files[0]);
    }

    const SubmitPhoto = async (intituleduprojet, numetatavancement) => {
        const formData = new FormData();
        formData.append('image', newimage);
        formData.append('commentaire', newcommentaire);
        
        try {
            const res = await axios.post(`http://localhost:3001/photos/${intituleduprojet}/${numetatavancement}`, formData);
            console.log(res);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const deletePhoto = async (index) => {
        

        
            await axios.delete(`http://localhost:3001/photos/${intituleduprojet}/${numetatavancement}/${index}`)
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err))
        
    }
    

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '90px', textAlign: 'center' }}>
                <h4 style={{ color: 'blue' }}>Photos d'avancement du projet {intituleduprojet} de la numération {numetatavancement}</h4>
            </div>
            <br></br>
            <div className='mb-2'>
                <Link to={`/photos/${intituleduprojet}/${numetatavancement}`} className='btn btn-light text-primary'
                onClick={(e) => SubmitPhoto(intituleduprojet, numetatavancement)}> Ajouter Photo </Link>
                <br></br>
                <br></br>
                <input type="file" className='form-control' accept="image/*" onChange={handlePhoto}/>
                <input type="text" className='form-control' placeholder="Commentaire" onChange={(e)=> setNewcommentaire(e.target.value)}/>
            </div>
            <div className="photo-gallery">
                {photoavancement.length > 0 ? (
                    photoavancement.map((photo, index) => (
                        <div key={index} className="photo-card">
                            <div className="photo-container">
                                <img src={`http://localhost:3001/${photo.url}`} className="photo-image" alt={`Photo ${index}`} />
                            </div>
                            <div className="photo-details">
                                <p className="photo-comment">
                                {photo.commentaire !== null &&
                                 photo.commentaire !== undefined
                                ? `${photo.commentaire}`
                                : 'hhh'}
                                </p>
                                <Link className="btn btn-link text-primary ms-6" to={`/photos/${intituleduprojet}/${numetatavancement}`} 
                               onClick={() => deletePhoto(index)}>
                                    <i className="bi bi-trash"></i>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No photos available</p>
                )}
            </div>
        </>
    );
}

export default Photos;
