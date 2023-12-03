import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
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
      <div className="title-seller text-white fw-bold">
        <h1>Best seller</h1>
      </div>
      <div className="d-flex justify-content-around g-5 flex-wrap px-0 m-0 py-4 carte">
        {books.map((book, index) => (
          <HomeCard
            img={book.url}
            title={book.title}
            key={index}
            description={book.description}
            auth={book.author}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeCardContent;
