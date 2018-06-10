const fs = require('fs');

function memoryTrack(opts) {
  const execute = () => setTimeout(measure, opts.freq);
  console.log("Dont forget to add expose flag if u use gc 'node --expose-gc filename.js'");
  fs.writeFile(opts.file, `rss,heapTotal,heapUsed,external\n`, { flag: 'w' }, execute);

  function measure() {
    if (opts.gc) global.gc();
    const usage = process.memoryUsage();
    fs.appendFile(opts.file, `${usage.rss},${usage.heapTotal},${usage.heapUsed},${usage.external}\n`, execute);
  }
}

// memoryTrack({ freq: 5000, gc: true, file: './memory.csv' });

// setInterval(() => console.log('I am here'), 20000);
module.exports = memoryTrack;
