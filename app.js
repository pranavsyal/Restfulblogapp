var express=require("express");
var methodOverride =require("method-override");
var expressSanitizer=require("express-sanitizer");
var app=express();
var bodyParser= require("body-parser");
var mongoose =require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(expressSanitizer());

app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema(
{
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//   title: "Test Blog",
//   image: "https://farm8.staticflickr.com/7628/16846563675_4e063bcbd8.jpg",
//   body: "Hello This is a blog"
// });

app.get("/", function(req, res)
       {
  res.redirect("/blogs");
});



app.get("/blogs", function(req, res)
        {
  Blog.find({},function(err, blogs){
    if(err)
      {
       console.log("ERROR!");
      }
    else
      {
        res.render("index",{blogs: blogs});
      }
  });
});
    

app.get("/blogs/new", function(req, res)
       {
  res.render("new");
});

app.post("/blogs", function(req, res)
        {
             Blog.create(req.body.blog, function(err, newBlog)
             {
    if(err)
      {
         res.render("new");
      }
    else
      {
        res.redirect("/blogs");
        
        }
});
});
app.get("/blogs/:id",function(req, res)
       {
         Blog.findById(req.params.id, function(err, foundBlog)
                      {
                      if(err)
                        {
                          res.redirect("/blogs");
                        }
           else
            {
              res.render("show", {blog: foundBlog});
            }
           
         });
});

app.get("/blogs/:id/edit",function(req, res)
       {
  Blog.findById(req.params.id, function(err, foundBlog)
               {
    if(err)
      {
         res.redirect("/blogs");
      }
    else
      {
        res.render("edit", {blog: foundBlog});
      }
   
  });
         
});

app.put("/blogs/:id", function(req, res)
        {
  req.body.blog.body=req.sanitize(req.body.blog.body);
Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog)
                      {
  if(err)
    {
      res.redirect("/blogs");
    }
  else
    {
      res.redirect("/blogs/" + req.params.id);
    }
});
});
app.delete("/blogs/:id", function(req, res)
          {
  Blog.findByIdAndRemove(req.params.id, function(err)
  {
    if(err)
      {
        res.redirect("/blogs");
      }
    else
      {
        res.redirect("/blogs");
      }
  }
                         );
});









app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is Listening!!!");
});