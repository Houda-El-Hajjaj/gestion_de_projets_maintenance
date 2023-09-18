import React, { useEffect, useState } from 'react';

import SidebarV from '../components/SidebarV';
import { Link } from "react-router-dom";

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';



function ProjectsList() {
    const [projects, setProjects] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [originalUser, setOriginalUser] = useState('');
    const [intituleduprojettoedit, setintituleduprojettoedit] = useState('');



    const handleEdit = (intituleduprojet) => {
        setintituleduprojettoedit(intituleduprojet)
        // Store the original user before entering edit mode
        setOriginalUser(selectedUser);
        // Set edit mode to true
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        // Cancel edit mode and revert to the original user
        setEditMode(false);
        setSelectedUser(originalUser);
    };

    const handleSaveEdit = (projectId) => {
        axios.put(`http://localhost:3001/changeresponsableprojet/${projectId}`, { responsibleUserId: selectedUser }, { withCredentials: true })
            .then(response => {
                const { success, updatedProject } = response.data;
                if (success) {
                    // Update the responsible user in the projects state for the specific project
                    setProjects(prevProjects => prevProjects.map(project => {
                        if (project._id === updatedProject._id) {
                            return { ...project, createur: { ...project.createur, _id: selectedUser } };
                        }
                        return project;
                    }));
                    // Exit edit mode after saving
                    setEditMode(false);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios.get('http://localhost:3001/userslist', { withCredentials: true })
            .then(response => {
                const { success, users } = response.data;
                if (success) {
                    setUsers(users);
                    const initialSelectedUser = projects.length > 0 ? projects[0].createur._id : '';
                    setSelectedUser(initialSelectedUser);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [projects]);

    useEffect(() => {
        axios.get('http://localhost:3001/projectslist', { withCredentials: true })
            .then(response => {
                const { success, projects } = response.data;
                if (success) {
                    setProjects(projects);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:3001/deleteproject/${projectId}`, { withCredentials: true })
            .then(response => {
                const { success } = response.data;
                if (success) {
                    // Remove the deleted project from the projects state
                    setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleReportButtonClick = () => {
        // Redirect to the Pdf.html page
        window.location.href = 'Pdf.html';
      };

    return (
        <div>
            <SidebarV />
            <div className='d-flex flex-column vh-100 bg-secondary '>
                <br />
                <br />
                <h4> List of Projects </h4>
                <div className='w-50 bg-white rounded p-3 border w-100 '>
                    <div className='d-flex justify-content-between'>
                        <Link to={`/createprojectadmin`} className='btn btn-primary'> Ajouter + </Link>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Intitulé de projet</th>
                                <th scope="col">Description</th>
                                <th scope="col">Responsable</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{project.intituleduprojet}</td>
                                    <td>{project.descriptif}</td>
                                    <td>
                                        {editMode && (intituleduprojettoedit === project.intituleduprojet) ? (
                                            <select
                                                name="users"
                                                id="users"
                                                
                                                onChange={(e) => setSelectedUser(e.target.value)}
                                            >
                                                <option value="">Select User</option>
                                                {users.map((user, index) => (
                                                    <option key={user._id} value={user._id}>{user.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="d-flex align-items-center">
                                                <span>{project.createur.name}</span>
                                                
                                                    <button className="ml-2" style={{ background: 'none', border: 'none' }} onClick={() => handleEdit(project.intituleduprojet)}>
                                                        <i className="bi bi-pencil text-primary fs-7"></i>
                                                    </button>
                                                
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            {!editMode && (
                                                <>
                                                    <Link
                                                        to={`/projectdetails/${project.intituleduprojet}`}
                                                        className="btn btn-info mx-2 text-success"
                                                    >
                                                        Details
                                                    </Link>
                                                    <Link
                                                        to={`/etatavancement/${project.intituleduprojet}`}
                                                        className="btn btn-light mx-2 text-primary"
                                                    >
                                                        Avancement
                                                    </Link>
                                                    <button
                                                       className="btn btn-warning mx-2 text-info"
                                                     >
                                                       <Link to={`/reportpage/${project.intituleduprojet}`}>
                                                         <FontAwesomeIcon icon={faDownload} />  Rapport
                                                       </Link>
                                                     </button>
                                                  
                                                </>
                                            )}
                                            <Link className="btn btn-link text-danger ms-6" onClick={() => handleDeleteProject(project._id)}>
                                                <i className="bi bi-trash"></i>
                                            </Link>
                                            {editMode && (intituleduprojettoedit === project.intituleduprojet) && (
                                                <>
                                                    <button className="btn btn-success ms-2 text-white" onClick={() => handleSaveEdit(project._id)}>
                                                        Save
                                                    </button>
                                                    <button className="btn btn-danger ms-2 text-white " onClick={handleCancelEdit}>
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProjectsList;