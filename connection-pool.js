
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
      this.connectionPool.set(poolName, {options: options, clients: []});
  }
  
  createClient(options){
    let poolName = options.poolName || DEFAULT_POOL;
    let clientKey = options.key || DEFAULT_CLIENT_KEY;
    let pool = this.connectionPool.get(poolName);
    if(!pool)
    {
      throw new Error('create pool must call first');
    }
    let client = this._createClient(clientKey, pool.options);
    pool.clients.push(client);
    this.connectionPool.set(poolName, pool);
    return client;
  }
  
  _createClient(key, poolOptions){
    if(typeof this.createClientFactory === 'function'){
      let client = this.createClientFactory();
      if(client)
      {
        
      }
      else
      {
        
      }
    }
    else
    {
      client = redis.createClient(this.redisConfig.port, this.redisConfig.host, {});
    }
    
  }
  
}
