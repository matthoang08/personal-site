"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const { AWS_REGION } = process.env;
AWS.config.update({
    region: AWS_REGION ? AWS_REGION : 'us-east-1'
});
class DynamoClient {
    constructor(tableName) {
        this.tableName = tableName;
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }
    async getItem(id) {
        const params = {
            TableName: this.tableName,
            Key: { id }
        };
        try {
            const resp = await this.docClient.get(params).promise();
            return resp.Item;
        }
        catch (err) {
            console.log('err calling dynamo', err);
            throw err;
        }
    }
}
exports.DynamoClient = DynamoClient;
//# sourceMappingURL=dynamoClient.js.map