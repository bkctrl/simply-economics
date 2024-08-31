import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/page';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Home | SimplyEconomics </title>
      </Helmet>

      <HomeView />
    </>
  );
}
