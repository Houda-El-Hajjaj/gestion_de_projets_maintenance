import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import Navbar from "./components/Navbar"

function Home() {
    const [suc, setSuc] = useState('');
    const [isButton1Clicked, setButton1Clicked] = useState(false);
    const [isButton2Clicked, setButton2Clicked] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/home')
            .then(res => {
                if (res.data === "Success") {
                    setSuc("Succeeded OK");
                } else {
                    navigate('/dashboard');
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleButtonClick = (buttonNumber) => {
        if (buttonNumber === 1) {
            setButton1Clicked(true);
            setButton2Clicked(false);
            navigate('/listprojects');

        } else if (buttonNumber === 2) {
            setButton1Clicked(false);
            setButton2Clicked(true);
            navigate('/informations');
        }
    };

    return (
       
        
        <div>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="justify-content-between ">
                    <button className=" btn bg-secondary text-primary font-weight-bold mx-5"
                        style={isButton1Clicked ? clickedButtonStyle : buttonStyle}
                        onClick={() => handleButtonClick(1)}
                    >
                        Lister mes projets
                    </button>
                    <button className="btn bg-secondary text-primary font-weight-bold mx-5" 
                        style={isButton2Clicked ? clickedButtonStyle : buttonStyle }
                        onClick={() => handleButtonClick(2)}
                    >
                        Ajouter un projet
                    </button>
                </div>
            </div>
        </div>
    );
}

const buttonStyle = {
    fontSize: '24px',
    padding: '20px',
    margin: '10px',
    width: '300px',
    height: '200px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: 'purple',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
   
};


const clickedButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'black',
    color: 'white',
};
export default Home;