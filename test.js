'use strict';

var Redis = require('ioredis');
var redisPool = require('./index');

redisPool.on('pool-created', (pool) => {
    console.log('pool-created', pool);
});

var client1 = redisPool.createClient();
var client2 = redisPool.createClient();
var client3 = redisPool.createClient();

client1.on('ready', () => {
    console.log('ready1');
});

client2.on('ready', () => {
    console.log('ready2');
});

client3.on('ready', () => {
    console.log('ready3');
});



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
var client4 = redisPool.createClient(options);

client4.on('ready', () => {
    console.log('ready4');
});