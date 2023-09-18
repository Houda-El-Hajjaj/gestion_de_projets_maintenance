import React, { useState , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link} from "react-router-dom";

import Navbar from "../components/Navbar";

function ListCreateBordPrix() {
    const { intituleduprojet } = useParams();
    
    const [designation, setDesignation] = useState('');
    const [U, setU] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pu, setPu] = useState('');
    const [pt, setPt] = useState('');

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [role, setRole] = useState('');
    
        useEffect(() => {
            axios.get(`http://localhost:3001/getuserrole`)
            .then(result => {
              setRole(result.data.role)
            });
        }, []) 
    



    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post(`http://localhost:3001/createbordprix/${intituleduprojet}`, { designation, U, quantity, pu, pt })
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
        <div><Navbar /> 
                
        
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
                <h2 className="text-primary">Ajouter un Borderoux de prix du projet :{intituleduprojet}</h2>
                <br />
                <div className='mb-2'>
                    <label htmlFor="" >designation :</label>
                    <input type="text" placeholder="" className='form-control'
                    onChange={(e)=> setDesignation(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=""> U :</label>
                    <input type="text" placeholder="" className='form-control' 
                    onChange={(e)=> setU(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Quantité :</label>
                    <input type="text" placeholder="" className='form-control'
                  onChange={(e)=> setQuantity(e.target.value)} />
                </div>
                <div className="className='mb-2'">
              <label htmlFor=''>P.U (DH) :</label>
              <input
                type='number'
                placeholder=''
                className='form-control'
                onChange={(e)=> setPu(e.target.value)}
              />
            </div>
            <div className="className='mb-2'">
              <label htmlFor=''>P.T (DH) :</label>
              <input
                type='number'
                placeholder=''
                className='form-control'
                onChange={(e)=> setPt(e.target.value)}
              />
            
            </div>
          <br />
         
          <input className=" btn bg-light text-primary font-weight-bold" type="submit" value="Ajouter" />
            
       </form>
        </div>
    </div>
    </div>   
    
    )
}

export default ListCreateBordPrix;
