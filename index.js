const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "",
    database: "user_details"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// USER REGISTERATION
app.post('/user/register', (req, res) => {
    console.log(req.body);
    
    // Checking email already exists or not
    const checkSql = "SELECT * FROM user_management WHERE email = ?";
    db.query(checkSql, [req.body.email], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(401).json('Resgiter request failed due to',err)
        }
        
        if (results.length > 0) {
            // Email already exists
            return res.status(406).json(`Account with this email already exist ..! Please try to use different email`)
        } else {

            const insertSql = "INSERT INTO user_management (`name`, `email`, `company`, `password`) VALUES (?, ?, ?, ?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.company,
                req.body.password
            ];
            db.query(insertSql, values, (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(401).json(`Something unexpected has occurred: `,err);
                }
                console.log('User registered successfully');
                return res.status(200).json(`User registered successfully`);
            });
        }
    });
});

// USER LOGIN
app.post('/user/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user with the provided email exists
    const checkSql = "SELECT * FROM user_management WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(401).json(`Something unexpected has occurred: `, err );
        }
        
        if (results.length === 0) {
            // Email does not exist
            return res.status(401).json(`User with this email does not exist`);
        } else {
            const user = results[0];
            if (user.password === password) {
                return res.status(200).json(`User logged in successfully`);
            } else {
                return res.status(406).json(`Invalid password`);
            }
        }
    });
});

// GET USER
app.get('/get/user/:email', (req, res) => {
    const email = req.params.email;

    // Check if user with the provided email exists
    const checkSql = "SELECT * FROM user_management WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(401).json('Something unexpected has occurred: ', err);
        }
        
        /* if (results.length === 0) {
            // Email does not exist
            return res.status(404).json('User with this email does not exist');
        } */ 
        else {
            const user = results[0];
            return res.status(200).json(user);
        }
    });
});


app.get('/', (req, res) => {
    return res.json("From Backend side");
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
