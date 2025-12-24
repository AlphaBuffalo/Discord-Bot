const { ChatInputCommandInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');

module.exports = new ApplicationCommand({
    command: {
        name: 'points',
        description: 'Show points for a user (or yourself).',
        type: 1,
        options: [
            { name: 'user', description: 'User to check', type: 6, required: false }
        ]
    },
    options: { cooldown: 2000 },
    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const target = interaction.options.getUser('user') || interaction.user;

        if (!interaction.guildId) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const key = `points-${interaction.guildId}-${target.id}`;
        const current = client.database.has(key) ? Number(client.database.get(key)) || 0 : 0;

        await interaction.reply({ content: `**${target.tag}** has **${current}** point(s).` });
    }
}).toJSON();
