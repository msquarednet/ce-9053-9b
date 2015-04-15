var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/my_world");

var PersonSchema = new mongoose.Schema({
    name: String
});

var Person = mongoose.model("Person", PersonSchema);

var ThingSchema = new mongoose.Schema({
    name: String
});

var Thing = mongoose.model("Thing", ThingSchema);

var app = express();
app.use(express.static(__dirname + "/client"));
app.use(bodyParser.json());

app.set("view engine", "jade");

app.get("/", function(req, res){
    res.render("index");
});


app.get("/people", function(req, res){
    res.render("index");
});

app.get("/things", function(req, res){
    res.render("index");
});

app.get("/api/people", function(req, res){
   Person.find({}, function(err, people){
       res.send(people); 
   }); 
});

app.delete("/api/people/:id", function(req, res){
    Person.remove({_id: req.params.id}, function(){
        res.send({});
    });    
});

app.post("/api/people/:id", function(req, res){
    Person.update({_id: req.params.id}, {$set:{name: req.body.name}}, function(err, person){
        res.send(person);
    });
});

app.post("/api/people", function(req, res){
    Person.create(req.body, function(err, person){
        res.send(person);
    });
});

app.get("/api/things", function(req, res){
   Thing.find({}, function(err, things){
       res.send(things);
   }); 
});

app.listen(process.env.PORT);