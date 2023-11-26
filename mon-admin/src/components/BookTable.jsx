/* eslint-disable array-callback-return */
// Importation des bibliothèques et outils
import { useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ListModal from "./ModalList";

// Fonction principal du composant
function TableBook({ books, onEditBook, onDeleteBook }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Méthode pour afficher le modal
  const handleShowModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Méthode pour fermer le modal
  const handleCloseModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

  // Méthode pour afficher le modal de la liste
  const handleShowListModal = () => {
    setShowListModal(true);
  };

  // Méthode pour fermer le modal de la liste
  const handleCloseListModal = () => {
    setShowListModal(false);
  };

  // L'affichage
  return (
    <div>
      <div className="mb-1">
        <Row>
          <Col md={8}>
            {" "}
            <h2 className="fw-bold text-start px-3">Books Details</h2>
          </Col>
          <Col md={4}>
            {" "}
            <Form className="mx-3">
              <Form.Control
                type="search"
                placeholder="Search"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                className="rounded-5"
              />
            </Form>
          </Col>
        </Row>
      </div>
      <Button
        variant=""
        className="soumission mt-3 mb-2 mx-2"
        onClick={handleShowListModal}
      >
        Afficher la liste
      </Button>
      <Table responsive striped bordered hover variant="bg-body-secondary">
        <thead>
          <tr>
            <th className="bg-light text-dark">#</th>
            <th className="bg-light text-dark">Titre</th>
            <th className="bg-light text-dark">Auteur</th>
            <th className="bg-light text-dark">Genre</th>
            <th className="bg-light text-dark">Lien</th>
            <th className="bg-light text-dark">Description</th>
            <th className="bg-light text-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase().trim())
              ) {
                return val;
              }
            })
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
                    variant="outline-info border border-none"
                    className="mb-2 mx-2"
                    onClick={() => handleShowModal(book)}
                  >
                    <Icon.Eye />
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-2 text-warning border border-none"
                    onClick={() => onEditBook(book)}
                  >
                    <Icon.Pen />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="mb-2 mx-2 border border-none"
                    onClick={() => onDeleteBook(book.id)}
                  >
                    <Icon.Trash />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Row>
        <div className="d-flex justify-content-center px-3">
          <ul
            className="pagination"
            style={{
              listStyle: "none",
              display: "flex",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {books.length > booksPerPage &&
              Array(Math.ceil(books.length / booksPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className="page-item"
                    style={{ borderRadius: "5px" }}
                  >
                    <Button
                      className={`page-link ${
                        currentPage === index + 1 ? "bg-primary text-white" : ""
                      }`}
                      onClick={() => paginate(index + 1)}
                      style={{ border: "none", borderRadius: "100px" }}
                    >
                      {index + 1}
                    </Button>
                  </li>
                ))}
          </ul>
        </div>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} className="text-start">
        <Modal.Header closeButton>
          <Modal.Title>Détails du livre</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light fw-bold">
          {selectedBook && (
            <div>
              <p>Titre : {selectedBook.title}</p>
              <p>Auteur : {selectedBook.author}</p>
              <p>Genre : {selectedBook.genre}</p>
              <p>Lien : {selectedBook.url}</p>
              <p>Description : {selectedBook.description}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <ListModal
        show={showListModal}
        handleClose={handleCloseListModal}
        books={books}
      />
    </div>
  );
}

export default TableBook;
