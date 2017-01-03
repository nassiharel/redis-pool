'use strict';

const EventEmitter = require('events').EventEmitter;
const genericPool = require('generic-pool');
const redis = require('redis');
const Pool = require('../Pool');
const DEFAULT_CLIENT_KEY = 'default_client';
const DEFAULT_POOL_KEY = 'default_pool';

const DEFAULT_REDIS_OPTIONS = {
  host: '127.0.0.1',
  port: 6379,
  options: {}
}

const DEFAULT_POOL_OPTIONS ={
  min: 1,
  max: 5
}

class ConnectionPool extends EventEmitter {
  
  constructor(options) {
    super();
    this.connectionPool = new Map();
    this._poolFactory();
  }
  
  createPool(options){
      options = options || {};
      let poolOptions = options.poolOptions || DEFAULT_POOL_OPTIONS
      let poolKey = options.poolKey || DEFAULT_POOL_KEY;
      let redisOptions = options.redisOptions || DEFAULT_REDIS_OPTIONS;
      let innerPool = genericPool.createPool(this._poolFactory, poolOptions);
      let pool = new Pool({ 
          poolKey: poolKey, 
          redisOptions: redisOptions, 
          clientFactory: options.clientFactory,
          innerPool: innerPool
      });
      this.connectionPool.set(poolKey, pool);
      this.emit('pool-created', pool);
      return pool;
  }
  
  _poolFactory()
  {
    this._poolFactory = {
      create: function(pool){
             return new Promise(function(resolve, reject){
                let client = this._createClient(pool.redisOptions, pool.clientFactory);
                client.on('ready', function() {
                    return resolve(client)
                })
            })
          },
          destroy: function(client){
            return new Promise(function(resolve){
              client.on('end', function(){
                return resolve()
              })
              client.disconnect();
            })
        }
    }
  }
  
  createClient(options){
    options = options || {};
    let poolKey = options.poolKey || DEFAULT_POOL_KEY;
    let clientKey = options.clientKey || DEFAULT_CLIENT_KEY;
    let pool = this.connectionPool.get(poolKey);
    if(!pool){
        pool = this.createPool(options);
        let client = this._createClient(pool.redisOptions, pool.clientFactory);
        pool.clients.set(clientKey, client);
        this.connectionPool.set(poolKey, pool);
       
    }
    return pool.clients.get(clientKey);
  }
  
  _createClient(redisOptions, clientFactory){
    let client = null;
    if(typeof clientFactory === 'function'){
      client = clientFactory();
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

module.exports = new ConnectionPool();
