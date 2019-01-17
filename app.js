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

// INDEX
app.get("/blogs", function(req, res) {
    Blog.find({}, function(error, blogs) {
       if(error) {
           console.log(error)
       } else {
        res.render("index", {blogs: blogs});
       }
    });    
});

// NEW
app.get("/blogs/new", function(req, res) {
    res.render("new")
});

// CREATE
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(error, newBlog) {
        if(error){
            console.log(error)
        } else {
            res.redirect("/blogs");
        }
    })
});

// SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(error, blogFound) {
        if(error){
            console.log(error)
        } else {
            res.render("show", {blog: blogFound});
        }
    });
});

app.listen(3001, function(){
    console.log("the app is running on port 3001")
});