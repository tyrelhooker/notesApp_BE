require('dotenv').config();
const express = require('express');
const db = require("./db.json");
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note');
const { response } = require('express');



const app = express();

// MIDDLEWARE
app.use(express.static('build'));
app.use(express.json());

morgan.token('reqBody', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));



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

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end();
      }
    })
    // .catch(error => {
    //   console.log(error);
    //   res.status(400).send({ error: 'malformatted id' });
    // })
    .catch(error => next(error));
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
//   const id = Number(req.params.id);
//   const newnotes = notes.filter(note => note.id !== id);
//   notes = newnotes;
//   console.log(notes);

//   res.status(404).send('note deleted').end();
})

app.post('/api/notes', (req, res) => {
  const body = req.body;
  // console.log(body);

  if(!body.content) {
    return res.status(400).json({ error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote);
    })
    .catch(error => next(error));

  // My original put route
  // Note.findById(req.params.id)
  //   .then(note => {
  //     note.important = body.important
  //     note.save().then(changedNote => {
  //       res.json(changedNote);
  //     })
  //   })
  //   .catch(error => next(error));
})

// MIDDLEWARE - MUST BE AFTER THE ROUTES AND LAST MIDDLEWARE
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));