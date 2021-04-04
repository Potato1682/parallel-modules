"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const commands = new discord_js_1.Collection();
exports.commands = commands;
const client = new discord_js_1.Client(), token = process.argv.length > 2 && process.argv[2] === "--development"
    ? process.env.DISCORD_BOT_TOKEN_DEV
    : process.env.DISCORD_BOT_TOKEN, cooldowns = new discord_js_1.Collection(), commandFiles = fs_1.default.readdirSync("./lib/commands").filter(command => command.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`../lib/commands/${file}`)["default"];
    commands.set(command.name, command);
}
client.once("ready", () => {
    console.log(`Logged in with ${client.user?.tag || "[Secret]"}.`);
});
client.on("message", async (message) => {
    if (!message.content.startsWith(".") || message.author.bot) {
        return;
    }
    const arguments_ = message.content.slice(".".length).split(/ +/), commandName = (arguments_.shift() || "").toLowerCase(), command = commands.get(commandName) ||
        commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {
        console.log(commands.map(p => p));
        return;
    }
    if (command.allowDM && message.channel.type !== "dm") {
        return await message.reply("このコマンドはDMから実行できません。");
    }
    if (command.args && arguments_.length === 0) {
        return await message.channel.send(`引数が必要です。\n.help ${commandName}でヘルプを閲覧してください。`);
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new discord_js_1.Collection());
    }
    const now = Date.now(), timestamps = cooldowns.get(command.name) || new discord_js_1.Collection(), cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return await message.reply(`\`${command.name}\`が実行できるようになるまで**${timeLeft.toFixed(1)}**秒お待ちください。`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps["delete"](message.author.id), cooldownAmount);
    try {
        return await command.execute(message, arguments_);
    }
    catch (error) {
        console.error(error);
        return await message.reply("コマンド実行中にエラーが発生しました。");
    }
});
client.login(token);
//# sourceMappingURL=index.js.map