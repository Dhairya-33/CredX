// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRouter = require('./routes/api');

const app = express();
app.use(cors()); // CORS first
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 })); // 100 req per minute

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send({
    message: "TrustChainX Credential Intelligence Network is Online",
    status: "Active",
    version: "v2.0.0",
    network: "Polygon Amoy / Mainnet Ready"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
