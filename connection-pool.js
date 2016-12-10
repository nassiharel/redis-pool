
var EventEmitter = require('events').EventEmitter;
var redis = require("redis");
const DEFAULT_CLIENT_KEY = 'default_client';
const DEFAULT_POOL = 'default_pool';

class ConnectionPool extends EventEmitter {
  constructor(options) {
    super();
    this.connectionPool = new Map();
  }
  
  createPool(options){
      let poolName = options.poolName || DEFAULT_POOL;
      this.connectionPool.set(poolName, {options: options.redis, clients: []});
  }
  
  createClient(options){
    let poolName = options.poolName || DEFAULT_POOL;
    let clientKey = options.key || DEFAULT_CLIENT_KEY;
    let pool = this.connectionPool.get(poolName);
    if(!pool){
      throw new Error('create pool must call first');
    }
    let client = this._createClient(clientKey, pool.options);
    pool.clients.push(client);
    this.connectionPool.set(poolName, pool);
    return client;
  }
  
  _createClient(key, poolOptions){
    if(typeof poolOptions.createClientFactory === 'function'){
      let client = poolOptions.createClientFactory();
      if(!client){
         throw new Error('create pool must call first');
      }
    }
    else{
      client = redis.createClient(poolOptions.redisConfig.port, poolOptions.redisConfig.host, poolOptions.options);
    }
    return client;
  }
  
}
