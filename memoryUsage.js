const from = require('from2');

module.exports = function(opts) {
  var lastScheduledSample = 0;

  const stream = from.obj(function(size, next) {
    if (opts.gc) {
      try {
        global.gc();
      } catch (e) {
        console.log("You must run program with 'node --expose-gc filename.js'");
        process.exit();
      }
    }
    const ms = opts.freq - (Date.now() - lastScheduledSample);
    setTimeout(measure, ms, next).unref();
  });

  return stream;

  function measure(cb) {
    var obj = process.memoryUsage();
    lastScheduledSample = Date.now();
    if (opts.ts) obj.ts = lastScheduledSample;
    cb(null, obj);
  }
};
