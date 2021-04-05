import { Collection } from "discord.js";

import Module from "./interfaces/module";

export interface ModuleInfo {
    error: Error | undefined,
    module: Module
}

export default class ModuleManager {
    public modules: Collection<string, ModuleInfo> = new Collection();

    public constructor() {}
}
