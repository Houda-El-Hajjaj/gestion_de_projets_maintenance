import Signup from './Signup'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home'
import ProjectAddition from './ProjectAddition'
import Informations from './Projects/Informations'
import BordPrix from './Projects/BordPrix'
import CreateBordPrix from './Projects/CreateBordPrix'
import UpdateBordPrix from './Projects/UpdateBordPrix'
import OrdreArret from './Projects/OrdreArret'
import CreateOrdreArret from './Projects/CreateOrdreArret'
import UpdateOrdreArret from './Projects/UpdateOrdreArret'

import ListProjects from './ListProjects/ListProjects'
import ListInfosProject from './ListProjects/ListInfosProject'
import ListBordPrixProject from './ListProjects/ListBordPrixProject'
import ListCreateBordPrix from './ListProjects/ListCreateBordPrix'
import ListUpdateBordPrix from './ListProjects/ListUpdateBordPrix'
import ListOrdreArretProject from './ListProjects/ListOrdreArretProject'
import ListCreateOrdreArret from './ListProjects/ListCreateOrdreArret'
import ListUpdateOrdreArret from './ListProjects/ListUpdateOrdreArret'
import './custom.scss'
import './custom.css'
import Profile from './Profile'
import EtatAvancement from './AvancementProjects/EtatAvancement'
import UpdateEtatAvancement from './AvancementProjects/UpdateEtatAvancement'
import PointsBlocants from './AvancementProjects/PointsBlocants/PointsBlocants'
import CreatePointBlocant from './AvancementProjects/PointsBlocants/CreatePointBlocant'
import UpdatePointBlocant from './AvancementProjects/PointsBlocants/UpdatePointBlocant'
import Photos from './AvancementProjects/Photos/Photos'
import ProjectsList from './Admin/ProjectsList'
import UsersList from './Admin/UsersList'
import UserDetails from './Admin/UserDetails'
import ProjectDetails from './Admin/ProjectDetails'
import Dashboard from './Admin/Dashboard'
import CreateProject from './Admin/CreateProject'
import ReportPage from './ReportPage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/reportpage/:intituleduprojet" element={ <ReportPage /> }></Route>
        <Route path="/createprojectadmin" element={ <CreateProject /> }></Route>
        <Route path="/projectslist" element={ <ProjectsList /> }></Route>
        <Route path="/userslist" element={ <UsersList /> }></Route>
        <Route path="/userdetails/:userId" element={<UserDetails />} />

        <Route path="/projectdetails/:intituleduprojet" element={<ProjectDetails />} />
        <Route path="/dashboard" element={ <Dashboard /> }></Route>

        
        <Route path="/photos/:intituleduprojet/:numetatavancement" element={ <Photos /> }></Route>

        <Route path="/updatepointsbloquants/:intituleduprojet/:numpointblocant" element={ <UpdatePointBlocant /> }></Route>
        <Route path="/createpointsbloquants/:intituleduprojet" element={ <CreatePointBlocant /> }></Route>
        <Route path="/pointsbloquants/:intituleduprojet" element={ <PointsBlocants /> }></Route>

        <Route path="/etatavancement/:intituleduprojet" element={ <EtatAvancement /> }></Route>
        <Route path="/updateetatavancement/:intituleduprojet/:numetatavancement" element={ <UpdateEtatAvancement /> }></Route>

        <Route path="/listprojects" element={ <ListProjects /> }></Route>
        <Route path="/listupdateordrearret/:intituleduprojet/:numordrearret" element={ <ListUpdateOrdreArret /> }></Route>
        <Route path="/listcreateordrearret/:intituleduprojet" element={ <ListCreateOrdreArret /> }></Route>
        <Route path="/listordrearretproject/:intituleduprojet" element={ <ListOrdreArretProject /> }></Route>
        <Route path="/listupdatebordprix/:intituleduprojet/:numbordprix" element={ <ListUpdateBordPrix /> }></Route>
        <Route path="/listcreatebordprix/:intituleduprojet" element={ <ListCreateBordPrix /> }></Route>
        <Route path="/listbordprixproject/:intituleduprojet" element={ <ListBordPrixProject /> }></Route>
        <Route path="/listinfosproject/:intituleduprojet" element={ <ListInfosProject /> }></Route>
        
        <Route path="/updateordrearret/:intituleduprojet/:numordrearret" element={ <UpdateOrdreArret /> }></Route>
        <Route path="/createordrearret/:intituleduprojet" element={ <CreateOrdreArret /> }></Route>
        <Route path="/ordrearret/:intituleduprojet" element={ <OrdreArret /> }></Route>
        <Route path="/createbordprix/:intituleduprojet" element={<CreateBordPrix />} />
        <Route path="/updatebordprix/:intituleduprojet/:numbordprix" element={ <UpdateBordPrix /> }></Route>
        <Route path="/informations" element={ <Informations /> }></Route>
        
        <Route path="/bordprix/:intituleduprojet" element={ <BordPrix /> }></Route>
        <Route path="/projectaddition" element={ <ProjectAddition /> }></Route>   
        <Route path="/home" element={ <Home /> }></Route>
        <Route path="/register" element={ <Signup /> }></Route>
        <Route path="/" element={ <Login /> }></Route>
        <Route path="/dashboard" element={ <Dashboard /> }></Route>
        <Route path="/profile" element={ <Profile /> }></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
