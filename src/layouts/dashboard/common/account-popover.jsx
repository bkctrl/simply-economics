import { useState } from 'react';
import { Box } from '@mui/material';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { account } from 'src/_mock/account';
import { handleSignOut } from "src/lib/cognitoActions";
import { useRouter } from 'src/routes/hooks';
import { useUser } from 'src/UserContext';
import 'aws-amplify/auth/enable-oauth-listener';

export default function AccountPopover() {
  const { user, attributes, isLoggedIn, loading } = useUser();
  const [open, setOpen] = useState(null);
  const router = useRouter();

  const toLoginPage = () => {
    router.push('/login');
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async (e) => {
    console.log("handleLogout triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleSignOut();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={isLoggedIn? attributes.picture : "https://simplyeconomics.s3.ca-central-1.amazonaws.com/placeholder-pfp.jpg"}
          alt="username"
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {(isLoggedIn && attributes) ? attributes.name : "username"}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {(isLoggedIn && attributes) ? attributes.name : "Not Logged In"}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {(isLoggedIn && attributes) ? attributes.email : ""}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
        <Box sx={{ p: 1 }}>
          <Button fullWidth color={isLoggedIn ? "error" : "primary"} size="medium" variant="text" onClick={isLoggedIn ? handleLogout : toLoginPage}>
          {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

