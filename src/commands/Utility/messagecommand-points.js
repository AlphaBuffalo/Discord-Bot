const { Message } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const MessageCommand = require('../../structure/MessageCommand');

module.exports = new MessageCommand({
    command: {
        name: 'points',
        description: 'Show points for a user (or yourself).',
        aliases: []
    },
    options: { cooldown: 2000 },
    /**
     * @param {DiscordBot} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || (args[0] ? await message.guild.members.fetch(args[0]).then(m=>m.user).catch(()=>null) : null) || message.author;

        const key = `points-${message.guild.id}-${target.id}`;
        const current = client.database.has(key) ? Number(client.database.get(key)) || 0 : 0;

        await message.reply({ content: `**${target.tag}** has **${current}** point(s).` });
    }
}).toJSON();
