
var EventEmitter = require('events').EventEmitter;
const DEFAULT_KEY = 'default_client';

class ConnectionPool extends EventEmitter {
  constructor(options) {
    super();
    this.connectionPool = new Map();
    this.redisConfig = options.redisConfig;
    this.createClientFactory = options.createClientFactory;
    this.poolName = options.poolName;
  }
  
  createClient(options)
  {
    let key = options.key || DEFAULT_KEY;
    let pool = this.connectionPool.get(key);
    if(!pool)
    {
      let pool = this._createClient(key);
    }
    return pool;
  }
  
  _createClient(key)
  {
    if(typeof this.createClientFactory === 'function'){
      let client = this.createClientFactory();
      if(client)
      {
        this.connectionPool.set(key, client);
      }
    }
    
  }
  
}
