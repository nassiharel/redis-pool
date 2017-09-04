'use strict';

const Redis = require('ioredis');
const redisPool = require('./index');

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

const poolOptions = {
    poolKey: 'my-pool',
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

const clientOptions = {
    poolKey: 'my-pool'
}

async function start() {
    redisPool.createPool(poolOptions);
    var client1 = await redisPool.createClient(clientOptions);
    var client2 = await redisPool.createClient(clientOptions);

    setTimeout(() => {
        redisPool.releaseClient(client1, clientOptions);
    }, 2000);

     setTimeout(() => {
        redisPool.releaseClient(client2, clientOptions);
    }, 3000);

    // var client3 = await redisPool.createClient(clientOptions);
    // var client4 = await redisPool.createClient(clientOptions);
    // var client5 = await redisPool.createClient(clientOptions);
    // var client6 = await redisPool.createClient(clientOptions);
};

start();

