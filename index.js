const { TOKEN, DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA, DB_QUERIES } = require('./config.json');
const { SALUDOS, ERROR, RESPONSE, EXPLANATION, CONSULT_TRIGGER } = require('./assets/languaje.json');
const { Telegraf } = require('telegraf');
const mysql = require('mysql2');
const bot = new Telegraf(TOKEN);
const emoji = require('node-emoji').emoji;



//////////////////////////////////////
//                DB                //
//////////////////////////////////////

// DB configuration
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_SCHEMA
});


//////////////////////////////////////
//             Commands             //
//////////////////////////////////////

// START
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `¡Hola ${ctx.from.first_name}! ${EXPLANATION.START_COMMAND_EXPLANATION} ${emoji.camping}`, {
    })
});

// ALTA
bot.command('alta', ctx => {
    console.log(ctx.from)
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Db connection success!");

        connection.promise().query(DB_QUERIES.GET_AUTHORIZED, ctx.from.id).then((result) => {
            // Users exists | User waitting for authentication | User does NOT exists
            if (result[0] !== null && result[0] !== undefined) {
                if (result[0].authorized === 1)
                    bot.telegram.sendMessage(ctx.chat.id, `${ERROR.ALREADY_EXISTS_ERROR} ${emoji.smile}`);
                else
                    bot.telegram.sendMessage(ctx.chat.id, `${ERROR.WAITTING_AUTH_ERROR} ${emoji.smiley}`);
            } else {
                bot.telegram.sendMessage(ctx.chat.id, `${EXPLANATION.USAGE_REQUEST_EXPLANATION} Si ves que tardamos mucho, manda este número: ${ctx.chat.id} a 312secretaria@gmail.com`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: `Quiero empezar a utilizar este bot ${emoji.sparkles}`,
                                callback_data: 'inscription'
                            }
                            ],
                        ]
                    }
                });
            }
        }).catch((err) => {
            console.log(`| ALTA COMMAND | - ${err}`);
            bot.telegram.sendMessage(ctx.chat.id, `${ERROR.GENERIC_ERROR}`);
        });
    });
});


//////////////////////////////////////
//             Chatbot              //
//////////////////////////////////////

bot.hears(['holi', 'hola'], (ctx, next) => {
    console.log(ctx.from);

    bot.telegram.sendMessage(ctx.chat.id, `${SALUDOS[Math.floor(Math.random() * SALUDOS.length)]} ${emoji.heart}`, {});
});

// CONSULTAR
bot.hears(CONSULT_TRIGGER, (ctx, next) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, `¿Qué te gustaría consultar? ${emoji.thinking_face}` + "\n" + `${RESPONSE.CONSULT_RESPONSE}`, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: `Dinero en mi hucha ${emoji.moneybag}`,
                    callback_data: 'piggyBank'
                },
                {
                    text: `Tipo de pago ${emoji.credit_card}`,
                    callback_data: 'paymentType'
                }
                ],

            ]
        }
    });
});


//////////////////////////////////////
//             Actions              //
//////////////////////////////////////

// PIGGY BANK
bot.action('piggyBank', ctx => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Db connection success!");

        connection.promise().query(DB_QUERIES.GET_PIGGY_BANK, ctx.from.id).then((result) => {
            if (result === null || result === undefined || result[0].length === 0)
                bot.telegram.sendMessage(ctx.chat.id, `${ERROR.PIGGY_BANK_ERROR}`);
            else
                bot.telegram.sendMessage(ctx.chat.id, `${RESPONSE.PIGGY_BANK_RESPONSE} ${result[0][0].hucha} euros ${emoji.euro}.`);
        }).catch((err) => {
            console.log(`| PIGGY BANK MODULE | - ${err}`);
            bot.telegram.sendMessage(ctx.chat.id, `${ERROR.GENERIC_ERROR}`);
        });
    });
});

// PAYMENT TYPE
bot.action('paymentType', ctx => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Db connection success!");

        connection.promise().query(DB_QUERIES.GET_PAYMENT_TYPE, ctx.from.id)
            .then((result) => {
                if (result === null || result === undefined || result[0].length === 0)
                    bot.telegram.sendMessage(ctx.chat.id, `${ERROR.PAYMENT_ERROR}`);
                else
                    bot.telegram.sendMessage(ctx.chat.id, `${RESPONSE.PAYMENT_RESPONSE} ${result[0][0].tipo_pago} ${emoji.calendar}.`);
            }).catch((err) => {
                console.log(`| PAYMENT MODULE | - ${err}`);
                bot.telegram.sendMessage(ctx.chat.id, `${ERROR.GENERIC_ERROR}`);
            });
    });
});


// INSCRIPTION
bot.action('inscription', ctx => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Db connection success!");

        connection.promise().query(DB_QUERIES.INSERT_NEW_MEMBER, ctx.from.id)
            .then(() => bot.telegram.sendMessage(ctx.chat.id, `${RESPONSE.REGISTER_RESPONSE} ${emoji.love_letter}`))
            .catch((err) => {
                console.log(`| INSCRIPTION MODULE | - ${err}`);
                bot.telegram.sendMessage(ctx.chat.id, `${ERROR.DUPLICATE_ENTRY} ${emoji.desktop_computer}`);
            });
    });
});

bot.launch();