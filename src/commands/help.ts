import { Message, MessageEmbed } from "discord.js";

import Command from "../interfaces/command";

import { commands } from "..";

export default class Help extends Command {
    public constructor() {
        super("help", "コマンド一覧を表示するか、コマンドを指定してヘルプを確認します。", "[command]");
    }

    public async execute(message: Message, arguments_: string[]) {
        super.execute(message, arguments_);

        const data: string[] = [];

        if (arguments_.length === 0) {
            data.push(
                "**コマンド一覧**",
                commands.map(command => `\`${command.name}\``).join(", "),
                "\n`.help [command]`で指定したコマンドのヘルプを確認できます。"
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

        const dataEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`\`${command.name}\``)
            .setAuthor("ヘルプ")
            .setDescription(command.description)
            .addFields(
                { name: "使用法", value: `\`.${command.name} ${command.usage}\`` },
                { inline: true, name: "クールダウン", value: `**${command.cooldown}**秒` },
                { inline: true, name: "エイリアス", value: command.aliases.map(alias => `\`${alias}\``).join(", ") }
            )
            .setFooter("Parallel Modules");

        return await message.channel.send(dataEmbed);
    }
}

