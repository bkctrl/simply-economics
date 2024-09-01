import PropTypes from 'prop-types';
import AnimatedNumbers from "react-animated-numbers";
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function AppWidgetSummary({ isBIG, haveDollarSign, havePercentageSign, title, total, icon, color = 'primary', sx, ...other }) {

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
      <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
        <Typography variant="h4">
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        {isBIG && total}
        {haveDollarSign && '$'}
        {!isBIG && 
          <AnimatedNumbers
            includeComma
            transitions={(index) => ({
              type: "spring",
              duration: index,
            })}
            animateToNumber={typeof Number(total) === 'number' ? Number(total).toFixed(2) : 0}
          />
        }
        {havePercentageSign && '%'}
        </span>
        </Typography>
        
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  haveDollarSign: PropTypes.bool,
  havePercentageSign: PropTypes.bool,
  isBIG: PropTypes.bool,
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
