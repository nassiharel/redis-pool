'use strict';

var Redis = require('ioredis');
var redisPool = require('./index');

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
    clientKey: 'my-pool',
    clientFactory: clientFactory,
    redisOptions: {
        port: 6379,
        options: {}
    },
    poolOptions: {
        min: 1,
        max: 2
    }
}

async function start() {
    const pr = redisPool.createPool(options);
    var client1 = await redisPool.createClient(options);
    var client2 = await redisPool.createClient(options);

    setTimeout(() => {
        redisPool.releaseClient(client1, options);
    }, 2000);

     setTimeout(() => {
        redisPool.releaseClient(client2, options);
    }, 3000);

    var client3 = await redisPool.createClient(options);
    var client4 = await redisPool.createClient(options);
    var client5 = await redisPool.createClient(options);
    var client6 = await redisPool.createClient(options);
};

start();

