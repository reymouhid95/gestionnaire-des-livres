import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Components/Sidebar';
import Home from './Pages/Statistics';
import Books from './Pages/Books';
import {Routes, Route} from 'react-router-dom';
import 'rsuite/dist/rsuite-no-reset.min.css'

import { useState } from 'react';
// import About from './Components/About';
import Template from './layouts/Template';
import Nav from './Components/Nav';
import Dashboard from './Pages/Dashboard';

function App() {
  const [toggle, setToggle] = useState(false);
  const Toggle = () => {
    setToggle(!toggle)
  }
  return (
    <div>
    <Template
      sidebar={<Sidebar />} 
      navbar={<Nav Toggle={Toggle}/>}
      toggle={toggle} 
      sidebarBg={"#282c34"}
    >
      <Routes>
          <Route path='/user/dashboard' element={<Dashboard />} />
          <Route path='/user/statistics' element={<Home />} />
          <Route path='/user/books' element={<Books />} />
      </Routes>
    </Template>
    </div>
  )
}

export default App;
