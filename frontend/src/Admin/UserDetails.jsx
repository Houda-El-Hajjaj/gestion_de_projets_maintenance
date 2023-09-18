import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SidebarV from '../components/SidebarV';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function UserDetails() {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getUserInfoAdmin/${userId}`)
      .then(response => {
        setUserDetails(response.data.userDetails);
      })
      .catch(error => {
        console.log(error);
      });
  }, [userId]);

  if (!userDetails) { 
    return <div>Loading...</div>;
  }

  return (
    <div>
       <SidebarV/>
       
       <div className='d-flex flex-column  '>
        <div className="col">
          <div className="bg-white p-2 rounded border">
            <h2>User Details</h2>
            <br />
            <div className="bg-white p-2 rounded border" style={{ width: '100%' }}>
              <p className="mb-2 p-2">
                <strong className="text-primary"> Name: </strong> {userDetails.name}
              </p>
              <p className="mb-2 p-2">
                <strong className="text-primary">Email:</strong> {userDetails.email}
              </p>
              <p className="mb-2 p-2">
                <strong className="text-primary">Number of Projects: </strong>
                {userDetails.projectCount}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="bg-white p-2 rounded border">
            <h3>Projets de {userDetails.name}</h3>

            <div className="m-5">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {userDetails.projects.map(project => (
                  <div key={project._id} className="col">
                    <div className="card h-100 shadow p-2 mb-2">
                      <div className="card-body">
                        <h5 className="card-title text-primary d-flex align-items-center">
                          {project.intituleduprojet}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ width: 80, height: 80, marginLeft: '100px' }}>
                              <CircularProgressbar value={`${project.pourcentageAvancementProjet.replace('%', '')}`} text={`${project.pourcentageAvancementProjet}`} />
                            </div>
                          </div>
                        </h5>
                        <p className="card-text">{project.descriptif}</p>
                        <div className="d-flex align-items-center ">
                          <Link className='btn btn-primary text-white m-2' to={`/projectdetails/${project.intituleduprojet}`}>
                            Details
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
      </div>
    </div>
  );
}

export default UserDetails;
