handleGetUnixDate = (context) => {
    const { date } = context.param
    if (date && new Date(date) == 'Invalid Date') {
        throw new Error('Invalid Date')
    }
    return {
        unix: date ? new Date(date).getTime() : Date.now(),
        utc: date ? new Date(date).toUTCString() : new Date().toUTCString(),
    }
}

module.exports = {
    handleGetUnixDate,
}
