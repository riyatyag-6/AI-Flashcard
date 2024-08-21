import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { orange} from '@mui/material/colors';
export default function SignUpPage() {
  // ... (component body)



  return(
    <Container maxWidth="100vm">
  <AppBar position="static" sx={{ backgroundColor: orange[500] }}>
  <Toolbar>
    <Typography variant="h6" sx={{flexGrow: 1}}>
      Flashcard SaaS
    </Typography>
    <Button color="inherit">
      <Link href="/api/sign-in" passHref style={{ color: 'white'}}>
        Login
      </Link>
    </Button>
    <Button color="inherit">
      <Link href="/api/sign-up" passHref style={{ color: 'white'}}>
        Sign Up
      </Link>
    </Button>
  </Toolbar>
</AppBar>

<Box
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  sx={{textAlign: 'center', my: 4}}
>
  <Typography variant="h4" component="h1" gutterBottom>
    Sign In
  </Typography>
  <SignIn />
</Box>

</Container>


  );
}