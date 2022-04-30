const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

// var roomList = [];

let roomList = new Map();

let idRoom = 0;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
  }
  if((parseInt(roomId) > roomList.size) || (roomList.size == 0)) {
    res.sendStatus(400);
  }
  isgameready = false
  let gameInfo;
  const room = roomList.get(parseInt(roomId));
  if(room.tinicio) {
    gameInfo = {
      isgameready: true,
      timestamp: room.tinicio,
      bienes: room.bienes
    }
    res.json({'isgameready':gameInfo.isgameready, 'timestamp': gameInfo.timestamp, 'bienes': gameInfo.bienes});
    return;
  }
  res.json({'isgameready': isgameready, 'timestamp': '', 'topos': ''});
})

app.post('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
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
    res.sendStatus(200);
    return;
  }

  let lastRoom = roomList.get(roomList.size-1);
  if (!lastRoom.user2) {
    lastRoom.user2 = userId;
    lastRoom.tinicio = Date.now();
    lastRoom.bienes = generatebienesSequence();
    roomList.set(roomList.size-1,lastRoom);
    res.sendStatus(200);
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
  res.sendStatus(200);
  return;

})

app.post('/biene', (req, res) => {
  const roomId = req.get("roomId");
  if (roomId == undefined) {
    res.sendStatus(400);
  }
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  const room = roomList.get(parseInt(roomId));

  let win = false;
  const bieneId = req.body.bieneId;
  console.log(bieneId);

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
  }
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  let userPoints = 0;
  let rivalPoints = 0;
  const room = roomList.get(parseInt(roomId));
  if (room.user1 == userId) {
    userPoints = room.result1;
    rivalPoints = room.result2;
    if (room.user2 == undefined) {
      roomList.delete(parseInt(roomId))
    }
    else {
      room.user1 = undefined
    }
  }
  else if(room.user2 == userId) {
    userPoints = room.result2;
    rivalPoints = room.result1;
    if (room.user1 == undefined) {
      roomList.delete(parseInt(roomId))
    }
    else {
      room.user2 = undefined
    }
  }
  res.json({'userPoints':userPoints, 'rivalPoints':rivalPoints});
})

function generatebienesSequence() {
  var bienes = [];
  for (let i = 0; i < 11; i = i+1) {
    let biene = {
      bieneId: i,
      delta: (i + 1)*5,
      position: 5,
      clicked: false
    }
    bienes.push(biene)
  }
  return bienes;
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})