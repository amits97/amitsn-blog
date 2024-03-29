## AMITSN
Source code for my personal website / blog: https://www.amitsn.com

> This project is a `create-react-app` application which communicates with a [serverless](https://serverless.com/) backend. Powered by AWS Services and Prerender.io for SEO benefits.

At a high level, this is how the project is split:
* **Backend API** - Managed by serverless. Uses AWS Lambda over API Gateway to fetch data from DynamoDB.
* **Frontend React Application** - All React frontend assets (HTML, CSS and JS from your npm build command) on AWS S3. Served using CloudFront.
* **Middleware** - Lambda@Edge on CloudFront which contains logic to send crawlers to cached prerender.io pages.

## Running Locally
* Clone the repository using: `git clone https://github.com/amits97/amitsn-blog.git`
* Change into the cloned directory: `cd amitsn-blog`
* Install required dependencies: `npm install`
* Start local server: `npm start`

## Commands
### Frontend (root `/` folder)
* `npm start` to run project locally after installing all dependencies using `npm install`.
* `npm run sitemap` to run sitemap generator which generates updated sitemap.xml in public folder.
* `npm run deploy` to create new sitemap.xml and deploy all changes to S3 bucket and invalidate CloudFront cache. Version number updates are handled automatically.

### Backend (`api/` folder)
* `serverless deploy` to deploy new API changes after installing all dependencies using `npm install`.
* `serverless deploy -f function-name` to deploy specific functions.
