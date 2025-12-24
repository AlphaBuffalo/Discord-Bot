const { ChatInputCommandInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');

module.exports = new ApplicationCommand({
    command: {
        name: 'givepoints',
        description: 'Give points to another user.',
        type: 1,
        options: [
            { name: 'user', description: 'The user to give points to', type: 6, required: true },
            { name: 'amount', description: 'Amount of points to give', type: 4, required: true }
        ]
    },
    options: {
        cooldown: 2000
    },
    /**
     *
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        if (!target) {
            await interaction.reply({ content: 'User not found.', ephemeral: true });
            return;
        }

        if (!Number.isInteger(amount) || amount <= 0) {
            await interaction.reply({ content: 'Please provide a valid positive integer amount.', ephemeral: true });
            return;
        }

        const key = `points-${interaction.guild.id}-${target.id}`;
        const current = client.database.has(key) ? parseInt(client.database.get(key), 10) || 0 : 0;
        const updated = current + amount;

        client.database.set(key, updated);

        await interaction.reply({ content: `Gave **${amount}** point(s) to **${target.tag}**. They now have **${updated}** point(s).` });
    }
}).toJSON();
