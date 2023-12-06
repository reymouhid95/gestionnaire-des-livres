import React from "react";
import { Link } from "react-router-dom";
import ArchivedBooks from "../../Components/Admin/ArchivedBooks";

function Archive() {
  return (
    <Link to="/admin/archived" style={{ textDecoration: "none" }}>
      <div className="divArchiveBooks">
        <ArchivedBooks />
      </div>
    </Link>
  );
}

export default Archive;
