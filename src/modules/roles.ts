import { Message } from "discord.js";
import { QueryResult } from "pg";

import { SQLError, UserError } from "../errors";

import Module from "../interfaces/module";
import { pool } from "..";

export default class Roles extends Module {
    static trigger = true;

    public async init(message: Message): Promise<void> {
        if (!message.guild) {
            throw new Error("Can't use Roles module from DM!");
        }

        let result: QueryResult<any>;

        try {
            result = await pool.query("select roles_channel_id from config where server_id == $1", [ message.guild.id ]);
        } catch (error) {
            throw new SQLError(error.message || "Uncaught SQL error");
        }

        if (result.rows.length <= 0) {
            throw new UserError("役職チャンネルを設定してください。\n\n`.config:set roles_channel_id=\"[役職チャンネルのID]\"`で設定してからもう一度お試しください。");
        } else if (!message.guild.channels.cache.some(channel => channel.id === result.rows[0])) {
            throw new UserError("存在しないチャンネルです。");
        }
    }
}
