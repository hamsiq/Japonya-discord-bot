const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// JLPT deneme sınavı – kelime / kanji odaklı basit mock
module.exports = {
    data: new SlashCommandBuilder()
        .setName('jlptmock')
        .setDescription('JLPT deneme sınavı (kelime / kanji testi)')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(true)
                .addChoices(
                    { name: 'N5', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                ))
        .addIntegerOption(option =>
            option.setName('sayi')
                .setDescription('Soru sayısı (5–20)')
                .setRequired(false)
                .setMinValue(5)
                .setMaxValue(20))
        .addStringOption(option =>
            option.setName('tur')
                .setDescription('Soru türü')
                .setRequired(false)
                .addChoices(
                    { name: 'Karışık', value: 'mix' },
                    { name: 'Sadece kelime', value: 'vocab' },
                    { name: 'Sadece kanji', value: 'kanji' }
                )),

    async execute(interaction, { db, vocabulary, kanji }) {
        const level = interaction.options.getString('level');
        const total = interaction.options.getInteger('sayi') || 10;
        const qType = interaction.options.getString('tur') || 'mix';

        const vocabPool = vocabulary.filter(v => v.level === level);
        const kanjiPool = kanji.filter(k => k.level === level);
        if (vocabPool.length < 4 && qType !== 'kanji') {
            return interaction.reply({
                content: '❌ Bu seviyede yeterli kelime yok!',
                ephemeral: true
            });
        }
        if (kanjiPool.length < 4 && qType === 'kanji') {
            return interaction.reply({
                content: '❌ Bu seviyede yeterli kanji yok!',
                ephemeral: true
            });
        }

        // Kullanıcı ilerleme kaydı için basit başlangıç satırı
        const userId = interaction.user.id;
        db.run('INSERT OR IGNORE INTO users (user_id) VALUES (?)', [userId]);

        const { embed, row } = buildQuestion({
            level,
            total,
            current: 1,
            userId,
            qType,
            vocabulary,
            kanji
        });

        await interaction.reply({ embeds: [embed], components: [row] });
    },

    async handleButton(interaction, { db, vocabulary, kanji }) {
        const parts = interaction.customId.split('_');
        // jlpt_level_total_current_qtype_selected_correct_userId
        const level = parts[1];
        const total = parseInt(parts[2], 10);
        const current = parseInt(parts[3], 10);
        const qType = parts[4];
        const selected = parts[5];
        const correct = parts[6];
        const buttonUserId = parts[7];

        if (interaction.user.id !== buttonUserId) {
            return interaction.reply({
                content: '❌ Bu butonlar sadece sınavı başlatan kişi tarafından kullanılabilir!',
                ephemeral: true
            });
        }

        const isCorrect = selected === correct;
        const userId = interaction.user.id;

        if (isCorrect) {
            db.run('UPDATE users SET xp = xp + 5 WHERE user_id = ?', [userId]);
        }

        const feedback = new EmbedBuilder()
            .setColor(isCorrect ? 0x51cf66 : 0xff6b6b)
            .setTitle(isCorrect ? '✅ Doğru!' : '❌ Yanlış!');

        if (qType === 'kanji') {
            const k = kanji.find(x => x.kanji === correct);
            if (k) {
                feedback.setDescription(
                    `Doğru cevap: **${k.kanji}** (${k.onyomi || k.kunyomi || 'okunuş yok'}) → ${k.meaning}`
                );
            }
        } else {
            const correctWord = vocabulary.find(v => v.japanese === correct);
            if (correctWord) {
                feedback.setDescription(
                    `Doğru cevap: **${correctWord.japanese}** (${correctWord.romaji}) → ${correctWord.meaning}`
                );
            }
        }

        // Sınav bitti mi?
        if (current >= total) {
            feedback.setFooter({ text: `JLPT ${level} mock bitti. XP'n güncellendi.` });
            return interaction.update({ embeds: [feedback], components: [] });
        }

        const next = buildQuestion({
            level,
            total,
            current: current + 1,
            userId,
            qType,
            vocabulary,
            kanji
        });

        await interaction.update({ embeds: [feedback, next.embed], components: [next.row] });
    }
};

// Yardımcı: yeni soru üretir (kelime / kanji)
function buildQuestion({ level, total, current, userId, qType, vocabulary, kanji }) {
    // Soru türü – mix ise rastgele seç
    let type = qType;
    if (qType === 'mix') {
        type = Math.random() < 0.5 ? 'vocab' : 'kanji';
    }

    let prompt = '';
    let options = [];
    let correctValue = '';

    if (type === 'kanji') {
        const pool = kanji.filter(k => k.level === level);
        const correct = pool[Math.floor(Math.random() * pool.length)];
        const wrong = pool
            .filter(k => k.kanji !== correct.kanji)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        options = [correct, ...wrong].sort(() => 0.5 - Math.random());
        prompt = `**${correct.kanji}** kanjisinin anlamı nedir?`;
        correctValue = correct.kanji;
    } else {
        const pool = vocabulary.filter(v => v.level === level);
        const correct = pool[Math.floor(Math.random() * pool.length)];
        const wrong = pool
            .filter(v => v.japanese !== correct.japanese)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        options = [correct, ...wrong].sort(() => 0.5 - Math.random());
        prompt = `**${correct.japanese}** (${correct.romaji}) kelimesinin anlamı nedir?`;
        correctValue = correct.japanese;
    }

    const embed = new EmbedBuilder()
        .setTitle(`📝 JLPT ${level} Mock – Soru ${current}/${total}`)
        .setDescription(prompt)
        .setColor(0x667eea);

    const row = new ActionRowBuilder();
    options.forEach((opt, index) => {
        const label = type === 'kanji' ? opt.meaning : opt.meaning;
        const idValue = type === 'kanji' ? opt.kanji : opt.japanese;
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`jlpt_${level}_${total}_${current}_${type}_${idValue}_${correctValue}_${userId}`)
                .setLabel(`${index + 1}. ${label}`)
                .setStyle(ButtonStyle.Secondary)
        );
    });

    return { embed, row };
}

