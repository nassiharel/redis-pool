# redis-pool
Node Redis Connection pool

Work in progress...

```js
var redisPool = require('redis-pool');
redisPool.createPool
```

## Installation

```bash
$ npm install redis-pool
```

## Features

  * Robust connection management

## Docs & Community


###Security Issues


## Quick Start

```bash

```

  Create the app:

```bash

```

  Install dependencies:

```bash
$ npm install
```

  Start the server:

```bash
$ npm start
```

## Philosophy


## Examples

Create client:

```bash
var redisPool = require('redis-pool');
var client = redisPool.createClient();
```
calling the create client without any options, will first create a default connection pool,
then it will create a client with default redis options and add it to the pool.

```bash
var redisPool = require('redis-pool');

let options = {
       poolKey: 'my-pool',
       clientKey: 'my-client',
       redisOptions: {
          host: '127.0.0.1',
          port: 6379
       },
       clientFactory: () => { return client}
}

var client = redisPool.createClient(options);
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## People


## License

  [MIT](LICENSE)
