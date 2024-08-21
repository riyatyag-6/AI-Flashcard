"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  CardActionArea,
  Button,
  Box,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  console.log("Current flashcards state:", flashcards);

  if (!isLoaded && !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (setName) => {
    console.log("Clicked set name:", setName);
    router.push(`/flashcard?id=${setName}`);
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: orange[600] }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
        <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: orange[700] }}
          >
            Flashcards Set
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {flashcards &&
            Array.isArray(flashcards) &&
            flashcards.map((flashcard, index) => {
              const setName =
                typeof flashcard === "string" ? flashcard : flashcard.setName;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: orange[50],
                      boxShadow: 3,
                    }}
                  >
                    <CardActionArea onClick={() => handleCardClick(setName)}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ textAlign: "center", color: orange[800] }}
                        >
                          {setName}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}
