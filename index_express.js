import express from "express";
import path from "path";

const app = express();

app.get("/getjson", (req, res) => {
  // res.sendStatus(404);
  res.json({
    success: true,
    products: [],
  });
});

app.get("/", (req, res) => {
  const filePath = path.resolve();
  // console.log(path.join(filePath,"./index.html"));
  res.sendFile(path.join(filePath, "./index.html"));
});

app.listen(5000, () => {
  console.log("server is working");
});
