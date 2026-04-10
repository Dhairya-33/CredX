// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRouter = require('./routes/api');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 })); // 100 req per minute

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send({
    message: "TrustChainX Autonomous Intelligence Network is Online",
    status: "Active",
    version: "v1.0.4",
    network: "Polygon Mumbai / Mainnet Ready"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
