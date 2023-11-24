import { Link } from "react-router-dom";
import FormBook from "../Components/BookForm"

function Dashboard() {
  return (
    <Link to="/user/dashboard" style={{textDecoration: "none"}}>
      <h1 className="title py-3 px-3 fw-bold">BOOKS DATABASE</h1>
      <div className="dashboard m-0 p-0">
          <FormBook />
      </div> 
    </Link>
  )
}

export default Dashboard;