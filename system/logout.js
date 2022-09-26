const SystemError = require('./!error')

module.exports = {
    name: 'logout',
    permissionLevel: 1,
    async execute(interaction, args) {
        if(args.includes('--help') || args.includes('-h')) {
            return 'system logout\n\nLoggt den aktuellen Systemuser aus'
        }
        const { user } = interaction
        let id = user.data.system.user
        if(!id) throw new SystemError('kein verbundener systemuser', 'Fehler | logout')
        delete user.data.system.user
        await user.save()
        return {
            success: true,
            message: `'${user.tag}' ist nun ausgeloggt`,
            userId: id
        }
    }
}