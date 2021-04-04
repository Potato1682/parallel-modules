import { Message } from "discord.js";

import Command from "../interfaces/command";

export default class Ping extends Command {
    public constructor() {
        super("ping", "Parallel Modulesが正常に応答するかを確認します。", "", 5);
    }

    public async execute(message: Message) {
        await message.channel.send("Pong!");
    }
}

