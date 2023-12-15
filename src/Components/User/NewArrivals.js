import React, { useEffect, useState, useCallback } from 'react';
import img from '../../assets/banner11.jpg'
import HomeCard from './HomeCard';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { db } from "../../firebase-config";
import {
    collection,
    getDocs
} from "firebase/firestore";

function NewArrivals() {
    const [books, setBooks] = useState([]);
    const loadBooks = useCallback(async () => {
      try {
        const bookCollection = collection(db, "books");
        const snapshot = await getDocs(bookCollection);
        const bookData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(bookData);
      } catch (error) {
        console.error("Error loading books:", error);
        alert(
          "Erreur de chargement. Veuillez vérifier votre connexion internet!"
        );
      }
    }, []);
  
    useEffect(() => {
      loadBooks();
    }, [loadBooks]);
    
    useEffect(() => {
        Aos.init({duration:2000})
    }, [])
  return (
    <div className='py-3 newArrivals'>
        <div data-aos="fade-up">
            <img src={img} alt="img" className='w-100'/>
        </div>
        <div className="row d-flex justify-content-around g-2 flex-wrap px-0 m-0 py-4 carte">
            {
              books.map((book, index) => (
                  <HomeCard img={book.url} title={book.title} key={index} description={book.description} auth={book.author}/>
              ))
            }
        </div>
    </div>
  )
}

export default NewArrivals