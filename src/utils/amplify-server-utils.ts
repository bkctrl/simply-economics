import { authConfig } from 'src/amplify-cognito-config';
import { createServerRunner } from "@aws-amplify/adapter-nextjs";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
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
            domain: 'simplyeconomics.auth.ca-central-1.amazoncognito.com',
            scopes: ['email', 'openid', 'profile'],
            responseType: 'code'
          },
        },
        userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
        userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
      },
    },
  },
});
