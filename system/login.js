const getData = require('../db/getData')
const SystemError = require('./!error')
const crypto = require('crypto')
const { secret } = require('../config.json')

module.exports = {
    name: 'login',
    permissionLevel: 1,
    async execute(interaction, args, data) {
        if(args.includes('--help') || args.includes('-h')) {
            return 'system login <id> [--password]\n\nVerwendet den ausgewählten Systemuser für Bot Aktionen\nid: ID des Accounts\n--password: Passwort'
        }
        const { user } = interaction
        let _args = args.filter(a => !a.startsWith('-'))
        let id = _args[0] || data?.userId || null
        if(!id) throw new SystemError('argument `<id>` fehlt', 'Syntaxfehler | login')
        let systemuser = await getData('userdata', id)
        let password = args.find(a => a.startsWith('--password') || a.startsWith('-pw'))?.split(' ')[1] || null
        if(systemuser.system?.bounduser != interaction.user.id) {
            if(!systemuser || systemuser.system?.password) {
                if(!password) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
                let hash = crypto.createHmac('sha256', secret).update(password).digest('base64')
                if(systemuser.system.password != hash) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
            }
        }
        if(!user.data.system) user.data.system = {}
        user.data.system.user = id
        await user.save()
        return {
            success: true,
            message: `'${user.tag}' ist nun eingeloggt als '${id}'`,
            userId: id
        }
    }
}