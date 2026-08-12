#!/usr/bin/env node

const express = require('express');
const { program } = require('commander');

// init(Key-Value)
const cache = new Map();

// Setup CLI options
program
  .option('-p, --port <number>', 'Port for running the proxy server', '3000')
  .option('-o, --origin <url>', 'URL of the target server (Origin)')
  .option('-c, --clear-cache', 'Clear the cached data');

program.parse(process.argv);
const options = program.opts();

// (--clear-cache)
if (options.clearCache) {
  cache.clear();
  console.log('Cache cleared successfully!');
  process.exit(0);
}

// Check if the origin URL is provided
if (!options.origin) {
  console.error('Error: --origin is required (e.g., --origin https://dummyjson.com)');
  process.exit(1);
}

const app = express();
const PORT = options.port;
const ORIGIN_URL = options.origin.replace(/\/$/, ''); // Delete trailing slash if present

// Middleware to handle all incoming requests
app.use(async (req, res) => {
  const cacheKey = `${req.method}:${req.url}`;

  // Check if the request is a GET and if the response is already cached
  if (req.method === 'GET' && cache.has(cacheKey)) {
    console.log(`[CACHE HIT] ${req.method} ${req.url}`);
    res.setHeader('X-Cache', 'HIT');
    
    const cachedResponse = cache.get(cacheKey);
    return res.status(cachedResponse.status).send(cachedResponse.body);
  }

  // If not cached, fetch from the origin server
  try {
    console.log(`[CACHE MISS] ${req.method} ${req.url} -> Redirecting to ${ORIGIN_URL}${req.url}`);

    const originResponse = await fetch(`${ORIGIN_URL}${req.url}`, {
      method: req.method,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Caching-Proxy',
        'Accept': req.headers['accept'] || '*/*'
      }
    });

    const body = await originResponse.text();
    const status = originResponse.status;

    // 
    if (req.method === 'GET' && status === 200) {
      cache.set(cacheKey, { status, body });
    }

    res.setHeader('X-Cache', 'MISS');
    return res.status(status).send(body);

  } catch (error) {
    console.error('Error when accessing the Origin server:', error.message);
    return res.status(500).json({ error: 'Origin server is unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Caching Proxy running on port ${PORT}`);
  console.log(`🔗 Proxies requests to: ${ORIGIN_URL}\n`);
});