import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "AmitsnBlog",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      postId: slugify(data.title),
      content: data.content,
      title: data.title,
      createdAt: Date.now(),
      postType: data.type
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}