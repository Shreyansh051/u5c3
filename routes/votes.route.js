const { Router } = require("express");
const express = require("express");
const fs = require("fs");

const votesRouter = Router();

votesRouter.use(express.urlencoded({ extended: true }));
votesRouter.use(express.json());

// filte by party name
votesRouter.get("/party/:party", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    parsed = parsed.filter((el) => el.role === "voter");
    // console.log(parsed)
    res.send(parsed);
  });
});

// filter all voters
votesRouter.get("/voters", (req, res) => {
  const { party } = req.params;
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    parsed = parsed.forEach((el) => el.party === party);
    // console.log(parsed)
    res.send(parsed);
  });
});

// vote a candidate
votesRouter.post("/vote/:user", (req, res) => {
  const { user } = req.params;
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    parsed = parsed.filter((el) => {
      // console.log(el.votes);
      if (el.name === user) {
        el = {
          ...el,
          votes: el.votes++,
        };
        return el;
      }
      return el;
    });
    fs.writeFile(
      "./db.json",
      JSON.stringify(parsed),
      { encoding: "utf-8" },
      () => {
        res.end("vote casted");
      }
    );
  });
});

// count votes
votesRouter.get("/count/:user", (req, res) => {
  const { user } = req.params;
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    parsed = parsed.forEach((el) => {
      if (el.name === user) {
        res.send(el.votes);
      }
    });
    res.send("cannot find user");
  });
});

module.exports = votesRouter;
