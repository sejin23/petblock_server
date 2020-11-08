const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/uploads', express.static('uploads'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/PetBlock');

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
    console.log("Connected to mongod server");
})

app.use('/api', require('./routers'));
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})