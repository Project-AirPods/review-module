require('newrelic');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const app = require('./app.js');


if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died.`);
    console.log('Creating a new worker.');
    cluster.fork();
  });
} else {

	const PORT = 3003;
	app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
}