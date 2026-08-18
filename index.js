const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { send } = require("process");
const {v4: uuidv4} = require('uuid');
uuidv4();  // ⇨ 'b18794e8-5d0d-417c-b361-ba38e78411b4'
const methodOverride = require("method-override");
const multer = require("multer");

// Multer Setup: Images ko 'public/uploads' folder me save karne ke liye
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});
const upload = multer({ storage: storage });

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,"public")));

let posts = [
    {
        id: uuidv4(),
        username: "Rajesh_Gadari",
        content: "What are the most essential VS Code extensions every Web Developer should use in 2026?",
        image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg" 
    },
    {   
        id: uuidv4(),
        username: "Rajul_Shrivastav",
        content: "How does Express middleware actually work under the hood? Can someone explain it in simple terms?",
        image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
    },
    {
        id: uuidv4(),
        username: "Shivanshu_Nath",
        content: "Is Node.js still worth learning for backend development, or should I jump straight to Go?",
        image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg"
    }
]

app.get("/posts", (req, res) => {
res.render("index.ejs", {posts});
})

app.get("/posts/new", (req, res) => {
res.render("new.ejs", {posts});
})

app.post("/posts", upload.single('image'), (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    let image = req.file ? `/uploads/${req.file.filename}` : ""; // Image path
    
    posts.push({ id, username, content, image });
    res.redirect("/posts");
});

app.post("/posts", (req, res) =>{
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({id, username, content});
    // res.render("index.ejs", {posts});   // or
    res.redirect("/posts")
})


app.get("/posts/:id", (req, res) =>{
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    console.log(post);
    res.render("show.ejs", { post });
})

app.patch("/posts/:id", upload.single('image'), (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);

    if (post) {
        post.content = newContent;
        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        }
    }

    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) =>{
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
})

app.delete("/posts/:id/", (req, res) =>{
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
})

app.listen(port, ()=>{
    console.log(`listening to port : ${port}`);
})