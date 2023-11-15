import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// const users = [];

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    // res.render("logout");

    const decoded = jwt.verify(token, "sdfghjksdfghjkcvbn");
    // console.log(decoded);
    req.user = await User.findById(decoded._id);
    // now we can access the info of any user in any next functions

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  // console.log(req.user);
  // console.log(req.cookies.token)
  // const token = req.cookies.token
  // const { token } = req.cookies;
  // if (token) {
  //   res.render("logout");
  // } else {
  //   res.render("login");
  // }
  //   res.sendFile("index.html");
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.redirect("/register");
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", { email, message: "Incorrect Password" });
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    "sdfghjksdfghjkcvbn"
  );

  res.cookie("token", token, {
    htttpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      _id: user._id,
    },
    "sdfghjksdfghjkcvbn"
  );

  res.cookie("token", token, {
    htttpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    htttpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// app.get("/add", async (req, res) => {
//   await Message.create({
//     name: "Sagar",
//     email: "sagar@gmail.com",
//   });
//   res.send("nice works");
// });

// app.get("/success", (req, res) => {
//   res.render("success");
// });

app.post("/contact", async (req, res) => {
  // const messageDate = {
  //   username: req.body.name,
  //   email: req.body.email,
  // };

  const { name, email } = req.body;

  await Message.create({
    // name: req.body.name,
    // email: req.body.email
    name,
    email,
  });

  //   res.render("success");
  res.redirect("/success");
});

app.get("/users", (req, res) => {
  res.json({
    users,
  });
});

app.listen(5000, () => {
  console.log("server is running");
});
