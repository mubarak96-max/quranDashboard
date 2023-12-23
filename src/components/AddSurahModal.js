import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  Alert,
  CircularProgress,
  InputLabel,
  styled,
  TextField
} from "@mui/material";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
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
  width: 380,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  scrollY: "scroll"
};

export default function AddSurahModal({
  openModal,
  handleClose,
  isEdit,
  editId,
  setLoading
}) {
  const [audioURL, setAudioURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [audioName, setAudioName] = useState(null);

  const [description, setDescription] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [lugandaName, setLugandaName] = useState("");
  const [surahName, setSurahName] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [surahIndex, setSurahIndex] = useState(null);

  const [location, setLocation] = useState("");
  const [verses, setVerses] = useState(null);

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEdit) {
      const surahDocRef = doc(db, "surah", editId);
      getDoc(surahDocRef)
        .then((doc) => {
          const data = doc.data();
          setAudioURL(data?.audioURL);
          setDescription(data?.description);
          setEnglishName(data?.englishName);
          setLugandaName(data?.lugandaName);
          setSurahName(data?.surahName);
          setSurahIndex(data?.surahIndex);
          setFileSize(data?.fileSize);
          setLocation(data?.location);
          setVerses(data?.verses);

          setAudioName(data?.audioName);
        })
        .catch((error) => console.log(error));
    } else {
      setAudioURL("");
      setDescription("");
      setEnglishName("");
      setLugandaName("");
      setSurahName("");
      setSurahIndex(null);
      setFileSize(null);
      setLocation("");
      setVerses(null);

      setAudioName("");
      setUploadProgress(null);
    }
  }, [editId]);

  const handleUpload = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `files/Quran/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setAudioName(file.name);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
        setUploading(true);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAudioURL(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  console.log("surah name", audioName);
  console.log("surah url", audioURL);
  console.log("progress", uploadProgress);
  console.log("upload", uploading);

  const handleSubmit = async () => {
    if (audioURL === "") {
      console.log(showError);
      setError("audio url is required");
      setShowError(true);
    } else if (surahIndex === null) {
      console.log(showError);
      setError("surah index is required");
      setShowError(true);
    } else if (isNaN(surahIndex)) {
      console.log(showError);
      setError("surah index should be number");
      setShowError(true);
    } else if (isNaN(verses)) {
      setError("verses should be number");
      setShowError(true);
    } else if (fileSize === null) {
      console.log(showError);
      setError("file size is required");
      setShowError(true);
    } else if (isNaN(fileSize)) {
      console.log(showError);
      setError("file size should be number");
      setShowError(true);
    } else if (surahName === "") {
      console.log(showError);
      setError("surah name is required");
      setShowError(true);
    } else if (description === "") {
      setError("fill in the description");
      setShowError(true);
    } else if (englishName === "") {
      setError("fill in the english name");
      setShowError(true);
    } else if (lugandaName === "") {
      setError("provide the luganda name");
      setShowError(true);
    } else {
      try {
        const data = {
          audioURL,
          description,
          surahIndex: Number(surahIndex),
          surahName,
          englishName,
          lugandaName,
          fileSize: Number(fileSize),
          verses: Number(verses),
          location,
          audioName
        };

        if (isEdit) {
          const surahRef = doc(db, "surah", editId);

          updateDoc(surahRef, data).then(() => {
            setLoading(true);
            handleClose();
          });

          setSuccess("Successfully edited");
        } else {
          await addDoc(collection(db, "surah"), data);

          handleClose();

          setSuccess("Successfully added");
        }

        Swal.fire({
          icon: "success",
          title: "Operation successful",
          text: `Surah has been successfully ${isEdit ? "edited" : "created"}`,
          confirmButtonColor: "#16a34a",
          confirmButtonText: "Ok"
        });

        setLoading(true);

        setSuccess("Success", "surah uploaded successfully");

        setTimeout(() => {
          setSuccess("");
          setLoading(false);
          setAudioURL("");
          setDescription("");
          setEnglishName("");
          setLugandaName("");
          setSurahName("");
          setSurahIndex(null);
          setFileSize(null);
          setLocation("");
          setVerses(null);
          setAudioName("");
          setUploadProgress(null);
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
            <Box sx={{ marginY: 1, display: "flex", flexDirection: "row" }}>
              {" "}
              <TextField
                id="outlined-basic"
                label="Surah Index"
                variant="outlined"
                value={surahIndex}
                size="small"
                onChange={(e) => {
                  setSurahIndex(e.target.value);
                }}
              />
              <TextField
                id="outlined-basic"
                label="File Size"
                variant="outlined"
                value={fileSize}
                size="small"
                onChange={(e) => {
                  setFileSize(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 1 }}>
              {" "}
              <TextField
                fullWidth
                id="outlined-basic"
                label="Surah Name"
                variant="outlined"
                value={surahName}
                size="small"
                onChange={(e) => {
                  setSurahName(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 1, display: "flex", flexDirection: "row" }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Luganda Name"
                variant="outlined"
                value={lugandaName}
                size="small"
                onChange={(e) => {
                  setLugandaName(e.target.value);
                }}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="English Name"
                variant="outlined"
                value={englishName}
                size="small"
                onChange={(e) => {
                  setEnglishName(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 1, display: "flex", flexDirection: "row" }}>
              {" "}
              <TextField
                fullWidth
                id="outlined-basic"
                label="Number of verses"
                variant="outlined"
                value={verses}
                size="small"
                onChange={(e) => {
                  setVerses(e.target.value);
                }}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Location"
                variant="outlined"
                value={location}
                size="small"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 1 }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Audio URL"
                variant="outlined"
                value={audioURL}
                onChange={(e) => {
                  setAudioURL(e.target.value);
                }}
              />

              <Box sx={{ marginY: 2 }}>
                <InputLabel sx={{ marginBottom: 1, fontWeight: "600" }}>
                  Quran File
                </InputLabel>
                <div>
                  <div className="grid gap-5">
                    <input
                      onChange={(e) => handleUpload(e)}
                      className="px-4 py-2 focus:border focus:border-blue-500"
                      type="file"
                      id="audioFile"
                      name="audio"
                      accept="audio/*"
                    />
                  </div>

                  {uploading && (
                    <div className="outerbar">
                      <CircularProgress
                        variant="determinate"
                        value={uploadProgress}
                      />
                    </div>
                  )}

                  {audioURL && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="">{audioName}</span>
                      </div>

                      <audio controls>
                        <source src={audioURL} type="audio/mpeg" />
                        <source src={audioURL} type="audio/mp4" />
                        <source src={audioURL} type="audio/m4a" />
                        <source src={audioURL} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </Box>
            </Box>

            <Box sx={{ marginY: 1 }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Description"
                variant="outlined"
                value={description}
                multiline
                maxRows={6}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                size="small"
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
