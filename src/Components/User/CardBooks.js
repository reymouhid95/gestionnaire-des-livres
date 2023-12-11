import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
      toast.error("Loading error. Please check your internet connection!");
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
      case "dispo":
        return filteredBooks.filter((book) => !book.archived);
      case "noDispo":
        return filteredBooks.filter((book) => book.archived);
      default:
        return [];
    }
  };

  return (
    <div className="container-fluid m-0 px-0 homeCard w-100">
      <SearchBooks
        books={books}
        filter={filter}
        func={(e) => setFilter(e.target.value)}
        func3={() => setFilterType("all")}
        func2={() => setFilterType("noDispo")}
        func1={() => setFilterType("dispo")}
      />
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4 books">
        {filterBooks().map((book, index) => (
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
