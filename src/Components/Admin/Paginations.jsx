// Importation des outils nécessaires
import { Button } from "react-bootstrap";

const Paginations = ({ booksPerPage, totalBooks, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul
      className="pagination"
      style={{
        listStyle: "none",
        display: "flex",
        justifyContent: "center",
        gap: "5px",
      }}
    >
      {pageNumbers.map((number) => (
        <li key={number} className="page-item" style={{ borderRadius: "5px" }}>
          <Button
            className={`page-link ${
              currentPage === number ? "bg-primary text-white" : ""
            }`}
            onClick={() => paginate(number)}
            style={{ border: "none", borderRadius: "100px" }}
          >
            {number}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default Paginations;
