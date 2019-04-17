/* eslint-env node */

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST_ERROR = 400;
const SUCCESS_CODE = 200;

const handleResponse = ({callback, statusCode, responseBody, error}) => {
  const response = {
    statusCode,
    body: JSON.stringify(responseBody)
  };

  callback(error, response);
};

exports.handler = (event, _, callback) => {
  const body = JSON.parse(event.body);
  if (!body.link || !body.message)
    return handleResponse({
      callback,
      statusCode: BAD_REQUEST_ERROR,
      responseBody: {message: 'Missing link and message'},
      error: 'Bad request'
    });

  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL_ADDRESS_TO]
    },
    Source: process.env.EMAIL_ADDRESS_FROM,
    Template: process.env.TEMPLATE_NAME /* required */,
    TemplateData: `{ "email":"${body.email}", "link":"${body.link}", "message":"${body.message}", "name":"${
      body.name
    }" }`,
    ReplyToAddresses: [body.email]
  };

  const sendPromise = new AWS.SES().sendTemplatedEmail(params).promise();

  sendPromise
    .then(data => {
      handleResponse({callback, statusCode: SUCCESS_CODE, responseBody: {message: data}, error: null});
    })
    .catch(err => {
      handleResponse({callback, statusCode: INTERNAL_SERVER_ERROR, responseBody: {message: err.stack}, error: err});
    });
};
