import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

export function call(action, params) {
  const dynamoDb = DynamoDBDocument.from(new DynamoDB());

  return dynamoDb[action](params);
}