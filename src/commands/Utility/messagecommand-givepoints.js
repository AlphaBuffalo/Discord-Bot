const { Message } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const MessageCommand = require('../../structure/MessageCommand');

module.exports = new MessageCommand({
    command: {
        name: 'givepoints',
        description: 'Give points to another user.',
        aliases: []
    },
    options: {
        cooldown: 2000
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || (args[0] ? await message.guild.members.fetch(args[0]).then(m => m.user).catch(() => null) : null);
        const amountArg = args[1] || args[0];
        const amount = amountArg ? parseInt(amountArg, 10) : NaN;

        if (!target) {
            await message.reply({ content: 'You must mention a user or provide their ID as the first argument.' });
            return;
        }

        if (!Number.isInteger(amount) || amount <= 0) {
            await message.reply({ content: 'Please provide a valid positive integer amount.' });
            return;
        }

        const key = `points-${message.guild.id}-${target.id}`;
        const current = client.database.has(key) ? parseInt(client.database.get(key), 10) || 0 : 0;
        const updated = current + amount;

        client.database.set(key, updated);

        await message.reply({ content: `Gave **${amount}** point(s) to **${target.tag}**. They now have **${updated}** point(s).` });
    }
}).toJSON();
