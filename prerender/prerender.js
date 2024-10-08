import { success, failure, redirect, custom } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";

const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const axios = require("axios").default;
const { XMLParser } = require("fast-xml-parser");

function lessThanOneDayAgo(date) {
  date = parseInt(date);
  const DAY = 1000 * 60 * 60 * 24;
  const aDayAgo = Date.now() - DAY;
  return date > aDayAgo;
}

async function dynamoDbCache(targetUrl) {
  const params = {
    TableName: "AmitsnBlogPrerender",
    Key: {
      url: targetUrl,
    },
  };

  try {
    let result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      if (lessThanOneDayAgo(result.Item.timestamp)) {
        // Return cache only if fresh
        return result.Item.html;
      }
    }
  } catch (e) {
    // Do nothing for now
  }
}

async function writeDynamoDbCache(url, html) {
  const params = {
    TableName: "AmitsnBlogPrerender",
    Item: {
      url: url,
      html: html,
      timestamp: Date.now(),
    },
  };

  try {
    await dynamoDbLib.call("put", params);
    return params.Item;
  } catch (e) {
    // Do nothing for now
  }
}

function trimUrl(targetUrl) {
  //Remove query parameters
  let cleanUrl = targetUrl.split("?")[0];

  //Remove trailing slashes
  return cleanUrl.replace(/\/$/, "");
}

export async function handler(event) {
  const ERROR_MESSAGE = "No query parameter given!";
  const INVALID_URL = "Invalid URL!";
  const ALLOWED_HOSTNAMES = ["www.amitsn.com", "amitsn.com"];
  const HOSTNAME = "https://www.amitsn.com";

  if (event.queryStringParameters) {
    const rawUrl = event.queryStringParameters.url;
    const targetUrl = trimUrl(rawUrl);
    let parsedUrl;

    if (!targetUrl) {
      return failure(ERROR_MESSAGE);
    } else {
      parsedUrl = new URL(targetUrl);
      if (!ALLOWED_HOSTNAMES.includes(parsedUrl.hostname)) {
        return failure(INVALID_URL);
      }
    }

    //Check if cache present in DynamoDB
    let cache = await dynamoDbCache(parsedUrl.href);
    if (cache) {
      return success(cache);
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    // Allow only URLs from sitemap
    let whitelistedURL;
    try {
      let sitemapResult = await axios.get(`${HOSTNAME}/sitemap.xml`);
      const parser = new XMLParser();
      const jObj = parser.parse(sitemapResult.data);
      const urlArray = jObj.urlset.url.map((item) => item.loc);
      whitelistedURL = urlArray[urlArray.indexOf(targetUrl)];
      if (!whitelistedURL) {
        // Try appending trailing slash
        whitelistedURL = urlArray[urlArray.indexOf(`${targetUrl}/`)];
      }
    } catch (e) {
      return failure(e);
    }

    if (!whitelistedURL) {
      whitelistedURL = `${HOSTNAME}/page/not/found`;
    }

    try {
      let page = await browser.newPage();
      let url = new URL(whitelistedURL);
      await page.goto(url.href);

      const result = await page.content();

      //Check for status code
      let status;
      try {
        await page.$("head > meta[name='prerender-status-code']");
        status = await page.$eval(
          "head > meta[name='prerender-status-code']",
          (element) => element.content
        );
      } catch (e) {
        // do nothing for now
      }

      if (status) {
        if (status === "301") {
          try {
            await page.$("head > meta[name='prerender-header']");
            let redirectUrl = await page.$eval(
              "head > meta[name='prerender-header']",
              (element) => element.content
            );
            browser.close();
            return redirect(redirectUrl);
          } catch (e) {
            // do nothing for now
          }
        } else {
          browser.close();
          return custom(parseInt(status), result);
        }
      }
      browser.close();
      await writeDynamoDbCache(url.href, result);
      return success(result);
    } catch (e) {
      return failure(e);
    }
  } else {
    return failure(ERROR_MESSAGE);
  }
}
