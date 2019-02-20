require('dotenv').config()
const spotify = require('./src/spotify')
const timer = require('./src/timer')

let alarmTime = process.argv[2]
let secrets = {
    refresh_token: process.env.REFRESH_TOKEN,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
}

async function main() {
    let oAuthToken = await spotify.auth(secrets)
    let timeOut = await timer.calculateTimeout(alarmTime)
    setTimeout(spotify.play, timeOut, oAuthToken)
}

main()