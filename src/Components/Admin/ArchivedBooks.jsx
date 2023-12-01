import React from "react";
import { Table, Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase-config";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import Paginations from "./Paginations";

function ArchivedBooks() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currenBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const [initialBookArchives, setInitialBookArchives] = useState({});
  const [bookArchives, setBookArchives] = useState({});
  const [archivedBookId, setArchivedBookId] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);



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
    const loadArchives = async () => {
      try {
        const docRef = doc(db, "archivedBooks", "archivedBooksData");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setInitialBookArchives(data || {});
      } catch (error) {
        console.error("Error loading archives from Firestore:", error);
      }
    };

    loadArchives();
  }, [books]);

  useEffect(() => {
    // Mettre à jour bookArchives après le chargement initial
    setBookArchives(initialBookArchives);
  }, [initialBookArchives]);

  useEffect(() => {
    // Mettre à jour bookArchives après l'archivage d'un livre
    if (archivedBookId) {
      setBookArchives((prevBookArchives) => ({
        ...prevBookArchives,
        [archivedBookId]: true,
      }));
      setArchivedBookId(null);
    }
  }, [archivedBookId]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const archive = useCallback(
    async (bookId) => {
      try {
        const selectedBook = books.find((book) => book.id === bookId);
        if (!selectedBook) {
          console.error("No selected book to archive.");
          return;
        }

        const updatedBookData = {
          ...selectedBook,
          archived: !selectedBook.archived,
        };

        await updateDoc(doc(db, "books", bookId), updatedBookData);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId ? { ...book, archived: !book.archived } : book
          )
        );

        if (updatedBookData.archived) {
          setIsArchived(true);
          setIsUnarchived(false);
        } else {
          setIsArchived(false);
          setIsUnarchived(true);
        }
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
    [books, selectedBook, setBooks, loadBooks]
  );

  const handleArchivedBook = async (bookId) => {
    archive(bookId);

    try {
      // Update archive state in Firestore
      const docRef = doc(db, "archivedBooks", "archivedBooksData");
      await setDoc(docRef, { ...bookArchives, [bookId]: true });

      // Update local state
      setBookArchives((prevBookArchives) => ({
        ...prevBookArchives,
        [bookId]: true,
      }));

      // Update archivedBookId
      setArchivedBookId(bookId);
    } catch (error) {
      console.error("Error updating archives in Firestore:", error);
    }
  };

  const handleUnarchivedBook = async (bookId) => {
    archive(bookId);

    try {
      // Update archive state in Firestore
      const docRef = doc(db, "archivedBooks", "archivedBooksData");
      await setDoc(docRef, { ...bookArchives, [bookId]: false });

      // Update local state
      setBookArchives((prevBookArchives) => ({
        ...prevBookArchives,
        [bookId]: false,
      }));

      // Update archivedBookId
      setArchivedBookId(bookId);
    } catch (error) {
      console.error("Error updating archives in Firestore:", error);
    }
  };

  return (
    <div className="dashboard" id="bookArchived">
      <Table
        responsive
        striped
        bordered
        hover
        variant="bg-body-secondary"
        id="table"
      >
        <thead>
          <tr>
            <th className="text-white text-start">#</th>
            <th className="text-white text-start">Titre</th>
            <th className="text-white text-start">Auteur</th>
            <th className="text-white text-start">Genre</th>
            <th className="text-white text-start">Lien</th>
            <th className="text-white text-start">Description</th>
            <th className="text-white text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currenBooks
            .filter((book) => book.archived)
            .map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.url}</td>
                <td>{book.description}</td>
                <td>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-1 text-warning border border-none"
                    onClick={() =>
                      book.archived
                        ? handleUnarchivedBook(book.id)
                        : handleArchivedBook(book.id)
                    }
                  >
                    {book.archived ? <Icon.FolderX /> : <Icon.FolderSymlink />}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div>
        <div className="d-flex justify-content-center p-0 m-0 w-100">
          <Paginations
            booksPerPage={booksPerPage}
            totalBooks={books.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default ArchivedBooks;
