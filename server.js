const express = require("express");
const app = express();

let cache = { data: null, time: 0 };

app.get("/", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  });

  if (cache.data && Date.now() - cache.time < 300000) {
    return res.send(cache.data);
  }

  try {
    const r = await fetch("https://metin-live.sesisoft.com:7777/api/rank", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "type=1&group_num=14&cunique=132465",
      signal: AbortSignal.timeout(15000),
    });
    const data = await r.text();
    cache = { data, time: Date.now() };
    res.send(data);
  } catch (e) {
    res.status(500).json({
      message: e.message,
      cause: e.cause ? String(e.cause) : null,
      code: e.cause?.code || e.code || null,
    });
  }
});

app.listen(process.env.PORT || 3000);
