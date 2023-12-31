

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

var _ = require('lodash');
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => { console.log(err) });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/journalDB');

  const articleSchema = new mongoose.Schema({
    title: String,
    post: String,
  });

  const Post = mongoose.model("Post", articleSchema);

  const pageSchema = new mongoose.Schema({
    page: String,
    posts: [articleSchema] //array
  });

  const Page = mongoose.model("Page", pageSchema);

  const homeContent = new Post({
    title: "Home",
    post: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
  });

  const aboutContent = new Post({
    title: "About",
    post: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
  });

  const contactContent = new Post({
    title: "Contact",
    post: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
  });

  app.get("/", (req, res) => {
    Page.findOne({ page: "Home" }).then((foundHome) => {
      if (!foundHome) {
        const newPage = new Page({
          page: "Home",
          posts: [homeContent]
        });
        newPage.save();
        res.redirect("/")
      } else {
        res.render("home", { homeStartingContent: foundHome })
      }
    })
  })


  app.get("/compose", (req, res) => {
    res.render("compose");
  })

  app.post("/compose", (req, res) => {

    const article = new Post({
      title: req.body.title,
      post: req.body.post
    })


    Page.findOneAndUpdate({ page: "Home" }).then((foundHome) => {
      foundHome.posts.push(article);
      foundHome.save();
      res.redirect("/");
    })


  })

  app.get("/about", (req, res) => {
    Page.findOne({ page: "About" }).then((foundAbout) => {
      if (!foundAbout) {
        const newPage = new Page({
          page: 'About',
          posts: [aboutContent]
        });
        newPage.save();
        res.redirect("/About");
      } else {
        res.render("about", { aboutContent: foundAbout })
      }
    })
  })


  app.get("/contact", (req, res) => {

    Page.findOne({ page: "Contact" }).then((foundContact) => {
      if (!foundContact) {
        const newPage = new Page({
          page: "Contact",
          posts: [contactContent]
        });

        newPage.save();
        res.redirect("/contact");

      } else {
        res.render("contact", { contactContent: foundContact });
      }
    })

  })


  app.get("/posts/:postId", (req, res) => {
    requestedTitle = req.params.postId;

    Page.findOne({ page: "Home" }).then((foundPost) => {
      if (foundPost) {
        const post = foundPost.posts.find(
          (p) => p.title === requestedTitle);

        console.log(post);
        res.render("post", { post: post })
      } else {
        console.log("Post not found");
      }
    }).catch((err) => { console.log(err); })
  })


  app.listen(port, function () {
    console.log(`Server started on port ${port}`);
  });


}

















