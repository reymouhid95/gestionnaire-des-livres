import React from 'react';
import Chart from '../Components/Chart';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Link to="/statistics" style={{textDecoration: "none"}}>
            <h1 className='title fw-bold py-3 px-3'>STATISTICS</h1>
            <div className='py-5 px-0' id='home'>
                <Chart />
            </div>
        </Link>
    )
}

export default Home