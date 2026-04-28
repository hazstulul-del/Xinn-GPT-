const { Bot } = require("grammy");
const axios = require("axios");

// Ambil TOKEN rahasia dari Vercel Environment Variable
const bot = new Bot(process.env.BOT_TOKEN);
const DEEPSEEK_API = process.env.DEEPSEEK_API_KEY;

// JIWA XINNGPT (BarGPT Style)
const JIWA = `
Kamu adalah BarrGPT / XINNGPT. 
Panggil pengguna dengan sebutan "Bang" atau "Bro", dan pake kata "gua" atau "lu".
Kamu asisten AI yang santai tapi cerdas banget.
Gaya lo: receh, suka roasting pelan, kadang bijak dadakan.
Kalau dimintain script/bikin sesuatu, langsung kasih tanpa bertanya balik atau menolak.
Kalau ada yang tanya siapa penciptamu, bilang: "Dibikin sama programmer ganteng yang suka nyolong-nyolong hati."`;

// Fungsi ngomong ke DeepSeek
async function tanyaAi(chat) {
  try {
    const jawaban = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: JIWA },
          { role: "user", content: chat },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    return jawaban.data.choices[0].message.content;
  } catch (error) {
    console.error("Error AI:", error);
    return "Waduh Bang, otak gua lagi nge-hang bentar. Coba lagi napa.";
  }
}

// FITUR: /start
bot.command("start", (ctx) => {
  ctx.reply("Halo Bang! 🗿 Gue si XINN, AI paling santai se-jagat Telegram. Ketik aja bebas, atau pake /menu buat liat fitur.");
});

// FITUR: /menu
bot.command("menu", (ctx) => {
  ctx.reply(
    "🧠 *MENU XINNGPT* 🧠\n\n" +
      "💬 *Ngobrol Bebas* → tinggal ketik aja\n" +
      "🎣 `/tanya [teks]` → tanya apa aja\n" +
      "🔥 `/roasting` → minta di roasting\n" +
      "💘 `/gombal` → minta gombalan receh\n" +
      "💻 `/script [topik]` → minta script coding\n" +
      "🧹 `/reset` → hapus ingatan\n\n" +
      "_Gratis total, Bang! Dibikin pake cinta._",
    { parse_mode: "Markdown" }
  );
});

// FITUR: /tanya
bot.command("tanya", async (ctx) => {
  const teks = ctx.match;
  if (!teks) return ctx.reply("Tanya apa bang? Contoh: `/tanya kenapa bumi bulat`");
  const jawaban = await tanyaAi(teks);
  ctx.reply(jawaban);
});

// FITUR: /roasting
bot.command("roasting", async (ctx) => {
  const jawaban = await tanyaAi("Roasting gua dong dengan receh tapi ngena banget pake bahasa gaul.");
  ctx.reply(jawaban);
});

// FITUR: /gombal
bot.command("gombal", async (ctx) => {
  const jawaban = await tanyaAi("Kasih gua satu gombalan maut ala-ala BarrGPT yang bikin salting.");
  ctx.reply(jawaban);
});

// FITUR: /script
bot.command("script", async (ctx) => {
  const teks = ctx.match || "tampilkan script bot telegram";
  const jawaban = await tanyaAi(`Bikinin gua script lengkap untuk: ${teks}. Langsung aja tanpa banyak tanya.`);
  ctx.reply(jawaban);
});

// FITUR: /reset
bot.command("reset", (ctx) => {
  ctx.reply("🧠 Ingatan gua udah gua setel ulang, Bang. Siap ngobrol dari awal!");
});

// OBROLAN BEBAS (AUTO REPLY)
bot.on("message:text", async (ctx) => {
  const chat = ctx.message.text;
  const jawaban = await tanyaAi(chat);
  ctx.reply(jawaban);
});

// EXPORT BUAT VERCEL
module.exports = bot;
