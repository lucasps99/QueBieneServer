const express = require('express')
const app = express()
const port = 3000

let waitingList = ['lucas', 'lucas2']

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game', (req, res) => {
  isgameready = false;  
  if(waitingList.length > 1) { 
    isgameready = true;
    waitingList.keys.toString().
    let user1 = waitingList.pop();
    let user2 = waitingList.pop();
  }
  res.json({'isgameready':isgameready});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})