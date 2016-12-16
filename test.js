'use strict';

var Redis = require('ioredis');
var redisPool = require('./index');
//var client = redisPool.createClient();

// client.on('ready', () => {
//     console.log('ready');
// });


function clientFactory() {
    return new Redis({
        sentinels: [{
            host: 'localhost',
            port: 26379
        }],
        name: 'mymaster'
    });
}

let options = {
    poolKey: 'my-pool',
    redisOptions: {
        host: '127.0.0.1',
        port: 6379
    },
    clientFactory: clientFactory
}

redisPool.createPool(options);
console.log(redisPool.connectionPool);
