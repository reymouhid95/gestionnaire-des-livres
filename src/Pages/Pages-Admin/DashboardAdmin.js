import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormBook from "../../Components/Admin/BookForm";

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem("utilisateur"));

    if (user) {
      // Si l'utilisateur est connecté, redirigez-le vers le tableau de bord approprié
      if (user.email !== "serigne@gmail.com") {
        navigate("/user/dashboardUser");
        window.location.reload();
      }
    }
  }, [navigate]);
  return (
    <Link to="/admin/dashboardAdmin" style={{ textDecoration: "none" }}>
      <h1 className="title py-3 px-3 fw-bold">BOOKS DATABASE</h1>
      <div className="dashboard m-0 p-0">
        <FormBook />
      </div>
    </Link>
  );
}

export default Dashboard;
