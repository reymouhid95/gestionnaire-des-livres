import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarUser from './Components/User/SidebarUser';
import SidebarAdmin from './Components/Admin/SidebarAdmin';
import Home from './Pages/Statistics';
import Template from './layouts/Template';
import NavUser from './Components/User/NavUser';
import NavAdmin from './Components/Admin/NavAdmin';
import DashboardUser from './Pages/Pages-User/DashboardUser';
import Books from './Pages/Pages-User/Books';
import DashboardAdmin from './Pages/Pages-Admin/DashboardAdmin';
import Archive from './Pages/Pages-Admin/Archive';
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";



import 'rsuite/dist/rsuite-no-reset.min.css';
import { useState } from 'react';
// import About from './Components/About';

// Import des autres bibliothèques et composants

function App() {
  const [toggle, setToggle] = useState(true);
  const url = "/admin/dashboardAdmin";
  // const url2 = "/user/dashboardUser";
  
  const Toggle = () => {
    setToggle(!toggle);
  }

  return (
    <div>
      <Template
        sidebar={
          window.location.pathname === url ? <SidebarAdmin /> : <SidebarUser />
        }
        navbar={
          window.location.pathname === url ? (
            <NavAdmin Toggle={Toggle} />
          ) : (
            <NavUser Toggle={Toggle} />
          )
        }
        toggle={toggle}
        sidebarBg="#282c34"
      >
        <Routes>
          <Route path="/admin/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/admin/archived" element={<Archive />} />
          <Route path="/admin/statistics" element={<Home />} />

          <Route path="/user/dashboardUser" element={<DashboardUser />} />
          <Route path="/user/statistics" element={<Home />} />
          <Route path="/user/books" element={<Books />} />
        </Routes>
      </Template>
    </div>
  );
}

export default App;

