const http = require('http');
const https = require('https');
const { URL } = require('url');

/**
 * HTTP Flood Bot Test
 * Tests rate limiting and volume protection
 */

const BASE_URL = 'http://localhost:9003';

class FloodBot {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.concurrency = options.concurrency || 10;
    this.totalRequests = options.totalRequests || 100;
    this.delay = options.delay || 0;
    this.userAgent = options.userAgent || 'FloodBot/1.0';
    
    this.results = {
      total: 0,
      success: 0,
      blocked: 0,
      rateLimit: 0,
      errors: 0
    };
  }

  async makeRequest(path = '/subscribe') {
    return new Promise((resolve) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Connection': 'close'
        }
      };

      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        this.results.total++;
        
        if (res.statusCode === 200) {
          this.results.success++;
        } else if (res.statusCode === 403) {
          this.results.blocked++;
        } else if (res.statusCode === 429) {
          this.results.rateLimit++;
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers
        });
      });

      req.on('error', () => {
        this.results.total++;
        this.results.errors++;
        resolve({ statusCode: 0, error: true });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        this.results.total++;
        this.results.errors++;
        resolve({ statusCode: 0, timeout: true });
      });

      req.end();
    });
  }

  async runConcurrentRequests() {
    const requestsPerBatch = this.concurrency;
    const totalBatches = Math.ceil(this.totalRequests / requestsPerBatch);
    
    console.log(`🌊 Starting Flood Test: ${this.totalRequests} requests, ${this.concurrency} concurrent\n`);
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const batchSize = Math.min(requestsPerBatch, this.totalRequests - (batch * requestsPerBatch));
      const promises = [];
      
      for (let i = 0; i < batchSize; i++) {
        promises.push(this.makeRequest());
      }
      
      await Promise.all(promises);
      
      // Progress update
      const progress = Math.round((this.results.total / this.totalRequests) * 100);
      process.stdout.write(`\rProgress: ${progress}% (${this.results.total}/${this.totalRequests})`);
      
      // Delay between batches
      if (this.delay > 0 && batch < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    console.log('\n');
  }

  printResults() {
    console.log('📊 Flood Test Results:');
    console.log(`Total Requests: ${this.results.total}`);
    console.log(`Successful (200): ${this.results.success} ${this.results.success > 0 ? '❌ TOO MANY' : '✅ GOOD'}`);
    console.log(`Blocked (403): ${this.results.blocked} ${this.results.blocked > 50 ? '✅ GOOD BLOCKING' : '❌ WEAK BLOCKING'}`);
    console.log(`Rate Limited (429): ${this.results.rateLimit} ${this.results.rateLimit > 20 ? '✅ RATE LIMITING WORKS' : '❌ RATE LIMITING WEAK'}`);
    console.log(`Errors/Timeouts: ${this.results.errors}`);
    
    const protectionRate = ((this.results.blocked + this.results.rateLimit) / this.results.total) * 100;
    console.log(`\nProtection Rate: ${protectionRate.toFixed(1)}% ${protectionRate > 80 ? '✅ EXCELLENT' : protectionRate > 50 ? '⚠️ MODERATE' : '❌ POOR'}`);
  }
}

async function runFloodTests() {
  // Test 1: Basic Flood
  console.log('Test 1: Basic Request Flood');
  const basicFlood = new FloodBot(BASE_URL, {
    totalRequests: 50,
    concurrency: 10,
    userAgent: 'Mozilla/5.0 (Bot Flood Test)'
  });
  
  await basicFlood.runConcurrentRequests();
  basicFlood.printResults();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Aggressive Bot Flood
  console.log('Test 2: Aggressive Bot User Agent Flood');
  const botFlood = new FloodBot(BASE_URL, {
    totalRequests: 30,
    concurrency: 15,
    userAgent: 'python-requests/2.28.1'
  });
  
  await botFlood.runConcurrentRequests();
  botFlood.printResults();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Rapid Fire Test
  console.log('Test 3: Rapid Fire (No Delay)');
  const rapidFlood = new FloodBot(BASE_URL, {
    totalRequests: 25,
    concurrency: 20,
    delay: 0,
    userAgent: 'RapidBot/1.0'
  });
  
  await rapidFlood.runConcurrentRequests();
  rapidFlood.printResults();
}

// Run tests
runFloodTests().catch(console.error);
