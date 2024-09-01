import { Helmet } from 'react-helmet-async';
import { CountriesView } from 'src/sections/countries/page';

export default function CountriesPage() {
  return (
    <>
      <Helmet>
        <title> Countries | SimplyEconomics </title>
      </Helmet>

      <CountriesView />
    </>
  );
}
