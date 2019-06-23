"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-east-1'
});
class DynamoClient {
    constructor(tableName) {
        this.tableName = tableName;
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }
    async getItem(item) {
        const params = {
            TableName: this.tableName,
            Key: {
                id: item
            }
        };
        try {
            const resp = await this.docClient.get(params).promise();
            console.log(`resp: ${JSON.stringify(resp, null, 2)}`);
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