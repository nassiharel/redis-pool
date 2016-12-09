class ConnectionPool {
  constructor(options) {
    this.connectionPool = new Map();
    this.redisConfig = options.redisConfig;
    this.createClientFactory = options.createClientFactory;
  }
  
  createClient()
  {
  }
}
