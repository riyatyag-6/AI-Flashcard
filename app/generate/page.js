'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,Snackbar,Alert,
  Toolbar,
  Paper,
  CardActionArea,
} from "@mui/material";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { orange, deepOrange } from '@mui/material/colors';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const router = useRouter();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);


  const handleSubmit = async () => {
    fetch('/api/generate', {
      method: 'POST',
      body: text,
    })
    .then((res) => res.json())
    .then(data => setFlashcards(data))
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const saveFlashcards = async () => {
     
    if (!isLoaded || !isSignedIn) {
      setSnackbarOpen(true);
      return;
    }

    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    const batch = writeBatch(db);

    const userDocRef = doc(collection(db, "users"), user.id);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const collections = userDocSnap.data().flashcards || [];
      if (collections.find((f) => f.setName === setName)) {
        alert("Flashcard collection with that name already exists.");
        return;
      } else {
        collections.push(setName);
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ setName }] });
    }

    const collectionRef = collection(userDocRef, 'flashcards', setName, 'cards');
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(collectionRef);
      batch.set(cardDocRef, {
        front: flashcard.front,
        back: flashcard.back,
      });
    });

    await batch.commit();
    handleCloseDialog();
    router.push("/flashcards");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: orange[500] }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit" onClick={handleHomeClick} sx={{ mr: 2 }}>
            Home
          </Button>
          <SignedOut>
            <Button color="inherit" href="/api/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/api/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: orange[700] }}>
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: "100%", backgroundColor: orange[50] }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: deepOrange[500], '&:hover': { backgroundColor: deepOrange[700] } }}
              onClick={handleSubmit}
              fullWidth
            >
              Generate Flashcards
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: orange[700] }}>
              Generated Flashcards
            </Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: orange[50] }}>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: "1000px",
                            "& > div": {
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              position: "relative",
                              width: "100%",
                              height: "200px",
                              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                            },
                            "& > div > div:nth-of-type(2)": {
                              transform: "rotateY(180deg)",
                            },
                            "& > div > div": {
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 2,
                              boxSizing: "border-box",
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: deepOrange[500], '&:hover': { backgroundColor: deepOrange[700] } }}
                onClick={handleOpenDialog}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          You cannot save without logging in. Please login/sign up to save your flashcards.
        </Alert>
      </Snackbar>
    </>
  );
}
