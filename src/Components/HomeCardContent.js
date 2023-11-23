import React from 'react'
import HomeCard from './HomeCard';
import { cardInfo } from './Utils';
// import Aos from 'aos';
// import 'aos/dist/aos.css';

function HomeCardContent() {
  return (
    <div className="m-0 px-0 homeCard w-100">
        <div className='title-seller text-white py-2'>
            <h1>BEST SELLER</h1>
        </div>
        <div className="row d-flex justify-content-center g-5 flex-wrap px-0 m-0 py-4 carte">
            {
                cardInfo.map((elem, index) => (
                    <HomeCard img={elem.img} title={elem.title} price={elem.price} key={index}/>
                ))
            }
        </div>
    </div>
  )
}

export default HomeCardContent