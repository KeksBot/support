const discord = require('discord.js')
const getData = require('../db/getData')

async function roles(member) {
	let roles = []
	if(member.data?.badges) {
		let badges = member.data.badges
		if(badges.mod) roles.push(member.guild.roles.cache.get('775002147846488085'))
		if(badges.dev) roles.push(member.guild.roles.cache.get('779969450383507488'))
		if(badges.team) roles.push(member.guild.roles.cache.get('779991897880002561'))
		if(badges.vip) roles.push(member.guild.roles.cache.get('775002243317104650'))
		if(badges.partner) roles.push(member.guild.roles.cache.get('782630956619268106'))
	}
	if(!member.user.bot) roles.push(member.guild.roles.cache.get('777971161048678471'))
	else roles.push(member.guild.roles.cache.get('776846101466316820'))
	return await member.roles.add(roles).catch()
}

module.exports = {
	name: 'KeksBot Support Server Autorole',
	event: 'guildMemberAdd',
	async on(member, client) {
		await roles(member)
		if(!member.user.bot) try {
			member.user.createDM().then((channel) => {
				var embed = new discord.MessageEmbed()
					.setColor(0xa051ae)
					.setTitle(`Willkommen, ${member.user.username}`)
					.setDescription(
						`Herzlich Willkommen auf dem KeksBot Support Server, <@${member.user.username}>.\nSolltest du Fragen, <#780004713038872596> oder <#780004599787945984>s äußern wollen, benutze bitte die dafür vorgesehenen Kanäle.\nAnsonsten wünschen wir dir viel Spaß auf dem Server :3`
					)
				channel.send({ embeds: [embed] });
			});
		} catch (err) {}
	}
};