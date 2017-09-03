'use strict';

const EventEmitter = require('events');
const genericPool = require('generic-pool');
const defaults = require('lodash.defaults');
const redis = require('redis');
const Pool = require('./Pool');

const DEFAULT_OPTIONS = {
  poolKey: 'default_pool',
  clientKey: 'default_client',
  poolOptions: {
    min: 1,
    max: 5
  },
  redisOptions: {
    port: 6379,
    options: {}
  }
}

class ConnectionPool extends EventEmitter {

  constructor(options) {
    super();
    this._connectionPool = new Map();
    this._poolFactory();
  }

  createPool(options) {
    options = options || {};
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
    const innerPool = genericPool.createPool(this._poolFactoryOptions, this._options.poolOptions);
    const pool = new Pool({
      poolKey: this._options.poolKey,
      redisOptions: this._options.redisOptions,
      clientFactory: options.clientFactory,
      innerPool: innerPool
    });
    this._connectionPool.set(this._options.poolKey, pool);
  }

  _poolFactory() {
    this._poolFactoryOptions = {
      create: (options) => {
        return new Promise((resolve) => {
          let client = ConnectionPool._createClient(options);
          client.on('ready', () => {
            return resolve(client);
          });
        });
      },
      destroy: (client) => {
        return new Promise((resolve) => {
          client.on('end', () => {
            return resolve();
          });
          client.disconnect();
        });
      }
    }
  }

  async createClient(options) {
    options = options || {};
    const opt = Object.assign({}, DEFAULT_OPTIONS, options);
    const pool = this._connectionPool.get(opt.poolKey);
    if (!pool) {
      throw new Error(`pool ${opt.poolKey} not found`);
    }
    const client = await pool.inner.acquire();
    return client;
  }

  async releaseClient(client, options) {
    const opt = Object.assign({}, DEFAULT_OPTIONS, options);
    const pool = this._connectionPool.get(opt.poolKey);
    if (!pool) {
      throw new Error(`pool ${opt.poolKey} not found`);
    }
    await pool.inner.release(client);
  }

  static _createClient(options) {
    options = options || {};
    let client = null;
    if (typeof options.clientFactory === 'function') {
      client = clientFactory();
      if (!client) {
        throw new Error('clientFactory must return client');
      }
    }
    else {
      client = redis.createClient(options.redisOptions);
    }
    return client;
  }
}

module.exports = new ConnectionPool();
