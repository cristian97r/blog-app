var bodyParser = require("body-parser"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog-app', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs")
});


app.get("/blogs", function(req, res) {
    Blog.find({}, function(error, blogs) {
       if(error) {
           console.log(error)
       } else {
        res.render("index", {blogs: blogs});
       }
    });    
});


app.listen(3001, function(){
    console.log("the app is running on port 3001")
});