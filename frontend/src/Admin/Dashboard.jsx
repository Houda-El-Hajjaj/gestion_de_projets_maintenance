import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import SidebarV from "../components/SidebarV"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Dashboard() {
    const [suc, setSuc] = useState('')
    const [userCount, setUserCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [avancement100PercentCount, setAvancement100PercentCount] = useState(0);
    const [notavancement100PercentCount, setNotAvancement100PercentCount] = useState(0);


    const [latestProjects, setLatestProjects] = useState([]);
    const [UserProjectsAvancement, setUserProjectsAvancement] = useState([]);
    const navigate = useNavigate()
    
    axios.defaults.withCredentials = true

    const percentage = 66;

    const currentDate = new Date()
    
    useEffect(() => {
        axios.get('http://localhost:3001/dashboard')
        .then(res => {
            if (res.data === "Success") {
                setSuc("Succeeded OK")
            } else {
                navigate('/home')
            }
        }).catch(err => console.log(err))

        // Fetch the number of users
        axios.get('http://localhost:3001/userslist')
            .then(res => {
                if (res.data.success) {
                    setUserCount(res.data.numberOfUsers);
                }
            })
            .catch(err => console.log(err));

        // Fetch the number of projects
        axios.get('http://localhost:3001/projectslist')
            .then(res => {
                if (res.data.success) {
                    setProjectCount(res.data.numberOfProjects);
                }
            })
            .catch(err => console.log(err));
        axios.get('http://localhost:3001/countavancement')
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.success)
                    setAvancement100PercentCount(res.data.count100Percent);
                    setNotAvancement100PercentCount(res.data.countNot100Percent);
                }
            })
            .catch(err => console.log(err));
        
    }, [])

    // Fetch the latest projects when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3001/latestprojects") // Use the new API endpoint
      .then((res) => {
        setLatestProjects(res.data.latestProjects);
      })
      .catch((err) => {
        console.error("Error fetching latest projects:", err);
      });
  }, []);

 

  // Fetch the top users when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3001/userprojectsavancement")
      .then((res) => {
        setUserProjectsAvancement(res.data.userData);
      })
      .catch((err) => {
        console.error("Error fetching top users:", err);
      });
  }, []);


    return (
      
        <div className="container-fluid">
            <SidebarV />
            <br />
            <br />
            <br />
            <br />
            <div className="row mb-4 bg-white">
                <div className="col-md-3">
                    <div className="p-3 border rounded bg-white text-center text-primary ">
                        <h4>Nombre d'utilisateurs</h4>
                        <p>{userCount}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 border rounded bg-white text-center text-success">
                        <h4>Projets en cours ...</h4>
                        <p>{projectCount}</p>
                    </div>
                </div>
                {/* Add more statistics as needed */}
                <div className="col-md-3">
                    <div className="p-3 border rounded bg-white text-center text-light">
                        <h4>Projets cloturés</h4>
                        <p>{avancement100PercentCount}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 border rounded bg-white text-center text-danger">
                        <h4>Projets retardés</h4>
                        <p>{notavancement100PercentCount}</p>
                    </div>
                </div>
            </div>
            <main className=" row col-md-9 ms-sm-auto col-lg-10 px-md-4 w-80 ">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Dashboard</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                         <Link  to={`/listprojects`} className=' btn btn-primary me-2'> Voir mes projet </Link> 
                         <Link  to={`/createprojectadmin`}className="btn btn-light"> Ajouter un projet </Link> 
                           
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="p-3 border shadow">
                                <div className="">
                                <h2 className="text-primary text-start">Utilisateurs</h2>
                                 <div className="card">
                                   <ul className="list-group list-group-flush">
                                     {UserProjectsAvancement.map(({user, projectCount, count100PercentProjects, countNot100PercentProjects}) => (
                                       <li key={user._id} className="list-group-item">
                                         <h5>{user.name}</h5>
                                         <p  className="small text-muted">Number of Projects: {projectCount}</p>
                                         <p className="small text-muted">Projects Cloturés:{count100PercentProjects}</p>
                                         <p className="small text-muted">Number en retard: {countNot100PercentProjects}</p>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 border shadow">
                            <h2 className="text-primary text-start"> Tout Les Projects </h2>
                               <table className="table">
                                 <thead>
                                   <tr>
                                     <th>Intitulé du projet</th>
                                     <th>État d'avancement</th>
                                     <th>Montant Réalisé</th>
                                     <th>Jours Avant Finalisation</th>
                                     <th>Ordres d'arrêt/Ordres de reprises</th>
                                     <th>Points Blocants</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                 {latestProjects.map(({ project, avancementProject }) => (
                                    <tr key={project._id}>
                                      <td style={{ marginTop: '30px' }}>
                                      <Link to={`/projectdetails/${project.intituleduprojet}`}>
                                       {project.intituleduprojet}
                                      </Link>
                                      </td>
                                      <td>
                                        <div style={{}}>
                                          <div style={{ width: 55, height: 55, marginLeft: '30px' }}>
                                            <a href={`/etatavancement/${project.intituleduprojet}`}>
                                            <CircularProgressbar
                                              value={`${avancementProject.pourcentageAvancementProjet.replace('%', '')}`}
                                              text={`${avancementProject.pourcentageAvancementProjet}`}
                                            />
                                            </a>
                                            
                                          </div>
                                        </div>
                                      </td>
                                      <td style={{ marginTop: '30px' }}>{avancementProject.montantRealisedSum}</td>
                                      {avancementProject.timeLeftInDays === 'En Retard!' ? (
                                        <td className="text-danger text-start" style={{ marginTop: '30px' }}>{avancementProject.timeLeftInDays}</td>
                                      ) : (
                                        <td style={{ marginTop: '30px' }}>{avancementProject.timeLeftInDays}</td>
                                      )}
                                      <td style={{ marginTop: '30px' }}>{avancementProject.ordreArretCount}</td>
                                      <td style={{ marginTop: '30px' }}>
                                      <Link to={`/pointsbloquants/${project.intituleduprojet}`}>
                                      {avancementProject.pointsBlocantsCount}
                                      </Link>
                                      </td>
                                    </tr>
                                  ))}

                                 </tbody>
                               </table>
                            </div>
                        </div>
                    </div>
                </main>
        </div>
    );
}

export default Dashboard;
