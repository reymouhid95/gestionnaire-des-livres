function Template(props) {
  return (
    <div className="container-fluid nin-vh-100 template p-0">
      <div className="d-flex contenu">
        {props.toggle && (
          <div
            className="col-12 col-md-2 vh-100 position-fixed m-0 p-0"
            id="sidebarDiv"
          >
            {props.sidebar}
          </div>
        )}
        {props.toggle && <div className="col-12 contentNavbar col-md-2"></div>}
        <div className="col p-0 m-0">
          {props.navbar}
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Template;
