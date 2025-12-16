// import client from "prom-client";
// import express from "express";

// const router = express.Router();

// // Collect default metrics (CPU, memory, event loop)
// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics({ timeout: 5000 });

// router.get("/metrics", async (req, res) => {
//   try {
//     res.set("Content-Type", client.register.contentType);
//     res.end(await client.register.metrics());
//   } catch (err) {
//     res.status(500).end(err);
//   }
// });

// export default router;


import express from "express";
import client from "prom-client";

const router = express.Router();

// Collect default Node.js metrics
client.collectDefaultMetrics({ timeout: 5000 });

// Define route at "/"
router.get("/", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default router;
