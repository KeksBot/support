const update = require('../db/update')
const getData = require('../db/getData')
const SystemError = require('./!error')
const crypto = require('crypto')

module.exports = {
    name: 'create',
    permissionLevel: 3,
    async execute(interaction, args) {
        if(args.includes('--help') || args.includes('-h')) {
            return 'system create <id> [--permissionLevel] [--name] [--password]\n\nErstellt einen neuen Systemuser-Account\nid: ID des zu erstellenen Accounts\n--permissionLevel | -pl: Systemberechtigungsgrad des Accounts\n--name | -n: Anzeigename des Accounts\n--password | -pw: Passwort'
        }
        let _args = args.filter(a => !a.startsWith('-'))
        if(!_args.length) throw new SystemError('argument `<id>` fehlt', 'Syntaxfehler | create')
        if(!_args[0].match(/^[\w\-\.~]+$/g)) throw new SystemError('argument `<id>` enthält ungültige zeichen (abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_~)', 'Syntaxfehler | create')
        if(_args[0].match(/^\d+$/g)) throw new SystemError('argument `<id>` muss mindestens einen buchstaben/ein zugelassenes sonderzeichen enthalten', 'Syntaxfehler | create')
        if(_args[0].length > 32) throw new SystemError('argument `<id>` ist zu lang (max: 32)', 'Syntaxfehler')

        let id = _args[0]
        if(await getData('userdata', id)) throw new SystemError(`nutzer "${id}" existiert bereits`, 'Fehler | create')
        let permissionLevel = parseInt(args.find(a => a.startsWith('--permissionLevel') || a.startsWith('-pl')).split(' ')[1]) || 0
        if(isNaN(permissionLevel)) throw new SystemError('argument `--permissionLevel` ist keine zahl', 'Syntaxfehler |create')
        if(permissionLevel < 0 || permissionLevel > 3) throw new SystemError('argument `--permissionLevel` ist nicht zwischen 0 und 3', 'Syntaxfehler | create')
        while (permissionLevel >= interaction.user.data.system.permissionLevel) permissionLevel--
        let name = args.find(a => a.startsWith('--name') || a.startsWith('-n'))?.split(' ').slice(1).join(' ') || null
        let password = args.find(a => a.startsWith('--password') || a.startsWith('-pw'))?.split(' ')[1] || null
        if(password) {
            const { secret } = require('../config.json')
            password = crypto.createHmac('sha256', secret).update(password).digest('base64')
        }

        let userobject = {
            _id: id,
            system: {
                permissionLevel,
            }
        }
        if(name) userobject.name = name
        if(password) userobject.system.password = password
        await update('userdata', id, userobject)
        return {
            success: true,
            message: `systemuser "${id}" wurde erstellt.`,
            data: {
                permissionLevel,
                username: name
            },
            userId: id,
            showMessage: true
        }
    }
}