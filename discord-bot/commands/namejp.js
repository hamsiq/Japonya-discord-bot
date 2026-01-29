const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Basit romaji → kana çevirici (dialog.js ile aynı mantık)
function romanToKatakana(input) {
    if (!input) return '';
    const str = input.toLowerCase().replace(/[^a-z]/g, '');
    const table = {
        kya: 'キャ', kyu: 'キュ', kyo: 'キョ',
        sha: 'シャ', shu: 'シュ', sho: 'ショ',
        cha: 'チャ', chu: 'チュ', cho: 'チョ',
        nya: 'ニャ', nyu: 'ニュ', nyo: 'ニョ',
        hya: 'ヒャ', hyu: 'ヒュ', hyo: 'ヒョ',
        mya: 'ミャ', myu: 'ミュ', myo: 'ミョ',
        rya: 'リャ', ryu: 'リュ', ryo: 'リョ',
        gya: 'ギャ', gyu: 'ギュ', gyo: 'ギョ',
        ja: 'ジャ', ju: 'ジュ', jo: 'ジョ',
        bya: 'ビャ', byu: 'ビュ', byo: 'ビョ',
        pya: 'ピャ', pyu: 'ピュ', pyo: 'ピョ',

        tsu: 'ツ', shi: 'シ', chi: 'チ', fu: 'フ',

        a: 'ア', i: 'イ', u: 'ウ', e: 'エ', o: 'オ',
        ka: 'カ', ki: 'キ', ku: 'ク', ke: 'ケ', ko: 'コ',
        sa: 'サ', si: 'シ', su: 'ス', se: 'セ', so: 'ソ',
        ta: 'タ', ti: 'チ', tu: 'ツ', te: 'テ', to: 'ト',
        na: 'ナ', ni: 'ニ', nu: 'ヌ', ne: 'ネ', no: 'ノ',
        ha: 'ハ', hi: 'ヒ', hu: 'フ', he: 'ヘ', ho: 'ホ',
        ma: 'マ', mi: 'ミ', mu: 'ム', me: 'メ', mo: 'モ',
        ya: 'ヤ', yu: 'ユ', yo: 'ヨ',
        ra: 'ラ', ri: 'リ', ru: 'ル', re: 'レ', ro: 'ロ',
        wa: 'ワ', wi: 'ウィ', we: 'ウェ', wo: 'ヲ',
        ga: 'ガ', gi: 'ギ', gu: 'グ', ge: 'ゲ', go: 'ゴ',
        za: 'ザ', zi: 'ジ', zu: 'ズ', ze: 'ゼ', zo: 'ゾ',
        da: 'ダ', di: 'ヂ', du: 'ヅ', de: 'デ', do: 'ド',
        ba: 'バ', bi: 'ビ', bu: 'ブ', be: 'ベ', bo: 'ボ',
        pa: 'パ', pi: 'ピ', pu: 'プ', pe: 'ペ', po: 'ポ',
        n: 'ン'
    };

    let i = 0;
    let result = '';
    while (i < str.length) {
        const tri = str.slice(i, i + 3);
        if (table[tri]) {
            result += table[tri];
            i += 3;
            continue;
        }
        const di = str.slice(i, i + 2);
        if (table[di]) {
            result += table[di];
            i += 2;
            continue;
        }
        const ch = str[i];
        if ('bcdfghjklmnpqrstvwxyz'.includes(ch)) {
            const withU = ch + 'u';
            if (table[withU]) {
                result += table[withU];
            } else {
                result += '・';
            }
        } else if (table[ch]) {
            result += table[ch];
        } else {
            result += '・';
        }
        i += 1;
    }
    return result || '・';
}

function katakanaToHiragana(kata) {
    return kata.replace(/[\u30a1-\u30f6]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('namejp')
        .setDescription('İsmini Japonca (katakana/hiragana) yazılışına çevirir')
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Latin harflerle ismin (örn: hamsiq)')
                .setRequired(false)),

    async execute(interaction) {
        const input = interaction.options.getString('isim')
            || interaction.member?.displayName
            || interaction.user.username;

        const kata = romanToKatakana(input);
        const hira = katakanaToHiragana(kata);

        const embed = new EmbedBuilder()
            .setTitle('📝 Japonca İsim Yazımı')
            .setColor(0x3498db)
            .addFields(
                { name: 'Latin (girdi)', value: `**${input}**`, inline: false },
                { name: 'Katakana', value: kata, inline: true },
                { name: 'Hiragana', value: hira, inline: true }
            )
            .setFooter({ text: 'Not: Bu otomatik, yaklaşık bir çeviridir.' });

        await interaction.reply({ embeds: [embed] });
    }
};

