import { Message } from "discord.js";

export default abstract class Command {
    protected constructor(
        public name: string,
        public description: string,
        public usage = "",
        public cooldown = 3,
        public aliases: string[] = [],
        public allowDM = true
    ) {}

    public async execute(message: Message, arguments_: string[] | undefined): Promise<any> {
        if (arguments_?.length == 0) {
            return await message.channel.send(`引数が必要です。\n\`.help ${this.name}\`でヘルプを閲覧してください。`);
        }
    }
}
