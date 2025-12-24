const { Message } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const MessageCommand = require('../../structure/MessageCommand');
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = new MessageCommand({
    command: {
        name: 'leaderboard',
        description: 'Show top points leaderboard for this server.',
        aliases: []
    },
    options: { cooldown: 5000 },
    /**
     * @param {DiscordBot} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const limitArg = parseInt(args[0], 10);
        const limit = Math.max(1, Math.min(25, Number.isInteger(limitArg) ? limitArg : 10));

        let db = {};
        try {
            db = yaml.load(fs.readFileSync('./database.yml', 'utf8')) || {};
        } catch (e) {
            await message.reply({ content: 'Unable to read database file.' });
            return;
        }

        const entries = Object.entries(db)
            .filter(([k]) => k.startsWith(`points-${message.guild.id}-`))
            .map(([k, v]) => ({ userId: k.split('-').pop(), points: Number(v) || 0 }))
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);

        if (!entries.length) {
            await message.reply({ content: 'No points recorded for this server.' });
            return;
        }

        const lines = await Promise.all(entries.map(async (e, i) => {
            try {
                const member = await message.guild.members.fetch(e.userId);
                return `**${i+1}.** ${member.user.tag} — **${e.points}**`;
            } catch {
                return `**${i+1}.** <@${e.userId}> — **${e.points}**`;
            }
        }));

        await message.reply({ content: `**Leaderboard (top ${lines.length})**\n${lines.join('\n')}` });
    }
}).toJSON();
