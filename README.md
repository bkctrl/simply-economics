<a href=""><img src="https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge"></a>
<!-- PROJECT LOGO -->

<div align="center">
  <a href="https://github.com/bkctrl/uwmun">
    <img src="https://simplyeconomics.s3.ca-central-1.amazonaws.com/simplyeconomics-logo.png" alt="Logo" width="110" height="110">
  </a>

<h3 align="center">SimplyEconomics</h3>

  <p align="center">
    A full-stack economics dashboard and discussions forum, powered by AWS services <br/> and World Bank REST API.
<br /><br />

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
<br/>
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
    
<br />
    
   <a href="https://simplyeconomics.ca" target="_blank"><strong>🔗 VISIT ACTIVE WEBSITE »</strong></a>
    <br />
    <br />
  </p>
</div> 


<!-- ABOUT THE PROJECT -->
## About The Project

SimplyEconomics features an interactive economics dashboard integrating the World Bank API to make your economic discussions more convenient! With the ability to select the country you are interested in and the year, easily share your economic insights and discuss with other users.

This project makes use of various AWS services. Account logins and signups are powered by Amazon Cognito and AWS Amplify, while the database is set up on a PostgreSQL AWS RDS and the user data is on a S3 bucket.


### Screenshots

<img src="https://uwmun.s3.ca-central-1.amazonaws.com/uwmun-screenshots.png">
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To set up the project locally and get a local copy up and running:

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository: <br />
   ```sh
   git clone https://github.com/bkctrl/simplyeconomics.git
   ```
2. Navigate to the project directory & install the dependencies: <br />
   ```sh
   cd simplyeconomics && npm install
   ```
3. Install the dependencies for the backend API: <br />
   ```sh
   cd src/backend && npm install
   ```
4. Set up the environment variables. More information on each of them are given further below. Your `.env` file should consist of (with similar names):  <br />
   ```sh
    VITE_USER_POOL_ID=
    VITE_USER_POOL_CLIENT_ID=
    VITE_COGNITO_DOMAIN=
    VITE_RDS_USER=
    VITE_RDS_HOST=
    VITE_RDS_DATABASE=
    VITE_RDS_PASSWORD=
    VITE_RDS_PORT=
    VITE_RDS_APIURL=
    VITE_BUCKET_NAME=
    VITE_IAM_USER_KEY=
    VITE_IAM_USER_SECRET=
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SETTING UP THE DATABASE -->
## Implement an Economics Dashboard with World Bank API

### Prerequisites
* An AWS account with Administrator access

### API Setup & Usage
The World Bank API is used to fetch economic data of selected countries in selected years. 

1. Set up the data to fetch from the World Bank: 

```javascript
// src/backend/country-data.js
// Utilizing World Back REST API
const APIURL = `https://api.worldbank.org/v2/country`;

const indicators = {
  gdp: 'NY.GDP.MKTP.CD',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  gdpPPP: 'NY.GDP.MKTP.PP.CD',
  gdpPPPPerCapita: 'NY.GDP.PCAP.PP.CD',
  population: 'SP.POP.TOTL',
  imports: 'NE.IMP.GNFS.CD',
  exports: 'NE.EXP.GNFS.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS'
};

// country name codes list 
export const countries = [
  { value: 'CA', label: 'Canada' },
  { value: 'US', label: 'United States' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'DE', label: 'Germany' },
  ...
```

2. Fetch key data using the API: 

```javascript
// src/backend/country-data.js
export async function fetchEconomicData(countryCode, year) {
  try {
    const fetchPromises = Object.entries(indicators).map(async ([key, indicator]) => {
      const response = await fetch(`${APIURL}/${countryCode}/indicator/${indicator}?format=json&date=${year}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok for indicator ${indicator}`);
      }
      const data = await response.json();
      return { key, data: data[1] ? data[1][0] : null };
    });
    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    console.error('Fetch error:', error);
    return null
  }
}
```

3. Displaying fetched country data:

```javascript
// src/sections/countries/page/countries.jsx
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

