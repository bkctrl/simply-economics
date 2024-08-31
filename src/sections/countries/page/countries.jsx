import Flag from 'react-flagkit';
import { useRef, useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { years, countries, fetchSectors, fetchEconomicData, fetchGdpPerCapitaTimeSeries } from "src/backend/country-data";

import GDPPerCapita from '../graph';
import EconomicSectors from '../pie-chart';
import CountrySelect from './countrySelect';
import AppWidgetSummary from '../app-widget-summary';


export default function AppView() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedYear, setYear] = useState(years[0]);
  const [countryData, setCountryData] = useState([]);
  const [sectorData, setSectorData] = useState({});
  const [countryPerCapitaGDP, setCountryPerCapitalGDP] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const getCountryDataByKey = (data, key) => {
    try {
      const item = data.find(obj => obj.key === key);
      return item ? item.data.value ?? 'No data available' : 'No data available';
    } catch (err) {
      console.log(err);
      return 'No data available';
    }
  };

  const formatGDP = (num) => {
    if (num === 'No data available') return num;
    const parsedNum = typeof num === 'number' ? num : parseFloat(num);
    const absNum = Math.abs(parsedNum);
    if (absNum >= 1.0e+12) {
      return `$${  (absNum / 1.0e+12).toFixed(2)  } T`;
    } if (absNum >= 1.0e+9) {
      return `$${  (absNum / 1.0e+9).toFixed(2)  } B`;
    } if (absNum >= 1.0e+6) {
      return `$${  (absNum / 1.0e+6).toFixed(2)  } M`;
    } if (absNum >= 1.0e+3) {
      return `$${  (absNum / 1.0e+3).toFixed(2)  } K`;
    } 
      return `$${  absNum.toFixed(2)}`;
    
  };

  useEffect(() => {
    const fetchData = async () => {
      if (abortControllerRef.current) {
        console.log('Aborting previous fetch');
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setLoading(true);
      try {
        const data = await fetchEconomicData(selectedCountry.value, selectedYear.value, abortController.signal);
        const sectors = await fetchSectors(selectedCountry.value);
        const dataPerCapitaGDP = await fetchGdpPerCapitaTimeSeries(selectedCountry.value, abortController.signal);
        if (!abortController.signal.aborted) {
          setCountryData(data);
          setSectorData(sectors);
          setCountryPerCapitalGDP(dataPerCapitaGDP);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log(`Fetch aborted for ${selectedCountry.label}`);
        } else {
          console.error('Error fetching economic data:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedCountry, selectedYear]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}> 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Flag country={selectedCountry.value} style={{ width: '2.4rem', height: 'auto', borderRadius: '0.3rem', overflow: 'hidden'}} /> 
            &nbsp; {selectedCountry.label}
            {loading && <div className='font-semibold'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><CircularProgress /></span>
            </div>} 
          </div>
          <div style={{ display : 'flex', gap : '1rem' }}>
            <CountrySelect data={years}
                           selectedData={selectedYear} 
                           setSelectedData={setYear} 
                           withFlags={false} 
                           width={122}
                           message="Select a year"/>
            <CountrySelect data={countries} 
                           selectedData={selectedCountry} 
                           setSelectedData={setSelectedCountry} 
                           withFlags={true} 
                           width={250}
                           message="Select a country"/>
          </div>
        </div>
      </Typography> 
      {loading && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '10rem'}}>
        <h1>Loading ...</h1>
      </div>}
      {!loading &&
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Population"
            haveDollarSign={false}
            havePercentageSign={false}
            total={getCountryDataByKey(countryData, "population")}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_people.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="GDP (Nominal)"
            isBIG={true}
            total={formatGDP(getCountryDataByKey(countryData, "gdp"))}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_fly_money.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="GDP (PPP)"
            isBIG={true}
            total={formatGDP(getCountryDataByKey(countryData, "gdpPPP"))}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_banknotes.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="GDP (PPP) Per Capita"
            haveDollarSign={true}
            havePercentageSign={false}
            total={getCountryDataByKey(countryData, "gdpPPPPerCapita")}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_moneybag.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <GDPPerCapita
            title="GDP Per Capita (Current US$)"
            subheader={getCountryDataByKey(countryData, "gdpPerCapita")}
            chart={{
              labels: countryPerCapitaGDP.filter(item => item.date).map(item => item.date.substring(0, 4)),
              series: [
                {
                  name: "GDP Per Capita",
                  type: 'area',
                  fill: 'gradient',
                  data: countryPerCapitaGDP.filter(item => item.date).map(item => item.value),
                }
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EconomicSectors
            title="Sectors by % of GDP (2020)"
            chart={{
              series: [
                { label: 'Industry', value: sectorData.industry },
                { label: 'Services', value: sectorData.services },
                { label: 'Others', value: 100 - sectorData.agriculture - sectorData.industry - sectorData.services },
                { label: 'Agriculture', value: sectorData.agriculture },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Imports"
            isBIG={true}
            total={formatGDP(getCountryDataByKey(countryData, "imports"))}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_box.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Exports"
            isBIG={true}
            total={formatGDP(getCountryDataByKey(countryData, "exports"))}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_airplane_departure.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Inflation (CPI)"
            haveDollarSign={false}
            havePercentageSign={true}
            total={getCountryDataByKey(countryData, "inflation")}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ice_glass_increasing.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Unemployment"
            haveDollarSign={false}
            havePercentageSign={true}
            total={getCountryDataByKey(countryData, "unemployment")}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_briefcase.png" />}
          />
        </Grid>

      </Grid>
      } 
    </Container>
  );
}

