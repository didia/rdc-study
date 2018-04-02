/* eslint-env node */

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

exports.handler = (event, _, callback) => {
  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL_ADDRESS_TO]
    },
    Source: process.env.EMAIL_ADDRESS_FROM,
    Template: process.env.TEMPLATE_NAME /* required */,
    TemplateData: `{ "email":"${event.email}", "link":"${event.link}", "message":"${event.message}", "name":"${
      event.name
    }" }`,
    ReplyToAddresses: [process.env.EMAIL_ADDRESS_FROM]
  };

  const sendPromise = new AWS.SES().sendTemplatedEmail(params).promise();

  sendPromise.then(data => callback(null, data)).catch(err => callback(err, err.stack));
};
