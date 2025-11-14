import fs from "fs";
import http2 from "http2";
import fetch from "node-fetch";

// create HTTP2 secure server
const server = http2.createSecureServer({
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
});

// Handle incoming streams HTTP2 doesn't use old-school "req" and "res"
server.on("stream", async (stream, headers) => {

  // custom header
  const path = headers[":path"];
  const method = headers[":method"];

  if (path === "/api/products" && method === "GET") {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();

      stream.respond({
        "content-type": "application/json",
        ":status": 200,
        "x-protocol": "http2"
      });

      return stream.end(JSON.stringify({ protocol: "http2", data }));
    } catch (err) {
      stream.respond({ ":status": 500 });
      return stream.end("Error fetching products");
    }
  }

  // serve frontend: GET
  if (path === "/") {
    const html = fs.readFileSync("./public/index.html");

    stream.respond({
      "content-type": "text/html",
      ":status": 200
    });
    return stream.end(html);
  }

  // serve static files and CSS file
  if (path.endsWith(".js") || path.endsWith(".css")) {
    try {
      const file = fs.readFileSync(`./public${path}`);
      const type = path.endsWith(".js") ? "application/javascript" : "text/css";

      stream.respond({
        "content-type": type,
        ":status": 200
      });

      return stream.end(file);


    } catch {
      stream.respond({ ":status": 404 });
      return stream.end("File not found");
    }
  }

  // fallback: return error feedback
  stream.respond({ ":status": 404 });
  stream.end("Not found.");
});

// server listen for connecttion
server.listen(8443, () => {
  console.log("HTTP/2 server running https://localhost:8443");
})