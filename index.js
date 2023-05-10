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

const config = {
  key1: 'config/file',
  //key2: 'value2',
  // add more key-value pairs as needed
};

function pushConfigToEtcd(config) {
  const client = new Etcd3({
    hosts: 'etcd:2379', // replace with the actual etcd cluster endpoint
  });

  client.put('config/file', JSON.stringify(config))
    .then(() => console.log('Configuration file pushed successfully'))
    .catch((err) => console.error('Error pushing configuration file:', err));

  const watcher = client.watch('config/file');
  watcher.on('data', (res) => {
    const config = JSON.parse(res.toString());
    console.log('New configuration file:', config);
  });

  client.get('config/file')
    .json()
    .then(config => {
      console.log(config);
    })
    .catch((err) => console.error('Error getting configuration file:', err));
}

pushConfigToEtcd(config); // call the function with your configuration object

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
