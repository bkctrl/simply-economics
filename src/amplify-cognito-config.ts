// "use client"

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
          domain: `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}`,
          scopes: ['email', 'openid', 'profile'],
          responseType: 'code'
        },
      },
      userPoolId: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`,
      userPoolClientId: `${process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID}`
    },
  },
});

export default function ConfigureAmplifyClientSide() {
  return null;
}
