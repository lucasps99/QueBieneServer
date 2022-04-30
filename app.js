const express = require('express')
const app = express()
const port = 3000

var roomList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
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

function generateToposSequence() {
  var topos = [];
  for (let i = 0; i < 11; i = i+1) {
    let topo = {
      topoId: i,
      delta: i*5,
      position: 5
    }
    topos.push(topo)
  }
  return topos;
}

function printRoomList() {
  console.log('roomList --> ')
  for (let i = 0; i < roomList.length; i = i+1) {
    console.log(roomList[i].user1 + ' ' + roomList[i].user2 + ' ' + roomList[i].tinicio + ' ' + roomList[i].result1 + ' ' + roomList[i].result2 + ' ' + roomList[i].topos + ' ')
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})