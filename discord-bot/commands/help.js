const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Bot komutlarını ve kullanımını gösterir'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🇯🇵 Japonca Öğren Bot - Yardım')
            .setDescription('Japonca öğrenmek için kullanabileceğiniz tüm komutlar:')
            .addFields(
                {
                    name: '📚 Alfabe Komutları',
                    value: '`/hiragana [harf]` - Hiragana alfabesini gösterir\n`/katakana [harf]` - Katakana alfabesini gösterir',
                    inline: false
                },
                {
                    name: '🈳 Kanji & Kelime',
                    value: '`/kanji [level] [sayi]` - Kanji karakterleri gösterir\n`/vocab [level] [sayi]` - Japonca kelimeler gösterir',
                    inline: false
                },
                {
                    name: '🎮 Öğrenme Araçları',
                    value: '`/flashcard [level]` - Flashcard ile kelime öğren\n`/quiz [level]` - Quiz yap ve bilgini test et',
                    inline: false
                },
                {
                    name: '📊 İstatistikler',
                    value: '`/stats` - Öğrenme ilerlemenizi görüntüleyin',
                    inline: false
                },
                {
                    name: '💡 İpuçları',
                    value: '• Flashcard kullanarak kelimeleri öğrenin ve tekrar edin\n• Quiz yaparak bilginizi test edin\n• Her doğru cevap XP kazandırır\n• Günlük çalışarak seri oluşturun!',
                    inline: false
                }
            )
            .setColor(0x667eea)
            .setFooter({ text: 'Japonca Öğren Bot' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
