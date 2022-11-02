const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Connected !');
    console.log('Server Running on Port:3000');
});

app.get('/', (req,res) => {
    res.render('dashboard.ejs');
});

app.get('/hasil-pencarian', (req,res) => {
    res.render('pencarian.ejs')
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs');
})

app.get('/bookings', (req, res) => {
    res.render('bookings.ejs');
})

app.get('/rooms', (req, res) => {
    res.render('rooms.ejs');
})

// Initiation
app.use(express.static('Public'));