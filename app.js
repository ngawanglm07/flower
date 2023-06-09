//jshint esversion:6
require('dotenv').config();
const express =  require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("cookie-session");
const passportLocalMongoose = require("passport-local-mongoose");

require('mongodb')
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret:"this is a sec",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb+srv://ngawang:sexyass@cluster0.7h0rl9g.mongodb.net/autth?retryWrites=true&w=majority`,{useNewUrlParser:true , useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);




passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// userSchema.plugin(encrypt,{secret:secrets , encryptedFields:["password"]});




app.post("/register",function(req,res){
    
 User.register({username:req.body.username},req.body.password , function(err,user){
    if(err){
        console.log(err);
    } else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
 })


});

app.post("/login",function(req,res){
  
const user = new User({
    username: req.body.username ,
    password: req.body.password
})

req.login(user,function(err){
    if(err){
        console.log(err);
    } else {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        });
    }
});
});


app.get("/secrets",function(req,res){

    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
    
})

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});


app.get("/register",function(req,res){
    res.render("register");
})



app.listen(3000,function(){
console.log("server started at port 3000");
});