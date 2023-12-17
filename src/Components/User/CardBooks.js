import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import HomeCard from "./HomeCard";
import SearchBooks from "./SearchBooks";

function CardBooks() {
  const [books, setBooks] = useState([]);
  const [filterType, setFilterType] = useState("all");
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

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filterBooks = () => {
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.description.toLowerCase().includes(filter.toLowerCase()) ||
        book.genre.toLowerCase().includes(filter.toLowerCase()) ||
        book.url.toLowerCase().includes(filter.toLowerCase())
    );

    switch (filterType) {
      case "all":
        return filteredBooks;
      case "roman":
        return filteredBooks.filter((book) => book.genre === "Roman");
      case "histoire":
        return filteredBooks.filter((book) => book.genre === "Histoire");
      case "art":
        return filteredBooks.filter((book) => book.genre === "Art");
      case "poesie":
        return filteredBooks.filter((book) => book.genre === "Poesie");
      case "science":
        return filteredBooks.filter((book) => book.genre === "Science");
      case "adventure":
        return filteredBooks.filter((book) => book.genre === "Adventure");
      default:
        return [];
    }
  };

  // console.log(filterBooks());

  const filteredBooks = filterBooks();

  return (
    <div className="container-fluid m-0 px-0 homeCard w-100">
      <SearchBooks
        books={books}
        filter={filter}
        func={(e) => setFilter(e.target.value)}
        func3={() => setFilterType("all")}
        func2={() => setFilterType("histoire")}
        func1={() => setFilterType("roman")}
        func4={() => setFilterType("art")}
        func5={() => setFilterType("poesie")}
        func6={() => setFilterType("science")}
        func7={() => setFilterType("adventure")}
      />
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4 books">
        {
          filteredBooks.map((book, index) => (
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
    </div>
  );
}

export default CardBooks;
