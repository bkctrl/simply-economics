import { Helmet } from 'react-helmet-async';

import { ConfirmEmailView } from 'src/sections/confirm-email-view';

// ----------------------------------------------------------------------

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title> Confirm Email | SimplyEconomics </title>
      </Helmet>

      <ConfirmEmailView />
    </>
  );
}
