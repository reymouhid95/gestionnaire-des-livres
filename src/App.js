import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./App.css";
import NavAdmin from "./Components/Admin/NavAdmin";
import SidebarAdmin from "./Components/Admin/SidebarAdmin";
import NavUser from "./Components/User/NavUser";
import SidebarUser from "./Components/User/SidebarUser";
import Archive from "./Pages/Pages-Admin/Archive";
import DashboardAdmin from "./Pages/Pages-Admin/DashboardAdmin";
import ListOfUsers from "./Pages/Pages-Admin/ListOfUsers";
import BookBorrowedContent from "./Pages/Pages-User/BookBorrowedContent";
import Books from "./Pages/Pages-User/Books";
import DashboardUser from "./Pages/Pages-User/DashboardUser";
import Template from "./layouts/Template";

function App() {
  const [toggle, setToggle] = useState(true);
  const url = "/admin/dashboardAdmin";

  const Toggle = () => {
    setToggle(!toggle);
  };

  return (
    <div>
      <Template
        sidebar={
          window.location.pathname === url ? <SidebarAdmin /> : <SidebarUser />
        }
        navbar={
          window.location.pathname === url ? (
            <NavAdmin Toggle={Toggle} />
          ) : (
            <NavUser Toggle={Toggle} />
          )
        }
        toggle={toggle}
        sidebarBg="#282c34"
      >
        <ToastContainer />
        <Routes>
          <Route path="/admin/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/admin/archived" element={<Archive />} />
          <Route path="/admin/userList" element={<ListOfUsers />} />

          <Route path="/user/dashboardUser" element={<DashboardUser />} />
          <Route path="/user/bookBorrowed" element={<BookBorrowedContent />} />
          <Route path="/user/books" element={<Books />} />
        </Routes>
      </Template>
    </div>
  );
}

export default App;
