import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "./components/Navbar";
import SidebarV from "./components/SidebarV";

function ProjectAddition() {
    const [suc, setSuc] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/projectaddition')
            .then(res => {
                if (res.data === "Success"){
                    setSuc("Succeeded OK");
                } else {
                    navigate('/dashboard');
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div >
            <Navbar/>
            <SidebarV />
            
        </div>
    );
}

export default ProjectAddition;
