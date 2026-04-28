const { Bot } = require("grammy");
const axios = require("axios");

const bot = new Bot(process.env.BOT_TOKEN);
const DEEPSEEK_API = process.env.DEEPSEEK_API_KEY;

const JIWA = `
Kamu adalah BarrGPT / XINNGPT. 
Panggil pengguna dengan "Bang" atau "Bro", gunakan "gua" atau "lu".
Kamu asisten AI yang santai, receh, suka roasting pelan, kadang bijak.
Kalau dimintain script/bikin sesuatu, langsung kasih tanpa bertanya balik.
`;

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
  } catch (e) {
    return "Otak gua lagi error, Bang. Coba bentar lagi.";
  }
}

bot.command("start", (ctx) => ctx.reply("Halo Bang! 🗿 Gue XINN, siap ngobrol. Ketik /menu buat liat fitur."));
bot.command("menu", (ctx) => ctx.reply("🧠 MENU XINNGPT:\n/tanya [teks]\n/roasting\n/gombal\n/script [topik]\n/reset"));
bot.command("tanya", async (ctx) => { const t = ctx.match; if(!t) return ctx.reply("Tanya apa?"); ctx.reply(await tanyaAi(t)); });
bot.command("roasting", async (ctx) => ctx.reply(await tanyaAi("Roasting gua dong receh ngena bahasa gaul.")));
bot.command("gombal", async (ctx) => ctx.reply(await tanyaAi("Kasih gombalan maut ala BarrGPT.")));
bot.command("script", async (ctx) => ctx.reply(await tanyaAi(`Bikinin script lengkap: ${ctx.match || "bot telegram"}`)));
bot.command("reset", (ctx) => ctx.reply("🧠 Ingatan direset!"));
bot.on("message:text", async (ctx) => ctx.reply(await tanyaAi(ctx.message.text)));

// EKSPOR BUAT VERCEL
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(JSON.parse(req.body));
      res.status(200).send("OK");
    } catch (e) {
      res.status(200).send("OK");
    }
  } else {
    res.status(200).send("XINNGPT BOT IS ALIVE 🗿");
  }
};
