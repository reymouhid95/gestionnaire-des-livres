import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import HomeCard from "./HomeCard";
import { ToastContainer } from "react-toastify";
// import SearchBooks from "./SearchBooks";

function BookBorrowed() {
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
  return (
    <div className="m-0 px-0 homeCard w-100">
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4">
        {books
          .filter((book) => book.isBorrowed)
          .map((book, index) => {
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
              />
            );
          })}
      </div>
    </div>
  );
}

export default BookBorrowed;
