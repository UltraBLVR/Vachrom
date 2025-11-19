module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    async execute(message, args) {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('You need ban permissions to use this command!');
        }
        
        const user = message.mentions.users.first();
        if (!user) return message.reply('Please mention a user to ban!');
        
        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        try {
            await message.guild.members.ban(user, { reason });
            message.reply(`${user.tag} has been banned. Reason: ${reason}`);
        } catch (error) {
            message.reply('Failed to ban the user!');
        }
    }
};