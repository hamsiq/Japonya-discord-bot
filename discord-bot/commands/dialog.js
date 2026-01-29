const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Çok basit bir romaji → katakana çevirici
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
        // 3 harfli heceler
        const tri = str.slice(i, i + 3);
        if (table[tri]) {
            result += table[tri];
            i += 3;
            continue;
        }
        // 2 harfli heceler
        const di = str.slice(i, i + 2);
        if (table[di]) {
            result += table[di];
            i += 2;
            continue;
        }
        // Tek harf (yalnız sessiz harfse sonuna 'u' ekle)
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

// Mini diyaloglar – temel senaryolar
const DIALOGS = {
    cafe: {
        title: '☕ Kafede Sipariş',
        lines: [
            { jp: 'すみません。メニューを見せてください。', romaji: 'Sumimasen. menyuu o misete kudasai.', tr: 'Affedersiniz, menüyü görebilir miyim?' },
            { jp: 'はい、どうぞ。', romaji: 'Hai, douzo.', tr: 'Buyurun.' },
            { jp: 'コーヒーを一つください。', romaji: 'Koohii o hitotsu kudasai.', tr: 'Bir kahve alabilir miyim?' },
            { jp: 'お砂糖は入れますか。', romaji: 'Osatou wa iremasu ka?', tr: 'Şeker ister misiniz?' },
            { jp: 'いいえ、そのままで大丈夫です。', romaji: 'Iie, sonomama de daijoubu desu.', tr: 'Hayır, böyle iyi.' }
        ]
    },
    train: {
        title: '🚋 Trende Yol Tarifi Sorma',
        lines: [
            { jp: 'すみません。この電車は新宿に行きますか。', romaji: 'Sumimasen. Kono densha wa Shinjuku ni ikimasu ka?', tr: 'Affedersiniz, bu tren Şinjuku\'ya gider mi?' },
            { jp: 'はい、行きますよ。でも三つ目の駅です。', romaji: 'Hai, ikimasu yo. Demo mittsu-me no eki desu.', tr: 'Evet, gider. Ama üçüncü durak.' },
            { jp: 'ありがとうございます。', romaji: 'Arigatou gozaimasu.', tr: 'Teşekkür ederim.' }
        ]
    },
    konbini: {
        title: '🏪 Konbini (Market) Alışverişi',
        lines: [
            { jp: 'いらっしゃいませ。', romaji: 'Irasshaimase.', tr: 'Hoş geldiniz.' },
            { jp: 'おにぎりはどこですか。', romaji: 'Onigiri wa doko desu ka?', tr: 'Onigiri nerede?' },
            { jp: 'こちらです。', romaji: 'Kochira desu.', tr: 'Burada.' },
            { jp: 'これを一つください。', romaji: 'Kore o hitotsu kudasai.', tr: 'Bundan bir tane alayım.' }
        ]
    },
    selfintro: {
        title: '🙋‍♂️ Kendini Tanıtma',
        lines: [
            { jp: 'はじめまして。', romaji: 'Hajimemashite.', tr: 'Tanıştığıma memnun oldum.' },
            // İsim kısmını kodda dolduracağız
            { jp: 'わたしはNAME_PLACEHOLDERです。', romaji: 'Watashi wa NAME_PLACEHOLDER desu.', tr: 'Ben NAME_PLACEHOLDER.' },
            { jp: 'トルコから来ました。', romaji: 'Toruko kara kimashita.', tr: 'Türkiye\'den geldim.' },
            { jp: 'どうぞよろしくお願いします。', romaji: 'Douzo yoroshiku onegaishimasu.', tr: 'Lütfen bana iyi davranın / Memnun oldum.' }
        ]
    },
    restaurant: {
        title: '🍜 Restoranda Sipariş',
        lines: [
            { jp: '予約しています。ハムシクと申します。', romaji: 'Yoyaku shite imasu. Hamoshiku to moushimasu.', tr: 'Rezervasyonum var. Adım Hamsiq.' },
            { jp: 'こちらへどうぞ。', romaji: 'Kochira e douzo.', tr: 'Bu taraftan lütfen.' },
            { jp: 'おすすめは何ですか。', romaji: 'Osusume wa nan desu ka?', tr: 'Ne tavsiye edersiniz?' },
            { jp: 'このラーメンが人気です。', romaji: 'Kono raamen ga ninki desu.', tr: 'Bu ramen çok popüler.' }
        ]
    },
    office: {
        title: '🏢 Ofiste İlk Gün',
        lines: [
            { jp: 'おはようございます。', romaji: 'Ohayou gozaimasu.', tr: 'Günaydın.' },
            { jp: '今日からお世話になります。', romaji: 'Kyou kara osewa ni narimasu.', tr: 'Bugünden itibaren size emanetim / birlikte çalışacağız.' },
            { jp: 'よろしくお願いします。', romaji: 'Yoroshiku onegaishimasu.', tr: 'İş birliğiniz için şimdiden teşekkürler.' }
        ]
    },
    hotel: {
        title: '🏨 Otelde Check-in',
        lines: [
            { jp: 'チェックインをお願いします。', romaji: 'Chekku-in o onegaishimasu.', tr: 'Check-in yapmak istiyorum.' },
            { jp: 'お名前とパスポートをお願いします。', romaji: 'Onamae to pasupooto o onegaishimasu.', tr: 'İsminiz ve pasaportunuzu alabilir miyim?' },
            { jp: 'こちらが部屋の鍵です。', romaji: 'Kochira ga heya no kagi desu.', tr: 'Bu da odanızın anahtarı.' }
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dialog')
        .setDescription('Mini Japonca diyaloglar gösterir')
        .addStringOption(option =>
            option.setName('konu')
                .setDescription('Diyalog konusu')
                .setRequired(true)
                .addChoices(
                    { name: 'Kafede sipariş', value: 'cafe' },
                    { name: 'Trende yol sorma', value: 'train' },
                    { name: 'Konbini (market)', value: 'konbini' },
                    { name: 'Kendini tanıtma', value: 'selfintro' },
                    { name: 'Restoran', value: 'restaurant' },
                    { name: 'Ofiste ilk gün', value: 'office' },
                    { name: 'Otelde check-in', value: 'hotel' }
                )),

    async execute(interaction) {
        const key = interaction.options.getString('konu');
        let data = DIALOGS[key];

        if (!data) {
            return interaction.reply({ content: '❌ Bu konu için diyalog bulunamadı.', ephemeral: true });
        }

        // Kendini tanıtma diyaloğunda kullanıcı adını otomatik yerleştir
        if (key === 'selfintro') {
            const displayName = interaction.member?.displayName || interaction.user.username;
            const katakanaName = romanToKatakana(displayName);
            data = {
                ...data,
                lines: data.lines.map(l => ({
                    ...l,
                    jp: l.jp.replace('NAME_PLACEHOLDER', katakanaName),
                    romaji: l.romaji.replace('NAME_PLACEHOLDER', displayName),
                    tr: l.tr.replace('NAME_PLACEHOLDER', displayName)
                }))
            };
        }

        const linesText = data.lines.map((l, i) =>
            `**${i + 1}.** ${l.jp}\n> _${l.romaji}_\n> ${l.tr}`
        ).join('\n\n');

        const embed = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(linesText)
            .setColor(0x1abc9c);

        await interaction.reply({ embeds: [embed] });
    }
};

