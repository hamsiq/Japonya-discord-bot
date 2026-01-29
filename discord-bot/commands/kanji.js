const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kanji')
        .setDescription('Kanji öğren')
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
                .setDescription('Kaç kanji gösterilecek (1-5)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(5)),
    
    async execute(interaction, { kanji }) {
        const level = interaction.options.getString('level') || 'all';
        const sayi = interaction.options.getInteger('sayi') || 3;
        
        let filtered = level === 'all' 
            ? kanji 
            : kanji.filter(k => k.level === level);
        
        if (filtered.length === 0) {
            return interaction.reply({ 
                content: '❌ Bu seviyede kanji bulunamadı!', 
                ephemeral: true 
            });
        }
        
        // Rastgele kanji seç
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, sayi);
        
        const embed = new EmbedBuilder()
            .setTitle('🈳 Kanji')
            .setDescription(selected.map((k, i) => {
                const readings = k.onyomi && k.kunyomi 
                    ? `${k.onyomi} / ${k.kunyomi}` 
                    : (k.onyomi || k.kunyomi || '-');
                return `${i + 1}. **${k.kanji}**\n   Okunuş: ${readings}\n   Anlam: ${k.meaning}\n   Seviye: ${k.level} [${k.strokes} çizgi]`;
            }).join('\n\n'))
            .setColor(0xf093fb)
            .setFooter({ text: `Seviye: ${level === 'all' ? 'Tümü' : level} | ${selected.length} kanji` });
        
        await interaction.reply({ embeds: [embed] });
    }
};
