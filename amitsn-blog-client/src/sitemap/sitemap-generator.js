require("babel-register")({
  presets: ["es2015", "react"]
});
 
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const AWSAmplify = require("aws-amplify");
const Amplify = AWSAmplify.default;
const API = AWSAmplify.API;
const config = require("../config").default;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "posts",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

async function generateSitemap() {
  try {
    const posts = await API.get("posts", "/posts");
    let idMap = [];

    for(var i = 0; i < posts.length; i++) {
      idMap.push({ id: posts[i].postId });
    }

    const paramsConfig = {
      "/blog/:id": idMap
    };

    return (
      new Sitemap(router)
          .applyParams(paramsConfig)
          .build("https://www.amitsn.com")
          .save("./public/sitemap.xml")
    );
  } catch(e) {
    console.log(e);
  } 
}

generateSitemap();