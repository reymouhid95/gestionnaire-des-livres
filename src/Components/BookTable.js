/* eslint-disable array-callback-return */
// Importation des bibliothèques et outils
import { useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';


const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
  };
  z-index: 1;
  `,
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[50]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &:active {
    background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }
  `,
);

const Search = styled("div")(({ theme }) => ({
position: "relative",
borderRadius: theme.shape.borderRadius,
backgroundColor: alpha(theme.palette.common.white, 1),
"&:hover": {
  backgroundColor: alpha(theme.palette.common.white, 0.25),
},
marginRight: theme.spacing(2),
marginLeft: 0,
zIndex:0,
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
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [filter, setFilter] = useState("");
  const [archivedBooks, setArchivedBooks] = useState([]);
  const [isArchived, setIsArchived] = useState(false);


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

  const filterBooks = () => {
    return currentBooks.filter(
      (book) =>(
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.description.toLowerCase().includes(filter.toLowerCase()) ||
        book.genre.toLowerCase().includes(filter.toLowerCase()) ||
        book.url.toLowerCase().includes(filter.toLowerCase()))
      );
  };

  const handleArchiveBook = (bookId) => {
    if (archivedBooks.includes(bookId)) {
      // Retirer l'ID du livre de la liste archivée
      setArchivedBooks(archivedBooks.filter((id) => id !== bookId));
      setIsArchived(false);
    } else {
      // Ajouter l'ID du livre à la liste archivée
      setArchivedBooks([...archivedBooks, bookId]);
      setIsArchived(true);
    }
  };
  
  // L'affichage
  return (
    <div className="container m-0">
      <div className="mb-1">
        <div className="searchContent d-flex pb-4">
          <Col md={8} sm={8}>
            {" "}
            <h2 className="fw-bold text-start text-dark px-3 w-100">Books Details</h2>
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
      <Table responsive striped className="w-100" bordered hover variant="bg-body-secondary">
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
              <tr key={book.id} style={{ textDecoration: isArchived ? 'line-through' : 'none' }}>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.url}</td>
                <td>{book.description}</td>
                <td className="d-flex">
                  {isArchived ? (
                    <Button
                      variant="outline-danger"
                      className="mb-2 mx-1 border border-none"
                      onClick={() => handleArchiveBook(book.id)}
                    >
                      <Icon.FolderX />
                    </Button>
                  ) : (<div className="d-flex">
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
                    onClick={() => handleArchiveBook(book.id)}
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
                  )
                }
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
          <Modal.Title>Détails de l'utilisateur</Modal.Title>
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
    </div>
  );
}

export default TableBook;
