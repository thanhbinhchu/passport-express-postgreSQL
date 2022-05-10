require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')

const flash = require('express-flash')
const session = require('express-session')

const methodOverride = require('method-override')

const {pool} = require("./dbConfig")

initializePassport(
    passport
)


app.set("view-engine", "ejs")
app.use(express.urlencoded({extended :false})) //---> important

app.use(flash())

app.use(session({

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false,
}
))

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))



app.get('/',(req,res) => {
    res.render('index.ejs', {name : req.user.name})
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
  });
  
  app.get("/login",(req, res) => {
    // flash sets a messages variable. passport sets the error message
    
    res.render("login.ejs");
  });


app.post('/login', passport.authenticate('local',{
    successRedirect :'/',
    failureRedirect :'/login',
    failureFlash :true,
}))



app.post('/register', async(req,res) => {
    let {name, email, password} = req.body;

    console.log({
        name,
        email,
        password
    });

    let errors = [];

    if(!name || !email || !password){
        errors.push({message : "Please enter your information"})
    }

    if(password.length < 2){
        errors.push({message : " Password should be at least 2 characters"})
    }

    if(errors.length > 0){
        res.render("register", {errors , name, email, password});
    }else{

    const hashedPass = await bcrypt.hash(password, 10);

    pool.query(
        `SELECT * FROM users WHERE email = $1`,[email],
        (err, results) => {
            if (err){
                throw err;
            }
            console.log(results.rows);

            if(results.rows.length >0 ){
                errors.push({message : "Email already existed"})
                res.render("register.ejs", {errors})
            }else{
                pool.query(
                    `INSERT INTO users (name,email,password) VALUES ($1,$2,$3)
                    RETURNING id, password`, [name,email,hashedPass],

                    (err,results) => {
                        if (err){
                            throw err
                        }
                        console.log(results.rows)
                        req.flash('success_msg', "You are already added new account")
                        res.redirect("/login")
                    }
                )
            }
        }

    )

    }
    
})

app.delete('/logout',(req,res) => {
    req.logOut(),

    res.redirect("/login")
})

app.listen(4000)