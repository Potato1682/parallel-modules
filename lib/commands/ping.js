"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ping = {
    aliases: [],
    args: false,
    cooldown: 5,
    description: "Parallel Modulesが正常に応答するかを確認します。",
    async execute(message) {
        await message.channel.send("Pong!");
    },
    name: "ping",
    usage: ""
};
exports.default = ping;
//# sourceMappingURL=ping.js.map