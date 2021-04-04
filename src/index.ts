import { Client } from "discord.js";

const
    client = new Client(),
    token = process.env.DISCORD_BOT_TOKEN;

client.on("ready", () => {
    console.log(`Logged in with ${client.user?.tag || "[Secret]"}.`);
});

client.on("message", async (message) => {
    if (message.content === ".ping") {
        await message.channel.send("Pong!");
    }
});

client.login(token);

