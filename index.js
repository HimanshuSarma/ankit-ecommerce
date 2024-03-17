require('dotenv').config();
const express = require('express');
const expressFormidable = require('express-formidable');
const cors = require('cors');
const bodyParser = require('body-parser');

const { createDBConnection } = require('./database/mongodb/connection');
const { indexRouter } = require('./routes/index');

const app = express();

app.use(cors({
    origin: '*'
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));
app.use(express.json({ limit: '10MB' }));
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
    createDBConnection();
    app.use(`/api/v1`, indexRouter);
});