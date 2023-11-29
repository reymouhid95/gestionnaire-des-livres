import React from 'react'
import HomeCard from './HomeCard';
import { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase-config";
import {
    collection,
    getDocs
} from "firebase/firestore";
import SearchBooks from './SearchBooks';

function CardBooks() {
  const [books, setBooks] = useState([]);
  const [booksNoDispo, setBooksNoDispo] = useState([]);
  const [filter, setFilter] = useState("");
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

  const loadBooksNoDispo = useCallback(async () => {
    try {
      const bookCollection = collection(db, "Archived");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooksNoDispo(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      alert(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooksNoDispo();
  }, [loadBooksNoDispo]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);
  console.log(books);


  const filterBooks = () => {
    return books.filter(
      (book) =>(
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.description.toLowerCase().includes(filter.toLowerCase()) ||
        book.genre.toLowerCase().includes(filter.toLowerCase()) ||
        book.url.toLowerCase().includes(filter.toLowerCase()))
      );    
  };
  const filterBooksNoDispo = () => {
    return booksNoDispo.filter(
      (book) =>(
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.description.toLowerCase().includes(filter.toLowerCase()) ||
        book.genre.toLowerCase().includes(filter.toLowerCase()) ||
        book.url.toLowerCase().includes(filter.toLowerCase()))
    );
  };
  return (
    <div className="container-fluid m-0 px-0 homeCard w-100">
      <SearchBooks books={books} filter={filter} func={(e) => setFilter(e.target.value)} func2={filterBooksNoDispo} func3={filterBooks}/>
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4 books">
          {
            filterBooks().map((book, index) => (
                <HomeCard img={book.url} title={book.title} key={index} description={book.description} auth={book.author}/>
            ))
          }
      </div>
    </div>
  )
}

export default CardBooks

// filterBooksNoDispo() ? filterBooksNoDispo().map((book, index) => (
//   <HomeCard img={book.url} title={book.title} key={index} description={book.description} auth={book.author}/>
// )) :