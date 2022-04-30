const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

var roomList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  isgameready = false
  const userId = req.get("userId");
  for(i=0;i< roomList.length; i+=1) {
    if(roomList[i].tinicio && (roomList[i].user1 == userId || roomList[i].user2 == userId)) {
      isgameready = true
    }
  }
  res.json({'isgameready':isgameready});
})

app.post('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  else {
    if (roomList.length == 0) {
      var room = {
        user1: userId,
        user2: undefined,
        tinicio: undefined,
        result1: 0,
        result2: 0,
        topos: []
      }
      roomList.push(room)
      printRoomList()
      res.sendStatus(200);
      return;
    }
    var lastRoom = roomList[roomList.length-1]
    if (lastRoom.user2 == undefined) {
      lastRoom.user2 = userId;
      lastRoom.tinicio = Date.now();
      lastRoom.topos = generateToposSequence();
      res.sendStatus(200);
      printRoomList()
      return;
    }
    else {
      var room = {
        user1: userId,
        user2: undefined,
        tinicio: undefined,
        result1: 0,
        result2: 0,
        topos: []
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
      for (let j = 0; j < roomList[i].topos.length; j = j + 1) {
        if (roomList[i].topos[j].bieneId == bieneId) {
          if (roomList[i].topos[j].clicked == false) {
            roomList[i].topos[j].clicked = true;
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
  res.json({'userPoints':userPoints, 'rivalPoints':rivalPoints});
})

function generateToposSequence() {
  var topos = [];
  for (let i = 0; i < 11; i = i+1) {
    let topo = {
      bieneId: i,
      delta: (i + 1)*5,
      position: 5,
      clicked: false
    }
    topos.push(topo)
  }
  return topos;
}

function printRoomList() {
  console.log('roomList --> ')
  for (let i = 0; i < roomList.length; i = i+1) {
    console.log(roomList[i].user1 + ' ' + roomList[i].user2 + ' ' + roomList[i].tinicio + ' ' + roomList[i].result1 + ' ' + roomList[i].result2 + ' topos -->')
    for (let j = 0; j < roomList[i].topos.length; j = j + 1) {
      console.log(roomList[i].topos[j].bieneId + ' ' + roomList[i].topos[j].delta + ' ' + roomList[i].topos[j].position + ' ' + roomList[i].topos[j].clicked)
    }
  }
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})