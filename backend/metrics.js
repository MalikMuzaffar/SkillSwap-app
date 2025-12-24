import client from 'prom-client';
import os from 'os';

const register = new client.Registry();

export const cpuUsageGauge = new client.Gauge({
  name: 'system_cpu_usage_percent',
  help: 'Total system CPU usage in percent'
});

export const memoryUsageGauge = new client.Gauge({
  name: 'system_memory_usage_percent',
  help: 'Total system memory usage in percent'
});

export const serverStateGauge = new client.Gauge({
  name: 'server_state',
  help: 'Server state',
  labelNames: ['state']
});

register.registerMetric(cpuUsageGauge);
register.registerMetric(memoryUsageGauge);
register.registerMetric(serverStateGauge);

export function updateSystemMetrics() {
  // Server is UP when /metrics is hit
  serverStateGauge.reset();
  serverStateGauge.set({ state: 'UP' }, 1);

  // Memory (%)
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  memoryUsageGauge.set(((totalMemory - freeMemory) / totalMemory) * 100);

  // CPU (%)
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  cpus.forEach(cpu => {
    for (const type in cpu.times) total += cpu.times[type];
    idle += cpu.times.idle;
  });

  cpuUsageGauge.set(((total - idle) / total) * 100);
}

export default register;






// import express from "express";
// import client from "prom-client";

// const router = express.Router();

// // Collect default Node.js metrics
// client.collectDefaultMetrics({ timeout: 5000 });

// // Define route at "/"
// router.get("/", async (req, res) => {
//   try {
//     res.set("Content-Type", client.register.contentType);
//     res.end(await client.register.metrics());
//   } catch (err) {
//     res.status(500).end(err);
//   }
// });

// export default router;
