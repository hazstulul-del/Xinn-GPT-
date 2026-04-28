const { Bot } = require('grammy');
const axios = require('axios');

const bot = new Bot(process.env.BOT_TOKEN);
const DEEPSEEK_API = process.env.DEEPSEEK_API_KEY;

const JIWA = `Kamu adalah XINNGPT, asisten AI gaul. Panggil "Bang"/"Bro", pakai "gua"/"lu". Santai, receh, suka roasting pelan, kadang bijak. Kalau dimintain script, kasih langsung.`;

async function tanyaAi(chat) {
  try {
    const res = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: JIWA },
        { role: 'user', content: chat }
      ],
      temperature: 0.8
    }, {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data.choices[0].message.content;
  } catch (e) {
    return 'Otak error, Bang. Coba lagi bentar.';
  }
}

// Command-command bot
bot.command('start', ctx => ctx.reply('Halo Bang! 🗿 Gue XINN. Ketik /menu.'));
bot.command('menu', ctx => ctx.reply('/tanya /roasting /gombal /script /reset'));
bot.command('tanya', async ctx => {
  const t = ctx.match;
  if (!t) return ctx.reply('Tanya apa?');
  ctx.reply(await tanyaAi(t));
});
bot.command('roasting', async ctx => ctx.reply(await tanyaAi('Roasting gua dong, receh ngena.')));
bot.command('gombal', async ctx => ctx.reply(await tanyaAi('Gombalan ala BarrGPT dong.')));
bot.command('script', async ctx => ctx.reply(await tanyaAi(`Script lengkap: ${ctx.match || 'bot telegram'}`)));
bot.command('reset', ctx => ctx.reply('🧠 Reset!'));
bot.on('message:text', async ctx => ctx.reply(await tanyaAi(ctx.message.text)));

// Handler Vercel Serverless
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(JSON.parse(req.body));
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(200).send('Error');
    }
  } else {
    res.status(200).send('XINNGPT Online 🗿');
  }
};
