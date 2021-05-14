# 312 telegram bot
 
This is a small project that aims to solve the needs of a scout group (312 - Cruz del sur, Cádiz).

This module of the project uses telegraf framework to allow families to consult some of the data we use in the group for management purposes in a more dynamic way.
 
* Telegraf's website: https://telegraf.js.org/
* Telegram's website: https://telegram.org/
 
 ## Current status
 
 Current version is 0.1.0 so it still has plain functionality just to get used to telegraf's framework and telegram's bot.
 
 Bot is made using node and interacts with a MySQL database hosted by a docker.
 
 
 ## Goals
 
 Complete proyect architecture is:
   * Angular frontend - For sake of user administration ease.
   * Express API (future) - As intermediate between DB and telegram/angular apps.
   * Telegram bot (node) - This app.
   * MySQL database (docker) - For its easy of deployment.
