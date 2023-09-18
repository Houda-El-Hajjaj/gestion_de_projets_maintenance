import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function ListProjects () {
  const [projectsWithAvancement, setProjectsWithAvancement] = useState([]);
  const [suc, setSuc] = useState('');
  const percentage = 66;

  const [sortingCriteria, setSortingCriteria] = useState('avancement'); // Default sorting criteria

  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');



// Handle the change event of the start date input
const handleStartDateChange = (e) => {
  setStartDate(e.target.value);
};

// Handle the change event of the end date input
const handleEndDateChange = (e) => {
  setEndDate(e.target.value);
};


    const handleSortingCriteriaChange = (e) => {
      setSortingCriteria(e.target.value);
    };


    const navigate = useNavigate();
    //const navig = useNavigate();
    axios.defaults.withCredentials = true;

    const [role, setRole] = useState('');
    
    useEffect(() => {
        axios.get(`http://localhost:3001/getuserrole`)
        .then(result => {
          setRole(result.data.role)
        });
    }, []) 

    useEffect(() => {
      axios.get('http://localhost:3001/listprojects')
        .then(res => {
          if (res.data.success) {
            // Projects with AvancementProjects were fetched successfully
            setSuc("Succeeded OK");
            setProjectsWithAvancement(res.data.projectsWithAvancement); // Set the projects with AvancementProjects in the state
          } else {
            navigate('/dashboard');
          }
        })
        .catch(err => console.log(err));
    }, []);
    

  const handleDelete = (intituleduprojet) => {
    axios.delete(`http://localhost:3001/deletelistprojects/${intituleduprojet}`)
    .then(res => {
        console.log(res);
        window.location.reload();
    })
    .catch(err => console.log(err))
}

return (
  <div>
    <Navbar />
      
    <div style={{ paddingTop: '60px' }}>
        <div className="m-5">
              {role === 'visitor' ? (
                <Link  to={`/informations`}className="btn btn-light"> Ajouter un projet </Link> 
                ) : (
                <Link  to={`/createprojectadmin`}className="btn btn-light"> Ajouter un projet </Link> 
                )} 
                <br></br>
                <br></br>
                <div>
                  {/* Add a select input for sorting criteria */}
                  <select value={sortingCriteria} onChange={handleSortingCriteriaChange}>
                    <option value="avancement">Sort by Avancement</option>
                    <option value="intituleduprojet">Sort by Project Name</option>
                  </select>
                  <div>
                    <label>Filter Date finalisation From :</label>
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                    <label style={{ marginLeft: '20px' }}>To :</label>
                    <input
                      type="date"
                      placeholder="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" style={{marginTop : '10px'}}>
                    {projectsWithAvancement.filter((project) => {
                      // Apply the filter based on the date range
                      if (startDate === '' || endDate === '') {
                        return true; // Return true for all projects if no date range is selected
                      }
                      const projectDate = new Date(project.project.datefinalprevis);
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      return projectDate >= start && projectDate <= end;
                    }).sort((a, b) => {
                      // Define sorting functions based on criteria
                      const sortByAvancement = () => {
                        const avancementA = parseFloat(a.avancementProject.replace('%', ''));
                        const avancementB = parseFloat(b.avancementProject.replace('%', ''));
                        return avancementB - avancementA;
                      };
                     const sortByName = () => {
                      const nameA = a.project.intituleduprojet.toLowerCase();
                      const nameB = b.project.intituleduprojet.toLowerCase();
                      return nameA.localeCompare(nameB);
                      };

                      switch (sortingCriteria) {
                      case 'avancement':
                      return sortByAvancement();
                      case 'intituleduprojet':
                      return sortByName();
                      // Add cases for other sorting criteria
                      default:
                        return 0;
                      }
                    }).map(({ project, avancementProject }) => (
                    <div key={project._id} className="col mb-4">
                      <div className="card h-100 shadow p-2 mb-2">
                        <div className="card-body">
                          <h5 className="card-title text-primary d-flex align-items-center">
                            {project.intituleduprojet}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                            <div style={{ width: 80, height: 80, marginLeft : '100px'}}>
                              <CircularProgressbar value={`${avancementProject.replace('%', '')}`} text={`${avancementProject}`} />
                            </div>
                            </div>
                            <Link className="btn btn-link text-danger ms-6" to={`/listprojects`} onClick={(e) => handleDelete(project.intituleduprojet)}>
                              <i className="bi bi-trash"></i>
                            </Link>
                          </h5>
                          <p className="card-text">{project.descriptif}</p>
                          <div className="d-flex align-items-center">
                            <Link className='btn btn-primary text-white m-2' to={`/listinfosproject/${project.intituleduprojet}`}>
                              details
                            </Link>
                            <br></br>
                            <br></br>
                            <Link className='btn btn-primary text-white' to={`/etatavancement/${project.intituleduprojet}`}>
                              Etat d'avancement
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  </div>
        </div>
     </div>
    
  </div>
);



}

export default ListProjects;

