require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const spotify = require('../src/spotify')
const timer = require('../src/timer')

const secrets = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    auth_uri: process.env.AUTH_URI,
    redirect_uri: process.env.REDIRECT_URI
}

app.use(express.static('../ui'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/auth', (req, res) => {
    let url = process.env.AUTH_URI
    res.json(url)
})

app.post('/oauth', (req, res) => {
    let code = req.body.code
    spotify.auth(secrets, code).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err.error_description)
    })
})

app.post('/play', async (req, res) => {
    let refreshToken = req.body.refreshToken
    let alarmTime = req.body.alarmTime
    let timeOut = await timer.calculateTimeout(alarmTime)
    setTimeout(async () => {
        let accessToken = await spotify.refreshAuth(secrets, refreshToken)
        spotify.play(accessToken)
    }, timeOut)
})

const PORT = process.env.PORT || 7000
app.listen(PORT, () => {
    console.log('Listening on port:', PORT)
})