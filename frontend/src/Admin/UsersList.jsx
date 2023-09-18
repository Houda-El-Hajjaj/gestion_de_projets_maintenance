import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SidebarV from '../components/SidebarV';
import axios from 'axios';
import { Link ,Navigate } from 'react-router-dom';

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/userslist', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                const { success, users } = response.data;
                if (success) {
                    setUsers(users);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    
    const handleDeleteUser = (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            // Send a request to delete the user
            axios.delete(`http://localhost:3001/deleteuser/${userId}`, { withCredentials: true })
                .then(response => {
                    const { success } = response.data;
                    if (success) {
                        // Remove the deleted user from the users state
                        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    return (
        <div>
        
        <SidebarV/>
    <div className='d-flex flex-column vh-100 bg-secondary'>
    <br />
    <br />
    <br />
    <div className=' bg-white rounded p-3 border  w-100 '>
        <div className='d-flex justify-content-between'>
        <Link to={`/register`}className='btn btn-primary'> Ajouter + </Link>
        
        </div>
        
        <table className='table'>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Email</th>
                                <th scope="col">Nombre de projets</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.projectCount}</td>
                                    <td>
                                    <Link
                                       to={`/userdetails/${user._id}`} // Pass the user's ID as a parameter in the URL
                                       className='btn btn-info mx-2 text-success'
                                      >
                                        Voir Plus
                                      </Link>
                                      <Link className="btn btn-link text-danger ms-6" onClick={() => handleDeleteUser(user._id)}>
                                             <i className="bi bi-trash"></i>
                                     </Link>                            </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsersList;
