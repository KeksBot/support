const Discord = require('discord.js')
const embeds = require('../embeds')

module.exports = {
    name: 'system',
    description: 'Systemkonsole',
    async execute(interaction, args, client) {
        const { user, color } = interaction
        await interaction.showModal(
            new Discord.ModalBuilder()
                .setTitle('Systemkonsole')
                .setCustomId('system.interface')
                .setComponents(
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.TextInputBuilder()
                                .setStyle(Discord.TextInputStyle.Short)
                                .setCustomId('system.interface.input')
                                .setPlaceholder('> ')
                                .setLabel('KeksBot Terminal Input')
                        )
                )
        )
        interaction = await interaction.awaitModalSubmit({ time: 150000 }).catch(() => null)
        if(!interaction) return
        let input = interaction.components[0].components[0].value || ''
        input = input.replaceAll('&& system', '&& &').replaceAll('| system', '| >').replace('system', '').trim()
        let commands = input.split(/&&|\|/g).map(s => s.trim())
        if(!client.systemCommands) return embeds.error(interaction, 'Fehler', 'systemcommand nicht initialisiert', true)
        let output
        for (const input of commands) {
            let command
            let commandName = input.replace(/^(& )|^(> )/, '').trim().split(' ')[0]
            try {
                command = require(client.systemCommands[commandName])
            } catch (e) {
                return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` konnte nicht lokalisiert werden`, true)
            }
            if(!command) return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` konnte nicht lokalisiert werden`, true)
            if(command.permissionLevel && command.permissionLevel > user.data.system?.permissionLevel) return embeds.error(interaction, 'Fehler', `systemcommand unbekannt: \n \`system ${commandName}\` ist konnte nicht gefunden werden`, true)
            try {
                output = await command.execute(interaction, input.replace(/^(& )|^(> )/, '').trim(), input.startsWith('>') ? input : null)
            } catch (e) {
                console.error('systemcommand error:', new Date().toLocaleString())
                console.error(input)
                console.error(e)
            }
            delete require.cache[client.systemCommands[commandName]]
        }
        if(output && !interaction.replied) {
            let embed
            try {
                embed = new Discord.EmbedBuilder()
                    .setColor(color.success)
                    .setTitle('Systemkonsole')
                    .setDescription(
                        typeof output === 'string' ? output.substring(0, 4096) :
                        typeof output === 'number' || typeof output === 'bigint' ? output.toString() :
                        typeof output === 'boolean' ? output.toString() :
                        typeof output === 'object' ? JSON.stringify(output, null, 4).substring(0, 4096) :
                        typeof output === 'undefined' ? 'undefined' :
                        'unknown'
                )
            } catch {}
            if(!embed) return embeds.error(interaction, 'Fehler', 'systemcommand output konnte nicht verarbeitet werden', true)
            if(interaction.deferred || interaction.replied) await interaction.editReply({ embeds: [embed] })
            else await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}