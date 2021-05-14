const { DB_QUERIES } = require('../config.json');
const { ERROR, EXPLANATION } = require('../assets/languaje.json');
const emoji = require('node-emoji').emoji;

class AuthService {
    constructor() { }

    isAuthed(ctx, bot, connection) {
        return new Promise(function (resolve, reject) {
            connection.connect(function (err) {
                if (err) throw err;

                connection.promise().query(DB_QUERIES.GET_AUTHORIZED, ctx.from.id).then((result) => {
                    console.log(result);
                    // Users exists | User waitting for authentication | User does NOT exists
                    if (result[0] !== null && result[0] !== undefined && result[0].length !== 0) {
                        if (result[0][0].authorized === 1)
                            resolve('EXIST');
                        else
                            resolve('NOT_AUTH');
                    } else {
                        return resolve('NOT_EXISTS');
                    }
                }).catch((err) => {
                    console.log(`| AUTH SERVICE | - ${err}`);
                    bot.telegram.sendMessage(ctx.chat.id, `${ERROR.GENERIC_ERROR}`);
                });
            });
        });
    }
}

module.exports = AuthService;