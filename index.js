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
app.use(express.urlencoded({ extended: true }));

app.get('/mps4aside', async  (req, res) => {
    res.sendFile(path.join(viewsPath, 'getMPSKey.html'));
});

app.post('/mps4aside', async  (req, res) => {
    
    const token = req.body.token;
    const url = "https://work.ink/_api/v2/token/isValid/" + token + "?deleteToken=1";
    const response = await fetch(url)
    const resBody = await response.json()
    const isValid = resBody.valid
    
    if (!isValid) {
        res.json({key:""})
        return;
    }

    try {
        const response = await fetch('https://betterkeysystem.sazawa.workers.dev/?key=IMGENERATINGANEWKEYRAHHHHHHHHHHHHHHH&type=MPSFREE');
        
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
});

app.get('/deadline', async  (req, res) => {
    res.sendFile(path.join(viewsPath, 'deadlineKey.html'));
});

app.post('/deadline', async  (req, res) => {
    const token = req.body.token;
    const url = "https://work.ink/_api/v2/token/isValid/" + token + "?deleteToken=1";
    const response = await fetch(url)
    const resBody = await response.json()
    const isValid = resBody.valid
    
    if (!isValid) {
        res.json({key:""})
        return;
    }

    try {
        const response = await fetch('https://betterkeysystem.sazawa.workers.dev/?key=IMGENERATINGANEWKEYRAHHHHHHHHHHHHHHH&type=DEADLINEFREE');
    
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
});

//-----MMP KEY-------//
app.get('/mmp', async (req,res) => {
    res.sendFile(path.join(viewsPath, 'mmpKey.html'));
})

app.post('/mmp', async (req,res)=> {
    const token = req.body.token;
    const url = "https://work.ink/_api/v2/token/isValid/" + token + "?deleteToken=1";
    const response = await fetch(url)
    const resBody = await response.json()
    const isValid = resBody.valid
    
    if (!isValid) {
        res.json({key:""})
        return;
    }

    try {
        const response = await fetch('https://betterkeysystem.sazawa.workers.dev/?key=IMGENERATINGANEWKEYRAHHHHHHHHHHHHHHH&type=MMPFREE');
    
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
})





//ADMIN PANEL
app.get('/admin/login', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (isAdmin) {
        res.redirect('/admin/panel')
        return;
    }
    res.sendFile(path.join(viewsPath, "adminLogin.html"))
})
app.post('/admin/login', async (req,res) => {
    if (req.body.password == "immaInstaLock123porn") {
        res.cookie("admin", true, {maxAge: 1000 * 60 * 2, httpOnly: true});
        res.redirect('/admin/panel')
    }
})

app.get('/admin/panel', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.redirect('/admin/login')
        return;
    }
    res.sendFile(path.join(viewsPath, 'adminPanel.html'));
})

app.post('/admin/panel/createnewkey', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.json({invalid:true})
        return;
    }

    const key = req.body.key;
    let expireTimer = "never";
    try {
        if (key.expiresIn != "never") {
            expireTimer = Date.now() + Number(key.expiresIn);
        }
    } catch(err) {
        console.log(err)
        res.status(400).send("wrong");
        return;
    }
    const url = "https://betterkeysystem.sazawa.workers.dev/?req=1aFG2HDjgJM99j1TaZvCjEweUGH9b6N3USfnEpGaN0YkL9le64sCQimJNHnEaljI&type=createnewkey&key=" + key.key + "&hwid=" + key.hwid + "&expirationDate=" + expireTimer + "&types=" + key.keyTypes
    const response = await fetch(url)
    const text = await response.text()
    res.status(response.status).send(text); 
})
app.post('/admin/panel/getkeys', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.json({invalid:true})
        return;
    }

    let keys = {}
    try
    {
        const url = "https://betterkeysystem.sazawa.workers.dev/?req=1aFG2HDjgJM99j1TaZvCjEweUGH9b6N3USfnEpGaN0YkL9le64sCQimJNHnEaljI&type=getpaidkey"
        const response =  await fetch(url)
        const keys = await response.json()
        res.json(keys);
    }
    catch (err)
    {
        console.log("Error occured while getting all paid keys", err)
    }
})

app.post('/admin/panel/deletekey', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.json({invalid:true})
        return;
    }
    const url = "https://betterkeysystem.sazawa.workers.dev/?req=1aFG2HDjgJM99j1TaZvCjEweUGH9b6N3USfnEpGaN0YkL9le64sCQimJNHnEaljI&type=deletekey&key=" + req.body.key;
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
})

app.post('/admin/panel/expirekey', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.json({invalid:true})
        return;
    }
    const url = "https://betterkeysystem.sazawa.workers.dev/?req=1aFG2HDjgJM99j1TaZvCjEweUGH9b6N3USfnEpGaN0YkL9le64sCQimJNHnEaljI&type=expirekey&key=" + req.body.key;
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
})

app.post('/admin/panel/resethwid', async (req,res) => {
    const isAdmin = req.cookies.admin;
    if (!isAdmin) {
        res.json({invalid:true})
        return;
    }
    const url = "https://betterkeysystem.sazawa.workers.dev/?req=1aFG2HDjgJM99j1TaZvCjEweUGH9b6N3USfnEpGaN0YkL9le64sCQimJNHnEaljI&type=resethwid&key=" + req.body.key;
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;