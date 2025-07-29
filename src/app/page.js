'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Avatar,
  Link,
  Stack,
  Alert,
} from '@mui/material';

import VerifiedIcon from '@mui/icons-material/Verified';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const features = [
  {
    icon: <AnalyticsIcon color="primary" sx={{ fontSize: 50 }} aria-label="Advanced QQL Analysis Icon" />,
    title: 'Advanced QQL Analysis',
    description:
      'Leverage cutting-edge AI technology to analyze complex QQL datasets with precision and speed.',
  },
  {
    icon: <ChatBubbleOutlineIcon color="primary" sx={{ fontSize: 50 }} aria-label="AI Chatbot Assistance Icon" />,
    title: 'AI Chatbot Assistance',
    description:
      'Interact with an intelligent AI chatbot designed to guide you through the analysis process and answer your questions instantly.',
  },
  {
    icon: <VerifiedIcon color="primary" sx={{ fontSize: 50 }} aria-label="Reliable & Secure Icon" />,
    title: 'Reliable & Secure',
    description:
      'Your data privacy is our priority. Our platform is built with robust security measures and complies with all relevant standards.',
  },
];

const testimonials = [
  {
    name: 'Dr. Sarah Williams',
    role: 'Data Scientist',
    quote:
      'Medlinguitis transformed how I analyze QQL data. The AI chatbot is like having an expert at my side 24/7.',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'John Carter',
    role: 'Research Analyst',
    quote:
      'The platform’s speed and accuracy are outstanding. It saved me weeks of manual data processing.',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Emily Nguyen',
    role: 'Graduate Student',
    quote:
      'A must-have tool for anyone working with QQL data. The interface is intuitive and the support is fantastic!',
    avatar:
      'https://randomuser.me/api/portraits/women/45.jpg',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'primary.dark',
          color: 'common.white',
          py: { xs: 10, md: 20 },
          textAlign: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(13, 71, 161, 0.75)',
            zIndex: 1,
          }}
          aria-hidden="true"
        />
        <Container sx={{ position: 'relative', zIndex: 2, maxWidth: 'md' }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Welcome to Medlinguitis
          </Typography>
          <Typography variant="h6" mb={6}>
            Revolutionizing QQL analysis with powerful AI tools and chatbot assistance — simplifying your research journey.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            maxWidth={400}
            mx="auto"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => router.push('/login')}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              fullWidth
              aria-label="Login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => router.push('/signup')}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              fullWidth
              aria-label="Signup"
            >
              Signup
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={8} color="primary.dark">
          Why Choose Medlinguitis?
        </Typography>
     <Grid container spacing={4} alignItems="stretch" justifyContent="center">
  {features.map(({ icon, title, description }, i) => (
    <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: 'flex' }}>
      <Card
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: 4,
          py: 6,
          boxShadow: 3,
          '&:hover': { boxShadow: 6, transform: 'translateY(-6px)', transition: '0.3s' },
        }}
      >
        {icon}
        <Typography variant="h6" fontWeight="medium" mt={3} mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Card>
    </Grid>
  ))}
</Grid>


      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'primary.light', py: 12 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight="bold" mb={8} color="primary.dark">
            What Our Users Say
          </Typography>
      <Grid container spacing={4} alignItems="stretch" justifyContent="center">
  {testimonials.map(({ name, role, quote, avatar }, i) => (
    <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: 'flex' }}>
      <Card
        sx={{
          flexGrow: 1,
          px: 3,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 2,
          '&:hover': { boxShadow: 5, transform: 'translateY(-4px)', transition: '0.3s' },
        }}
      >
        <Typography variant="body1" fontStyle="italic" mb={3}>
          “{quote}”
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={avatar} alt={`${name} avatar`} sx={{ width: 56, height: 56, border: 2, borderColor: 'primary.light' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" color="primary.main">
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Grid>
  ))}
</Grid>


        </Container>
      </Box>

      {/* Newsletter Section */}
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Typography variant="h5" align="center" fontWeight="bold" mb={3} color="primary.dark">
          Stay Updated
        </Typography>
        <Typography variant="body1" align="center" mb={5} color="text.secondary">
          Subscribe to our newsletter to get the latest news and updates about Medlinguitis.
        </Typography>

        {subscribed ? (
          <Alert severity="success" sx={{ mb: 4 }}>
            Thanks for subscribing! You will receive updates from us.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="email"
              required
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              aria-label="Email Address"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </Button>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ userSelect: 'none' }}>
            &copy; {new Date().getFullYear()} Medlinguitis. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="https://twitter.com/"
              target="_blank"
              rel="noopener"
              aria-label="Twitter"
              color="inherit"
              sx={{ '&:hover': { color: 'secondary.light' } }}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.005.959-3.127 1.184-.897-.959-2.178-1.555-3.594-1.555-2.717 0-4.92 2.206-4.92 4.917 0 .39.045.765.127 1.124-4.083-.205-7.702-2.158-10.126-5.134-.423.723-.666 1.562-.666 2.475 0 1.708.87 3.215 2.188 4.099-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.85.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.418-1.68 1.316-3.809 2.1-6.102 2.1-.397 0-.788-.023-1.17-.067 2.189 1.394 4.768 2.207 7.557 2.207 9.054 0 14-7.5 14-14 0-.213 0-.425-.015-.637.961-.695 1.8-1.562 2.46-2.549z" />
              </svg>
            </Link>
            <Link
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              color="inherit"
              sx={{ '&:hover': { color: 'secondary.light' } }}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.938v5.668H9.353V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.367-1.852 3.6 0 4.266 2.367 4.266 5.451v6.292zM5.337 7.433a2.06 2.06 0 1 1 0-4.121 2.06 2.06 0 0 1 0 4.12zM7.119 20.452H3.554V9h3.565v11.452z" />
              </svg>
            </Link>
            <Link
              href="https://facebook.com/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              color="inherit"
              sx={{ '&:hover': { color: 'secondary.light' } }}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24h11.495v-9.294H9.692v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.312h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.324-.593 1.324-1.326V1.326C24 .593 23.407 0 22.676 0z" />
              </svg>
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
