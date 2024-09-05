/*
const express = require('express');
const app = express(); //express app
const ejs=require('ejs') //ejs
const path=require('path') 
var http = require('http'); //http server
var server = http.createServer(app);
var io = require('socket.io')(server); //web socket connection
const PORT=process.env.PORT||3300 //enviroment port
app.use(express.static(__dirname)); //static file loc

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); //joins 
  });

  io.on('connection', function(socket){ //ws connection done
    console.log('user connected');
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`); //listening to port 3300
});
*/
var express = require('express')
var app = express()
var http = require('http').createServer(app);
const path = require('path');
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
//user model
const User = require("./app/models/user");
// web socket connention
var io = require('socket.io')(http);
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { get } = require('http');
const { Socket } = require('dgram');
const mongoose = require('mongoose');
const session = require('express-session');

const flash = require('express-flash');

const MongoStore = require('connect-mongo');
const cartController = require('./app/http/controllers/cartController');
const menuController = require('./app/http/controllers/menuController');
//menu model fir merch store
const Menu = require('././app/models/menu');

//database connection
const url = 'mongodb://localhost:27017/valorant';
const connection = mongoose.connection;
mongoose.connect(url).then(() => {
  console.log('Db connected');
  connection.once('open', () => {
    console.log('mongoose connectionn opened');
  });
}).catch(err => {
  console.error('connection error:', err.message);
});

//sesson store, uses db instead of memory 
let mongoStore = MongoStore.create({
  mongoUrl: url,
  collectionName: 'sessions'
})
//session config(session works as a middleware)
app.use(session({
  secret: 'secretkey',
  resave: false,
  store: mongoStore, //to store in dbinstead of mem
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } //cookie age
}));

/*
app.use(express.static(__dirname));
app.use(flash()); //using flash as  middleware so use keywords
app.use(express.urlencoded({extended:false}));
app.use(express.json()); //converts incoming data to json format
//app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, 'index.html')); //joins 
  //res.render('index.html');
//}); 
*/
/*
//global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session;
  res.locals.user=req.user;
  next(); //process request forward
})
*/
// Other requires...
app.use(session({
  secret: "YourSecretKey",
  resave: false,
  saveUninitialized: false
}));

app.set('views', path.join(__dirname, 'resources', 'views')); //setting foldwe fir views
app.set('view engine', 'ejs'); //setting ejs
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'app'))); //static file loc for style and js files
app.use(flash()); //using flash as  middleware so use keywords
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //converts incoming data to json format



// ROUTES
//=====================================================================================
// Showing home page
app.get("/", function (req, res) {
  res.render("index",{ username: req.user ? req.user.username : null });
});
app.get("/art", function (req, res) {
  res.render("art");
});
app.get("/order", function (req, res) {
  res.render("order");
})
app.get('/cart', function (req, res) {
  // Check if session.cart exists and has items
  if (req.session.cart && req.session.cart.items) {
    // Access de   cart itemsss
    const cartItems = req.session.cart.items;
    // Renderfer the view with cart items
    res.render('cart', { session: req.session, cartItems: cartItems });
  } else {
    // Render the view without cart items or handle the absence of cart items
    res.render('cart', { session: req.session, cartItems: [] });
  }
});
//post functions and controllers
app.post('/update-cart',cartController().update);
app.post('/clearCart', cartController().clearCart);

app.get("/chat", function (req, res) {
  res.render("chat");
});
//absolute path
app.get("/featured", menuController().index1);
app.get("/apparel", menuController().index2);
app.get("/coll", menuController().index3);
app.get("/acc", menuController().index4);
app.get("/sale", menuController().index5);
app.get("/indexchat", function (req, res) {
  res.render("indexchat");
});
app.get("/media", function (req, res) {
  res.render("media");
});
app.get("/news", function (req, res) {
  res.render("news");
});


//login authentication routes=================================
app.post('/register', function (req, res) {
  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username 
    }), req.body.password, function (err, msg) {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successful" });
      }
    }
  )
})
app.get('/login',function(req,res){
  res.render("login");
})
/*
  Login routes -- This is where we will use the 'local'
  passport authenciation strategy. If success, send to
  /index, if failure, send baxk to /login
*/
// Update login route to handle login form submission
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login', // Redirect to login page if authentication fails
  successRedirect: '/'
   // Redirect to profile page if authentication succeeds
}));
// Add a route for logout
// Add a route for logout
app.get('/logout', function(req, res){
  req.logout(function(){
    // Perform any post-logout actions here
    res.redirect('/'); // Redirect to home page after logout
  });
});

// Modify the profile route to check if user is authenticated
app.get('/profile', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user }); // Render profile page if authenticated
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
});
app.get('/login-failure', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt Failed.');
});

app.get('/login-success', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt was successful.');
});

/*
  Protected Route -- Look in the account controller for
  how we ensure a user is logged in before proceeding.
  We call 'isAuthenticated' to check if the request is 
  authenticated or not. 
*/
app.get('/profile', function(req, res) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    res.json({ message: 'You made it to the secured profie' })
  } else {
    res.json({ message: 'You are not authenticated' })
  }
})


//require('./routes/web')(app); //connects express to web.js
//checks enviroment port 
http.listen(process.env.PORT || 5000, function () {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

//run when client connects
const botname = 'Admin  ';
io.on('connection', function (socket) {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    console.log('Client connected to the WebSocket');
    //welcome current user 
    socket.emit('message', formatMessage(botname, 'welcome to Valorant Connect!'));
    //broadcasts when  a user connects
    //connecting to  all clients in general thats why its broadcast baby 
    socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat`)); //omitting to a specific room
    //send users and room info (gonna pass object)
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  //listen for chatMessage
  socket.on('chatMessage', function (msg) {
    console.log("Received a chat message");
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  //runs when client disconnects 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {  //if user exists
      io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the chat`));
    }
    //send users and room info (gonna pass object)
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
})