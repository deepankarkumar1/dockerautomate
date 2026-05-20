const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('CI/CD Pipeline Running Successfully');
});

app.listen(3090, () => {
    console.log('Server running on port 3090');
});
