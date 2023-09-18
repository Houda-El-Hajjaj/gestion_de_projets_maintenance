import React from 'react'
import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 
    const navigate = useNavigate()

    axios.defaults.withCredentials = true
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/', { email, password })
        .then(res => {
            if(res.data.Status === "Success" ){
                localStorage.setItem('userId', res.data.userId); // Store the user's ID
                if(res.data.role === "admin"){
                    navigate('/dashboard')
                }else {
                    navigate('/home')
                }
            }
        }).catch(err => console.log(err))
    }

    return (
    <div className="d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center">
    <h2>Log In </h2>
    <form onSubmit={handleSubmit}>

    <input type="email" name="email" placeholder="Email" 
    autoComplete="off"
    onChange={(e)=> setEmail(e.target.value)}/>

    <input type="password" name="password" placeholder="Password"  
    autoComplete="off"
    onChange={(e)=> setPassword(e.target.value)}/>

    <input className='bg-primary' type="submit" value="Login" />
    </form>
   
    </div>
    )
        
    
}

export default Login