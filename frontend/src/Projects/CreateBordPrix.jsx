import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
import SidebarV from "../components/SidebarV";

function CreateBordPrix() {
    const { intituleduprojet } = useParams();
    
    const [designation, setDesignation] = useState('')
    const [U, setU]                     = useState('')
    const [quantity, setQuantity]       = useState('')
    const [pu, setPu]                   = useState('')
    const [pt, setPt]                   = useState('')

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:3001/createbordprix/${intituleduprojet}`, { designation, U, quantity, pu, pt })
        .then(res => {
            navigate(`/bordprix/${intituleduprojet}`)
        }).catch(err => console.log(err))
    }

    return (
        <div><Navbar /> 
                
        
    <div className='d-flex vh-100  bg-secondary justify-content-center align-items-center'> 
    <div className='w-50 bg-white rounded p-3 shadow p-3 mb-5'>
        <div>
        <Link to={`/bordprix/${intituleduprojet}`}>
        <i className="bi bi-arrow-left-circle-fill text-primary fs-2 mx-5"></i>
        </Link>
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

export default CreateBordPrix