var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog-app', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressSanitizer());

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
    // Sanatize the body of the blog post
    req.body.blog.body = req.sanitize(req.body.blog.body)
    //
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

// EDIT 

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(error, blogFound) {
        if(error){
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: blogFound});
        }
    });
});

// UPDATE

app.put("/blogs/:id", function(req, res) {
    // Sanatize the body of the blog post
    req.body.blog.body = req.sanitize(req.body.blog.body)
    //
    Blog.findOneAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog) {
        if(error){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

// DESTROY

app.delete("/blogs/:id", function(req, res) {
    Blog.findOneAndRemove(req.params.id, function(error) {
        if(error){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
});



app.listen(3001, function(){
    console.log("the app is running on port 3001")
});