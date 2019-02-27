## Serverless SPA for amitsn.com
This is the source code for my personal website / blog: amitsn.com

At a high level, this is how the project is split:
* **Backend API** - Managed by serverless. Uses AWS Lambda over API Gateway to fetch data from DynamoDB.
* **Frontend React Application** - All React frontend assets (HTML, CSS and JS from your npm build command) on AWS S3. Served using CloudFront.
* **Middleware** - Lambda@Edge on CloudFront which contains logic to send crawlers to cached prerender.io pages.

### Commands
On `api/` folder:
* `serverless deploy` to deploy new API changes after installing all dependencies using `npm install`.
* `serverless deploy function -f list` to deploy specific functions.

On root `/` folder:
* `npm start` to run project locally after installing all dependencies using `npm install`.
* `npm run sitemap` to run sitemap generator which generates updated sitemap.xml in public folder.
* `npm run deploy` to create new sitemap.xml and deploy all changes to S3 bucket and invalidate CloudFront cache.
