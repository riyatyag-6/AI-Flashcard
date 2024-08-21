'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
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
  Box
} from "@mui/material";
import { orange, deepOrange } from '@mui/material/colors';
import { db } from "@/firebase";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const { isLoaded, isSignedIn, user } = useUser();
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(db, 'users', user.id, 'flashcards', search, 'cards');
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

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

      <Container maxWidth="100vw">
      <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: orange[700] }}
          >
            Saved Generated Flashcards 
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
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
      </Container>
    </>
  );
}
