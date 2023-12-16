import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AboutUs from "../../Components/User/AboutUs";
import BookCategories from "../../Components/User/BookCategories";
import CarouselAcceuil from "../../Components/User/CarouselAcceuil";
import NewArrivals from "../../Components/User/NewArrivals";
import Newsletter from "../../Components/User/Newsletter";
import Testimonials from "../../Components/User/Testimonials";

function DashboardUser() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifiez si l'utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem("utilisateur"));

    if (user) {
      // Si l'utilisateur est connecté, redirigez-le vers le tableau de bord approprié
      if (user.email === "serigne@gmail.com") {
        navigate("/admin/dashboardAdmin");
        window.location.reload();
      }
    }
  }, [navigate]);

  return (
    <Link to="/user/dashboardUser" style={{ textDecoration: "none" }}>
      <div className="dashboard">
        <CarouselAcceuil />
        <BookCategories />
        <NewArrivals />
        <AboutUs />
        <Newsletter />
        <Testimonials />
      </div>
    </Link>
  );
}

export default DashboardUser;
