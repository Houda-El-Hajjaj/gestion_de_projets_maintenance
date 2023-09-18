import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

function ListUpdateBordPrix() {
    const { intituleduprojet, numbordprix } = useParams();
    
    const [designation, setDesignation] = useState('');
    const [U, setU] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pu, setPu] = useState('');
    const [pt, setPt] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`http://localhost:3001/updatebordprix/${intituleduprojet}/${numbordprix}`)
        .then(result => {
            setDesignation(result.data.designation);
            setU(result.data.U);
            setQuantity(result.data.quantity);
            setPu(result.data.pu);
            setPt(result.data.pt);
        });
    }, []) 
    const [role, setRole] = useState('');
    
        useEffect(() => {
            axios.get(`http://localhost:3001/getuserrole`)
            .then(result => {
              setRole(result.data.role)
            });
        }, []) 
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/updatebordprix/${intituleduprojet}/${numbordprix}`, { designation, U, quantity, pu, pt })
        .then(res => {
            const userRole = res.data.userRole; // Extract user's role from the response
          
          if (userRole === 'visitor') {
              navigate(`/listbordprixproject/${intituleduprojet}`);
          } else if (userRole === 'admin') {
              navigate(`/projectdetails/${intituleduprojet}`);
          }
        }).catch(err => console.log(err));
    }

  

    return (
      
        <div >

            <Navbar />
            <br />
            <br />
    <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
    <div>
                {role === 'admin' ? (
                            <Link to={`/projectdetails/${intituleduprojet}`}>
                                <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
                            </Link>
                        ) : (
                            <Link to={`/listbordprixproject/${intituleduprojet}`}>
                                <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-2"></i>
                            </Link>
                        )}
                </div>
            
    <form onSubmit={handleSubmit}>
            <h2 className="text-success">Modifier le Borderoux de prix du projet : {intituleduprojet}</h2>
            
            <br />
                <div className='mb-2'>
                <label htmlFor="" >designation :</label>
                <input type="text" placeholder="" className='form-control'
                 onChange={(e)=> setDesignation(e.target.value)}
                value={designation}
            />
                </div>

            <div className='mb-2'>
                <label htmlFor="" >U :</label>
                <input type="text" placeholder="" className='form-control'
            onChange={(e)=> setU(e.target.value)}
            value={U}
            />
             </div>

             <div className='mb-2'>
                <label htmlFor="" >Quantité :</label>
                <input type="number" placeholder="" className='form-control'
            onChange={(e)=> setQuantity(e.target.value)}
            value={quantity}
            />
             </div>

            
           
            <div className='mb-2'>
                <label htmlFor="" >Prix unitaire :</label>
                <input type="number" placeholder="" className='form-control'
            onChange={(e)=> setPu(e.target.value)}
            value={pu}
            />
            </div>
            

           <div className='mb-2'>
                <label htmlFor="" >Prix par quantité :</label>
                <input type="number" placeholder="" className='form-control'
            onChange={(e)=> setPt(e.target.value)}
            value={pt}
            />
             </div>
            <br />

            <input className=" btn btn-lg bg-info text-success" type="submit" value="Update" />
         </form>
            </div>
            </div>
            </div>
        
        
    )
}

export default ListUpdateBordPrix;
