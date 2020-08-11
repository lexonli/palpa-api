const express = require('express');
const app = express();


//API endpoints

//Version endpoint
const version = {"version": "1.0.0"}
app.get('/version', (req, res) => {
	res.send(version);
});







//Listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
    //Local server should be running on http://127.0.0.1:5000/
    console.log(`Palpa server is running on port: ${port}`)
});