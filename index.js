const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/app.js')
const app = express();
// register view engine
app.set('views','views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', indexRouter);

const port = 3000;

// Importing data from our fake database file
const users = require('./users');
const posts = require('./posts');

app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded data
app.use(bodyParser.json({ extended: true })); // To handle JSON data


// Creating Get route for the entire posts database.

app.get('/posts', (req, res) => {
  res.json(posts);
});

// GET all USERS
app.get('/users', (req, res) => {
  res.json(users);
});

// Creating a simple GET route for individual users,
// using a route parameter for the unique id

app.get('/users/:id', (req, res, next) => {
  const user = users.find((u) => u.id == req.params.id);
  if (user) res.json(user);
  else next();
});

app.get('/posts/:id', (req, res, next) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) res.json(post);
  else next();
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      users.splice(i, 1);
      return true;
    }
  });

  if (user) res.json(user);
  else next();
});

// POST USER - create a new user
app.post('/users', (req, res) => {
  // Within the POST request route, we create a new

  if (req.body.name && req.body.username && req.body.email) {
    if (users.find((u) => u.username == req.body.username)) {
      res.json({ error: `Username already taken` });
      return;
    }

    const newUser = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    };

    users.push(newUser);
    res.json(users[users.length - 1]);
  } else {
    res.json({ error: 'Insufficient Data' });
  }
});

// Custom 404 (not found) middleware.

app.use((req, res) => {
  res;
  res.status(404);
  res.json({ error: `Resource Not Found` });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
