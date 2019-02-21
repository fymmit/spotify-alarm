function calculateTimeout(end) {
    return new Promise(resolve => {
        let endHours = end.substring(0, end.indexOf(':'))
        let endMinutes = end.substring(end.indexOf(':') + 1)
        let startTime = new Date()
        let endTime = new Date()
        endTime.setHours(endHours)
        endTime.setMinutes(endMinutes)
        endTime.setSeconds(0)
        endTime.setMilliseconds(0)
        if (endHours < startTime.getHours() || endHours == startTime.getHours() && endMinutes < startTime.getMinutes()) endTime.setDate(startTime.getDate() + 1)
        else endTime.setDate(startTime.getDate())
        resolve(endTime - startTime)
    })
}

module.exports = {
    calculateTimeout
}