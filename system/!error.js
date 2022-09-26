module.exports = class SystemError extends Error {
    constructor(message = 'ein fehler ist aufgetreten', type = 'Fehler') {
        super(message)
        this.name = 'SystemError'
        this.type = type
    }
}