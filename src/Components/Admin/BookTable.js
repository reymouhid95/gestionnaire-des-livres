/* eslint-disable no-unused-vars */
// Importation des bibliothèques et outils
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { db } from "../../firebase-config";
import BookDetails from "./BookDetails";
import ListModal from "./ModalList";
import Paginations from "./Paginations";

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
function TableBook({ books, onEditBook, onDeleteBook, onArchivedBook }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [filter, setFilter] = useState("");
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // const [bookArchives, setBookArchives] = useState(
  //   JSON.parse(localStorage.getItem("bookArchives")) || {}
  // );
  const [initialBookArchives, setInitialBookArchives] = useState({});
  const [bookArchives, setBookArchives] = useState({});
  const [archivedBookId, setArchivedBookId] = useState(null);

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

  // Filtre de recherche des livres
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

  const handleArchivedBook = (bookId) => {
    onArchivedBook(bookId);

    // Update local storage to store the archived state
    setBookArchives((prevBookArchives) => {
      const updatedArchives = {
        ...prevBookArchives,
        [bookId]: true,
      };
      console.log("Updated Archives:", updatedArchives);
      localStorage.setItem("bookArchives", JSON.stringify(updatedArchives));
      return updatedArchives;
    });
  };

  // L'affichage
  return (
    <div>
      <div className="searchContent d-flex justify-content-center">
        <div>
          <Search className="rounded-pill">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Rechercher ici…"
              inputProps={{ "aria-label": "search" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Search>
        </div>
      </div>
      <div>
        <Button className="soumission mx-5" onClick={handleShowListModal}>
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
        className="mx-5 data"
        size="sm"
      >
        <thead>
          <tr>
            <th className="text-light text-center">#</th>
            <th className="text-light text-center">Titre</th>
            <th className="text-light text-center">Auteur</th>
            <th className="text-light text-center">Genre</th>
            <th className="text-light text-center">Lien</th>
            <th className="text-light text-center">Description</th>
            <th className="text-light text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterBooks().map((book, index) => (
            <tr
              key={book.id}
              style={{
                textDecoration: book.archived ? "line-through" : "none",
              }}
            >
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.url}</td>
              <td>{book.description}</td>
              <td>
                <div className="">
                  <Button
                    variant="outline-info border border-none"
                    className="mb-2 mx-1"
                    onClick={() => handleShowModal(book)}
                  >
                    <Icon.EyeFill />
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-1 text-warning border border-none"
                    onClick={() => onEditBook(book)}
                  >
                    <Icon.PenFill />
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-1 text-warning border border-none"
                    onClick={onArchivedBook}
                  >
                    {book.archived ? (
                      <Icon.FolderX
                        onClick={() => handleArchivedBook(book.id)}
                      />
                    ) : (
                      <Icon.FolderSymlinkFill
                        onClick={() => handleArchivedBook(book.id)}
                      />
                    )}
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="mb-2 mx-1 border border-none"
                    onClick={() => onDeleteBook(book.id)}
                  >
                    <Icon.TrashFill />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <div className="d-flex justify-content-center w-100">
          <Paginations
            booksPerPage={booksPerPage}
            totalBooks={books.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
      <BookDetails
        show={showModal}
        handleClose={handleCloseModal}
        selectedBook={selectedBook}
      />
      <ListModal
        show={showListModal}
        handleClose={handleCloseListModal}
        books={books}
      />
    </div>
  );
}

export default TableBook;
