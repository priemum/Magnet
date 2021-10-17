// © 2021 by Philip
// This project is licenced under the MIT liscense, and is open source.

const { Listener } = require('discord-akairo');
const { textSync } = require('figlet');
const { red, yellow, yellowBright, blue, cyanBright, green, black, white, gray } = require('chalk');
const { isEqual }= require('lodash');
const { botstatus } = require('../config');
const { registerCommands, commands, deleteCommands } = require('../slash-setup');
module.exports = class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    };
    async exec() {
        const { client } = this;
        const { guildInvites } = client;
        console.log(white(textSync('Magnet', { horizontalLayout: 'full' })));
        console.log(white('\n'
            + `👤 Users:         ${client.users.cache.size}\n`
            + `📡 Channels:      ${client.channels.cache.size}\n`
            + `💾 Servers:       ${client.guilds.cache.size}\n`));
        client.guilds.cache.forEach(async guild => {
            let invites = await guild.fetchInvites();
            if(guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());
            guildInvites.set(guild.id, invites);
        });
        console.log(white(''
        + `📦 Repository:    https://github.com/by-Philip/\n`
        + `📄 Changelog:     https://github.com/by-Philip/\n`
        + `💸 Help:          https://ko-fi.com/byphilip\n`
        + `📑 License:       https://opensource.org/licenses/MIT\n`
        + `📪 Contact:       https://discord.gg/e6mRUGG76T\n`
        + `\n`
        + `© 2021 by Philip`));
        client.guilds.cache.forEach(async guild => {
            let invites = await guild.fetchInvites();
            if(guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());
            guildInvites.set(guild.id, invites);
        });
        if(botstatus.enabled === true) {
            if(botstatus.activity_type.toUpperCase() == 'STREAMING') {
                client.user.setPresence({activity: {name: botstatus.activity_text, type: botstatus.activity_type.toUpperCase(), url: botstatus.activity_url}, status: botstatus.status.toLowerCase() || 'online'});
            } else {
                client.user.setPresence({activity: {name: botstatus.activity_text, type: botstatus.activity_type.toUpperCase()}, status: botstatus.status.toLowerCase() || 'online'});
            };
        };
        let application = await client.fetchApplication();
        if(client.config.welcomeChannel == true) {
            let welcomeChannel = await client.channels.fetch(client.config.welcomeChannel);
            if(!welcomeChannel.permissionsFor(welcomeChannel.guild.me).has('SEND_MESSAGES')) {
                try {
                    application.owner.send('I do not have permission to send messages in the welcome channel you have inputted. Please provide me permissions to do so.');
                } catch (error) {};
            };
        };
        let alreadyRegistered = await client.api.applications(application.id).commands.get();
        if(client.config.slashCommands && !isEqual(alreadyRegistered.map(command => command.name), commands.map(command => command.name))) registerCommands(client);
        if(client.config.slashCommands === false && alreadyRegistered) deleteCommands(client)
        if(client.guilds.cache.size == 0) {
            let invite = await client.generateInvite({permissions: ["MANAGE_GUILD", "VIEW_CHANNEL", "SEND_MESSAGES", "ADMINISTRATOR"]})
            if(client.config.slashCommands) invite += "%20applications.commands"
            console.log(red(`Bliep bliep! It seems like I am not in any servers! Please invite me to a server using this link:\n`) + invite)
        }
    };
};
