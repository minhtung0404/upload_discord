const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const {ownerID, token, prefix} = require('./config.json');

class MyClient extends AkairoClient {
    constructor() {
        super({
            ownerID: ownerID,
        }, {
            disableMentions: 'everyone'
        });
        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: prefix
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });

        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
    }
}

const client = new MyClient();
client.login(token);
