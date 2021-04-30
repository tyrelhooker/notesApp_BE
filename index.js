require('dotenv').config();
const express = require('express');
const db = require("./db.json");
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note');



const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('reqBody', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));

// Global Variables and Functions
// let notes = db.notes.map(note => note);
// console.log(notes);

// const generateRandomId = () => Math.floor(Math.random() * 10000 + 1);

// ROUTES
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  });
})

// app.get('/info', (req, res) => {
//   const totalnotes = notes.length;
//   console.log(totalnotes);
//   // console.log(notes.length)
//   const calcDate = new Date();
  
//   res.send(
//     `<p>Notebook has info for ${totalnotes} people.</p>
//     <p>${calcDate}</p>`
//   )
// })

// app.get('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const note = notes.find(note => note.id === id);

//   if(note) {
//     res.json(note)
//   } else {
//     res.status(404).end();
//   }
// })

// app.delete('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const newnotes = notes.filter(note => note.id !== id);
//   notes = newnotes;
//   console.log(notes);

//   res.status(404).send('note deleted').end();
// })

// app.post('/api/notes', (req, res) => {
//   const body = req.body;
//   // console.log(body);

//   if(!body.content) {
//     return response.status(400).json({ error: 'content missing'})
//   }

//   const note = {
//     id: generateRandomId(),
//     content: body.content,
//     date: new Date(),
//     important: body.important || false
//   }

//   notes = notes.concat(note);
//   // console.log(notes);

//   res.json(note);
// })

// app.put('/api/notes/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const body = req.body;
//   // console.log(body);

//   const note = {
//     id: body.id,
//     content: body.content,
//     date: body.date,
//     important: body.important
//   }

//   console.log("beforeFind", notes);

//   notes.find(n => n.id === id).important = note.important;
  
//   console.log("afterFind:", notes);
  
//   res.json(note)
// })

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));