var input = document.getElementById('time-input')
var authButton = document.getElementById('auth-button')
var alarmButton = document.getElementById('alarm-button')
var origin = window.location.origin

authButton.addEventListener('click', authenticate)
alarmButton.addEventListener('click', play)
window.addEventListener('load', handleLoad)

function handleLoad(e) {
    saveCode()
    if (sessionStorage.code) {
        let code = sessionStorage.code
        if (!sessionStorage.refresh_token) {
            oAuth({code}).then(res => {
                saveAccessTokens(res)
            })
        }
    }
}

function play(e) {
    if (input.value) {
        if (sessionStorage.refresh_token) {
            let refreshToken = sessionStorage.refresh_token
            let alarmTime = input.value
            let data = {
                refreshToken,
                alarmTime
            }
            fetch(origin + '/play', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        } else {
            alert('Please authenticate first.')
        }
    } else {
        alert('Enter a time.')
    }
}

function oAuth(code) {
    return fetch(origin + '/oauth', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(code)
    }).then(res => res.json()).catch(err => {
        alert(err)
        sessionStorage.clear()
    })
}

function saveAccessTokens(data) {
    if (!sessionStorage.accessTokens) {
        sessionStorage.setItem('access_token', data.access_token)
        sessionStorage.setItem('refresh_token', data.refresh_token)
    }
}

function saveCode() {
    if (!sessionStorage.code) {
        let href = window.location.href
        if (href.includes('code=')) {
            let code = href.substring(href.indexOf('=') + 1)
            sessionStorage.setItem('code', code)
        }
    }
}

function authenticate() {
    if (!sessionStorage.code) {
        fetch(origin + '/auth')
        .then(res => {
            return res.json()
        })
        .then(res => {
            window.location = res
        }).then(() => {
            saveCode()
        })
    } else {
        alert('Already authenticated.')
    }
}
