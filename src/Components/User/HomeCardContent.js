import React, { useState, useEffect, useCallback  } from 'react';
import HomeCard from './HomeCard';
import { db } from "../../firebase-config";
import {
    collection,
    getDocs,
} from "firebase/firestore";
import { toast,} from 'react-toastify';

function HomeCardContent() {
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

  const toastComps = () => {
    return toast.success("Livre emprunté")
  }


  return (
    <div className="m-0 px-0 homeCard w-100">
      <div className="title-seller text-white py-2">
        <h1>BEST SELLER</h1>
      </div>
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4 carte">
        {books.map((book, index) => {
          return (
            <HomeCard
              img={book.url}
              title={book.title}
              key={index}
              description={book.description}
              auth={book.author}
              Id={book.id}
              archived={book.archived}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomeCardContent