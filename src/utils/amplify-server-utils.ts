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
            domain: `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}`,
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
