import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Box } from '@mui/material';

import Link from '@mui/material/Link';
// import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        // width: 40,
        // height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img
        src="assets/simplyeconomics-full-logo.png"
        alt="Logo"
        style={{ width: '90%', height: '100%', paddingTop: '0.7rem', paddingBottom: '0.7rem'}}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
