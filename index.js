const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 4000;
const path = require('path');


const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')
app.use(express.static(viewsPath));
app.use(express.static(publicPath));
app.use(express.json());
app.use(cookieParser());

app.get('/mps4aside', async  (req, res) => {
    res.sendFile(path.join(viewsPath, 'getMPSKey.html'));
});

app.post('/mps4aside', async  (req, res) => {
    if (req.body.referrer != 'https://lootdest.org/') {
        res.json({key:""})
    } else {

        try {
            const response = await fetch('https://keysystem.sazawa.workers.dev/?key=GIVEMEKEYPLEASEIMLEGIT');
        
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }
        
            const responseText = await response.text();
            res.json({key:responseText})
    
        } catch (error) {
            console.error("Error getting key:", error);
            res.status(500).json({key:"Error getting key"});
        }
    }
});


const checkpointToKey = {
    [1]: "https://lootdest.org/s?RwLz3rc7",
    [2]: "https://lootdest.org/s?qKyAjyH1",
    [3]: "https://lootdest.org/s?yRoTGZH0",
}

//-----MMP KEY-------//
app.get('/mmp', async (req,res) => {
    res.sendFile(path.join(viewsPath, 'mmpKey.html'));
})

app.post('/mmp/getcheckpoint', async (req,res)=> {
    

    let userCheckpoint = 1;
    if (req.cookies.checkpoint) {
        userCheckpoint = parseInt(req.cookies.checkpoint);
    }
    console.log("checkpoint " + userCheckpoint)
    res.json({checkpoint:userCheckpoint})
})

app.post('/mmp/geturl', async (req, res) => {

    let userCheckpoint = 1;
    if (req.cookies.checkpoint) {
        userCheckpoint = parseInt(req.cookies.checkpoint);
    }
    if (userCheckpoint != 1 && req.referrer != "https://lootdest.org/") {
        res.clearCookie("checkpoint", {httpOnly:true});
        console.log("tried a bypass, nuh uh! ", req.referrer)
        res.json({url:"",key:""})
        return;
    }
    if (userCheckpoint == 3) {
        res.clearCookie("checkpoint", {httpOnly:true});
        console.log('sent key!')
        res.json({key:"testkey123"})
        return;
    }
    userCheckpoint += 1;
    res.cookie("checkpoint", userCheckpoint, {maxAge: 1000 * 60 * 10, httpOnly: true});
    const checkPoinToSend = checkpointToKey[userCheckpoint-1]
    console.log("sending " + checkPoinToSend, " and checkpoint will be: ", userCheckpoint)
    res.json({url:checkPoinToSend});
})

app.post('/mmp/leave', async(req,res) => {
    res.clearCookie("checkpoint", {httpOnly:true});
})




//ADMIN PANEL
app.get('/admin/login', async (req,res) => {
    res.sendFile(path.join(viewsPath, "adminLogin.html"))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;