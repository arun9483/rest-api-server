const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');

const app = express();
app.use(express.static(__dirname));

app.use(cors());
const router = express.Router();

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

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, path.join(__dirname, '/uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.route('/upload-avtar').post(upload.single('avtar'), (req, res) => {
  const imageData = req.file.path;
  console.log('imageData', imageData);
  res.status(200).json({
    success: true
  });
});

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`express server started at port ${PORT}`);
});
