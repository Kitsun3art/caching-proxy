# Caching Proxy CLI

A lightweight CLI tool that proxies HTTP requests to an origin server and caches the responses locally to improve performance and minimize external API calls.

Built as a solution for the [roadmap.sh Caching Server Project](https://roadmap.sh/projects/caching-server).

---

## Features

- **In-Memory Caching:** Caches GET responses in RAM using a Key-Value data structure.
- **Custom Header Verification:** Appends `X-Cache: HIT` when served from cache and `X-Cache: MISS` when fetched from the origin server.
- **Cache Invalidation:** Supports clearing the stored cache via a simple CLI flag.
- **Zero Overhead:** Blazing fast execution built on Node.js and Express.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (uses native `fetch` support).

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/caching-proxy.git](https://github.com/your-username/caching-proxy.git)
   cd caching-proxy

## Usage

caching-proxy --port 3000 --origin [https://dummyjson.com](https://dummyjson.com)
