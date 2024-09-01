import PropTypes from 'prop-types';
import AnimatedNumbers from "react-animated-numbers";
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from 'src/components/chart';

export default function GDPPerCapita({ title, subheader, chart, ...other }) {
  const { labels, series, options } = chart;

  const chartOptions = useChart({
    colors: ['#53c973'],
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(0)}`
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: (value) => {
          const date = new Date(value);
          return `${date.getFullYear()}`;
        },
      },
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `$${parseFloat(value.toString()).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader 
      title={title} 
      // subheader={subheader}
      subheader={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          $<AnimatedNumbers
            includeComma
            transitions={(index) => ({
              type: "spring",
              duration: index + 0.3,
            })}
            animateToNumber={typeof Number(subheader) === 'number' ? Number(subheader).toFixed(2) : 0}
            />
        </span>
      }
      titleTypographyProps={{ 
        color: 'textSecondary', 
        fontWeight: 'bold' 
      }}
      subheaderTypographyProps={{ 
          variant: 'h3', 
          color: 'textPrimary', 
          fontWeight: 'bold'
        }} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

GDPPerCapita.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
