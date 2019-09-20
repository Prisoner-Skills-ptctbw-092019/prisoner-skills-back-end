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

server.use('/auth', authRouter);
server.use('/users', usersRouter);

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

server.get('/prisons/:id', (req, res) => {

  const { id } = req.params;

  return db('Prisoners').select('*')
  .where('prisonID', '=',  id )
  .then(prisoners => {
    res.json(prisoners);
  })
  .catch(error => {
    res.status(500).json({
        message: 'Invalid Prison ID'
     })
})
})

server.put('/prisons/:id', (req, res) => {
  const changes = req.body

  db('Prisons')
  .where('prisonID', '=', req.params.id)
  .update(changes)

  .then(count => {
    if(count > 0) {
      res.status(200).json({
        message: 'Prison Updated'
      })
    } else {
      res.status(404).json({ 
          message: 'ID seems to be incorrect' 
        })
    }
  })
  .catch(error => {
    res.status(500).json({
        message: 'Could not update!'
    })
  })
})

server.delete('/prisons/:id', (req, res) => {

  db('Prisons')
  .where('prisonID', '=', req.params.id)
  .del()
 
  .then(count => {
     if(count > 0) {
       res.status(200).json({
         message: 'Prison Deleted'
       })
     } else {
       res.status(404).json({
           message: 'ID doesnt seem to exist'
         })
     }
  })
  .catch(error => {
    res.status(500).json({
        message: 'Could not delete'
     })
  })
 })

module.exports = server;