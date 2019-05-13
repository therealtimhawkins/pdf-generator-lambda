const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {

  console.log(event.htmlDoc);

  wkhtmltopdf(event.htmlDoc, { pageSize: 'letter' }, (error) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, {
      message: 'Test is working'
    });
  });
};
