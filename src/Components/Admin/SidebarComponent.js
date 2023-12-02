import { Link } from "react-router-dom";

function SidebarComponent({ title, icon, path }) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      className="py-4 ps-2 my-2 rounded items col-md-12 col-2"
      to={path}
    >
      <i className={icon}></i>
      <span className="fs-5">{title}</span>
    </Link>
  );
}

export default SidebarComponent;
