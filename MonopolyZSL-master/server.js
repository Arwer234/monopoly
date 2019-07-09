var express = require("express")
var app = express();
var http = require('http').createServer(app);
var socketio = require('socket.io')(http);

app.use(express.static('static'))

// Support POST data
app.use(require("body-parser").urlencoded({ extended: true }))

const Datastore = require("nedb")

const fields = new Datastore({
    filename: 'db/fields.db',
    autoload: true
})

const fieldData = new Datastore({
    filename: 'db/fieldData.db',
    autoload: false
})
const playersData = new Datastore({
    filename: 'db/players.db',
    autoload: false
})

const fs = require("fs")
fs.unlink('db/fieldData.db', () => {
    fieldData.loadDatabase()
})

fs.unlink('db/players.db', () => {
    playersData.loadDatabase()
})

http.listen(3000, function () {
    console.log('listening on 3000');
});

var totalPlayers = 0
var activePlayer = 0
var thrown = false

socketio.on('connection', function (client) {
    console.log("klient się podłączył" + client.id)

    if(totalPlayers>1)client.emit("id", "full")
    else {
        client.emit("id", totalPlayers)
        totalPlayers++

        client.broadcast.emit("joined")
    }

    client.on("disconnect", function () {
        console.log("klient się rozłącza")
    })

    client.on("start",function(data){
        console.log("rcx start")

        socketio.sockets.emit("started")
        //console.log(totalPlayers)
        for(let i = 0;i<totalPlayers;i++){
            var doc = {
                playerID:i,
                budget:i==0?5000:600,
                position:0,
            }
            console.log("creating")
            playersData.insert(doc,function(err, newDoc){
                //if(err) console.log("err")
                //else console.log("?")
            })
        }
    })

    client.on("sendDice",function(data){
        if(thrown){
            client.emit("alreadyThrown")
        }
        else{
            var oczka = []

            if (data) {
                oczka = data
            }
            
            else {
                oczka.push(Math.round(Math.random() * 5) + 1)
                oczka.push(Math.round(Math.random() * 5) + 1)
            }
            
            var ruch = 0
            for(let i = 0;i<2;i++) {
                ruch+=oczka[i]
                // players[activePlayer]+=oczka[i]
                // if(players[activePlayer]>=40)players[activePlayer]-=40
            }
            playersData.findOne({ playerID: activePlayer },function(err,docs){
                docs.position+=ruch
                if(docs.position>=40)docs.position-=40
                playersData.update({_id:docs._id},{$set:docs},{},function(err,numUpdated){
                    //console.log(numUpdated)
                })
            })
            socketio.sockets.emit("getDice",oczka)
            thrown = true
        }
    })
    client.on("endTurn",function(){
        activePlayer+=1
        if (activePlayer >= totalPlayers) activePlayer = 0
        socketio.sockets.emit("nextTurn", activePlayer)
        thrown = false
    })
})

app.post("/reset", (req, res) => {
    totalPlayers = 0
    activePlayer = 0
    thrown = false
    playersData.remove({ }, { multi: true }, function (err, numRemoved) {
        playersData.loadDatabase(function (err) {
          // done
        });
    });
    fieldData.remove({ }, { multi: true }, function (err, numRemoved) {
        fieldData.loadDatabase(function (err) {
          // done
        });
    });
    res.send("reset ok")
})

app.post("/getFields", (req, res) => {
    fields.find({}, (err, docsFields) => {
        if (err) throw err

        docsFields.sort((a, b) => {
            return parseInt(a.index) - parseInt(b.index)
        })

        res.json(docsFields)
    })
})

app.post("/getPlayer",(req,res)=>{
    var pID = parseInt(req.body.playerID)

    playersData.findOne({playerID:pID},function(err,docs){
        // console.log(docs)
        res.json(docs)
    })
})

