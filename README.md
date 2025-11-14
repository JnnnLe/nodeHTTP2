Tiny Storefront — HTTP/2 & HTTP/3 Test Project

A simple demo project for testing and comparing HTTP/2 and HTTP/3 (QUIC) using a real public API.
This mini-app proxies product data from FakeStoreAPI through two local servers—one running H2 and the other running H3—so you can measure protocol differences, latency, and behavior.

🚀 Objectives

Build and run a local HTTP/2 server

Build and run a local HTTP/3 (QUIC) server

Proxy real API data through both protocols

Compare response times and protocol characteristics

Practice async fetch, routing, and basic full-stack setup

📂 Tech Stack

Node.js (HTTP/2 + QUIC)

FakeStoreAPI (free + no API key required)

Frontend: HTML, CSS, JavaScript

Self-signed TLS cert for local HTTPS/QUIC

🧪 How It Works

Click “Load via HTTP/2” → Request goes to https://localhost:8443/api/products

Click “Load via HTTP/3” → QUIC request hits quic://localhost:8444

Both servers fetch the same product list from FakeStoreAPI

Frontend displays:

Protocol used

Load time in ms

Grid of product cards

📦 Run the Project
1. Install dependencies
npm install

2. Generate local certificates
mkdir cert
openssl req -x509 -newkey rsa:4096 -nodes -keyout cert/localhost.key -out cert/localhost.crt -subj "/CN=localhost" -days 365

3. Start servers
node server/http2.js
node server/http3.js

4. Open your browser
https://localhost:8443

✔ Why This Project Exists

This project is intentionally small and easy to understand.
It’s designed to help you feel the difference between HTTP/2 and HTTP/3 using real network calls—not simulations. Perfect for learning, experimenting, and expanding into more advanced server work.