const discord = require('discord.js')
const { exec } = require('child_process')
const path = require('path')
const embeds = require('../embeds')

module.exports = {
    name: 'update',
    description: 'Updatet den Bot',
    options: [
        {
            name: 'bot',
            description: 'Welcher Bot geupdatet werden soll',
            type: 'STRING',
            choices: [
                {
                    name: 'keksbot',
                    value: 'keksbot'
                },
                {
                    name: 'keksbot support',
                    value: 'support'
                }
            ],
            required: true
        },
        {
            name: 'branch',
            description: 'Von welcher Branch gepullt werden soll',
            type: 'STRING',
            choices: [
                {
                    name: 'main',
                    value: 'main'
                },
                {
                    name: 'dev',
                    value: 'dev'
                }
            ],
            required: true
        }
    ],
    roles: 'owner',
    async execute(ita, args, client) {
        const { color } = ita
        let cwd = (args.bot == 'keksbot') ? path.join(process.cwd, require('../config.json').path) : process.cwd + ''
        let embed = new discord.MessageEmbed()
            .setColor(color.yellow)
            .setTitle('Update eingeleitet')
            .setDescription('Das Update wird in Kürze durchgeführt.')
        await ita.reply({ embeds: [embed], ephemeral: true })
        await require('delay')(5000)
        if(args.bot == 'keksbot') exec(`git checkout ${args.branch}`, { cwd })
        exec(`git pull`, { cwd }, async function(error, stdout, stderr) {
            if(error) {
                embed = new discord.MessageEmbed()
                    .setColor(color.red)
                    .setDescription('Ein Fehler ist aufgetreten. Das Update wurde nicht oder unvollständig heruntergeladen.')
                    .setTitle('Fehler')
                return await ita.editReply({ embeds: [embed] })
            }
            if(!stdout.toString().includes('Already up to date') || !stderr.toString().includes('Bereits aktuell')) {
                embed = new discord.MessageEmbed()
                    .setColor(color.yellow)
                    .setTitle('Update heruntergeladen')
                    .setDescription('Das Update wird nun installiert.')
                await ita.editReply({ embeds: [embed] })
                exec(`pm2 restart ${(function() {
                    if(args.bot == 'keksbot') return 'KeksBot'
                    else return 'Support'
                })()}`, { cwd })
            } else return embeds.error(ita, 'Fehler', 'Es ist bereits die aktuellste Version von der ausgewählten Branch installiert.')
        })
    }
}