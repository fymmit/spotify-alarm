var input = document.getElementById('time-input')
var authButton = document.getElementById('auth-button')
var alarmButton = document.getElementById('alarm-button')

authButton.addEventListener('click', authenticate)
alarmButton.addEventListener('click', play)
window.addEventListener('load', handleLoad)

function handleLoad(e) {
    saveCode()
    if (sessionStorage.code) {
        let code = sessionStorage.code
        oAuth({code}).then(res => {
            saveAccessTokens(res)
        })
    }
}

function play(e) {
    if (sessionStorage.access_token) {
        let oauth = sessionStorage.access_token
        let alarmTime = input.value
        let data = {
            oauth,
            alarmTime
        }
        fetch('http://localhost:7000/play', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    } else {
        alert('Please authenticate first.')
    }
}

function oAuth(code) {
    return fetch('http://localhost:7000/oauth', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(code)
    }).then(res => res.json())
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
        fetch('http://localhost:7000/auth')
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
