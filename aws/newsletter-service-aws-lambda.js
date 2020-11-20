/* eslint-env node */

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB.DocumentClient();

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST_ERROR = 400;
const SUCCESS_CODE = 200;

const handleResponse = ({callback, statusCode, responseBody, error}) => {
  const response = {
    statusCode,
    body: JSON.stringify(responseBody),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  callback(error, response);
};

const addEmail = (email, firstName, lastName) => {
  if (!/^[\w\.+_-]+@([\w\n_-]+\.)+[\w]{2,}$/.test(email)) {
    return Promise.reject('The email format is invalid');
  }

  return ddb
    .put({
      TableName: process.env.NEWSLETTER_TABLE_NAME,
      Item: {
        email,
        firstName,
        lastName,
        subscribedAt: new Date().toISOString()
      },
      Expected: {
        email: {
          Exists: false
        }
      }
    })
    .promise();
};

const removeEmail = email => {
  return ddb
    .delete({
      TableName: process.env.NEWSLETTER_TABLE_NAME,
      Item: {
        email
      }
    })
    .promise();
};

exports.handler = (event, _, callback) => {
  const body = JSON.parse(event.body);
  if (!body.email) {
    return handleResponse({
      callback,
      statusCode: BAD_REQUEST_ERROR,
      responseBody: {message: 'Missing email'},
      error: 'Bad request'
    });
  }

  const operation = body.unsubscribe ? removeEmail : addEmail;

  operation(body.email, body.firstName, body.lastName)
    .then(() =>
      handleResponse({callback, statusCode: SUCCESS_CODE, responseBody: {message: 'Operation successful'}, error: null})
    )
    .catch(error => {
      if (error.code === 'ConditionalCheckFailedException') {
        return handleResponse({
          callback,
          statusCode: SUCCESS_CODE,
          responseBody: {message: 'Operation successful'},
          error: null
        });
      }

      const errorMessage = body.unsubscribe
        ? `Le désabonnement a échoué. Raison: ${error}`
        : `L'abonnement a échoué. Raison: ${error}. Prénom: ${body.firstName}, Nom: ${body.lastName}`;

      const params = {
        Destination: {
          ToAddresses: [process.env.EMAIL_ADDRESS_TO]
        },
        Source: process.env.EMAIL_ADDRESS_FROM,
        Template: process.env.TEMPLATE_NAME /* required */,
        TemplateData: `{ "email":"${body.email}", "reason":"${errorMessage}" }`
      };

      const sendPromise = new AWS.SES().sendTemplatedEmail(params).promise();

      sendPromise
        .then(data => {
          handleResponse({callback, statusCode: SUCCESS_CODE, responseBody: {message: data}, error: null});
        })
        .catch(err => {
          handleResponse({callback, statusCode: INTERNAL_SERVER_ERROR, responseBody: {message: err.stack}, error: err});
        });
    });
};
