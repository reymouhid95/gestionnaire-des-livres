import React from "react";
import { Link } from "react-router-dom";

function SidebarComponent({ title, icon, path }) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      className="py-3 my-2 rounded list-group-item"
      to={path}
    >
      <i className={icon}></i>
      <span className="fs-5">{title}</span>
    </Link>
  );
}

export default SidebarComponent;
