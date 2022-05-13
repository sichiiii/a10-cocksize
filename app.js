import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { getRandomPerDateDickSize } from './get-random-per-date-dick-size';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

const MIN_SIZE = 1;
const MAX_SIZE = 51;

const EMOJIS = {
    0: '😭',
    5: '🙁',
    10: '😐',
    15: '😏',
    20: '😮',
    25: '🥳',
    30: '😨',
    35: '😱',
};

const CACHE_TIME = 60 * 60 * 12;

function getEmoji(size) {
    const sizeSteps = Object.keys(EMOJIS);
    let result;

    sizeSteps.forEach((step) => {
        if (step < size) {
            result = EMOJIS[step];
        }
    });

    return result;
}

bot.on('inline_query', async (ctx) => {
    try {
        const userId = ctx.inlineQuery.from.id.toString();
        console.log(ctx.inlineQuery);
        const isTim = ctx.inlineQuery.from.username.includes('t1mmaas');

        const size = getRandomPerDateDickSize(
            userId,
            new Date(),
            MIN_SIZE,
            MAX_SIZE,
        );

        const responseMessage = `My cock size is *${size}cm* ${getEmoji(size)}`;

        if (isTim) {
            responseMessage = 'My cock size is *57cm* ❤️❤️❤️';
        }

        const result = {
            type: 'article',
            id: userId,
            title: 'Share my cock size to this chat',
            description: 'Let everyone know',
            message_text: responseMessage,
            parse_mode: 'MarkdownV2',
        };

        return ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, [result], {
            is_personal: true,
            cache_time: CACHE_TIME,
        });
    } catch (e) {
        console.error(e);
    }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
