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

import { handleConfirmSignUp } from "src/lib/cognitoActions";


export default function ConfirmEmailView() {

  const [formData, setFormData] = useState({
    email: '',
    code: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const theme = useTheme();

  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   const handleSubmit = async (e) => {
    console.log("handleSubmit (confirm) triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleConfirmSignUp(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      router.push("/login");
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email Address" value={formData.email}
          onChange={handleInputChange}
          required />
        <TextField name="code" label="Verification Code"  value={formData.code}
          onChange={handleInputChange}
          required />
      </Stack>
      <br/>
      <ConfirmButton isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
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
          <Typography variant="h4">Confirm your Email</Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Make sure to check your junk folder!
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}

function ConfirmButton({ isSubmitting, handleSubmit }) {
  return (
    <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isSubmitting}  // Show loading indicator while submitting
        disabled={isSubmitting}  // Disable button while submitting
        onClick={handleSubmit}
      >
        Confirm
    </LoadingButton>
  );
}
