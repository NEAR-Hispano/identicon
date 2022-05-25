const config = require('./config');

const compression = require('compression')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan-body');
const { sequelize } = require("./models");

const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(compression());

const port = config.general.port;

// Routes
const utilsRoutes = require('./routes/utils');
const accountsRoutes = require('./routes/accounts');

process.env.uuid = uuidv4();

app.use(cors());
app.use(express.json({ limit: '25mb', type: ["application/json", "text/plain"] }));
app.use(express.urlencoded({ extended: true }));

const logger = {
  write: message => {
    console.log(process.env.uuid, ' - ', message);
  },
};

morgan(app, {
  stream: logger,
  prettify: false,
  maxBodyLength: 2000
});

app.use('/v1/health', utilsRoutes);
app.use('/v1/accounts'/*, AuthMiddleware*/, accountsRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Sequelize drop and re-sync db completed");
  app.listen(port, () => {
    console.log(`Api started at http://localhost:${port}`);
  });
});
