const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {
  const html_utf8 = new Buffer(event.htmlDoc, 'base64').toString('utf8');

  wkhtmltopdf(html_utf8, { pageSize: 'letter' }, (error) => {
    if (error) {
      console.log('Failed to convert html to pdf...');
      callback(error);
      return;
    };
    console.log('Pdf was generated successfully...');
    callback(null, {
      message: 'Test is working'
    });
  });
};
