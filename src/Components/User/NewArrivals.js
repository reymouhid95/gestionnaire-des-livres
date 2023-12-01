import Aos from "aos";
import "aos/dist/aos.css";
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import img from "../../assets/banner11.jpg";
import imgBanner1 from "../../assets/banner21.jpg";
import imgBanner2 from "../../assets/banner22.jpg";
import imgBanner3 from "../../assets/banner23.jpg";
import { db } from "../../firebase-config";
import HomeCard from "./HomeCard";

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
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="py-3 newArrivals">
      <div data-aos="fade-up">
        <img src={img} alt="img" className="w-100" />
      </div>
      <div className="row d-flex justify-content-center g-5 flex-wrap px-0 m-0 py-4 carte">
        {books.map((book, index) => (
          <HomeCard
            img={book.url}
            title={book.title}
            key={index}
            description={book.description}
            auth={book.author}
            genre={book.genre}
          />
        ))}
      </div>
      <div className="d-flex justify-content-between pt-5">
        <div className="col-md-6">
          <img src={imgBanner1} alt="img" className="img-fluid w-100" />
        </div>
        <div className="col-md-5 d-flex flex-column justify-content-between">
          <div>
            <img src={imgBanner2} alt="img" className="img-fluid" />
          </div>
          <div>
            <img src={imgBanner3} alt="img" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewArrivals;
