import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

const SubmitButton = styled(Button)(({ theme }) => ({
  color: "white",
  background: "blue",
  marginBottom: 3,
  marginTop: 2,
  display: "block",
  textAlign: "center"
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: "white",
  background: "red",
  marginBottom: 3,
  marginTop: 2,
  marginLeft: 8,
  display: "block",
  textAlign: "center"
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const categories = [
  {
    id: "12s",
    category: "mental strength"
  },
  {
    id: "1bs",
    category: "spirituality"
  },
  {
    id: "1cs",
    category: "morality"
  },
  {
    id: "1ls",
    category: "love and relationships"
  },
  {
    id: "1s",
    category: "finance"
  },
  {
    id: "9qs",
    category: "self control"
  }
];

export default function AddQuoteModal({
  openModal,
  handleClose,
  isEdit,
  editId,
  setLoading
}) {
  const [author, setAuthor] = useState("");

  const [quote, setQuote] = useState("");

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEdit) {
      const quotesDocRef = doc(db, "quotes", editId);
      getDoc(quotesDocRef)
        .then((doc) => {
          const data = doc.data();
          setAuthor(data?.author);

          setQuote(data?.quote);
        })
        .catch((error) => console.log(error));
    } else {
      setAuthor("");

      setQuote("");
    }
  }, [editId]);

  const handleSubmit = async () => {
    if (author === "") {
      console.log(showError);
      setError("author is required");
      setShowError(true);
    } else if (quote === "") {
      console.log("provide the audio url");
      setError("provide the quote");
      setShowError(true);
    } else {
      try {
        const data = {
          author: author,

          quote: quote
        };

        if (isEdit) {
          const quotesRef = doc(db, "quotes", editId);

          updateDoc(quotesRef, data).then(() => {
            setLoading(true);
            handleClose();
          });

          setSuccess("Successfully edited");
        } else {
          await addDoc(collection(db, "quotes"), data);

          handleClose();

          setSuccess("Successfully added");
        }

        setLoading(true);

        setSuccess("Success", "quote uploaded successfully");

        Swal.fire({
          icon: "success",
          title: "Operation successful",
          text: `Quote has been successfully ${isEdit ? "edited" : "created"}`,
          confirmButtonColor: "#16a34a",
          confirmButtonText: "Ok"
        });

        setTimeout(() => {
          setSuccess("");
          setLoading(false);
          setAuthor("");
          setCategory("");
          setCommentary("");
          setQuote("");
        }, 300);
      } catch (error) {
        console.log("Error", `Failed to upload due to ${error}`);

        // setLoading(false);
      }
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Box sx={{ marginY: 2 }}>
              {" "}
              <TextField
                id="outlined-basic"
                label="Author"
                variant="outlined"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}>
              <TextField
                id="outlined-basic"
                label="Quote"
                multiline
                rows={7}
                variant="outlined"
                value={quote}
                onChange={(e) => {
                  setQuote(e.target.value);
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <SubmitButton
              variant="outline"
              sx={{ display: "block", textAlign: "center" }}
              onClick={handleSubmit}
            >
              Submit
            </SubmitButton>
            <CancelButton onClick={handleClose}>Cancel</CancelButton>
          </Box>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="warning">{error}</Alert>}
        </Box>
      </Modal>
    </div>
  );
}
