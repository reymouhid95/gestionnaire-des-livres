import CarouselAcceuil from "../Components/CarouselAcceuil";
import HomeCardContent from "../Components/HomeCardContent";
import NewArrivals from "../Components/NewArrivals";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <Link to="/user/dashboard" style={{textDecoration: "none"}}>
    <h1 className="title py-3 px-3 fw-bold">Home</h1>
      <div className="dashboard">
        <CarouselAcceuil />
        <HomeCardContent />    
        <NewArrivals />
      </div> 
    </Link>
  )
}

export default Dashboard;