const express = require("express");
const app = express();
const PORT = 5000;
const cors = require('cors');
const mongoose = require("mongoose");
mongoURI = "mongodb+srv://nakshatragarg:Nakshatra9614@cluster0.plvre25.mongodb.net/blogging?retryWrites=true&w=majority";
// const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path")
// dotenv.config();

app.use(cors());
app.use(express.json()); //to convert every file in json format

app.use("/images",express.static(path.join(__dirname,"/images"))) //to make this folder public

//to connect node to mongo using mongoose
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
});
  
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});


app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

//example to use app
// app.use("/", (req,res) => {
//     console.log("Inside the web browser");
// })

// starting the port and listen it to defined port no. 3000
app.listen(5000, () =>{
    console.log(`backend is running on 5000 `);
})




