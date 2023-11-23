import React, { useEffect } from 'react';
import img from '../assets/banner11.jpg'
import { newArriv } from './Utils';
import HomeCard from './HomeCard';
import imgBanner1 from '../assets/banner21.jpg';
import imgBanner2 from '../assets/banner22.jpg';
import imgBanner3 from '../assets/banner23.jpg';
import Aos from 'aos';
import 'aos/dist/aos.css';

function NewArrivals() {
    useEffect(() => {
        Aos.init({duration:2000})
    }, [])
  return (
    <div className='py-3 newArrivals'>
        <div data-aos="fade-up">
            <img src={img} alt="img" className='w-100'/>
        </div>
        <div className="row d-flex justify-content-center g-5 flex-wrap px-0 m-0 py-4 carte">
            {
                newArriv.map((elem, index) => (
                    <HomeCard img={elem.img} title={elem.title} price={elem.price} key={index}/>
                ))
            }
        </div>
        <div className='d-flex justify-content-between pt-5'>
            <div className='col-md-6'>
                <img src={imgBanner1} alt="img" className='img-fluid w-100'/>
            </div>
            <div className='col-md-5 d-flex flex-column justify-content-between'>
                <div>
                    <img src={imgBanner2} alt="img" className='img-fluid'/>
                </div>
                <div>
                    <img src={imgBanner3} alt="img" className='img-fluid'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewArrivals