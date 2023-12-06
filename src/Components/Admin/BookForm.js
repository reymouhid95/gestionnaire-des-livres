/* eslint-disable react-hooks/exhaustive-deps */
// Importation des bibliothèques et outils
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../firebase-config";
import TableBook from "./BookTable";
import { addSeconds, differenceInDays } from "date-fns";

// Composant principal pour les méthodes d'ajout, de modification et de suppression
function FormBook() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    url: "",
    description: "",
    archived: false,
    isBorrowed: false,
    dueDate: null,
    stock: 5,
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const urlInputRef = useRef();
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [stocks, setStocks] = useState({});

  // Surveiller le chargement des données au montage de l'appli
  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        archived: doc.archived || false,
      }));
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Méthode d'ajout d'un livre
 const handleAddBook = useCallback(async () => {
   // Utilisez une expression régulière pour vérifier si la valeur de formData.url est un lien valide
   const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
   if (!urlRegex.test(formData.url)) {
     toast.error("Veuillez entrer un lien valide dans le champ URL.");
     // Mettez le focus sur le champ URL
     urlInputRef.current.focus();
     return;
   }

   // Vérifier si tous les champs requis sont remplis
   if (
     formData.title.trim() === "" ||
     formData.author.trim() === "" ||
     formData.genre.trim() === "" ||
     formData.url.trim() === "" ||
     formData.description.trim() === ""
   ) {
     toast.error("Veuillez remplir tous les champs.");
     return;
   }

   // Vérifier si le livre existe déjà
   const existingBook = books.find(
     (book) =>
       book.title === formData.title &&
       book.author === formData.author &&
       book.genre === formData.genre &&
       book.url === formData.url &&
       book.description === formData.description
   );

   if (existingBook) {
     toast.error("Ce livre existe déjà.");
     return;
   }

   // Ajouter le livre seulement si tous les champs sont remplis
   const book = formData;
   await addDoc(collection(db, "books"), book);
   await loadBooks();
   setFormData({
     title: "",
     author: "",
     genre: "",
     url: "",
     description: "",
   });

   // Réinitialiser les champs après l'ajout
   setFormData({
     title: "",
     author: "",
     genre: "",
     url: "",
     description: "",
   });
   toast.success("Livre ajouté avec succès!");

   // Mettre à jour le nombre de livres ajoutés
   setNumberOfBooks((prevNumberOfBooks) => prevNumberOfBooks + 5);

   // Stocker le nombre de livres ajoutés dans le local storage
   localStorage.setItem("numberOfBooks", numberOfBooks + 5);
 }, [formData, loadBooks, numberOfBooks]);

  // méthode pour le rechargement du stock
  // const checkStockAndReload = async () => {
  //   const booksToUpdate = books.filter((book) => book.stock === 0);
  //   if (booksToUpdate.length > 0) {
  //     await Promise.all(
  //       booksToUpdate.map(async (book) => {
  //         await updateDoc(doc(db, "books", book.id), {
  //           stock: 5,
  //         });
  //         setStocks((prevStocks) => ({
  //           ...prevStocks,
  //           [book.title]: 5,
  //         }));
  //         toast.info(`Stock rechargé pour le livre "${book.title}"!`);
  //       })
  //     );
  //   }
  // };

  // Mettre à jour un livre
  const handleEditBook = (book) => {
    setShow(true);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      url: book.url,
      description: book.description,
      archived: book.archived,
    });
    setIsAdding(false);
    setSelectedBook(book);
  };

  // Faire la mise à jour sans ajouter un nouveau champ dans le tableau
  const handleUpdateBook = async () => {
    setShow(false);
    if (selectedBook) {
      await updateDoc(doc(db, "books", selectedBook.id), formData);
      await loadBooks();
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });

      // Réinitialiser les champs après l'ajout
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });
      toast.success("Données modifiées avec success!");
      setIsAdding(true);
      setSelectedBook(null);
    }
  };

  // La fonction handleBorrowBook qui permet d'emprunter un livre
  // const handleBorrowBook = async (title) => {
  //   if (stocks[title] > 0) {
  //     const updatedStock = stocks[title] - 1;
  //     const dueDate = addSeconds(new Date(), 20);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       isBorrowed: true,
  //       dueDate,
  //     }));

  //     // Mettre à jour la base de données avec le nouveau stock
  //     const bookToUpdate = books.find((book) => book.title === title);
  //     if (bookToUpdate) {
  //       await updateDoc(doc(db, "books", bookToUpdate.id), {
  //         stock: updatedStock,
  //         isBorrowed: true,
  //         dueDate,
  //       });
  //       setStocks((prevStocks) => ({
  //         ...prevStocks,
  //         [title]: updatedStock,
  //       }));
  //       toast.success("Livre emprunté avec succès!");
  //     }
  //   } else {
  //     toast.warning("Stock épuisé. Impossible d'emprunter le livre!");
  //   }

  //   await checkStockAndReload();
  // };

  // Fonction pour gérer le retour automatique des livres
  // const handleAutoReturn = async () => {
  //   const currentDate = new Date();
  //   const overdueBooks = books.filter(
  //     (book) =>
  //       book.isBorrowed &&
  //       book.dueDate &&
  //       differenceInDays(new Date(), book.dueDate) > 0
  //   );

  //   // Retour automatique des livres et mise à jour de la base de données
  //   await Promise.all(
  //     overdueBooks.map(async (book) => {
  //       await updateDoc(doc(db, "books", book.id), {
  //         isBorrowed: false,
  //         dueDate: null,
  //         stock: stocks[book.title] + 1,
  //       });
  //       setStocks((prevStocks) => ({
  //         ...prevStocks,
  //         [book.title]: stocks[book.title] + 1,
  //       }));

  //       // L'lerte pour informer l'utilisateur du retour automatique
  //       toast.info(
  //         `Retour automatique du livre "${book.title}" en raison de la date d'échéance dépassée!`
  //       );
  //     })
  //   );

  //   await checkStockAndReload();
  // };

  // Nettoyage au démontage
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     handleAutoReturn();
  //     checkStockAndReload();
  //   }, 20 * 1000);

  //   return () => clearInterval(intervalId);
  // }, [handleAutoReturn]);

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

  // Supprimer un livre
  const handleDeleteBook = useCallback(
    async (bookId) => {
      await deleteDoc(doc(db, "books", bookId));
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setStocks((prevStocks) => {
        const {
          [books.find((book) => book.id === bookId).title]: removed,
          ...rest
        } = prevStocks;
        return rest;
      });
      toast.success("Stock supprimé avec succès!");
    },
    [books]
  );

  // Soummission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      setShow(false);
      await handleAddBook();
    } else {
      await handleUpdateBook();
    }
  };



  // Surveiller l'état du bouton
  const buttonText = isAdding ? "Ajouter" : "Mise à jour";

  // L'affichage
  return (
    <div className="mt-2">
      <ToastContainer />
      {isArchived && toast.success("Livre archivé avec succès!")}
      {isUnarchived && toast.success("Livre désarchivé avec succès!")}
      <Form onSubmit={handleSubmit}>
        <Row className="w-100 m-0 p-0">
          <div className="d-flex justify-content-end">
            <Button
              className="soumission mt-2 mx-5"
              style={{ width: "max-content" }}
              onClick={handleShow}
            >
              Ajouter
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Informations livres</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row d-flex g-2">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Titre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    placeholder="Nom de l'auteur"
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="row g-2 d-flex flex-wrap">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    placeholder="Genre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="url"
                    value={formData.url}
                    placeholder="Lien du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    ref={urlInputRef}
                    required
                  />
                </Col>
                <Col md={12} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    placeholder="Description du livre"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  className="soumission mt-2 mb-3"
                  onClick={handleSubmit}
                  style={{ width: "max-content" }}
                >
                  {buttonText}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Row>
      </Form>

      <div>
        <TableBook
          books={books}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onArchivedBook={archive}
        />
      </div>
    </div>
  );
}

export default FormBook;
