import fs from "fs";
import { Client, Collection } from "discord.js";

import Command from "./interfaces/command";

const commands = new Collection<string, Command>();

export { commands };

const
    client = new Client(),
    token = process.argv.length > 2 && process.argv[2] === "--development"
        ? process.env.DISCORD_BOT_TOKEN_DEV
        : process.env.DISCORD_BOT_TOKEN,
    cooldowns = new Collection<string, Collection<string, any>>(),
    commandFiles = fs.readdirSync("./lib/commands").filter(command => command.endsWith(".js"));

for (const file of commandFiles) {
    const command = new (require(`../lib/commands/${file}`)["default"])();

    commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`Logged in with ${client.user?.tag || "[Secret]"}.`);
});

client.on("message", async (message) => {
    if (!message.content.startsWith(".") || message.author.bot) {
        return;
    }

    const
        arguments_ = message.content.slice(".".length).split(/ +/),
        commandName = (arguments_.shift() || "").toLowerCase(),
        command = commands.get(commandName) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        console.log(commands.map(p => p));

        return;
    }

    if (!command.allowDM && message.channel.type === "dm") {
        return await message.reply("このコマンドはDMから実行できません。");
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection<string, any>());
    }

    const
        now = Date.now(),
        timestamps = cooldowns.get(command.name) || new Collection<string, any>(),
        cooldownAmount = command.cooldown * 1000;

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
    } catch (error) {
        console.error(error);

        return await message.reply("コマンド実行中にエラーが発生しました。");
    }
});

client.login(token);

