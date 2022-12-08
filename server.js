const express = require('express')
const path = require('path'); // Finds directory 
const fs = require('fs') // Allows data persistence by writing a file

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to stringify 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static middleware
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html'))) 
// OBSERVATION: Not necessary for the main page to open
// QUESTOIN: Why isn't it necessary?

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html'))) // added
// QUESTION: Is public needed? 

/// Previously getting URL not found errors. index.js had URLs, but the server did not have the URLs
app.get('/api/notes', (req, res) => {
  /// send message to the client
  // res.status(200).json(`${req.method} request received`) /// Verified received at URL/api/notes
  
  /// send message to the terminal
  console.info(`${req.method} request received`) /// verified received in terminal

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const parsedPost = JSON.parse(data)
      console.log('parsedPost', parsedPost) /// verified received in terminal as an array of objects
      console.log('stringify:', JSON.stringify(parsedPost)) /// not necessary, but to see what it does
      res.status(200).json(parsedPost) /// If I comment this out, then the code stops here. It does not move from getNotes to here and back to renderNoteList function. I had a console.log("Hello"). It didn't come through. It didn't come through because there was no response.
    }})
})

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body
  const newPost = {
    title,
    text
  }
  console.log('newPost', newPost) /// verified

  /// Requires both fs.readFile and fs.writeFile
  /// fs.readFile gets existing data. Push new data. Re-write the file using fs.writeFile
  /// Add to write to db.json file
  // fs.writeFile('./db/db.json', JSON.stringify(note))

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const parsedPost = JSON.parse(data)
      parsedPost.push(newPost)

      fs.writeFile('./db/db.json', JSON.stringify(parsedPost), (err) => err ? console.error(err) : console.info('Success')) /// verified, received success
      res.status(200).json(parsedPost)
    }
  })
})



// Starts the server to begin listening
app.listen(PORT, () => {
  console.log('Server listening on: http://localhost:' + PORT)
})
