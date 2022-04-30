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
    if (roomList.length() == 0) {
      var room = {
        user1: userId,
        user2: undefined,
        tinicio: undefined,
        result1: 0,
        result2: 0,
        topos: []
      }
      roomList.push(room)
      res.sendStatus(200);
    }
    var lastRoom = roomList[roomList.length()-1]
    if (lastRoom.user2 == undefined) {
      lastRoom.user2 = userId;
      lastRoom.tinicio = currentDate.getTime();
      lastRoom.topos = generateToposSequence();
      res.sendStatus(200);
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
      roomList.push(room)
      res.sendStatus(200);
    }
    //console.log('User ' + userId + ' added to userQueue')
    //console.log(waitingList)
    res.sendStatus(200);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})