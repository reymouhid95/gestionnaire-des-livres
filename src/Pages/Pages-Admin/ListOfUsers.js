import React from "react";
import { Link } from "react-router-dom";
import UserList from "../../Components/Admin/UserList";

function ListOfUsers() {
  return (
    <Link to="/admin/userList" style={{ textDecoration: "none" }}>
      <UserList />
    </Link>
  );
}

export default ListOfUsers;
