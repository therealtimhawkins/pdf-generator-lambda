const wkhtmltopdf = require('wkhtmltopdf');
const MemoryStream = require('memorystream');
const AWS = require('aws-sdk');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {

  const s3 = new AWS.S3();
  const memStream = new MemoryStream();

  if (!event.htmlDoc) {
    callback(Error('Please submit a base64 encoded html doc to convert.'));
    return;
  };

  const html_utf8 = new Buffer(event.htmlDoc, 'base64').toString('utf8');

  wkhtmltopdf(html_utf8, event.options, (error) => {
    if (error) {
      console.log('Failed to convert html to PDF... ( this is a problem with wkhtmltopdf )');
      callback(error);
      return;
    };

    console.log(`PDF was generated successfully. Adding PDF to bucket ${event.bucket}...`);
    const s3PutParams = {
      Bucket: event.bucket,
      Key: event.key,
      Body: memStream.read(),
      ContentType: 'application/pdf',
      Metadata: { "x-amz-meta-requestId": context.awsRequestId }
    };
    
    s3.putObject(s3PutParams, function(error, data) {
      if ( error ) {
        console.error('Failed to pass the object to S3...');
        callback(error);
        return;
      };

      console.log(process.env.AWS_REGION);

      const pdfUrl = `http://s3.${process.env.AWS_REGION}.amazonaws.com/${event.bucket}/${event.key}`;
      callback(null, { 
        message: 'Pdf created successfully and saved in S3.',
        url: pdfUrl 
      });
    });
  }).pipe(memStream);
};
