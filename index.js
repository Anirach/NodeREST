const express = require('express');
const Sequelize = require('sequelize');
const app = express();
// parse incoming requests
app.use(express.json());

// set db url
const dbUrl = 'postgres://webadmin:MGFnmx63258@node56609-anirach-noderest.proen.app.ruk-com.cloud:11584/Books'
//const dbUrl = 'postgres://webadmin:MAIgsf81141@node40729-noderest.proen.app.ruk-com.cloud:11478/Books'
// create a connection to the database
const sequelize = new Sequelize(dbUrl);
// define the Book model
const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// create the books table if it doesn't exist
sequelize.sync();

// route to get all books
app.get('/books', (req, res) => {
  Book.findAll().then(books => {
    res.json(books);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to get a book by id
app.get('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      res.json(book);
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to create a new book
app.post('/books', (req, res) => {
  Book.create(req.body).then(book => {
    res.send(book);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to update a book
app.put('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      book.update(req.body).then(() => {
        res.send(book);
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      book.destroy().then(() => {
        res.send({});
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
