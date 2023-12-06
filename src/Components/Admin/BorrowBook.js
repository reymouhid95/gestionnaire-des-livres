import React, { useState } from "react";
import Button from "rsuite/Button";
import { toast } from "react-toastify";

const BorrowButton = ({ title, onBorrowBook, stock }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleBorrow = () => {
    if (stock > 0) {
      onBorrowBook(title);
      setIsDisabled(true);
    } else {
      toast.error("Stock épuisé. Impossible d'emprunter le livre.");
    }
  };

  return (
    <Button
      color="orange"
      className="text-white mt-3 bg-warning bouton rounded-pill"
      onClick={handleBorrow}
      disabled={isDisabled}
    >
      {isDisabled ? "Emprunter (Archivé)" : "Emprunter"}
    </Button>
  );
};

export default BorrowButton;
