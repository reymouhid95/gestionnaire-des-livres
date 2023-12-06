import { Link } from "react-router-dom";
import FormBook from "../../Components/Admin/BookForm";
// import { useEffect } from "react";
// import { useNavigate } from 'react-router-dom';

function Dashboard() {
  return (
    <Link to="/admin/dashboardAdmin" style={{ textDecoration: "none" }}>
      <div className="dashboard m-0 p-0">
        <FormBook />
      </div>
    </Link>
  );
}

export default Dashboard;
