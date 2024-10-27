import { del, get, post, put } from "aws-amplify/api";

// Wrapper around v6 Amplify API functions to preserve v5 calling style.
export const API = {
  get: async (apiName, path) => {
    const request = get({ apiName, path });
    const { body } = await request.response;
    const json = await body.json();
    return json;
  },
  post: async (apiName, path, options) => {
    const request = post({ apiName, path, options });
    const { body } = await request.response;
    const json = await body.json();
    return json;
  },
  put: async (apiName, path, options) => {
    const request = put({ apiName, path, options });
    const { body } = await request.response;
    const json = await body.json();
    return json;
  },
  del: async (apiName, path) => {
    return del({ apiName, path }).response;
  },
};
