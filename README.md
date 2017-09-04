# redis-pool
Node Redis Connection pool

Work in progress...

## Installation

```bash
$ npm install redis-pool --save
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

```js
const redisPool = require('redis-pool');
const client = redisPool.createClient();
```
calling the create client without any options, will first create a default connection pool,
then it will create a client with default redis options and add it to the pool.

```js
const redisPool = require('redis-pool');
const Redis = require('ioredis');

function clientFactory() {
    return new Redis({
        sentinels: [{
            host: 'localhost',
            port: 26379
        }],
        name: 'mymaster'
    });
}

const options = {
    poolKey: 'my-pool',
    clientKey: 'my-pool',
    clientFactory: clientFactory,
    redisOptions: {
        host: '127.0.0.1',
        port: 6379,
        options: {}
    },
    poolOptions: {
        min: 1,
        max: 2
    }
}

redisPool.createClient(options);

const client1 = await redisPool.createClient(options);
const client2 = await redisPool.createClient(options);

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
