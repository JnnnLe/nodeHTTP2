import fs from "fs";
import http2 from "http2";
import fetch from "node-fetch";

// ------------------- GLOBAL ERROR LOGGING -------------------
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason.stack || reason);
});

// ------------------- CREATE HTTP2 SECURE SERVER -------------------
const server = http2.createSecureServer({
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
});

// ------------------- STREAM HANDLER -------------------
server.on("stream", async (stream, headers) => {
  const path = headers[":path"];
  const method = headers[":method"];

  try {
    // GET /api/products
    if (path === "/api/products" && method === "GET") {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();

      stream.respond({
        "content-type": "application/json",
        ":status": 200,
        "x-protocol": "http2"
      });

      return stream.end(JSON.stringify({ protocol: "http2", data }));
    }

    // GET /
    if (path === "/" && method === "GET") {
      const html = fs.readFileSync("./public/index.html");

      stream.respond({
        "content-type": "text/html",
        ":status": 200
      });

      return stream.end(html);
    }

    // Serve static JS/CSS files
    if ((path.endsWith(".js") || path.endsWith(".css")) && method === "GET") {
      const file = fs.readFileSync(`./public${path}`);
      const type = path.endsWith(".js") ? "application/javascript" : "text/css";

      stream.respond({
        "content-type": type,
        ":status": 200
      });

      return stream.end(file);
    }

    // Fallback for other paths
    stream.respond({ ":status": 404 });
    stream.end("Not found.");

  } catch (err) {
    // Centralized error logging with stack traces
    console.error(`❌ Error handling ${method} ${path}:`, err.stack || err);

    // Respond to client
    stream.respond({ ":status": 500 });
    stream.end("Internal Server Error");
  }
});

// ------------------- START SERVER -------------------
server.listen(8443, () => {
  console.log("HTTP/2 server running at https://localhost:8443");
});
