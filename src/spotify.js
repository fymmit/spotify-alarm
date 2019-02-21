require('dotenv').config()
const axios = require('axios')
const qs = require('qs')

function play(authToken) {
    return new Promise((resolve, reject) => {
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
        axios.put(url, data, config)
        .then(() => {
            resolve()
        })
        .catch(err => {
            console.log(err)
        })
    })
}

function auth(secrets, code) {
    return new Promise((resolve, reject) => {
        let url = 'https://accounts.spotify.com/api/token'
        let data = qs.stringify({
            grant_type: 'authorization_code',
            code,
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
            resolve(result.data)
        }).catch(err => {
            console.log(err)
            reject()
        })
    })
}

function refreshAuth(secrets, refresh_token) {
    return new Promise(resolve => {
        let url = 'https://accounts.spotify.com/api/token'
        let data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token,
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
            reject()
        })
    })
}

module.exports = {
    play,
    auth,
    refreshAuth
}