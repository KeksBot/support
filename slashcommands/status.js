const Discord = require('discord.js')

module.exports = {
    name: 'status',
    description: 'Optionen zur Statusveränderung',
    options: [
        {
            name: 'set',
            type: Discord.ApplicationCommandOptionType.Subcommand,
            description: 'Manuelle Statuseingabe',
            options: [
                {
                    name: 'title',
                    required: true,
                    description: 'Titel der Statusanzeige',
                    type: Discord.ApplicationCommandOptionType.String
                },
                {
                    name: 'description',
                    required: true,
                    description: 'Beschreibung der Statusanzeige',
                    type: Discord.ApplicationCommandOptionType.String
                }
            ],
        },
        {
            name: 'reset',
            description: 'Status zurücksetzen',
            type: Discord.ApplicationCommandOptionType.Subcommand
        }
    ],
    roles: 'owner',
    execute(ita, args, client) {return true}
}