<!-- PROJECT LOGO -->

<div align="center">
  <a href="https://github.com/bkctrl/uwmun">
    <img src="https://simplyeconomics.s3.ca-central-1.amazonaws.com/simplyeconomics-logo.png" alt="Logo" width="110" height="110">
  </a>

<h3 align="center">SimplyEconomics</h3>

  <p align="center">
    A full-stack economics dashboard and discussions forum, powered by AWS services and World Bank REST API.
<br /><br />
    
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
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



<!-- SETTING UP THE DATABASE -->
## Setting Up the Userbase, Signups and Logins with Amazon Cognito + AWS Amplify

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

