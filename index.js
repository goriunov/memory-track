const memoryUsage = require('./memoryUsage');
const csvWriter = require('csv-write-stream');
const path = require('path');
const http = require('http');
const PassThrough = require('readable-stream').PassThrough;
const pump = require('pump');
const ecstatic = require('ecstatic');
const SSE = require('sse-stream');
/**
 *
 * @param {*} options
 * options.freq = 5000
 * options.gc = true / false
 */

function chatStream(cb) {
  const input = new PassThrough();
  const server = http.createServer(ecstatic({ root: path.join(__dirname, 'public') }));
  const sse = SSE('/data');
  let header;

  sse.install(server);

  sse.on('connection', function(client) {
    input.once('data', function(chunk) {
      if (chunk !== header) client.write(header);
      client.write(chunk);
      pump(input, client);
    });
  });

  server.listen(function() {
    sse.interval.unref();
    cb('http://localhost:' + server.address().port);
  });

  server.unref();

  input.once('data', function(chunk) {
    header = chunk;
  });

  return input;
}

function memoryTrack(options) {
  memoryUsage(options)
    .pipe(csvWriter())
    .pipe(chatStream((url) => console.log(`Open ${url} in your browser to see the chart`)));
}

// memoryTrack({freq: 5000, gc: true})

// setInterval(() => {
//   console.log('I am here')
// }, 20000)
module.exports = memoryTrack;
