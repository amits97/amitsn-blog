require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const config = require("../config").default;
const axios = require("axios").default;

async function generateSitemap() {
  try {
    const posts = await axios.get(config.apiGateway.URL + "/posts");
    let idMap = [];

    for (var i = 0; i < posts.data.length; i++) {
      idMap.push({ id: posts.data[i].postId });
    }

    const paramsConfig = {
      "/blog/:id": idMap,
    };

    return new Sitemap(router)
      .applyParams(paramsConfig)
      .build("https://www.amitsn.com")
      .save("./public/sitemap.xml");
  } catch (e) {
    console.log(e);
  }
}

generateSitemap();
