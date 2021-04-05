import { Message } from "discord.js";

export default class Module {
    static trigger: boolean = false;

    public name = this.constructor.name;
    public enabled: boolean = false;

    protected constructor(
        public friendlyName: string,
        public description: string
    ) {}

    public init(message: Message): Promise<void> {
        this.enabled = true;

        return Promise.resolve();
    }

    public close(message: Message): Promise<void> {
        this.enabled = false;

        return Promise.resolve();
    }
}

