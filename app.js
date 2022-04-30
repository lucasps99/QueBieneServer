const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

var roomList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  isgameready = false
  let gameInfo;
  for(i=0;i< roomList.length; i+=1) {
    if(roomList[i].tinicio && (roomList[i].user1 == userId || roomList[i].user2 == userId)) {
      gameInfo = {
        isgameready: true,
        timestamp: roomList[i].tinicio,
        topos: roomList[i].topos
      }
      res.json({'isgameready':gameInfo.isgameready, 'timestamp': gameInfo.timestamp, 'topos': gameInfo.topos});
      return;
    }
  }
  res.json({'isgameready': isgameready, 'timestamp': '', 'topos': ''});
})

app.post('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  else {
    if (roomList.length == 0) {
      let room = {
        user1: userId,
        user2: undefined,
        tinicio: undefined,
        result1: 0,
        result2: 0,
        bienes: []
      }
      roomList.push(room)
      printRoomList()
      res.sendStatus(200);
      return;
    }
    let lastRoom = roomList[roomList.length-1]
    if (lastRoom.user2 == undefined) {
      lastRoom.user2 = userId;
      lastRoom.tinicio = Date.now();
      lastRoom.bienes = generatebienesSequence();
      res.sendStatus(200);
      printRoomList()
      return;
    }
    else {
      let room = {
        user1: userId,
        user2: undefined,
        tinicio: undefined,
        result1: 0,
        result2: 0,
        bienes: []
      }
      roomList.push(room);
      printRoomList();
      res.sendStatus(200);
      return;
    }
    //console.log('User ' + userId + ' added to userQueue')
    //console.log(waitingList)
    
  }
  
})

app.post('/biene', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  var win = false;
  const bieneId = req.body.bieneId;
  console.log(bieneId);
  for (let i = 0; i < roomList.length; i = i + 1) {
    if (roomList[i].user1 == userId || roomList[i].user2 == userId ) {
      for (let j = 0; j < roomList[i].bienes.length; j = j + 1) {
        if (roomList[i].bienes[j].bieneId == bieneId) {
          if (roomList[i].bienes[j].clicked == false) {
            roomList[i].bienes[j].clicked = true;
            if (roomList[i].user1 == userId) {
              roomList[i].result1 = roomList[i].result1 + 1;
              win = true;
            }
            else {
              roomList[i].result2 = roomList[i].result2 + 1;
              win = true;
            }
            break;
          }
        }
        
      }
    }
    break;
  }
  printRoomList();
  res.json({'win':win});
  
})

app.get('/result', (req, res) => {
  const userId = req.get("userId");
  let userPoints = 0;
  let rivalPoints = 0;
  for (i=0;i< roomList.length; i+=1) {
    if (roomList[i].user1 == userId) {
      userPoints = roomList[i].result1;
      rivalPoints = roomList[i].result2;
      if (roomList[i].user2 == undefined) {
        roomList = roomList.splice(i,1);
      }
      else {
        roomList[i].user1 = undefined
      }
    }
    else if(roomList[i].user2 == userId) {
      userPoints = roomList[i].result2;
      rivalPoints = roomList[i].result1;
      if (roomList[i].user1 == undefined) {
        roomList = roomList.splice(i,1);
      }
      else {
        roomList[i].user2 = undefined
      }
    }
  }
  printRoomList()
  res.json({'userPoints':userPoints, 'rivalPoints':rivalPoints});
})

function generatebienesSequence() {
  var bienes = [];
  for (let i = 0; i < 11; i = i+1) {
    let tobienepo = {
      bieneId: i,
      delta: (i + 1)*5,
      position: 5,
      clicked: false
    }
    bienes.push(biene)
  }
  return bienes;
}

function printRoomList() {
  console.log('roomList --> ')
  for (let i = 0; i < roomList.length; i = i+1) {
    console.log(roomList[i].user1 + ' ' + roomList[i].user2 + ' ' + roomList[i].tinicio + ' ' + roomList[i].result1 + ' ' + roomList[i].result2 + ' bienes -->')
    for (let j = 0; j < roomList[i].bienes.length; j = j + 1) {
      console.log(roomList[i].bienes[j].bieneId + ' ' + roomList[i].bienes[j].delta + ' ' + roomList[i].bienes[j].position + ' ' + roomList[i].bienes[j].clicked)
    }
  }
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})