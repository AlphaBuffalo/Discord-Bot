const { ChatInputCommandInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = new ApplicationCommand({
    command: {
        name: 'leaderboard',
        description: 'Show top points leaderboard for this server.',
        type: 1,
        options: [
            { name: 'limit', description: 'How many top users to show', type: 4, required: false }
        ]
    },
    options: { cooldown: 5000 },
    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const limit = Math.max(1, Math.min(25, interaction.options.getInteger('limit') || 10));

        let db = {};
        try {
            db = yaml.load(fs.readFileSync('./database.yml', 'utf8')) || {};
        } catch (e) {
            await interaction.reply({ content: 'Unable to read database file.', ephemeral: true });
            return;
        }

        const entries = Object.entries(db)
            .filter(([k]) => k.startsWith(`points-${interaction.guild.id}-`))
            .map(([k, v]) => ({ userId: k.split('-').pop(), points: Number(v) || 0 }))
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);

        if (!entries.length) {
            await interaction.reply({ content: 'No points recorded for this server.' });
            return;
        }

        const lines = await Promise.all(entries.map(async (e, i) => {
            try {
                const member = await interaction.guild.members.fetch(e.userId);
                return `**${i+1}.** ${member.user.tag} — **${e.points}**`;
            } catch {
                return `**${i+1}.** <@${e.userId}> — **${e.points}**`;
            }
        }));

        await interaction.reply({ content: `**Leaderboard (top ${lines.length})**\n${lines.join('\n')}` });
    }
}).toJSON();
