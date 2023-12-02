import { Link } from "react-router-dom";
import FormBook from "../../Components/Admin/BookForm";
// import { useEffect } from "react";
// import { useNavigate } from 'react-router-dom';

function Dashboard() {
  return (
    <Link to="/admin/dashboardAdmin" style={{ textDecoration: "none" }}>
      <h1 className="title px-3 fw-bold">Books Database</h1>
      <div className="dashboard m-0 p-0">
        <FormBook />
      </div>
    </Link>
  );
}

export default Dashboard;
