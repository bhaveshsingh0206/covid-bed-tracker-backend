require('colors');
const log = {};

// log errors
log.err = (head, title, body) => {
   head = `[${head.toUpperCase()}]`;
   let toLog = `${head.cyan} ${title.bold.red} ${body || ''}`;
   console.error(toLog);
};

// log status
log.log = (head, title) => {
   head = `[${head.toUpperCase()}]`;
   let toLog = `${head.cyan} ${title}`;
   console.log(toLog);
};

module.exports = log;