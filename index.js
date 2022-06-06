const express = require("express");
const fs = require("fs");
const userRouter = require("./routes/user.route");
const votesRouter = require("./routes/votes.route");

const app = express();

votesRouter.use(express.urlencoded({ extended: true }));
votesRouter.use(express.json());

app.get("/", (req, res) => {
  res.send("voting app is working");
});

app.get("/db", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    res.send(parsed);
  });
});

app.post("/db", (req, res) => {
  fs.writeFile(
    "./db.json",
    JSON.stringify(req.body),
    { encoding: "utf-8" },
    () => {
      res.end();
    }
  );
});

app.use(["/votes", "/user/logout"], (req, res, next) => {
  // console.log(req.query.apiKey);
  if (!req.query.apiKey) {
    return res.status(401).send("User not logged in");
  }
  next();
});

app.use("/user", userRouter);
app.use("/votes", votesRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started `);
});
