'use strict';

var Redis = require('ioredis');
var redisPool = require('./index');

redisPool.on('pool-created', (pool) => {
    console.log('pool-created', pool);
});

// var client = redisPool.createClient();

// client.on('ready', () => {
//     console.log('ready1');
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
    clientFactory: clientFactory
}

redisPool.createPool(options);
var client = redisPool.createClient(options);

client.on('ready', () => {
    console.log('ready4');
});