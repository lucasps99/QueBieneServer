const express = require('express')
const app = express()
const port = 3000

var waitingList = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  isgameready = false;  
  if(waitingList.length > 1) { 
    isgameready = true;
    let user1 = waitingList.pop();
    let user2 = waitingList.pop();
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
    //console.log('User ' + userId + ' added to userQueue')
    //console.log(waitingList)
    res.sendStatus(200);
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})