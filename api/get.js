import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

async function retryGet(postId) {
  let params = {
    TableName: "AmitsnBlog",
    FilterExpression: "contains(postId, :postId)",
    ExpressionAttributeValues: {
      ":postId": postId,
    },
  };

  if (postId.length > 2) {
    try {
      const result = await dynamoDbLib.call("scan", params);
      if (result.Items.length > 0) {
        let finalResult = result.Items[0];
        // Return the retrieved item
        return success(finalResult);
      } else {
        return retryLoop(postId);
      }
    } catch (e) {
      return failure({ status: false, error: e });
    }
  } else {
    return failure({ status: false, error: "Item not found." });
  }
}

function retryLoop(postId) {
  let keywords = postId.split("-");

  if (keywords.length > 1) {
    keywords.pop();
    return retryGet(keywords.join("-"));
  } else {
    return failure({ status: false, error: "Item not found." });
  }
}

export async function main(event) {
  const params = {
    TableName: "AmitsnBlog",
    Key: {
      postId: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return retryGet(event.pathParameters.id);
    }
  } catch (e) {
    return failure({ status: false, error: e });
  }
}
