'use strict';

var EventEmitter = require('events').EventEmitter;
var redis = require('redis');
const DEFAULT_CLIENT_KEY = 'default_client';
const DEFAULT_POOL = 'default_pool';

const DEFAULT_REDIS = {
  host: '127.0.0.1',
  port: 6379
}

class ConnectionPool extends EventEmitter {
  
  constructor(options) {
    super();
    this.connectionPool = new Map();
  }
  
  createPool(options){
      let poolName = options.poolName || DEFAULT_POOL;
      let redisOptions = options.redisOptions || DEFAULT_REDIS;
      let pool = {redisOptions: redisOptions, clientFactory: options.clientFactory, clients: []};
      this.connectionPool.set(poolName, pool);
      return pool;
  }
  
  createClient(options){
    let clientKey = options.key || DEFAULT_CLIENT_KEY;
    let pool = this.connectionPool.get(options.poolName);
    if(!pool){
        pool = this.createPool();
    }
    let client = this._createClient(clientKey, pool.redisOptions, pool.clientFactory);
    pool.clients.push(client);
    this.connectionPool.set(poolName, pool);
    return client;
  }
  
  _createClient(key, redisOptions, clientFactory){
    if(typeof clientFactory === 'function'){
      let client = clientFactory();
      if(!client){
         throw new Error('clientFactory must return client');
      }
    }
    else{
      client = redis.createClient(redisOptions.port, redisOptions.host, redisOptions.options);
    }
    return client;
  }
  
}
