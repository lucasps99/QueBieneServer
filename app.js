const express = require('express')
const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  isgameready = false
  const userId = req.get("userId");
  for(i=0;i< roomList.length(); i+=1) {
    if(roomList.tinicio && (roomList.user == userId || roomList.user2 == userId)) {
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
    waitingList.push(userId);
    res.sendStatus(200);
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})