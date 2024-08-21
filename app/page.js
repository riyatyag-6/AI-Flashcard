'use client';

import getStripe from "../utils/get.stripe";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Grid,
  Container,
} from "@mui/material";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { orange, deepOrange } from '@mui/material/colors';

export default function Home() {
  const handleSubmit = async (plan) => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const checkoutSessionJson = await checkoutSession.json();
    const stripe = await getStripe();

    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Easily create flashcards from text using AI" />
      </Head>
      <AppBar position="static" sx={{ backgroundColor: orange[500] }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
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
      <Container>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: orange[700] }}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your AI-powered flashcard generator.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: deepOrange[500], '&:hover': { backgroundColor: deepOrange[700] } }}
            href="/generate"
          >
            Get Started
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h3" component="h2"  gutterBottom >
            Features
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box sx={{ padding: 2, backgroundColor: orange[50], borderRadius: 2 }}>
              <Typography variant="h6">Easy Text Input</Typography>
              <Typography>
                Simply input your text and let our software do the rest.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ padding: 2, backgroundColor: orange[50], borderRadius: 2 }}>
              <Typography variant="h6">Smart Flashcards</Typography>
              <Typography>
                Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ padding: 2, backgroundColor: orange[50], borderRadius: 2 }}>
              <Typography variant="h6">Accessible Anywhere</Typography>
              <Typography>
                Access your flashcards from any device at any time. Study on the go with ease.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h3" component="h2" gutterBottom >
            Subscription Plans
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: orange[200],
                  borderRadius: 2,
                  backgroundColor: orange[50],
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Basic Plan
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5/month
                </Typography>
                <Typography>
                  Access to AI-powered flashcards and basic customization options. Limited storage and cloud sync.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: deepOrange[500], '&:hover': { backgroundColor: deepOrange[700] } }}
                  onClick={() => handleSubmit("basic")}
                >
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: orange[200],
                  borderRadius: 2,
                  backgroundColor: orange[50],
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Pro Plan
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $10/month
                </Typography>
                <Typography>
                  Unlock all features including unlimited flashcards, full customization, advanced study modes, and priority support.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: deepOrange[500], '&:hover': { backgroundColor: deepOrange[700] } }}
                  onClick={() => handleSubmit("pro")}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
