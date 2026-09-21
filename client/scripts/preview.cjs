/* Serves the production bundle for visual QA; compatible with the supervised preview. */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.slice(2);
const value = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(__dirname, "../build");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};
http
  .createServer((req, res) => {
    let url;
    try {
      url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400);
      return res.end();
    }
    if (url === "/__qa__") {
      const query = new URL(req.url, "http://localhost").searchParams;
      const width = Math.min(
        1920,
        Math.max(320, Number(query.get("width")) || 390),
      );
      const height = Math.min(
        1200,
        Math.max(500, Number(query.get("height")) || 844),
      );
      res.writeHead(200, {
        "Content-Type": "text/html",
        "Cache-Control": "no-store",
      });
      return res.end(
        `<html><head><title>Responsive QA</title></head><body style="margin:0;background:#39443d;padding:16px"><iframe title="Portfolio responsive preview" src="/" style="width:${width}px;height:${height}px;border:0;border-radius:12px"></iframe></body></html>`,
      );
    }
    const file = path.resolve(root, "." + url);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      return res.end();
    }
    const requested =
      fs.existsSync(file) && fs.statSync(file).isFile()
        ? file
        : path.join(root, "index.html");
    res.writeHead(200, {
      "Content-Type":
        mime[path.extname(requested)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(requested).pipe(res);
  })
  .listen(Number(value("--port", 4173)), value("--host", "127.0.0.1"), () =>
    console.log("Production preview ready"),
  );
