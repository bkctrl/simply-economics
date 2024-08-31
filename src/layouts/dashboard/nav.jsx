/* eslint-disable perfectionist/sort-imports */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import SvgColor from 'src/components/svg-color';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useResponsive } from 'src/hooks/use-responsive';
import { account } from 'src/_mock/account';
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NAV } from './config-layout';
import { handleSignOut } from "src/lib/cognitoActions";
import { useRouter } from 'src/routes/hooks';
import { useUser } from 'src/UserContext';
import 'aws-amplify/auth/enable-oauth-listener';

export default function Nav({ openNav, onCloseNav }) {
  const { user, attributes, isLoggedIn, loading } = useUser();

  const pathname = usePathname();
  const upLg = useResponsive('up', 'lg');
  const router = useRouter();

  const toLoginPage = () => {
    router.push('/login');
  };

  const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  );

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
  
  const navConfig = [
    {
      title: 'Home',
      path: '/',
      icon: icon('ic_home'),
    },
    {
      title: 'Profile',
      path: '/user',
      icon: icon('ic_user'),
    },
    {
      title: 'Country Data',
      path: '/countries',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Discussions',
      path: '/blog',
      icon: icon('ic_discussions'),
    },
    {
      title: isLoggedIn ? "Logout" : "Login",
      icon: icon('ic_lock'),
      onClick: isLoggedIn ? handleLogout : toLoginPage,
    }
  ];

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={isLoggedIn? attributes.picture : "https://simplyeconomics.s3.ca-central-1.amazonaws.com/placeholder-pfp.jpg"} alt="photoURL" sx={{border: `solid 2px darkgray`}}/>

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{(isLoggedIn && attributes) ? attributes.name : "Not Logged In"}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
        bgcolor: 'white',
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  return (
    <ListItemButton
      component={item.onClick ? 'button' : RouterLink} 
      href={!item.onClick ? item.path : undefined} 
      onClick={item.onClick && item.onClick} 
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
