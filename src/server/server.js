const express = require('express');
const app = express();
const PORT = 43214;

// Uses express v4. Doc: https://expressjs.com/en/api.html
app.use('/', express.static('public'));

app.get('/api', (req, res) => {
    res.send('API: Hello World!')
});

app.listen(PORT, () => console.log(`The app listening on port http://localhost:${PORT}`));
