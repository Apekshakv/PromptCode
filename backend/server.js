const express = require("express");
const mongoose = require("mongoose");


const app = express();


const cors = require("cors");


app.use(cors({
  origin: 'https://my-project-eight-beige-90.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.options('/{*path}', cors())  


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(
 //'mongodb://@ac-yd1egyt-shard-00-00.ukitble.mongodb.net:27017,ac-yd1egyt-shard-00-01.ukitble.mongodb.net:27017,ac-yd1egyt-shard-00-02.ukitble.mongodb.net:27017/?ssl=true&replicaSet=atlas-vxqj0c-shard-0&authSource=admin&appName=Cluster0'
)
.then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));



const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);


app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Registration Successful",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    res.json({
      message: "Login Successful",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});
if (require.main === module) {
  app.listen(8000, () => console.log('Server running on port 8000'))
}
module.exports = app;
