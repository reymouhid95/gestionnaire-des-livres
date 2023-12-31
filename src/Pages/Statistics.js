import React from "react";
import { Link } from "react-router-dom";
import Chart from "../Components/Chart";

function Home() {
  return (
    <Link to="/statistics" style={{ textDecoration: "none" }}>
      <div className="py-5 px-0" id="home">
        <Chart />
      </div>
    </Link>
  );
}

export default Home;
