const express = require('express')
const app = express()
const port = 3000

var waitingList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/game', (req, res) => {
  const userId = req.get("userId");
  if (userId == undefined) {
    res.sendStatus(400);
  }
  else {
    waitingList.push(userId);
    console.log('User ' + userId + ' added to userQueue')
    console.log(waitingList)
    res.sendStatus(200);
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})