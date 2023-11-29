// Importation des bibliothèques et outils
import { useEffect, useState } from "react";
import { Table, Button, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import ListModal from "./ModalList";
import BookDetails from "./BookDetails";
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
function TableBook({ books, onEditBook, onDeleteBook, onArchivedBook }) {
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

  useEffect(() => {
    // Load archived status from local storage on component mount
    const storedArchives = JSON.parse(localStorage.getItem("bookArchives")) || {};
    console.log("Stored Archives:", storedArchives);
    setBookArchives(storedArchives);
  }, []);

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
                  >
                    <Icon.Eye onClick={() => handleShowModal(book)} />
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-1 text-warning border border-none"
                    style={{ display: !book.archived ? "inline" : "none" }}
                  >
                    <Icon.Pen onClick={() => onEditBook(book)} />
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mx-1 text-warning border border-none"
                  >
                    {book.archived ? (
                      <Icon.FolderX onClick={() => handleArchivedBook(book.id)} />
                    ) : (
                      <Icon.FolderSymlink
                        onClick={() => handleArchivedBook(book.id)}
                      />
                    )}
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="mb-2 mx-1 border border-none"
                  >
                    <Icon.Trash onClick={() => onDeleteBook(book.id)} />
                  </Button>
                </div>
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
