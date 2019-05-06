const express = require('express');
const path = require('path');
const port = require('./serverConfig');

const app = express();

const htmlPath = path.join(path.dirname(__dirname), 'dist');
app.use(express.static(htmlPath));
app.set('views', htmlPath);

app.use((req, res) => res.sendFile(path.join(htmlPath, 'index.html')));

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
