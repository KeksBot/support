module.exports = {
	name: 'KeksBot Support Server Autorole',
	event: 'guildMemberAdd',
	async on(member, client) {
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
};