```
Above is the frontend code displaying the first 3 values fetched. Similar code can be found in the source file. 

<!-- SETTING UP THE DATABASE -->
## Setting Up the Userbase, Signups and Logins with Amazon Cognito + AWS Amplify

1. Create a user pool on **Amazon Cognito.**

<img src="https://uwmun.s3.ca-central-1.amazonaws.com/uwmun-screenshots.png">

2. Take note of the **user pool ID**, **client ID**, and **Cognito domain**. These will be stored as environment variables.

```ruby
// .env
VITE_USER_POOL_ID='YOUR_USER_POOL_ID'
VITE_USER_POOL_CLIENT_ID='YOUR_USER_POOL_CLIENT_ID'
VITE_COGNITO_DOMAIN='USER_POOL.auth.REGION.amazoncognito.com'
```

3. Create functions to handle signups, confirming emails, logins, and logouts.

```typescript
// src/lib/cognitoActions.ts
export async function handleSignUp(formData: any) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.email),
      password: String(formData.password),
      options: {
        userAttributes: {
          email: String(formData.email),
          name: String(formData.name),
          picture: "https://simplyeconomics.s3.ca-central-1.amazonaws.com/placeholder-pfp.jpg"
        },
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  window.location.href = "/confirm-email";
}
// ... handleConfirmSignUp, handleSignIn, handleSignOut
```

4. Frontend Integration

```javascript
// src/sections/signup/signup-view.jsx
import { handleSignUp } from "src/lib/cognitoActions";

export default function SignupView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  ...

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit triggered");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await handleSignUp(formData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  ...

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Enter your name" value={formData.name}
          onChange={handleInputChange}
          required />
        <TextField name="email" label="Email address" value={formData.email}
          onChange={handleInputChange}
          required />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <br/>
      <SignUpButton isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
    </>
  );
```


## Storing User Data on a S3 Bucket and Implementing Profile Updates










### Prerequisites
* An AWS account with Administrator access

### Database Setup 
1. Navigate to [Notion](https://notion.so) and create a document.
2. Create a new database by typing `/database`.
3. Populate the database with appropriate data. The database(s) you create should be in these formats:
   ![](https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-1.png?)
4. Navigate to [Integrations](https://www.notion.so/profile/integrations) and create a Notion integration. Select the database you created. Select `Internal` or `Public` as appropriate and choose a logo. The UWMUN wesbite for instance uses an internal integration. 
5. Select appropriate capabilities. Then show the Internal Integration Secret. This would be the `NEXT_PUBLIC_NOTION_API_KEY` in your `.env.local`. **Do not share this with anyone!**
<br /><br />
  ![](https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-2.png?)
6. Find out your database ID. This is what precedes `?v=` of the link when you open the dabase in fulll screen:
   ```sh
   https://www.notion.so/<database_ID>?v=<view_ID>
   ```
This would be the `NEXT_PUBLIC_NOTION_EXECUTIVES_DATABASE_ID` or the ID of your specific database. The UWMUN website for instance has one for the executives database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- EMAIL FUNCTION -->
## Set Up an S3 Bucket for Profile Picture Storage
There are numerous options. This project uses **EmailJS** for its email submitting functionality. 
1. Take a look at EmailJS's [Getting Started](https://www.emailjs.com/docs/) page for detailed instructions.
2. Fill in the following in your `.env.local` file:
   ```sh
   NEXT_PUBLIC_EMAIL_API_KEY=
   NEXT_PUBLIC_EMAIL_SERVICE_ID=
   NEXT_PUBLIC_EMAIL_TEMPLATE_ID=
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONFIGURING BACKEND -->
## Set Up an AWS RDS Database with PostgreSQL for Posts and Comments Data
You could test the backend both locally or by using a deployed API. The following is on testing locally. 
1. Uncomment the commented-out code in `src/app/page.tsx` and `server/api/index.js` for local testing.
2. Navigate to `index.js` and run the server. Assuming you are at the root directory:
   ```sh
   cd server/api && nodemon index.js
   ```
3. Open a new terminal and run the frontend. On the new terminal:
   ```sh
   npm run dev
   ```
4. Navigate to `localhost:3000` on your browser and see the project demo!

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

The website automatically updates to the changes you make to the Notion document!

For instance:
<p align="center">
  <img alt="Light" src="https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-3-new.png?" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark" src="https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-4-new.png?" width="45%">
</p>

After making some changes:
<p align="center">
  <img alt="Light" src="https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-5-new.png?" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark" src="https://uwmun.s3.ca-central-1.amazonaws.com/notion-demo-6-new.png?" width="45%">
</p>

