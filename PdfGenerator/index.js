const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context, callback) {
  wkhtmltopdf(event.htmlDoc, { pageSize: 'letter' }, (error) => {
    if (error) {
      callback(error);
      return;
    }
  }).pipe(fs.createWriteStream('output.pdf'));;
};
