const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Seviye bazlı ders akışı
const GRAMMAR_BY_LEVEL = {
    N5: {
        goal: 'Temel cümle yapısı, kendini tanıtma, basit isim/sıfat cümleleri.',
        patterns: [
            '**[özne] wa [bilgi] desu** – tanımlama cümlesi',
            '**[yer] ni [nesne] ga arimasu / imasu** – bir şeyin varlığını söyleme',
            '**[zaman] に [fiil]** – zamanı belirtme'
        ],
        examples: [
            'わたしは 学生です。→ Ben öğrenciyim.',
            '東京に 友だちが います。→ Tokyo\'da arkadaşım var.',
            '七時に 起きます。→ Saat 7\'de uyanırım.'
        ]
    },
    N4: {
        goal: 'Geçmiş zaman, niyet, istek ve basit bağlaçlar.',
        patterns: [
            '**〜と思います (to omoimasu)** – bence / sanıyorum',
            '**〜たいです (tai desu)** – bir şeyi yapmak istemek',
            '**〜から / 〜ので** – çünkü, -dığı için'
        ],
        examples: [
            '日本語は むずかしいと思います。→ Japonca zor olduğunu düşünüyorum.',
            '日本へ 行きたいです。→ Japonya\'ya gitmek istiyorum.',
            '雨が降っているので、出かけません。→ Yağmur yağdığı için dışarı çıkmıyorum.'
        ]
    },
    N3: {
        goal: 'Daha soyut ifadeler, niyet ve alışkanlık yapıları.',
        patterns: [
            '**〜ようにする** – bir şeyi yapmaya çalışmak',
            '**〜ことにする / 〜ことになっている** – karar vermek / kural olmak',
            '**〜てしまう** – istemeden yapmak, tamamlamak'
        ],
        examples: [
            '毎日 日本語で 日記を書くようにしています。→ Her gün Japonca günlük yazmaya çalışıyorum.',
            '来年 留学することにしました。→ Seneye yurtdışında okumaya karar verdim.',
            '財布を忘れてしまいました。→ Cüzdanımı yanlışlıkla unuttum.'
        ]
    },
    N2: {
        goal: 'Neden-sonuç, zorunluluk ve beklenti kırılması.',
        patterns: [
            '**〜わけにはいかない** – yapmam doğru olmaz',
            '**〜はずだ / 〜はずがない** – öyle olması gerekir / olamaz',
            '**〜ことはない** – yapmana gerek yok'
        ],
        examples: [
            '明日は試験だから、遊んでいるわけにはいかない。→ Yarın sınav var, oyun oynayacak durumda değilim.',
            '彼は日本に十年住んでいるから、日本語が話せるはずだ。→ On yıl Japonya\'da yaşadı, Japonca konuşabiliyor olması gerekir.',
            'そんなに心配することはありません。→ O kadar endişelenmene gerek yok.'
        ]
    },
    N1: {
        goal: 'İleri seviyede temkinli ifade ve dolaylı anlatım.',
        patterns: [
            '**〜ないものでもない** – imkânsız da sayılmaz',
            '**〜ざるを得ない** – yapmadan edemem',
            '**〜に越したことはない** – en iyisi ... olmasıdır'
        ],
        examples: [
            '少し無理をすれば、買えないものでもない。→ Biraz zorlarsam alamayacak da sayılmam.',
            '体調が悪くても、今日中に終わらせざるを得ない。→ Kendimi kötü hissetsem de bugün bitirmek zorundayım.',
            '安全であるに越したことはない。→ Güvenli olması en iyisidir.'
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lesson')
        .setDescription('Seviye bazlı Japonca dersi başlatır')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('JLPT seviyesi')
                .setRequired(true)
                .addChoices(
                    { name: 'N5 (başlangıç)', value: 'N5' },
                    { name: 'N4', value: 'N4' },
                    { name: 'N3', value: 'N3' },
                    { name: 'N2', value: 'N2' },
                    { name: 'N1', value: 'N1' }
                )),

    async execute(interaction, { vocabulary, kanji }) {
        const level = interaction.options.getString('level');

        const info = GRAMMAR_BY_LEVEL[level];

        // İlgili seviyeden birkaç kelime ve kanji çekelim
        const vocabPool = vocabulary.filter(v => v.level === level);
        const kanjiPool = kanji.filter(k => k.level === level);

        const pickSome = (arr, n) => arr
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(n, arr.length));

        const vocabSample = pickSome(vocabPool, 8);
        const kanjiSample = pickSome(kanjiPool, 5);

        const embed = new EmbedBuilder()
            .setTitle(`📖 ${level} Dersi`)
            .setColor(0x667eea);

        if (info) {
            embed.setDescription(info.goal);
        }

        // Kelime bölümü
        if (vocabSample.length) {
            embed.addFields({
                name: '🈚 Kelimeler',
                value: vocabSample.map(v =>
                    `**${v.japanese}** (${v.romaji}) → ${v.meaning}`
                ).join('\n'),
                inline: false
            });
        }

        // Kanji bölümü
        if (kanjiSample.length) {
            embed.addFields({
                name: '🈳 Kanji',
                value: kanjiSample.map(k =>
                    `**${k.kanji}** ・ onyomi: ${k.onyomi || '-'} ・ kunyomi: ${k.kunyomi || '-'} ・ anlam: ${k.meaning}`
                ).join('\n'),
                inline: false
            });
        }

        // Dilbilgisi yapıları ve örnek cümleler
        if (info) {
            embed.addFields(
                {
                    name: '📌 Önemli Yapılar',
                    value: info.patterns.join('\n'),
                    inline: false
                },
                {
                    name: '🗣 Örnek Cümleler',
                    value: info.examples.join('\n'),
                    inline: false
                }
            );
        }

        // Önerilen komut akışı
        embed.addFields({
            name: '🧭 Bu dersten sonra ne yapmalı?',
            value: [
                '• Kelimeleri tekrar etmek için: `/flashcard level:' + level + '`',
                '• Ek kelime için: `/vocab level:' + level + ' sayi:10`',
                '• Kanji pekiştirmek için: `/kanji level:' + level + ' sayi:3`',
                '• Kendini test etmek için: `/quiz level:' + level + '`'
            ].join('\n'),
            inline: false
        });

        await interaction.reply({ embeds: [embed] });
    }
};

