const express = require('express')
const app = express()
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use( cors( { origin: true } ) );

let roomList = new Map();

let idRoom = 0;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  getGameInfo(req,res,false);
})

app.post('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
    return;
  }
  const roomId = idRoom;

  if (roomList.size == 0) {
    let room = {
      user1: userId,
      user2: null,
      tinicio: undefined,
      result1: 0,
      result2: 0,
      bienes: []
    }
    roomList.set(roomList.size,room)
    res.json({'roomId': roomList.size-1});
    return;
  }

  let lastRoom = roomList.get(roomList.size-1);
  if (!lastRoom.user2) {
    lastRoom.user2 = userId;
    lastRoom.tinicio = Date.now();
    lastRoom.bienes = generatebienesSequence();
    roomList.set(roomList.size-1,lastRoom);
    res.json({'roomId': roomList.size-1});
    return;
  }
  let room = {
    user1: userId,
    user2: undefined,
    tinicio: undefined,
    result1: 0,
    result2: 0,
    bienes: []
  }
  idRoom += 1;
  roomList.set(roomList.size,room);
  res.json({'roomId': roomList.size-1});
  return;

})

function getGameInfo(req,res,wantBienes) {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
    return;
  }
  if((parseInt(roomId) > roomList.size) || (roomList.size == 0)) {
    res.sendStatus(400);
    return;
  }
  isgameready = false
  let gameInfo;
  const room = roomList.get(parseInt(roomId));
  if(room.tinicio) {
    if (!wantBienes) {
      gameInfo = {
        isgameready: true,
        timestamp: room.tinicio,
        bienes: room.bienes
      }
      res.json({'isgameready':gameInfo.isgameready, 'timestamp': gameInfo.timestamp});
      return;
    }
  }
  res.json({'bienes': room.bienes})

}

app.get('/biene', (req, res) => {
  getGameInfo(req,res,true);
})

app.get('/biene/press', (req, res) => {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
    return;
  }
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
    return;
  }
  const bieneId = req.get("bieneId");
  if (bieneId == undefined) {
    res.sendStatus(400);
    return;
  }
  const room = roomList.get(parseInt(roomId));

  let win = false;

  for (let j = 0; j < room.bienes.length; j = j + 1) {
    if (room.bienes[j].bieneId != bieneId) {
      continue;
    }
    if (room.bienes[j].clicked == false) {
      room.bienes[j].clicked = true;
      if (room.user1 == userId) {
        room.result1 = room.result1 + 1;
        win = true;
      }
      else {
        room.result2 = room.result2 + 1;
        win = true;
      }
      break;
      }
    }
  res.json({'win':win});
})

app.get('/result', (req, res) => {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
    return;
  }
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
    return;
  }
  getGamePoints(userId,roomId,true,res);
})

app.get('/game/state', (req, res) => {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
    return;
  }
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
    return;
  }
  getGamePoints(userId,roomId,false,res);
})

function getGamePoints(userId,roomId,isGameEnded,res) {
  
  let userPoints = 0;
  let rivalPoints = 0;
  const room = roomList.get(parseInt(roomId));
  if (room.user1 == userId) {
    userPoints = room.result1;
    rivalPoints = room.result2;
    if(isGameEnded) {
      if (room.user2 == undefined) {
        roomList.delete(parseInt(roomId))
      }
      else {
        room.user1 = undefined
      }
    }
  }
  else if(room.user2 == userId) {
    userPoints = room.result2;
    rivalPoints = room.result1;
    if(isGameEnded) {

      if (room.user1 == undefined) {
        roomList.delete(parseInt(roomId))
      }
      else {
        room.user2 = undefined
      }
    }
  }
  res.json({'userPoints':userPoints, 'rivalPoints':rivalPoints});
}


app.get('/result', (req, res) => {
  const userId = req.get("userId");
  getGamePoints(userId,true,res);
})

function generatebienesSequence() {
  var bienes = [];
  for (let i = 0; i < 19; i = i+1) {
    let biene = {
      bieneId: i,
      delta: (i + 1)*3,
      position: generateRandomInt(1,9),
      clicked: false
    }
    bienes.push(biene)
  }
  return bienes;
}

function generateRandomInt(min,max){
  return Math.floor((Math.random() * (max-min)) +min);
}


app.get('/clock', (req, res) => {
  const start = req.get("start");
  if (start == undefined) {
    res.sendStatus(400);
    return;
  }
  servertime = Date.now();
  delta = servertime - parseInt(start);
  res.json({'timestamp': servertime, 'delta':delta});
})


app.listen(port, () => {
  console.log(`Que Biene Server listening on port: ${port}`)
})