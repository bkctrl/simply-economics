import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      loginWith: {
        oauth: {
          redirectSignIn: [
            "http://localhost:3030/",
          ],
          redirectSignOut: [
            "http://localhost:3030/",
          ],
          domain: `${import.meta.env.VITE_COGNITO_DOMAIN}`,
          scopes: ['email', 'openid', 'profile'],
          responseType: 'code'
        },
      },
      userPoolId: `${import.meta.env.VITE_USER_POOL_ID}`,
      userPoolClientId: `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`
    },
  },
});

export default function ConfigureAmplifyClientSide() {
  return null;
}
