import * as AWS from 'aws-sdk';

const { AWS_REGION } = process.env;

AWS.config.update({
  region: AWS_REGION ? AWS_REGION : 'us-east-1'
});

export class DynamoClient {

  public tableName: string;
  public docClient: AWS.DynamoDB.DocumentClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  async getItem(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };
    try {
      const resp = await this.docClient.get(params).promise();
      return resp.Item;
    } catch (err) {
      console.log('err calling dynamo', err);
      throw err;
    }
  }
}