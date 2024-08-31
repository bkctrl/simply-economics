import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import 'aws-amplify/auth/enable-oauth-listener';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function correctPicURL(url) {
    const s3UrlRegex = /^https:\/\/([^\.]+)\.s3\.[^\/]+\/(.+)$/;
    const match = url.match(s3UrlRegex);

    if (match) {
      const bucketName = match[1];
      const key = match[2];
      return `https://${bucketName}.s3.ca-central-1.amazonaws.com/${key}`;
    }

    return url;
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const session = await fetchAuthSession();
        console.log("Session:", session); // Debugging session

        if (session) {

          setIsLoggedIn(true);
          const currentUser = await getCurrentUser();
          console.log("User:", currentUser); // Debugging user data
          setUser(currentUser);

          const idTokenPayload = session.tokens.idToken.payload;
          const isGoogleUser = idTokenPayload['cognito:groups'] && idTokenPayload['cognito:groups'].some(group => group.includes('Google'))

          if (isGoogleUser) {
            // If the user logged in via Google, extract attributes directly from the token
            const userAttributes = {
              email: idTokenPayload.email,
              name: idTokenPayload.name,
              picture: idTokenPayload.picture,
            };
            console.log("Google User Attributes:", userAttributes);
            setAttributes(userAttributes);
          } else {
            console.log("Start fetching user attributes")
            const userAttributes = await fetchUserAttributes();
              const correctPictureUrl = correctPicURL(userAttributes.picture);
              userAttributes.picture = correctPictureUrl;
            console.log("Attributes:", userAttributes); // Debugging user data
            setAttributes(userAttributes);
          }

          
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, attributes, isLoggedIn, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
