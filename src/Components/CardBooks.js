import React from 'react'
import HomeCard from './HomeCard';
import { cardInfo, newArriv } from './Utils';

function CardBooks() {
  return (
    <div className="row d-flex justify-content-center g-5 flex-wrap px-0 m-0 py-4 books">
        {
            cardInfo.map((elem, index) => (
                <HomeCard img={elem.img} title={elem.title} price={elem.price} key={index}/>
            ))
        }

        {
            newArriv.map((elem, index) => (
                <HomeCard img={elem.img} title={elem.title} price={elem.price} key={index}/>
            ))
        }
    </div>
  )
}

export default CardBooks