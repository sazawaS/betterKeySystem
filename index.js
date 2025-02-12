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
    res.sendFile(path.join(viewsPath, 'mmpKey.html'));
})

app.post('/mmp/getcheckpoint', async (req,res)=> {
    

    let userCheckpoint = 1;

    if (req.cookies.checkpoint) {
        userCheckpoint = parseInt(req.cookies.checkpoint);
    } else {
        res.cookie('checkpoint', 1, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    }

    let userNextUrl = checkpointToKey[userCheckpoint];

    if (userCheckpoint == 1) {
        res.json({checkpoint:userCheckpoint, nextUrl:userNextUrl});
        console.log("have a good day finishing that!")
        return;
    }



    if (req.body.referrer == "https://lootdest.org/") {
        userCheckpoint += 1;
        res.cookie('checkpoint', userCheckpoint, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' }); // Update cookie
        userNextUrl = checkpointToKey[userCheckpoint];
        console.log("congrats! you didn't bypass!")

        if (userCheckpoint == 3) {

            res.clearCookie('checkpoint', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

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
        res.clearCookie('checkpoint', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
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