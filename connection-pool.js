
var EventEmitter = require('events').EventEmitter;
var redis = require("redis");
const DEFAULT_CLIENT = 'default_client';
const DEFAULT_POOL = 'default_pool';

class ConnectionPool extends EventEmitter {
  constructor(options) {
    super();
    this.connectionPool = new Map();
  
  }
  
  createPool(options){
      let poolName = options.poolName || DEFAULT_POOL;
      this.connectionPool.set(poolName, options);
  }
  
  createClient(options){
    let key = options.key || DEFAULT_KEY;
    let pool = this.connectionPool.get(key);
    if(!pool)
    {
       pool = this._createClient(k
                                 create pool must call first')
    }
    return pool;
  }
  
  _createClient(key){
    if(typeof this.createClientFactory === 'function'){
      let client = this.createClientFactory();
      if(client)
      {
        this.connectionPool.set(key, client);
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
