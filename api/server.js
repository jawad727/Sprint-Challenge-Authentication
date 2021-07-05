const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());


// Sanity check (works)
server.get('/', (req, res) => {
    res.send(
        `<h1>working</h1>`
    )
 })

configureRoutes(server);

module.exports = server;
