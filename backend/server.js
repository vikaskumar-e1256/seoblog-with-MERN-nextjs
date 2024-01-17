const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");

// app
const app = express();

// db
mongoose.connect(process.env.DATABASE_LOCAL, {

    useNewUrlParser: true,

    useUnifiedTopology: true

})
    .then(() => console.log('DB connected'));

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
if (process.env.NODE_ENV == "development") {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}


// routes
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

// port
const port = process.env.PORT || 8001;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});