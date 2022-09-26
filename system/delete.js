const userdata = require('../schemas/userdata')
const SystemError = require('./!error')
const crypto = require('crypto')
const { secret } = require('../config.json')
const getData = require('../db/getData')

module.exports = {
    name: 'delete',
    permissionLevel: 3,
    async execute(interaction, args, data) {
        if(args.includes('--help') || args.includes('-h')) {
            return 'system delete <id> [--password]\n\nLöscht den ausgewählten Systemuser\nid: ID des Accounts\n--password | -pw: Passwort'
        }
        let id = data?.userId || args[0] || null
        if(!id) throw new SystemError('argument `<id>` fehlt', 'Syntaxfehler | delete')
        if(id.match(/^\d+$/g)) throw new SystemError('argument `<id>` ist ein nicht löschbarer, reeler nutzer', 'Fehler | delete')
        let systemuser = await getData('userdata', id)
        let password = args.find(a => a.startsWith('--password') || a.startsWith('-pw'))?.split(' ')[1] || null
        if(!systemuser || systemuser.system?.password) {
            if(!password) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
            let hash = crypto.createHmac('sha256', secret).update(password).digest('base64')
            if(systemuser.system.password != hash) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
        }
        await userdata.findByIdAndDelete(id)
        return {
            success: true,
            message: `systemuser '${id}' wurde gelöscht`,
            showMessage: true
        }
    }
}