var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('{ "response": "Hey There! This is Shubham" }');
});

app.get('/will', function (req, res) {
    res.send('{ "response": "Hello World! this is /will page" }');
});
app.get('/ready', function (req, res) {
    res.send('{ "response": " Great!, It works!" }');
});
app.listen(process.env.PORT || 3000);
module.exports = app;