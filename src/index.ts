import fs from "fs";
import { Client, Collection } from "discord.js";

const main = async () => {
    const
        client = new Client(),
        token = process.argv.length > 2 && process.argv[2] === "--development"
            ? process.env.DISCORD_BOT_TOKEN_DEV
            : process.env.DISCORD_BOT_TOKEN,
        commands = new Collection<string, any>(),
        cooldowns = new Collection<string, Collection<string, any>>(),
        commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`))["default"];

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
            arguments_ = message.content.slice(1).split(/ +/),
            commandName = (arguments_.shift() || "").toLowerCase();

        if (!commands.has(commandName)) {
            return;
        }

        const command = commands.get(commandName) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return;
        }

        if (command.allowDM && message.channel.type !== "dm") {
            return message.reply("このコマンドはDMから実行できません。");
        }

        if (command.args && arguments_.length === 0) {
            return message.channel.send(`引数が必要です。\n.help ${commandName}でヘルプを閲覧してください。`);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection<string, any>());
        }

        const
            now = Date.now(),
            timestamps = cooldowns.get(command.name) || new Collection<string, any>(),
            cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                return message.reply(`\`${command.name}\`が実行できるようになるまで**${timeLeft.toFixed(1)}**秒お待ちください。`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps["delete"](message.author.id), cooldownAmount);

        try {
            command.execute(message, arguments_);
        } catch (error) {
            console.error(error);

            await message.reply("コマンド実行中にエラーが発生しました。");
        }
    });

    client.login(token);
};

main().then(p => p)["catch"]((error) => {
    console.error(error);
});

