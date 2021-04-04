import { Message } from "discord.js";

import { commands } from "../src";

const help = {
    aliases: [],
    args: false,
    cooldown: 3,
    description: "コマンド一覧を表示するか、コマンドを指定してヘルプを確認します。",
    async execute(message: Message, arguments_: string[]) {
        const data: string[] = [];

        if (arguments_.length === 0) {
            data.push(
                "**コマンド一覧**",
                commands.map(command => `\`${command.name}\``).join(", "),
                "\n.help [コマンド名]で指定したコマンドのヘルプを確認できます。"
            );

            return await message.author.send(data, { split: true })
                .then((p) => {
                    if (message.channel.type === "dm") {
                        return p;
                    }

                    message.reply("DMにコマンド一覧を送信しました。");

                    return p;
                })["catch"]((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply("DMにコマンド一覧を送信できませんでした。DMを無効化していないか確認してください。");
                });
        }

        const
            name = arguments_[0].toLowerCase(),
            command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return await message.reply("無効なコマンドです。");
        }

        data.push(`**名前** - ${command.name}`);

        if (command.aliases) {
            data.push(`**エイリアス** - ${command.aliases.join(", ")}`);
        }

        if (command.description) {
            data.push(`**説明** - ${command.description}`);
        }

        if (command.usage) {
            data.push(`**使用法** - \`.${command.name} ${command.usage}\``);
        }

        data.push(`**クールダウン** - ${"cooldown" in command && command.cooldown ? command.cooldown : 3}秒`);

        message.channel.send(data, { split: true });
    },
    name: "help",
    usage: "[コマンド名]"
};

export default help;

