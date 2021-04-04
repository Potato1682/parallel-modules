import { Client } from "discord.js";

const
    client = new Client(),
    token = "ODI4MTM1OTUwMTM5Nzg1MjI3.YGlLtA.TG2MuP8ocWn8sLDpJwtMlhqY8NQ";


client.on("ready", () => {
    console.log(`Logged in with ${client.user?.tag || "[Secret]"}.`);
});

client.on("message", async (message) => {
    if (message.content === ".ping") {
        await message.channel.send("Pong!");
    }
});

client.login(token);

