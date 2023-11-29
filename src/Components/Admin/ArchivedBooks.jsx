import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { db } from "../../firebase-config";
import Paginations from "./Paginations";

function ArchivedBooks() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currenBooks = books.slice(indexOfFirstBook, indexOfLastBook);

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
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                    variant="outline-warning"
                    className="mb-2 mx-2 border border-none"
                    onClick={""}
                  >
                    <Icon.FolderX />
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
