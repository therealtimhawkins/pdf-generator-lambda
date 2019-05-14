const LambdaTester = require('lambda-tester');
const lambdaFunction = require('../PdfGenerator/index');
const successfulEventMock = require('./mocks/successfulEventMock');
const AWS = require('aws-sdk-mock');
 
AWS.mock('S3', 'putObject', function (params, callback) {
  callback(null, "successfully put item in database");
});

describe('handler', () => {
  it('should be called correctly', (done) => {
    LambdaTester(lambdaFunction.handler)
      .event(successfulEventMock)
      .expectResult()
      .verify(done);
  });

  it('should return bucket name and key if successful', (done) => {
    const expectedResult = { bucket: 'pdfs-from-generator', key: 'lambdaTestKey' };

    LambdaTester(lambdaFunction.handler)
      .event(successfulEventMock)
      .expectResult(result => {
        expect(result).toEqual(expectedResult);
      })
      .verify(done);
  });
});
