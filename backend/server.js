require('./config/db');

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');

var corsOptions = {
    origin: 'http://localhost:3000',
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});