app.post("/getFieldData", (req, res) => {
    fieldData.findOne({fieldIndex: req.body.index}, (err, doc) => {
        if (doc == null)
            doc = {owner: null}

        res.json(doc)
    })
})
app.post("/buyField", (req,res) => {
    var data = {
        fieldIndex: req.body.fieldIndex,
        owner: req.body.playerID,
        houses: 0
    }

    var pID = parseInt(req.body.playerID)

    if (req.body.bought == "true") {
        fieldData.insert(data, (err) => {
            if (err)
                console.log("err insert fieldData")
            else {
                playersData.findOne({playerID:pID},function(err,doc){
                    doc.budget -= parseInt(req.body.cost)

                    playersData.update({_id:doc._id},{$set:doc})
                })

                socketio.sockets.emit("bought", data)
                res.send("ok")
            }
        })
    }

    else {
        data.notBougth = true
        socketio.sockets.emit("bought", data)
    }
})
app.post("/buyHouse",(req,res)=>{
    var pID = parseInt(req.body.playerID)

    fields.findOne({ index: parseInt(req.body.fieldIndex) }, (err,field) => {

        fieldData.findOne({fieldIndex:req.body.fieldIndex},(err,fieldDoc)=>{

            playersData.findOne({ playerID: pID }, (err,playerDoc) => {

                if (playerDoc.budget >= field.houseCost) {
                    fieldDoc.houses++
                    playerDoc.budget -= field.houseCost

                    fieldData.update({_id:fieldDoc._id},{$set:fieldDoc})
                    socketio.sockets.emit("houseBought",fieldDoc)

                    playersData.update({_id:playerDoc._id},{$set:playerDoc})

                    console.log(playerDoc.budget)
                    res.json({budget: playerDoc.budget})
                }

                else {
                    res.json({nofunds: true})
                }
            })
        })
    })
})
app.post("/sellHouse",(req,res)=>{
    var pID = parseInt(req.body.playerID)

    fields.findOne({ index: parseInt(req.body.fieldIndex) }, (err,field) => {
        fieldData.findOne({fieldIndex:req.body.fieldIndex},(err,doc)=>{
            doc.houses--
            fieldData.update({_id:doc._id},{$set:doc})
            socketio.sockets.emit("houseSold",doc)

            playersData.findOne({ playerID: pID }, (err,playerDoc) => {
                playerDoc.budget += field.houseCost
                playersData.update({_id:playerDoc._id},{$set:playerDoc})

                res.json({budget: playerDoc.budget})
            })
        })
    })
})

const maxColors = {
    "3C990F": 3,
    "6BA1B3": 3,
    "00008B": 2,
    "964B00": 2,
    "A69321": 3,
    "DC5539": 3,
    "DF5286": 3,
    "FF8300": 3,
}

app.post("/getBudget",(req,res) => {
    var pID = parseInt(req.body.playerID)

    playersData.findOne({ playerID: pID }, (err,doc) => {
        res.json({
            budget: doc.budget
        })
    })
})

app.post("/pay",(req,res) => {
    console.log({ fieldIndex: req.body.fieldIndex })
    fieldData.findOne({ fieldIndex: req.body.fieldIndex }, (err,fieldDataDoc) => {
        console.log(err, fieldDataDoc)

        fieldData.find({ owner: fieldDataDoc.owner }, (err, ownedDocs) => {
            var owned = ownedDocs.length

            fields.findOne({ index: parseInt(req.body.fieldIndex) }, (err,field) => {
                var maxOwned = maxColors[field.color]

                var rent = 0
                
                if (fieldDataDoc.houses > 0)
                    rent = field.houseCost*2 *(fieldDataDoc.houses-1)*1.5 + field.houseCost*2
                
                else {
                    rent = field.rent

                    console.log(owned, maxOwned)
                    if (owned == maxOwned)
                        rent += 20
                }

                playersData.findOne({ playerID: parseInt(req.body.playerID) }, (err,doc) => {
                    if (doc.budget >= rent) {
                        doc.budget -= rent

                        playersData.update({_id:doc._id},{$set:doc})

                        playersData.findOne({ playerID:parseInt(fieldDataDoc.owner) }, (err,doc) => {
                            doc.budget += rent

                            playersData.update({playerID:fieldDataDoc.owner},{$set:doc})

                            socketio.sockets.emit("updateBudget", {
                                target: fieldDataDoc.owner,
                                rent: rent,
                                left: doc.budget,
                                paid: false,
                            })
                        })

                        socketio.sockets.emit("updateBudget", {
                            target: parseInt(req.body.playerID),
                            rent: rent,
                            left: doc.budget,
                            paid: true
                        })
                    }

                    else {
                        socketio.sockets.emit("bankrupt", {
                            playerID: parseInt(req.body.playerID) 
                        })
                    }
                })                    
            })
        })
    })
})