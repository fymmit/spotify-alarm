const axios = require('axios')
const qs = require('qs')

function play(authToken) {
    let url = 'https://api.spotify.com/v1/me/player/play'
    let data = {
        context_uri: 'spotify:user:luzik:playlist:2YjgqY60wSZUbsS4fyMamV',
        offset: {
            uri: 'spotify:track:1W6Ey5cxf0eljSaZnNVO5c'
        },
        position_ms: 0
    }
    let config = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }
    axios.put(url, data, config).catch(err => {
        console.log(err)
    })
}

function auth(secrets) {
    return new Promise(resolve => {
        let url = 'https://accounts.spotify.com/api/token'
        let data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: secrets.refresh_token,
            redirect_uri: secrets.redirect_uri,
            client_id: secrets.client_id,
            client_secret: secrets.client_secret
        })
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(url, data, config).then(result => {
            resolve(result.data.access_token)
        }).catch(err => {
            console.log(err)
        })
    })
}

module.exports = {
    play,
    auth
}