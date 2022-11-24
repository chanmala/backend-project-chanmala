var express = require('express');
var router = express.Router();

const fs = require('firebase-admin');
const serviceAccount = require('../key.json'); 
fs.initializeApp({
 credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();

         
//=------------------------------
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});          

      
             //  register

//------------------------ 
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


//---------------------
router.post('/register', async (req, res, err) => {
  try {
    const u = await db.collection("users").where("username", "==", req.body.username).get()
   if (u.empty == false) {
      return res.render('error', {msg : "User already exist"})
   }
    const id = req.body.username;
    const userJson = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };
    const usersDb = db.collection('users'); 
    const response = await usersDb.doc(id).set(userJson);
  return  res.render('success', { username: userJson.username });
  } catch(err) {
    res.status(500)

    res.json(err);
  }  
});

              // Login

//------------------
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
      

//-----------------
router.post('/login', async (req, res, err) => {
  try {
    const userRef = db.collection("users").doc(req.body.username);
    const response = await userRef.get()
    if (response.exists === false ){
      return res.render('error', {msg:"User not found"});
    }
    if (response.data().password !== req.body.password) {
      return res.render('error', {msg:"Password invalid"});
    }
  return  res.render('success', {username :req.body.username});
  } catch(err) {
    res.status(500)
    res.json(err);
  }  
});

module.exports = router;
