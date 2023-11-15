// const http = require("http");
import http from "http";
import fs from "fs";

// import { gfname,gfname2 } from "./features";

import { gfname } from "./features.js";
// console.log(gfname);

import { generatePercent } from "./features.js";
// console.log(generatePercent());

// const home = fs.readFile("./index.html", () =>{
//     // this is callback function
//     console.log("File read");
// })

// console.log(home);

const home = fs.readFileSync("./index.html");

const server = http.createServer((req, res) => {
  if (req.url === "/about") {
    // === strict equality operator
    res.end(`<h1>Love is ${generatePercent()}</h1>`);
  } else if (req.url === "/") {
    // const home = fs.readFile("./index.html", (err,home) =>{
    // this is callback function
    res.end(home);
    // })
  } else {
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(5000, () => {
  console.log("server is ready");
});
