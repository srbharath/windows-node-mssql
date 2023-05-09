require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');

const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

const Etcd3 = require('etcd3');

// create a new etcd client object
const client = new Etcd3({
  hosts: 'etcd:2379', // replace with the actual etcd cluster endpoint
});
// fetch the value of the 'config' key from etcd
client.get('config').string().then((value) => {
  // do something with the configuration value
  console.log('Configuration value:', value);
}).catch((error) => {
  console.error('Error fetching configuration:', error);
});

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
