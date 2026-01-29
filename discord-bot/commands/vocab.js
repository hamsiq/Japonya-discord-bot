const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vocab')
        .setDescription('Japonca kelime öğren')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(false)
                .addChoices(
                    { name: 'Tümü', value: 'all' },
                    { name: 'N5', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                ))
        .addIntegerOption(option =>
            option.setName('sayi')
                .setDescription('Kaç kelime gösterilecek (1-10)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),
    
    async execute(interaction, { vocabulary }) {
        const level = interaction.options.getString('level') || 'all';
        const sayi = interaction.options.getInteger('sayi') || 5;
        
        let filtered = level === 'all' 
            ? vocabulary 
            : vocabulary.filter(v => v.level === level);
        
        // Rastgele kelimeler seç
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, sayi);
        
        if (selected.length === 0) {
            return interaction.reply({ 
                content: '❌ Bu seviyede kelime bulunamadı!', 
                ephemeral: true 
            });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('📚 Japonca Kelimeler')
            .setDescription(selected.map((v, i) => 
                `${i + 1}. **${v.japanese}** (${v.romaji})\n   → ${v.meaning} [${v.level}]`
            ).join('\n\n'))
            .setColor(0x667eea)
            .setFooter({ text: `Seviye: ${level === 'all' ? 'Tümü' : level} | ${selected.length} kelime` });
        
        await interaction.reply({ embeds: [embed] });
    }
};
