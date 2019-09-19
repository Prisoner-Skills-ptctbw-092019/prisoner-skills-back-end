const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex')

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./users/users_router.js');
const db = require('./database/dbConfig.js')

const server = express();

const KnexSessionStore = connectSessionKnex(session);

const sessionConfig = {
  name: 'webauth',
  //this should not be hard coded in
  secret: 'Greetings, Nevevar, my old friend.',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true, //the browser cant access via js

  },
  resave: false,
  saveUninitialized: false,
  // where to store?
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 *60
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

server.get('/prisoners', (req, res) => {
  find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/prisoners', (req, res) => {
  let prisoner = req.body;

  add(prisoner)
  
    .then(saved => {

      //create a session 
      //send back a cookie that corponds to session
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function find() {
  return db('prisoners').select('*');
}

async function add(prisoner) {
  const [id] = await db('prisoners').insert(prisoner);
  return (prisoner.name + ' added to the Prisoner Database');
}

server.get('/prisons', (req, res) => {
  findprisons()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/prisons', (req, res) => {
  let prisons = req.body;

  addprisons(prisons)
  
    .then(saved => {

      //create a session 
      //send back a cookie that corponds to session
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
      console.log(error)
    });
});

function findprisons() {
  return db('prisons').select('*');
}

async function addprisons(prisons) {
  const [id] = await db('Prisons').insert(prisons);
  return (prisons.Prison_Name + ' added to the Prison Database');
}
module.exports = server;