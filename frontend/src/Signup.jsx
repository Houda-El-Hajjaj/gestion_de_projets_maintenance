import { useState } from 'react'
import './Signup.css'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'

function Signup() {
    const [name, setName]= useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', {name, email, password})
        .then(res => {
            navigate('/userslist')
        }).catch(err => console.log(err))
    }

    return (
        <div className="d-flex flex-column vh-100 bg-secondary justify-content-center align-items-center">
    <h2>Ajouter un utilisateur </h2>
    <form onSubmit={handleSubmit}>

    <input type="text" name="name" placeholder="Name"
    autoComplete="off"
    onChange={(e)=> setName(e.target.value)}/>

    <input type="email" name="email" placeholder="Email" 
    autoComplete="off"
    onChange={(e)=> setEmail(e.target.value)}/>

    <input type="password" name="password" placeholder="Password"  
    autoComplete="off"
    onChange={(e)=> setPassword(e.target.value)}/>

    <input className='bg-primary' type="submit" value="Ajouter" />
    </form>
    </div>
    )
}

export default Signup