const express = require('express')
const mongoose = require('mongoose')
const config = require('config')


const app = express();

app.use(express.json());

const db = config.get('mongoURI');

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/jobspost', require('./routes/api/jobspost'));
app.use('/api/applicantProfile', require('./routes/api/applicantProfile'))
app.use('/api/recruiterProfile', require('./routes/api/recruiterProfile'))
app.use('/api/viewJobs', require('./routes/api/viewJobs'))
app.use('/api/applicantJob', require('./routes/api/applicantJob'))


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));