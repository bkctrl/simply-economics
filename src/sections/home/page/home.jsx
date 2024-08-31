import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useUser } from 'src/UserContext';
import 'aws-amplify/auth/enable-oauth-listener';
import { fetchEconomicData } from "src/backend/country-data";
import Flag from 'react-flagkit';
import AppWidgetSummary from 'src/sections/countries/app-widget-summary';
import { useRef, useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import PostCard from 'src/sections/blog/post-card';
import { useRouter } from 'src/routes/hooks';
import { CircularProgress } from '@mui/material';
import AOS from 'aos';

export default function HomeView() {
  
  const { user, attributes, isLoggedIn, loading } = useUser();
  const country = "CA";
  const year = 2023;
  const [countryData, setCountryData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const abortControllerRef = useRef(null);
  const router = useRouter();
  let varNum = 1;

  const handleTitleClick = () => {
    console.log("handleTItleClick trigerred")
    router.push("/blog");
  }

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
      return `$${(absNum / 1.0e+12).toFixed(2)} T`;
    } else if (absNum >= 1.0e+9) {
      return `$${(absNum / 1.0e+9).toFixed(2)} B`;
    } else if (absNum >= 1.0e+6) {
      return `$${(absNum / 1.0e+6).toFixed(2)} M`;
    } else if (absNum >= 1.0e+3) {
      return `$${(absNum / 1.0e+3).toFixed(2)} K`;
    } else {
      return `$${absNum.toFixed(2)}`;
    }
  };

  useEffect(() => {
    AOS.init();
    const fetchData = async () => {
      if (abortControllerRef.current) {
        console.log('Aborting previous fetch');
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setDataLoading(true);
      try {
        const data = await fetchEconomicData("CA", year, abortController.signal);
        if (!abortController.signal.aborted) {
          setCountryData(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log(`Fetch aborted for Country Data`);
        } else {
          console.error('Error fetching economic data:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setDataLoading(false);
        }
      }
    };

    const fetchPosts = async () => {
      try {
        console.log("Home page launched");
        console.log("RDS API URL: ", import.meta.env.VITE_RDS_APIURL);
        const response = await fetch(`${import.meta.env.VITE_RDS_APIURL}/posts`, { method: 'GET' });
        if (response.ok) {
          const allPosts = await response.json();
          setPosts(allPosts.slice(0, 2)); // Get the two newest posts

          if (isLoggedIn) {
            const userSpecificPosts = allPosts.filter(post => post.author_user_id === user.userId);
            setUserPosts(userSpecificPosts.slice(0, 2)); // Get the user's two newest posts
          }
        } else {
          console.error('Failed to fetch posts:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchData();
    fetchPosts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isLoggedIn, (user) ? user.userId : null]);

  return (
    <Container maxWidth="xl">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
      {loading ? (
        <Typography variant="h4" sx={{ mb: 5 }}>
          Loading...
        </Typography>
      ) : (
        <div>
          <Typography variant="h3" sx={{ mb: 5, top: 0, position: 'relative' }} style={{ paddingTop: -3 }}>
            {isLoggedIn ? (
              <p data-aos="fade-right" data-aos-duration="1000">Welcome back, {attributes.name} 👋</p>
            ) : (
              <p>Login to View Your Dashboard!</p>
            )}
          </Typography>

          {/* Key Economic Data Section */}
          <Typography variant="h4" sx={{ mb: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Key Economic Data for Canada &nbsp; <Flag country='CA' style={{ width: '2.4rem', height: 'auto', borderRadius: '0.3rem', overflow: 'hidden'}} />
            </div>
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
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
          </Grid>

          {/* New Posts Section */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  New Posts
                </div>
                {(posts.length > 1) ? (
                <div style={{ display: 'flex', alignItems: 'center', maxWidth: '100%'}}>
                  <div style={{ paddingTop: "2rem", paddingRight: "1rem" , flex: '0 0 51%', }} data-aos="zoom-in" aos-duration="1500">
                    <PostCard
                      post={{
                        cover: `/assets/images/covers/cover_${Math.floor(Math.random() * 24) + 1}.jpg`,
                        ...posts[0],
                      }}
                      onTitleClick={() => handleTitleClick()}
                      index={4}
                    />
                  </div>
                  <div style={{ paddingTop: "2rem", flex: '0 0 49%' }} data-aos="zoom-in" aos-duration="1500">
                    <PostCard
                      post={{
                        cover: `/assets/images/covers/cover_${Math.floor(Math.random() * 24) + 1}.jpg`,
                        ...posts[1],
                      }}
                      onTitleClick={() => handleTitleClick()}
                      index={4}
                    />
                  </div>
                </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '10rem'}}>
                    <CircularProgress />
                  </div>
                )}
              </Typography>
            </div>

            {/* User's Posts Section */}            
            <div style={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Your Posts
                </div>
                {isLoggedIn ? (
                  userPosts.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
                      {userPosts.map((post, index) => (
                        <div
                          key={index}
                          style={{
                            paddingTop: "2rem",
                            paddingRight: index === 0 ? "1rem" : "0",
                            flex: index === 0 ? '0 0 51%' : '0 0 49%',
                          }}
                          data-aos="zoom-in"
                          aos-duration="1500"
                        >
                          <PostCard
                            post={{
                              ...post,
                              cover: `/assets/images/covers/cover_${Math.floor(Math.random() * 24) + 1}.jpg`,
                            }}
                            onTitleClick={() => handleTitleClick()}
                            index={4}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ paddingTop: '10rem', textAlign: 'center', width: '100%' }}>
                      <h4>Add your first post!</h4>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      width: '100%',
                      paddingTop: '10rem',
                    }}
                  >
                    <h4>Login to view your posts!</h4>
                  </div>
                )}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
