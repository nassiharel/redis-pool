
var EventEmitter = require('events').EventEmitter;
var redis = require("redis");
const DEFAULT_CLIENT_KEY = 'default_client';
const DEFAULT_POOL = 'default_pool';

'use strict';

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
      this.connectionPool.set(poolName, {redisOptions: options.redisOptions, clients: []});
  }
  
  createClient(options){
    let poolName = options.poolName || DEFAULT_POOL;
    let clientKey = options.key || DEFAULT_CLIENT_KEY;
    let pool = this.connectionPool.get(poolName);
    if(!pool){
      throw new Error('create pool must call first');
    }
    let client = this._createClient(clientKey, pool.redisOptions);
    pool.clients.push(client);
    this.connectionPool.set(poolName, pool);
    return client;
  }
  
  _createClient(key, redisOptions){
    if(typeof poolOptions.createClientFactory === 'function'){
      let client = poolOptions.createClientFactory();
      if(!client){
         throw new Error('create pool must call first');
      }
    }
    else{
      client = redis.createClient(redisOptions.port, redisOptions.host, redisOptions.options);
    }
    return client;
  }
  
}
