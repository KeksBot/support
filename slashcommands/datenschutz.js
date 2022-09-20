const Discord = require('discord.js')
const { getData } = require('../db/db')
const embeds = require('../embeds')
const userdata = require('../schemas/userdata')

module.exports = {
    name: 'datenschutz',
    description: 'Optionen im Bezug auf Datenschutz',
    options: [
        {
            name: 'delete',
            description: 'Löscht alle Accountdaten',
            type: Discord.ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'show',
            description: 'Übermittelt alle Accountdaten im JSON-Format',
            type: Discord.ApplicationCommandOptionType.Subcommand
        }
    ],
    async execute(interaction, args, client) {
        const color = {...interaction.color}
        switch(args.subcommand) {
            case 'delete': {
                let embed = new Discord.EmbedBuilder()
                    .setColor(color.yellow)
                    .setTitle('Accountdaten löschen')
                    .setDescription('Bist du dir sicher, dass du alle deine Accountdaten löschen möchtest?\nDieser Vorgang kann nicht rückgängig gemacht werden und jeglicher Fortschritt geht für immer verloren.')
                let buttons = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('not.so.dangerous.exit')
                            .setLabel('Abbrechen')
                            .setStyle(Discord.ButtonStyle.Success),
                        new Discord.ButtonBuilder()
                            .setCustomId('dangerous.delete.all.data')
                            .setLabel('Alle Daten unwiderruflich löschen')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setEmoji('⚠️')
                    )
                let message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true, ephemeral: true })
                interaction = await message.awaitMessageComponent({ time: 120000 }).catch(e => {return null})
                if(!interaction) return embeds.success(interaction, 'Timeout', 'Der Vorgang wurde abgebrochen und es wurden keine Daten gelöscht.', true)
                if(interaction.customId == 'not.so.dangerous.exit') return embeds.success(interaction, 'Abgebrochen', 'Der Vorgang wurde abgebrochen und es wurden keine Daten gelöscht.', true)
                await interaction.showModal(
                    new Discord.ModalBuilder()
                        .setTitle('Accountdaten löschen')
                        .setCustomId('dangerous.confirm.delete.all.data')
                        .setComponents([
                            new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.TextInputBuilder()
                                        .setStyle(Discord.TextInputStyle.Paragraph)
                                        .setCustomId('nothing.to.see.here')
                                        .setValue(`Gib unten "${interaction.user.tag}" ein, um den Vorgang zu bestätigen und alle deine Daten unwiderruflich zu löschen.`)
                                        .setLabel('Information')
                                        .setRequired(false),
                                ),
                            new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.TextInputBuilder()
                                        .setStyle(Discord.TextInputStyle.Short)
                                        .setCustomId('dangerous.confirm.delete.all.data.keyword')
                                        .setLabel('Eingabe')
                                        .setPlaceholder(interaction.user.tag)
                                        .setRequired(true)
                                )
                        ])
                )
                interaction = await interaction.awaitModalSubmit({ time: 120000 }).catch(e => {return null})
                if(!interaction) return
                if(interaction.components[1].components[0].value == interaction.user.tag) {
                    let { err } = await userdata.findByIdAndRemove(interaction.user.id) 
                    if(err) {
                        return embeds.error(interaction, 'Fehler', 'Beim Löschen deiner Daten ist ein Fehler aufgetreten. Bitte kontaktiere <@514089658833960963> per DM, um eine manuelle Löschung zu beantragen.\nWir entschuldigen uns für die Unannehmlichkeiten.', true)
                    }
                    let embed = new Discord.EmbedBuilder()
                        .setColor(color.lime)
                        .setTitle('Accountdaten gelöscht')
                        .setDescription('Deine Daten wurden erfolgreich gelöscht.\nWir bedauern, dass du die Nutzung des KeksBot beendest und hoffen, dich eines Tages wieder begrüßen zu dürfen.\nVielen Dank, dass du den KeksBot verwendet hast!')
                    await interaction.update({ embeds: [embed], components: [], ephemeral: true })
                } else {
                    return embeds.error(interaction, 'Bestätigung fehlgeschlagen', 'Der Vorgang wurde abgebrochen und es wurden keine Daten gelöscht.', true)
                }
                break
            }
            case 'show': {
                let regex = /[\w0-9_\-.]+/
                let attachment = new Discord.AttachmentBuilder()
                    .setFile(Buffer.from(JSON.stringify(interaction.user.data, null, 4), 'utf-8'))
                    .setName(`${(interaction.user.username.match(regex) || ['data']).join('')}.json`)
                let attachment_min = new Discord.AttachmentBuilder()
                    .setFile(Buffer.from(JSON.stringify(interaction.user.data), 'utf-8'))
                    .setName(`${(interaction.user.username.match(regex) || ['data']).join('')}-min.json`)
                let embed = new Discord.EmbedBuilder()
                    .setColor(color.normal)
                    .setTitle('Accountdaten')
                    .setDescription('Hier findest du alle deine, von uns gespeicherten, Accountdaten.')
                await interaction.reply({ embeds: [embed], files: [attachment, attachment_min], ephemeral: true })
            }
        }
    }
}