const axios = require('axios');
const bcrypt = require('bcryptjs')
const DB = require('./helpers')
const jwt = require('jsonwebtoken')
const dbs = require('../database/dbConfig')

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};



function generateToken(user) { 
  const payload = {
      subject: user.id , 
      username: user.username,
      
  };
  const secret = "secret"

  const options = {
      expiresIn: "1d",

  }

  return jwt.sign(payload, secret, options)
}





function register(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;

  if (req.body.username && req.body.password) {
    dbs('users')
      .insert(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
}}



//===================

function login(req, res) {

  const password = req.body.password
  const username = req.body.username

  dbs('users')
  .where({username})
  .first()

  .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
          
          const token = generateToken(user); 

          res.status(200).json({ message: `Welcome ${user.username}`, token })
      } else {
          res.status(401).json({ 
              message: 'YOU SHALL NOT PASS' 
           })
      }
  })
  .catch( error => {
      res.status(500).json({message: "no work"})
  })
  
}



function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
