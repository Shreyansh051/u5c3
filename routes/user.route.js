const { Router } = require("express");
const express = require("express");
const fs = require("fs");
const userRouter = Router();
const { v4: uuid } = require("uuid");
const randomToken = require("random-token");

userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(express.json());

//create new user
userRouter.post("/create", (req, res) => {
  let newId = uuid();
  let newUser = {
    ...req.body,
    id: newId,
  };
  // console.log(newUser);
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    // console.log(parsed);
    parsed = [...parsed, newUser];

    fs.writeFile(
      "./db.json",
      JSON.stringify(parsed),
      { encoding: "utf-8" },
      () => {
        res.status(201).send(`"user created", ${newId}`);
      }
    );
  });
});

// user login
userRouter.post("/login", (req, res) => {
  if (
    req.body.username === undefined ||
    req.body.username === "" ||
    req.body.password === undefined ||
    req.body.password === ""
  ) {
    return res.status(400).send("please provide username and password");
  }
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    // console.log(parsed);
    let token = false;
    parsed = parsed.map((el) => {
      if (
        req.body.username === el.username &&
        req.body.password === el.password
      ) {
        token = randomToken(16);

        console.log(el, token);
        // req.url = req.url + `?apiKey=${token}`;
        return {
          ...el,
          token: token,
        };
      }
      return el;
    });
    if (token) {
      fs.writeFile(
        "./db.json",
        JSON.stringify(parsed),
        { encoding: "utf-8" },
        () => {
          res.send(`"Login Successful", ${token}`);
        }
      );
    } else {
      res.status(401).send("Invalid Credentials");
    }
  });
});

// user logout
userRouter.post("/logout", (req, res) => {
  console.log(req.params);
  // if (
  //   req.body.username === undefined ||
  //   req.body.username === "" ||
  //   req.body.password === undefined ||
  //   req.body.password === ""
  // ) {
  //   return res.status(400).send("please provide username and password");
  // }
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    // console.log(parsed);
    parsed = parsed.map((el) => {
      if (req.query.apiKey === el.token) {
        return {
          ...el,
          token: undefined,
        };
      }
      return el;
    });

    fs.writeFile(
      "./db.json",
      JSON.stringify(parsed),
      { encoding: "utf-8" },
      () => {
        res.send("user logged out successfully");
      }
    );
  });
});

module.exports = userRouter;
