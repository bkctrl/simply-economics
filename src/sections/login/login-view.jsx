import { useState } from 'react';
import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
import { handleSignIn } from "src/lib/cognitoActions";
import { signInWithRedirect } from "aws-amplify/auth";
import 'aws-amplify/auth/enable-oauth-listener';


// import { Auth } from 'aws-amplify';

const handleGoogleSignIn = async () => {
  try {
    await Auth.federatedSignIn({ provider: 'Google' });
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
};

// ----------------------------------------------------------------------

export default function LoginView() {
  const [formData, setFormData] = useState({
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
      await handleSignIn(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    router.push('/dashboard');
  };

  const toSignupPage = () => {
    router.push('/signup');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
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
      <LoginButton isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
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
          <Typography variant="h4">Sign in to SimplyEconomics</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don&apos;t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={toSignupPage}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={() => signInWithRedirect({ provider: "Google" })}
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16), height: '40px' }}
            >
              <Iconify icon="flat-color-icons:google" />
              <Typography class="gsi-material-button-contents" className={{fontSize : "20px"}}>&nbsp;&nbsp;&nbsp;&nbsp;Sign in with Google</Typography>
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}

function LoginButton({ isSubmitting, handleSubmit }) {
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
        Login
    </LoadingButton>
  );
}

