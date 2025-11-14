import fs from "fs";
import http2 from "http2";
import fetch from "node-fetch";

// create HTTP2 secure server
const server = http2.createSecureServer({
  key: fs.readFileSync("./cert/localhost.key"),
  cert: fs.readFileSync("./cert/localhost.cert"),
});

// Handle incoming streams HTTP2 doesn't use old-school "req" and "res"
server.on("stream", async (stream, headers) => {

  // custom header
  const path = headers[":path"];
  const method = headers[":method"];

  if (path === "/api/products" && method === "GET") {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
  }

  stream.respond({
    "content-type": "application/json",
    ":status": 200,
    "x-protocol": "http2"
  });

  return stream.end(JSON.stringify({ protocol: "http2", data }));
});

// server listen for connecttion
server.listen(8443, () => {
  console.log("HTTP/2 server running https://localhost:8443");
})