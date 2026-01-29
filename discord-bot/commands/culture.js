const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('culture')
        .setDescription('Japon kültürü ve görgü kuralları hakkında bilgi verir')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Konu')
                .setRequired(false)
                .addChoices(
                    { name: 'Genel', value: 'general' },
                    { name: 'Görgü kuralları', value: 'etiquette' },
                    { name: 'Günlük hayat', value: 'daily' },
                    { name: 'İş kültürü', value: 'work' },
                    { name: 'Seyahat', value: 'travel' },
                    { name: 'Dil & keigo', value: 'language' }
                )),

    async execute(interaction) {
        const topic = interaction.options.getString('topic') || 'general';

        const embed = new EmbedBuilder()
            .setTitle('🇯🇵 Japon Kültürü')
            .setColor(0xffc107);

        if (topic === 'etiquette') {
            embed.setTitle('🇯🇵 Japon Görgü Kuralları');
            embed.addFields(
                {
                    name: 'Toplu taşıma',
                    value: '• Yüksek sesle konuşma\n• Telefonla konuşma neredeyse hiç yok\n• Sıra çizgilerine göre bekle',
                    inline: false
                },
                {
                    name: 'Yemek',
                    value: '• Çubukları pirince dikme (cenaze çağrışımı)\n• Çubuktan çubuğa yiyecek uzatma\n• Sokakta yürürken yemek içmek genelde hoş karşılanmaz',
                    inline: false
                },
                {
                    name: 'Eve / iç mekâna girerken',
                    value: '• Ayakkabıyı çıkar, terlik giy\n• Tatami odalarına terlikle basma',
                    inline: false
                }
            );
        } else if (topic === 'daily') {
            embed.setTitle('🇯🇵 Japonya\'da Günlük Hayat');
            embed.addFields(
                {
                    name: 'Konut',
                    value: '• 1K, 1DK, 1LDK gibi kısaltmalar oda + mutfak/düzen anlamına gelir\n• Share house ucuz ama mahremiyet az, tek kişilik daireler pahalı ama rahat',
                    inline: false
                },
                {
                    name: 'Ulaşım',
                    value: '• IC kart (Suica/PASMO/ICOCA) neredeyse her yerde geçerli\n• Son tren saatlerine dikkat (özellikle Tokyo çevresi)',
                    inline: false
                },
                {
                    name: 'Market & yemek',
                    value: '• Konbiniler (7-Eleven, Lawson, FamilyMart) 7/24 açık\n• Öğle yemeği için bento ve hazır yiyecekler oldukça yaygın',
                    inline: false
                },
                {
                    name: 'Çöp atma',
                    value: '• Çöpler yakılabilir / yakılamaz / pet şişe / cam gibi ayrılır\n• Çöp günleri bölgeye göre değişir, belediyenin takvimine bakmak gerekir',
                    inline: false
                }
            );
        } else if (topic === 'work') {
            embed.setTitle('🇯🇵 Japon İş Kültürü');
            embed.addFields(
                {
                    name: 'Çalışma tarzı',
                    value: '• Takım ve şirket uyumu bireysel parlaklıktan daha önemli görülebilir\n• Fazla mesai (残業 zanggyou) yaygın ama yavaş yavaş azalıyor',
                    inline: false
                },
                {
                    name: 'İletişim',
                    value: '• Doğrudan “hayır” demek yerine dolaylı ifade kullanılır\n• Karşındakini utandırmamak (面子 men-tsu) önemli',
                    inline: false
                },
                {
                    name: 'Hiyerarşi',
                    value: '• Kıdeme ve yaşa saygı kültürün önemli parçası\n• Keigo (kibar dil) özellikle iş ortamında kritik',
                    inline: false
                }
            );
        } else if (topic === 'travel') {
            embed.setTitle('🇯🇵 Japonya Seyahat İpuçları');
            embed.addFields(
                {
                    name: 'Toplu ulaşım',
                    value: '• JR Pass uzun mesafe tren seyahati için avantajlı olabilir\n• Şehir içi için günlük metro kartları bazen daha ucuzdur',
                    inline: false
                },
                {
                    name: 'Konaklama',
                    value: '• Business hotel, hostel, kapsül otel ve ryokan (geleneksel otel) seçenekleri var\n• Ryokanlarda genelde akşam yemeği + onsen deneyimi sunulur',
                    inline: false
                },
                {
                    name: 'Turist olarak görgü',
                    value: '• Tapınak ve mabedlerde fotoğraf kısıtlamalarına dikkat et\n• Sessiz alanlarda (tapınak, tren, müze) yüksek sesle konuşmaktan kaçın',
                    inline: false
                }
            );
        } else if (topic === 'language') {
            embed.setTitle('🇯🇵 Dil & Keigo');
            embed.addFields(
                {
                    name: 'Seviye farkları',
                    value: '• 普通形 (futsuu-kei) – günlük, arkadaş arası dil\n• 敬語 (keigo) – iş ve resmi durumlar için kibar dil',
                    inline: false
                },
                {
                    name: 'Keigo örnekleri',
                    value: '• します → いたします\n• 行きます → 参ります\n• います → おります',
                    inline: false
                },
                {
                    name: 'Ne zaman gerekli?',
                    value: '• Müşteriyle konuşurken\n• Müdür / hoca / yaşça büyük kişilerle ilk konuşmalarda\n• Resmi telefon ve e-posta iletişiminde',
                    inline: false
                }
            );
        } else {
            // general
            embed.addFields(
                {
                    name: 'Dil & yazı',
                    value: '• Üç yazı sistemi: Hiragana, Katakana, Kanji\n• Günlük hayatta üçünü karışık görürsün',
                    inline: false
                },
                {
                    name: 'Toplum',
                    value: '• Düzen, temizlik ve başkasını rahatsız etmemek çok önemli değerler\n• Grup uyumu (和 wa) bireyden önce gelir',
                    inline: false
                },
                {
                    name: 'Kültürel unsurlar',
                    value: '• Anime/manga sadece gençlere değil, her yaşa hitap eder\n• Tapınaklar, festivaller, mevsim kutlamaları gündelik hayatla iç içedir',
                    inline: false
                }
            );
        }

        await interaction.reply({ embeds: [embed] });
    }
};

