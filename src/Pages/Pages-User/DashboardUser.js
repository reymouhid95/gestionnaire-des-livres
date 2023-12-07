import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarouselAcceuil from "../../Components/User/CarouselAcceuil";
import HomeCardContent from "../../Components/User/HomeCardContent";
import NewArrivals from "../../Components/User/NewArrivals";

function DashboardUser() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem("utilisateur"));

    if (user) {
      // Si l'utilisateur est connecté, redirigez-le vers le tableau de bord approprié
      if (user.email === "serigne@gmail.com") {
        navigate("/admin/dashboardAdmin");
      }
    }
  }, [navigate]);

  return (
    <Link to="/user/dashboardUser" style={{ textDecoration: "none" }}>
      <h1 className="title py-3 px-3 fw-bold">Home</h1>
      <div className="dashboard">
        <CarouselAcceuil />
        <HomeCardContent />
        <NewArrivals />
      </div>
    </Link>
  );
}

export default DashboardUser;
