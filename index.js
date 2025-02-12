const { checkPrime } = require('crypto');
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 4000;
const path = require('path');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')
app.use(express.static(viewsPath));
app.use(express.static(publicPath));
app.use(express.json());

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
            console.log(responseText)
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
    let userCheckpoint = 1;
    if (req.session && req.session.user) {
        userCheckpoint = req.session.user.checkpoint;
    } else {
        req.session.user = {checkpoint:1}
    }
    console.log('this user is on checkpoint number ' + userCheckpoint)
    res.sendFile(path.join(viewsPath, 'mmpKey.html'));
})

app.post('/mmp/getcheckpoint', async (req,res)=> {
    
    let userCheckpoint = req.session.user.checkpoint;
    let userNextUrl = checkpointToKey[userCheckpoint];

    if (userCheckpoint == 1) {
        res.json({checkpoint:userCheckpoint, nextUrl:userNextUrl});
        console.log("have a good day finishing that!")
        return;
    }



    if (req.body.referrer == "https://lootdest.org/") {
        userCheckpoint += 1;
        req.body.session.checkpoint = userCheckpoint;
        userNextUrl = checkpointToKey[userCheckpoint];
        console.log("congrats! you didn't bypass!")

        if (userCheckpoint == 3) {

            try {
                const response = await fetch('https://betterkeysystem.sazawa.workers.dev/?key=IMGENERATINGANEWKEYRAHHHHHHHHHHHHHHH');
            
                if (response.status == 201) {
                    const responseText = await response.text();
                    console.log(" congrats! you got key " + responseText)
                    res.json({checkpoint:userCheckpoint, key:responseText})
                } else {
                    console.log(" uh oh! key is not status code 201!")
                    res.json({checkpoint:userCheckpoint, key:"some error happened while getting key, please try again"})
                }
                return;
        
            } catch (error) {
                console.error("Error getting key:", error);
                res.status(500).json({checkpoint:userCheckpoint, key:"Error getting key"});
            }
        }

    } else {
        req.session.destroy()
        userNextUrl = ""
        console.log("congrats! you tried bypassing!")
    }
    res.json({checkpoint:userCheckpoint, nextUrl:userNextUrl});
})




//ADMIN PANEL
app.get('/admin/login', async (req,res) => {
    res.sendFile(path.join(viewsPath, "adminLogin.html"))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;