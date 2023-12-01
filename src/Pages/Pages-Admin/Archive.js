import React from "react";
import { Link } from "react-router-dom";
import ArchivedBooks from "../../Components/Admin/ArchivedBooks";

function Archive() {
  return (
    <Link to="/admin/archived" style={{ textDecoration: "none" }}>
      <h1 className="title fw-bold py-3 px-3">Archived</h1>
      <div className="divArchiveBooks">
        <ArchivedBooks />
      </div>
    </Link>
  );
}

export default Archive;
