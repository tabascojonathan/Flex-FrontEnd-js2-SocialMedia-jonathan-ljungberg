import express from "express";


// skapar en express-server-app.
// app innehåller async metoder för att lyssna efter http-requests på en specific port och path
const app = express();


//Talar om vilken port på datorn vi ska lyssna på
// Behöver vara en port som inte används av någonting annat
app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});


//Vid en GET request till endpoint '/' skickas ett response med lite text
app.get('/', (req, res)=>{
    res.send('GET request received');
})
