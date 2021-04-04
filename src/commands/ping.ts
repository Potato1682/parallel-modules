import { Message } from "discord.js";

const ping = {
    aliases: [],
    args: false,
    cooldown: 5,
    description: "Parallel Modulesが正常に応答するかを確認します。",
    async execute(message: Message) {
        await message.channel.send("Pong!");
    },
    name: "ping",
    usage: ""
};

export default ping;

