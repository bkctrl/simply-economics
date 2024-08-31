"use client";

import { useState } from 'react';
import { Box } from '@mui/material';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { handleSignUp } from "src/lib/cognitoActions";

export default function SignupView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleSignUp(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toLoginPage = () => {
    router.push('/login');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Enter your name" value={formData.name}
          onChange={handleInputChange}
          required />
        <TextField name="email" label="Email address" value={formData.email}
          onChange={handleInputChange}
          required />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <br/>
      <SignUpButton isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.7),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
          width: { xs: 132, md: 264 }, 
          height: { xs: 23.5, md: 47 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Welcome to SimplyEconomics!</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already a member?
            <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer'}} onClick={toLoginPage}>
              Log In
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}

function SignUpButton({ isSubmitting, handleSubmit }) {
  return (
    <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isSubmitting}  
        disabled={isSubmitting} 
        onClick={handleSubmit}
      >
        Sign Up
    </LoadingButton>
  );
}
