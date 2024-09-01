import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import ConfigureAmplifyClientSide from 'src/amplify-cognito-config';
import { UserProvider, useUser } from 'src/UserContext'; 
import { CircularProgress } from '@mui/material';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <ConfigureAmplifyClientSide />
      <UserProvider>
        <MainContent />
      </UserProvider>
    </ThemeProvider>
  );
}

function MainContent() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  return <Router />;
}
