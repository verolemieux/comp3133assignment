var express = require("express");
var path = require("path");
var cors = require("cors");
var bodyParser = require("body-parser");

var numPlayers = 0;

// models
let History = require("./models/history");
let Event = require("./models/event");
let User = require("./models/user");
let Game = require("./models/game");
// connecting to database
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const url =
  "mongodb://admin:admin@aliens-shard-00-00-eukpc.mongodb.net:27017,aliens-shard-00-01-eukpc.mongodb.net:27017,aliens-shard-00-02-eukpc.mongodb.net:27017/test?ssl=true&replicaSet=aliens-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true }).then(
  () => {
    console.log("Database successfully connected");
  },
  error => {
    console.log("Database could not be connected: " + error);
  }
);

// setting up port
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", express.static(path.join(__dirname, "mean_stack_game")));

// create port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("App listening on port " + port);
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

/*** API ROUTES ***/
app.get("/api/history", function(req, res) {
  History.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get history.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/api/eventlog", function(req, res) {
  Event.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get event log.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/api/games", function(req, res) {
  Game.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get history.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/api/topscores", function(req, res) {
  User.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get top scores.");
    } else {
      res.status(200).json(docs);
    }
  })
    .sort({ topScore: -1 })
    .limit(10);
});

app.get("/api/topusers", function(req, res) {
  User.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get top users.");
    } else {
      res.status(200).json(docs);
    }
  })
    .sort({ numWins: -1 })
    .limit(10);
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

/*** SOCKETS ***/
var io = require("socket.io")(server);

var gameTime = 180;

var position;
var positionp1 = {
  x: 230,
  y: 400
};

var positionp2 = {
  x: 770,
  y: 400
};

var boundaryp1 = {
  l: 5,
  r: 500
};

var boundaryp2 = {
  l: 585,
  r: 1040
};
var enemies1 = [];
var enemies2 = [];
var oldposx;
var oldposy;
//GET POSITION FROM HERE THIS FILE

io.on("connection", socket => {
  /*** GENERAL ***/
  // default username
  socket.username = "Anonymous";

  if (gameTime < 180) gameTime = 180;

  new Event({
    type: "CONNECTION",
    date: getCurrentDate(),
    time: getCurrentTime(),
    user: socket.username
  }).save();

  //keeps time identical for both players
  socket.on("timer", () => {
    gameTime--;
    if (gameTime < 0) gameTime = 0;
    io.emit("timerDown", gameTime);
  });

  socket.on("disconnect", function() {
    io.sockets.emit("player_left", { username: "Anonymous" });
    numPlayers--;
    io.emit("numplayers", numPlayers);
    if (numPlayers < 0) numPlayers = 0;
    if (numPlayers == 0) {
      gameTime = 180;

      positionp1 = {
        x: 230,
        y: 400
      };

      positionp2 = {
        x: 770,
        y: 400
      };

      boundaryp1 = {
        l: 5,
        r: 500
      };

      boundaryp2 = {
        l: 585,
        r: 1040
      };
      enemies1 = [];
      enemies2 = [];
    }
    new Event({
      type: "DISCONNECTION",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: socket.username
    }).save();
  });

  socket.on("checkNumPlayers", () => {
    io.emit("numplayers", numPlayers);
  });
  socket.on("invaders1_pos", data => {
    console.log("setting enemies1");
    console.log(JSON.stringify(data));
    if (enemies1.length == 0) {
      enemies1 = data;
    }
    io.emit("invaders_p1", enemies1);

    //io.emit("invaders_p1",enemies1);
  });
  socket.on("invaders2_pos", data => {
    console.log("setting enemies2");
    console.log(JSON.stringify(data));
    if (enemies2.length == 0) {
      enemies2 = data;
    }
    io.emit("invaders_p2", enemies2);
    //io.emit("invaders_p2",enemies2);
  });
  /*socket.on('geti1_pos',()=>{
        io.emit("invaders_p1",enemies1);
    })
    socket.on("geti2_pos", ()=>{
        io.emit("invaders_p2",enemies2);
    })*/
  socket.on("player_join", data => {
    io.sockets.emit("player_join", { username: "Anonymous" });
    new Event({
      type: "JOINED GAME",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: socket.username
    }).save();
  });

  socket.on("player_left", data => {
    io.sockets.emit("player_left", { username: "Anonymous" });
    new Event({
      type: "LEFT GAME",
      date: getCurrentDate(),
      time: getCurrentTime(),
      user: socket.username
    }).save();
  });

  socket.on("checkPlayers", () => {
    numPlayers++;
    if (numPlayers == 1) {
      positionp1.x = 230;
      positionp1.y = 400;
      io.emit("player_join", { numPlayers, positionp1, boundaryp1 });
    } else {
      positionp2.x = 770;
      positionp2.y = 400;

      console.log(numPlayers);
      io.emit("player_join", { numPlayers, positionp2, boundaryp2 });
    }
  });

  /*** CHAT ***/
  // listen on change_username
  socket.on("change_username", data => {
    socket.username = data.username;
  });

  socket.on("record", data => {
    new Game({
      player1: data.p1name,
      player2: data.p2name,
      winner: data.winner,
      scorePlayer1: data.p1score,
      scorePlayer2: data.p2score
    }).save();

    console.log("game recorded");
  });
  // listen on new_message
  socket.on("new_message", data => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username
    });
    new History({
      player: socket.username,
      opponent: "player2",
      date: getCurrentDate(),
      time: getCurrentTime(),
      message: data.message
    }).save();
  });

  /*** GAME ***/
  socket.on("move", data => {
    var playerNum;
    switch (data) {
      case "left":
        playerNum = 2;
        oldposx = positionp2.x;
        oldposy = positionp2.y;
        //so player 1 doesn't go off map
        if (positionp2.x >= boundaryp2.l) positionp2.x -= 5;
        position = positionp2;
        io.emit("position", { position, oldposx, oldposy, playerNum });
        break;
      case "right":
        playerNum = 2;
        oldposx = positionp2.x;
        oldposy = positionp2.y;
        //so player 1 doesnt go off map
        if (positionp2.x <= boundaryp2.r) positionp2.x += 5;
        position = positionp2;
        io.emit("position", { position, oldposx, oldposy, playerNum });
        break;
      case "z":
        //so player 1 doesn't go off map
        playerNum = 1;
        oldposx = positionp1.x;
        oldposy = positionp1.y;
        if (positionp1.x >= boundaryp1.l) positionp1.x -= 5;
        position = positionp1;
        io.emit("position", { position, oldposx, oldposy, playerNum });
        break;
      case "c":
        //so player 1 doesnt go off map
        playerNum = 1;
        oldposx = positionp1.x;
        oldposy = positionp1.y;
        if (positionp1.x <= boundaryp1.r) positionp1.x += 5;
        position = positionp1;
        io.emit("position", { position, oldposx, oldposy, playerNum });
        break;
      case "appear":
        io.emit("position", { position, oldposx, oldposy, playerNum }); //POSITIONS SPACESHIP AT LAS POSITION RECORDED
        break;
    }
  });

  socket.on("shoot", data => {
    console.log("player" + data);
    if (data == "p1") position = positionp1;
    if (data == "p2") position = positionp2;
    var player = data;
    io.emit("shoot", { position, player });
  });
});

function getCurrentDate() {
  return new Date(Date.now()).toLocaleDateString();
}

function getCurrentTime() {
  return new Date(Date.now()).toLocaleTimeString();
}
