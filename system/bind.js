const SystemError = require('./!error')
const getData = require('../db/getData')

module.exports = {
    name: 'bind',
    permissionLevel: 3,
    async execute(interaction, args, data) {
        if(args.includes('--help') || args.includes('-h')) {
            return 'system bind <id> <user> [--password] [--force]\n\nReserviert den ausgewählten Systemuser für einen Discord Account\nid: ID des Systemuser-Accounts\nuser: Discord User ID\n--password: Passwort\n--forve | -f: Erzwingt die Zuweisung'
        }
        const { user } = interaction
        let _args = args.filter(a => !a.startsWith('-'))
        let id = data?.userId || _args[0] || null
        let bounduser = _args[1] || id != _args[0] ? _args[0] : null || user.id
        if(!id) throw new SystemError('argument `<id>` fehlt', 'Syntaxfehler | bind')
        if(!id) throw new SystemError('argument `<user>` fehlt', 'Syntaxfehler | bind')
        let password = args.find(a => a.startsWith('--password') || a.startsWith('-pw'))?.split(' ')[1] || null
        let systemuser = await getData('userdata', id)
        if(!systemuser || systemuser.system?.password) {
            if(!password) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
            let hash = crypto.createHmac('sha256', secret).update(password).digest('base64')
            if(systemuser.system.password != hash) throw new SystemError('authentifizierung fehlgeschlagen', 'Authentifizierungsfehler | login')
        }
        bounduser = await interaction.client.users.fetch(bounduser)
        if(!bounduser) throw new SystemError('argument `<user>` ist ungültig', 'Syntaxfehler | bind')
        if(systemuser.system?.bounduser && !args.includes('--force') && !args.includes('-f')) throw new SystemError('systemuser ist bereits einem anderen nutzer zugeordnet\nVerwende `--force`, um eine überschreibung zu erzwingen', 'Fehler | bind')
        if(systemuser.system?.bounduser && (args.includes('--force') || args.includes('-f')) && user.data.system.permissionLevel <= systemuser.system?.permissionLevel) throw new SystemError('die verwendung von `--force` zum überschreiben bereits existenter verbindungen erfordert eine höhere Systemberechtigungsstufe', 'Berechtigungsfehler | bind')
        if(!systemuser.system) systemuser.system = {}
        systemuser.system.bounduser = bounduser.id
        await systemuser.save()
        return {
            success: true,
            message: `'${bounduser.tag}' ist nun mit '${id}' verbunden`,
            showMessage: true
        }
    }
}