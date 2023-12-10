/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";
import HomeCard from "./HomeCard";

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
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    console.log(books);
    loadBooks();
  }, [loadBooks]);

  const toastComps = () => {
    return toast.success("Livre emprunté");
  };

  return (
    <div className="m-0 px-0 homeCard w-100">
      <div className="title-seller text-white py-">
        <h1>Best Seller</h1>
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
              stock={book.stock}
              toastComp={toastComps}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomeCardContent;
