const { json } = require("body-parser");
const { response } = require("express");
const express = require("express");
const fileupload = require('express-fileupload');
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload());

// database connect
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "honancehotel",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Database Connected !"); // if connect success
});

// get dashboard
app.get("/", (req, res) => {
  connection.query("SELECT * FROM rooms", (err, rows) => {
    if (err) throw err;
    if (rows.length < 0) return false;
    let response = JSON.parse(JSON.stringify(rows));
    res.render("dashboard.ejs", {
      data: response,
    });
  });
});


app.get("/hasil-cari/:id_room", (req,res) => {
  const {id_room} = req.params;
  console.log(id_room);
  connection.query(`SELECT * FROM rooms WHERE id_room = '${id_room}'`, (err,rows) => {
    if (err) throw err;
    let response = JSON.parse(JSON.stringify(rows));
    res.render("pencarian.ejs", {
      data: response,
    });
  })
})

app.get("/checkin/:id_room", (req,res) => {
  const {id_room} = req.params;
  connection.query(`SELECT * FROM rooms WHERE id_room = '${id_room}'`, (err,rows) => {
    if (err) throw err;
    let response = JSON.parse(JSON.stringify(rows));
    res.render("checkin.ejs", {
      data: response,
    });
  })
})

app.get("/pembayaran", (req,res) => {
      res.render("pembayaran.ejs");
})

// get admin page
app.get("/admin", (req, res) => {
  connection.query("SELECT * FROM bookings", (err, rows) => {
    if (err) throw err;
    connection.query("SELECT * FROM rooms", (err, rows2) => {
      if (rows2.length < 0) return false;
      connection.query("SELECT * FROM bookings", (err, rows3) => {
        if (rows3.length < 0) return false;
        let jumlahKamar = rows2.length;
        let jumlahBooking = rows3.length;
        let response = JSON.parse(JSON.stringify(rows));
        res.render("admin.ejs", {
          data: response,
          jumlahK: jumlahKamar,
          jumlahB: jumlahBooking,
        });
      });
    });
  });
});

// Get data bookings from database
app.get("/bookings", (req, res) => {
  // query to get data bookings
  connection.query("SELECT * FROM bookings", (err, rows) => {
    let response = JSON.parse(JSON.stringify(rows)); // parsing
    if (err) throw err;
    res.render("bookings.ejs", {
      data: response,
    });
  });
});

// Get data rooms then join with facilities from database
app.get("/rooms", (req, res) => {
  // query to get data rooms
  connection.query("SELECT * FROM rooms JOIN facilities ON facilities.id_facilities=rooms.id_facilities", (err, rows) => {
    if (err) throw err;
    let response = JSON.parse(JSON.stringify(rows));
    res.render("rooms.ejs", {
      data: response,
    });
  });
});

// form tambah
app.get("/formtambah", (req, res) => {
  res.render("formTambah.ejs");
});

// method tambah data
app.post("/tambah", (req, res) => {
  let idRoom = req.body.id_room;
  let nameRoom = req.body.name_room;
  let facilities = req.body.facilities;
  let quantity = req.body.quantity;
  let price = req.body.price;

  console.log(nameRoom);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.photo;
  uploadPath = __dirname + "/public/img/rooms/" + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    connection.query(
      `INSERT INTO rooms(id_room,name_room,id_facilities,quantity_room,price_room) VALUES('${idRoom}','${nameRoom}','${facilities}','${quantity}','${price}')`,
      (err, result) => {
        if (err) throw err;
        res.redirect("/rooms");
      }
    );
  });
});

// method delete data
app.get("/delete/:id_room", (req, res) => {
  connection.query(
    `DELETE FROM rooms WHERE id_room='${req.params.id_room}'`,
    (req, rows) => {
      res.redirect("/rooms");
    }
  );
});

// halaman update
app.get("/update/:id_room", (req, res) => {
  connection.query(
    `SELECT * FROM rooms WHERE id_room='${req.params.id_room}'`,
    (req, rows) => {
      let hasil = JSON.parse(JSON.stringify(rows));
      res.render("formUpdate.ejs", { data: hasil });
    }
  );
});

// method post data
app.post("/updateroom", (req, res) => {
  let idRoom = req.body.id_room;
  let idRoom2 = req.body.id_room2;
  let nameRoom = req.body.name_room;
  let facilities = req.body.facilities;
  let quantity = req.body.quantity;
  let price = req.body.price;
  connection.query(
    `UPDATE rooms SET id_room='${idRoom}',name_room='${nameRoom}',id_facilities='${facilities}',quantity_room='${quantity}',price_room='${price}' WHERE id_room='${idRoom2}'`,
    (err, rows) => {
      res.redirect("/rooms");
    }
  );
});

app.listen(3000, () => {
  console.log("Server Running on http://localhost:3000");
});