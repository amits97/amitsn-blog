import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "AmitsnBlog",
    IndexName: "postStatus-createdAt-index",
    KeyConditionExpression: "postStatus = :postStatus",
    ExpressionAttributeValues: {
      ":postStatus": "LIVE",
    },
    ScanIndexForward: false
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false, error: e });
  }
}