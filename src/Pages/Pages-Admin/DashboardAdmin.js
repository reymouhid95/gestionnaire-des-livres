import { Link } from "react-router-dom";
import FormBook from "../../Components/Admin/BookForm"
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem("utilisateur")){
      navigate("/connexion")
    }
  })
  return (
    <Link to="/admin/dashboardAdmin" style={{textDecoration: "none"}}>
      <h1 className="title py-3 px-3 fw-bold">BOOKS DATABASE</h1>
      <div className="dashboard m-0 p-0">
          <FormBook />
      </div> 
    </Link>
  )
}

export default Dashboard;