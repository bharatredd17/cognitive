const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const loginroute = require("./api/Routes/users.js");
const authroute = require("./api/Routes/auth.js");
const autisamroute = require("./api/Routes/autisam.js");
const dislexiaroute = require("./api/Routes/dislexia.js")
const activityroute = require("./api/Routes/activity.js")
const { loginUser } = require("./api/models/loginuser.js");
const { Activity } = require("./api/models/activity.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
const PORT = 5000;
app.use(bodyParser.json());
app.use(express.json())
const User = require("./api/models/user.js");
mongoose.connect("mongodb+srv://kbhanu5125:dGEfmiRgDexoIU8u@psproject.if85nzf.mongodb.net/?authSource=PSProject&authMechanism=SCRAM-SHA-1");
app.use("/api/loginusers", loginroute)
app.use("/api/auth", authroute)
app.use("/api/autisam", autisamroute)
app.use("/api/dislexia", dislexiaroute)
app.use("/api/activity", activityroute)

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateUser', async(req, res) => {
  const {id, fname, lname, email, dob, age, gender, adress, contact, education, city, state, pincode} = req.body
  try{
    await User.updateOne({_id: id},{
      $set: {
        fname: fname,
        lname: lname,
        email: email,
        dob: dob,
        age: age,
        gender: gender,
        adress: adress,
        contact: contact,
        education: education,
        city: city,
        state: state,
        pincode: pincode
      }
    })
    return res.json({status: "ok", data: "Updated"})
  }
  catch(error) {
    return res.json({status: "error", data: error})
  }
})

app.get("/getusers", async (req, res) => {
  try {
    const allUser = await User.find({})
    res.send({allUser})
  } catch (error) {
    console.log(error)
  }
})
app.get("/user-details/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const userDetails = await User.findOne({ email: email });
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get("/getemail", async (req, res) => {
	try {
	  const allEmail = await loginUser.find({})
	  res.send({allEmail})
	} catch (error) {
	  console.log(error)
	}
})

app.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token, "jJPh462VRjobOmXgzElwt2t7pYiq7zCm", (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              loginUser.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
      }
  })
})

app.post('/forgot-password', (req, res) => {
  const {email} = req.body;
  loginUser.findOne({email: email})
  .then(user => {
      if(!user) {
          return res.send({Status: "User not existed"})
      } 
      const token = jwt.sign({id: user._id}, "jJPh462VRjobOmXgzElwt2t7pYiq7zCm", {expiresIn: "1d"})
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'kbhanu5125@gmail.com',
            pass: 'jfmg zubn bxub gyyi'
          }
        });
        
        var mailOptions = {
          from: 'kbhanu5125@gmail.com',
          to: email,
          subject: 'Reset Password Link',
          text: "https://final-ps.vercel.app/reset_password/" + user._id + "/" + token 
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            return res.send({Status: "Success"})
          }
        });
  })
})

app.post('/api/exchange-code', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', // Specify JSON response format
      },
      body: JSON.stringify({
        client_id: 'a9c2dea3c6f7faa3ddd5',
        client_secret: '652fa2382702d0bcd5a032e92debc226a260e979',
        code,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access_token;

      // Fetch user details using the obtained access token
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        res.status(200).json({ user: userData });
      } else {
        res.status(500).json({ error: 'Error fetching user data from GitHub API' });
      }
    } else {
      res.status(500).json({ error: 'Error exchanging code for access token' });
    }
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/microsoft/user', async (req, res) => {
  const { authorization } = req.headers;

  try {
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: authorization,
      },
    });

    const user = await userResponse.json();
    res.json(user);
  } catch (error) {
    console.error('Microsoft User Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/activityset/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const userDetails = await Activity.findOne({ email: email });
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});