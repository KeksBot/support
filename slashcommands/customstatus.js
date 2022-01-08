const discord = require('discord.js')

module.exports = {
    name: 'status',
    description: 'Ändert den Status in #status auf einen beliebigen Wert',
    options: [
        {
            name: 'set',
            type: 'SUB_COMMAND',
            description: 'Setzt den Status auf den angegebenen Wert',
            options: [
                {
                    name: 'title',
                    type: 'STRING',
                    required: 'true',
                    description: 'Der Titel des Status'
                },
                {
                    name: 'description',
                    type: 'STRING',
                    required: 'true',
                    description: 'Die Beschreibung des Status'
                }
            ]
        },
        {
            name: 'reset',
            type: 'SUB_COMMAND',
            description: 'Zeigt den automatischen Status an'
        }
    ],
    roles: 'owner',
    async execute(ita, args, client) {
        if(args.subcommand == 'set') {
            let embed = new discord.MessageEmbed()
                .setTitle(args.title)
                .setDescription(args.description)
                .setColor(global.color.yellow)
            await global.message.edit({ embeds: [embed], content: null })
            await ita.reply({ embeds: [embed.setFooter('Änderungen übernommen')], ephemeral: true })
        } else {
            let embed = new discord.MessageEmbed()
                .setTitle('Status wird geladen')
                .setDescription('Dies kann einige Zeit dauern')
                .setColor(global.color.normal)
            await global.message.edit({ embeds: [embed], content: null })
            await ita.reply({ embeds: [embed.setFooter('Änderungen übernommen')], ephemeral: true })
        }
    }
}