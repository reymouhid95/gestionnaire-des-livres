/* eslint-disable array-callback-return */
// Importation des bibliothèques et outils
import { useEffect, useState } from "react";
import { Table, Button, Modal, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import { db } from "../firebase-config";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import ListModal from "./ModalList";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  zIndex: 0,
  width: "50%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    zIndex: -1,
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// Fonction principal du composant
function TableBook({ books, onEditBook, onDeleteBook }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [filter, setFilter] = useState("");
  const [bookArchives, setBookArchives] = useState(
    JSON.parse(localStorage.getItem("bookArchives")) || {}
  );
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Méthode pour afficher lemodal
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

  const filterBooks = () => {
    return currentBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.description.toLowerCase().includes(filter.toLowerCase()) ||
        book.genre.toLowerCase().includes(filter.toLowerCase()) ||
        book.url.toLowerCase().includes(filter.toLowerCase())
    );
  };

// Fonction pour archiver un livre et Sauvegarder les livres archivés dans la base de données
const handleArchiveBook = async (book) => {
  const isBookArchived = bookArchives[book.id] !== undefined ? bookArchives[book.id] : false;

  // Mettre à jour l'état d'archivage du livre
  setBookArchives((prevArchives) => ({
    ...prevArchives,
    [book.id]: !isBookArchived,
  }));

  // Si le livre est archivé, ajouter le livre à la collection "Archived"
  if (!isBookArchived) {
    const archivedBook = {
      originalId: book.id, // Store the original book ID
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      url: book.url || "",
      description: book.description || "",
    };

    try {
      // Ajouter le document à la collection "Archived"
      const docRef = await addDoc(collection(db, "Archived"), archivedBook);
      console.log("Document archived with ID: ", docRef.id);
    } catch (error) {
      console.error("Error archiving document: ", error);
    }
  } else {
    // Si le livre est désarchivé, supprimer le document de la collection "Archived"
    console.log("Book archives before unarchiving: ", bookArchives);
    try {
      const originalId = bookArchives[book.id]?.originalId;
      if (originalId) {
        const archivedDoc = doc(db, "Archived", originalId);
        await deleteDoc(archivedDoc);
        console.log("Document unarchived and deleted: ", originalId);
      } else {
        console.warn("Original ID not found for book:", book.id);
      }
    } catch (error) {
      console.error("Error deleting archived document: ", error);
    }

  }
};
  // Persist bookArchives to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("bookArchives", JSON.stringify(bookArchives));
  }, [bookArchives]);


  // L'affichage
  return (
    <div className=" m-0">
      <div className="mb-1">
        <div className="searchContent d-flex pb-4">
          <Col md={8} sm={8}>
            {" "}
            <h2 className="fw-bold text-start text-dark px-3 w-100">
              Books Details
            </h2>
          </Col>
          <Col md={4} sm={4}>
            {" "}
            <div className="col-md-12">
              <Search className="rounded-pill">
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </Search>
            </div>
          </Col>
        </div>
      </div>
      <div>
        <Button
          variant=""
          className="soumission mt-3 mb-2 mx-2"
          onClick={handleShowListModal}
        >
          Afficher la liste
        </Button>
      </div>
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
            <th className="text-light text-start py-3">#</th>
            <th className="text-light text-start py-3">Titre</th>
            <th className="text-light text-start py-3">Auteur</th>
            <th className="text-light text-start py-3">Genre</th>
            <th className="text-light text-start py-3">Lien</th>
            <th className="text-light text-start py-3">Description</th>
            <th className="text-light text-start py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterBooks().map((book, index) => (
            <tr
              key={book.id}
              style={{
                textDecoration: bookArchives[book.id] ? "line-through" : "none",
              }}
            >
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.url}</td>
              <td>{book.description}</td>
              <td>
                {bookArchives[book.id] ? (
                  <div className="">
                    <Button
                      variant="outline-danger"
                      className="mb-2 border border-none"
                      onClick={() => handleArchiveBook(book)}
                    >
                      <Icon.FolderX />
                    </Button>

                    <Button
                      variant="outline-danger"
                      className="mb-2 mx-1 border border-none"
                      onClick={() => onDeleteBook(book.id)}
                    >
                      <Icon.Trash />
                    </Button>
                  </div>
                ) : (
                  <div className="">
                    <Button
                      variant="outline-info border border-none"
                      className="mb-2 mx-1"
                      onClick={() => handleShowModal(book)}
                    >
                      <Icon.Eye />
                    </Button>
                    <Button
                      variant="outline-success"
                      className="mb-2 mx-1 text-warning border border-none"
                      onClick={() => onEditBook(book)}
                    >
                      <Icon.Pen />
                    </Button>
                    <Button
                      variant="outline-success"
                      className="mb-2 mx-1 text-warning border border-none"
                      onClick={() => handleArchiveBook(book)}
                    >
                      <Icon.FolderSymlink />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="mb-2 mx-1 border border-none"
                      onClick={() => onDeleteBook(book.id)}
                    >
                      <Icon.Trash />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <div className="d-flex justify-content-center p-0 m-0 w-100">
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
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="text-center">
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
