const express = require('express');
const cors = require('cors');
const axios = require('axios');

const router = express.Router();

const app = express();
const PORT = 8080;

async function getUsers() {
  const resp = await axios.get('https://randomuser.me/api/?results=5');
  return resp.data;
}

router.get('/users', (req, res) => {
  getUsers()
    .then(data => {
      res.status(200).json({ users: data.results });
    })
    .catch(error => {
      res.status(500).json({ error: 'fetch users failed' });
    });
});

app.use(cors());
app.use('/', router);
app.listen(PORT, () => {
  console.log(`express server started at port ${PORT}`);
});
