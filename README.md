## 🇬🇧 Overview · 🇹🇷 Genel Bakış

**EN** – A Discord bot to learn Japanese and explore life in Japan: JLPT N5–N1 vocab & kanji, lessons, quizzes, flashcards, dialogues, culture tips and simple Japanese chat.  
**TR** – Japonca öğrenmek ve Japonya kültürünü keşfetmek için hazırlanan bot: JLPT N5–N1 kelime & kanji, dersler, quizler, flashcard’lar, diyaloglar, kültür notları ve botla Japonca sohbet.

---

## ✨ Features · Özellikler

- 📚 **Kana / Alfabeler** – `/hiragana`, `/katakana`  
  **EN:** Big Hiragana & Katakana charts as images.  
  **TR:** Hiragana ve Katakana alfabelerini büyük, okunaklı görsel olarak gösterir.

- 🈳 **Kanji Trainer** – `/kanji level:<N5–N1> sayi:<1–5>`  
  **EN:** Practice kanji by JLPT level (onyomi/kunyomi + meaning).  
  **TR:** JLPT seviyesine göre kanji çalış, okunuş ve anlamlarını gör.

- 📖 **Vocabulary Practice** – `/vocab level:<N5–N1> sayi:<1–10>`  
  **EN:** Random words from each JLPT level.  
  **TR:** Seçilen seviyeden rastgele kelimelerle alıştırma.

- 🃏 **Flashcards** – `/flashcard level:<N5–N1|all>`  
  **EN:** Spaced-repetition style flashcards with “Flip / I know / I don’t know / Next”.  
  **TR:** Kelimeleri kartlarla tekrar et, bildiklerini/bilmediklerini işaretle.

- 📝 **Quizzes & JLPT Mock** – `/quiz`, `/jlptmock`  
  **EN:** 4-choice quizzes + JLPT-like mock exams (vocab / kanji / mixed).  
  **TR:** Çoktan seçmeli quizler ve JLPT tarzı deneme sınavları.

- 🎓 **Lessons & Courses** – `/lesson level:<N5–N1>`, `/course level:<N5–N1>`  
  **EN:** Level-based lessons with words, kanji, grammar patterns, example sentences & study plans.  
  **TR:** Seviye bazlı dersler (kelime + kanji + kalıp + örnek cümle) ve çalışma planları.

- 🗣 **Dialogues & Chat** – `/dialog`, @Bot mention  
  **EN:** Real-life dialogues (cafe, train, office, self-intro, etc.) + simple Japanese small talk.  
  **TR:** Hazır diyaloglar ve botu etiketleyerek Japonca sohbet.

- 🌏 **Culture & Guide** – `/culture`  
  **EN:** Quick tips about daily life, etiquette, work culture, travel, and language.  
  **TR:** Japonya'da yaşam, görgü kuralları, iş kültürü ve seyahat hakkında kısa rehber.

- ✍️ **Name to Japanese** – `/namejp`  
  **EN:** Convert your name to Katakana & Hiragana spelling.  
  **TR:** İsmini Japonca (Katakana + Hiragana) yazımına çevirir.

---

## ⚙️ Setup · Kurulum

```bash
git clone <repo-url>
cd discord-bot
npm install
cp .env.example .env
# Edit .env and set DISCORD_TOKEN
npm start
```

**EN:** In Discord Developer Portal, enable **MESSAGE CONTENT INTENT** for your bot.  
**TR:** Discord Developer Portal’da bot ayarlarından **MESSAGE CONTENT INTENT** seçeneğini açmayı unutma.

---

## 🗂️ Env & Ignore

`.env` / `.env.example`:

```env
DISCORD_TOKEN=your_bot_token_here
DATABASE_PATH=./data/database.db
```

`.gitignore` (important):

```gitignore
node_modules/
.env
data/*.db
data/*.db-journal
*.log
.DS_Store
```

---

## 📄 License · Lisans

MIT License © 2026 **hamsiq**  
Detaylar için [`LICENSE`](./LICENSE) dosyasına bakın.

---

## 🤝 Contributing · Katkıda Bulunma

Pull request’ler memnuniyetle karşılanır.  
PR açmadan önce yapmak istediğiniz değişiklikleri kısaca açıklayan bir **issue** açmanız tavsiye edilir.

Contact / İletişim: `discord: .hamsiq`
