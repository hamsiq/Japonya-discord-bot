const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('course')
        .setDescription('Seviye bazlı Japonca çalışma planı')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(true)
                .addChoices(
                    { name: 'N5 (Başlangıç)', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                )),

    async execute(interaction, { db, hiragana, katakana, vocabulary, kanji }) {
        const level = interaction.options.getString('level');

        const embed = new EmbedBuilder()
            .setTitle(`📚 ${level} Japonca Kurs Akışı`)
            .setColor(0x667eea);

        if (level === 'N5') {
            embed.setDescription('Tamamen sıfırdan başlayanlar için önerilen çalışma yolu:');
            embed.addFields(
                {
                    name: '1️⃣ Alfabeler (Hiragana & Katakana)',
                    value: '• `/hiragana` ile hiragana tablosuna bak\n• `/katakana` ile katakana tablosuna bak\n• Her satırı yüksek sesle oku, yazmaya çalış',
                    inline: false
                },
                {
                    name: '2️⃣ Temel Kelimeler',
                    value: '• `/vocab level:N5 sayi:10` ile 10 temel kelime çalış\n• Bilmediklerini `/flashcard level:N5` ile tekrar et',
                    inline: false
                },
                {
                    name: '3️⃣ Temel Kanji',
                    value: '• `/kanji level:N5 sayi:3` ile 3 kanji öğren\n• Okunuş ve anlamlarını not al',
                    inline: false
                },
                {
                    name: '4️⃣ Quiz ile Pekiştir',
                    value: '• `/quiz level:N5` ile kelime bilgisini test et\n• Her gün en az 5 soru çözmeye çalış',
                    inline: false
                },
                {
                    name: '5️⃣ Günlük Rutin Önerisi',
                    value: '• 5 dakika alfabe tekrar\n• 10 yeni kelime (`/vocab`)\n• 3 yeni kanji (`/kanji`)\n• 1 quiz (`/quiz`)\n• 10 dakika flashcard (`/flashcard`)',
                    inline: false
                }
            );
        } else {
            embed.setDescription(`${level} seviyesinde olanlar için önerilen çalışma yolu:`);
            embed.addFields(
                {
                    name: '1️⃣ Kelime Havuzunu Genişlet',
                    value: `• \`/vocab level:${level} sayi:10\` ile 10 kelime öğren\n• Bilmediklerini \`/flashcard level:${level}\` ile tekrar et`,
                    inline: false
                },
                {
                    name: '2️⃣ Kanji Yoğunlaştırma',
                    value: `• \`/kanji level:${level} sayi:3\` ile 3 yeni kanji\n• Okunuş + anlam + örnek cümle bulmaya çalış (dış kaynaklardan)`,
                    inline: false
                },
                {
                    name: '3️⃣ Quiz ile Seviye Kontrolü',
                    value: `• \`/quiz level:${level}\` ile kendini test et\n• Hatalı sorulardaki kelimeleri flashcard\'a ekle`,
                    inline: false
                },
                {
                    name: '4️⃣ Günlük Rutin Önerisi',
                    value: `• 10 yeni kelime (\`/vocab level:${level} sayi:10\`)\n• 5 yeni kanji (\`/kanji level:${level} sayi:5\`)\n• 2 quiz (\`/quiz level:${level}\`)\n• 15 dakika flashcard`,
                    inline: false
                }
            );
        }

        embed.addFields({
            name: '🔥 İlerleme Takibi',
            value: '• `/stats` ile XP, öğrenilen kelime ve kanji sayını takip et\n• Her gün en az 1 kurs döngüsü tamamlamaya çalış (rutin bölümündeki adımlar)',
            inline: false
        });

        await interaction.reply({ embeds: [embed] });
    }
};

