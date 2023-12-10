import React from 'react'
import UserList from '../../Components/Admin/UserList'
import { Link } from 'react-router-dom'

function ListOfUsers() {
  return (
    <Link to="/admin/userList" style={{ textDecoration: "none" }}>
      <h1 className="text-dark fw-bold title py-3 px-2">List Of Users</h1>
      <UserList />
    </Link>
  );
}

export default ListOfUsers