import React from "react";
import { Link } from "react-router-dom";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import CarouselAcceuil from "../../Components/User/CarouselAcceuil";
import HomeCardContent from "../../Components/User/HomeCardContent";
import NewArrivals from "../../Components/User/NewArrivals";

function DashboardUser() {
  return (
    <Link to="/user/dashboardUser" style={{ textDecoration: "none" }}>
      <h1 className="title px-3 fw-bold">Home</h1>
      <div className="dashboard">
        <CarouselAcceuil />
        <HomeCardContent />
        <NewArrivals />
      </div>
    </Link>
  );
}

export default DashboardUser;
