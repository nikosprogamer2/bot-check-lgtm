module.exports = function (client, options) {
    const description = {
        name: "AL-audit",
        version: `${client.version}-${client.branch}`
    };
    const eventtype = {
        shardDisconnect: "auditmsg",
        guildMemberAdd: "auditlog",
        guildMemberRemove: "auditlog",
        channelCreate: "auditlog",
        channelDelete: "auditlog",
        channelUpdate: "auditlog",
        inviteCreate: "auditlog",
        inviteDelete: "auditlog",
        roleCreate: "auditlog",
        roleDelete: "auditlog",
        guildBanAdd: "auditlog",
        guildBanRemove: "auditlog",
        guildMemberUpdate: "auditlog",
        usernameChangedMsg: "auditlog",
        discriminatorChangedMsg: "auditlog",
        avatarChangedMsg: "auditlog",
        messageDelete: "auditlog",
        messageUpdate: "auditlog",
        voiceStateUpdate: "voice"
    };
    console.log(`BOT LOG: [FUNCTIONS LOADER: AUDIT] ${description.name} (v${description.version}) initialized.`);

    let debugmode = false;
    if (options && options.debugmode === true) debugmode = true;

    // Event Handlers
    //
    sleep = function (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };

    KickCheck = async function (member) {

        /**
         *  Checks if the user has left or was kicked on their own decision.
         * 
         */
        return new Promise(async function (resolve, reject) {
            try {

                let guild = member.guild;

                // Throw an error and reject the promise if the bot does not have sufficient permission.
                if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) console.error(`Discord-AuditLog - Missing Permission To View Audit Log`);
                if (!guild.me.hasPermission('VIEW_AUDIT_LOG')) return resolve(false);

                // Grab the last audit log entry for kicks
                const AuditLogFetch = await guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_KICK',
                });

                // If No Result is found return a promise false
                if (!AuditLogFetch || AuditLogFetch.entries.size === 0) return resolve(false);

                // TODO: Check more than 1 entry, iteratie trought result to check if it was a kick.
                const FirstEntry = AuditLogFetch.entries.first();


                // If there is no entry made in the audit log in the last 5 seconds, resolve false as user was not kicked recently 
                if (FirstEntry.createdTimestamp > (Date.now() - 6000) === false) return resolve(false);
                const { executor, target } = FirstEntry;

                // If user was kicked return an object containing information
                const Info = { user: target.username, id: target.id, kickedby: executor.username, reason: FirstEntry.reason }

                return resolve(Info);

            } catch (e) {

                // Any unhandled issues above will reject the promise with an error
                reject(e);
            }
        });
    }

    // SHARD DISCONNECTED V12
    client.on("shardDisconnect", (event, id) => {
        const tosend = client.guilds.cache.get('668213441453883394');
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: shardDisconnect triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Shard Disconnected.`,
            fields: [{ name: `Shard ID:`, value: id.number }, { name: `Reason:`, value: event.CloseEvent }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `#${channel.name}` },
        };
        send(client, tosend, options, embed, "shardDisconnect");
    });

    // CHANNEL CREATED V12
    client.on("channelCreate", (channel) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: channelCreate triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Channel created: **#${channel.name}**`,
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `#${channel.name}` },
        };
        send(client, channel.guild, options, embed, "channelCreate");
    });

    // MESSAGE DELETE V12
    client.on("messageDelete", (message) => {
        if (!message || message.partial) return;
        if (typeof message.author === "undefined") return;
        if (message.author && message.author.bot === true) return
        if (message.channel && message.channel.type !== "text") return
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: messageDelete triggered`);
        var embed = {
            title: `Message Deleted`,
            description: `
**Author: ** <@${message.author.id}> - *${message.author.tag}*
**Date: ** ${message.createdAt}
**Channel: ** <#${message.channel.id}> - *${message.channel.name}*
**Deleted Message:**
${message.content.replace(/`/g, "'")}

**Attachment URL:**
${message.attachments.map(x => x.proxyURL)}
`,
            image: { url: message.attachments.map((x) => x.proxyURL)[0] },
            color: 16711680,
            timestamp: new Date(),
            footer: { text: `Deleted: ` },
            author: { name: `Moderation | Audit Log` }
        };
        if (message && message.member && typeof message.member.guild === "object") {
            send(client, message.member.guild, options, embed, "messageDelete");
        } else {
            console.error(`[HANDLERS: AUDIT LOG] ${description.name}: messageDelete - ERROR - member guild id couldn't be retrieved`);
            console.error("Author:", message.author);
            console.error("Member:", message.member);
            console.error("Message Content:", message.content);
        };
    });

    // MESSAGE UPDATE V12
    client.on("messageUpdate", (oldMessage, newMessage) => {
        if (oldMessage.author.bot === true) return;
        if (oldMessage.channel.type !== "text") return;
        if (newMessage.channel.type !== "text") return;

        if (oldMessage.content === newMessage.content) return;
        var embed = {
            title: `Moderation | Audit Log`,
            description:
                `
**Author: ** <@${newMessage.member.user.id}> - *${newMessage.member.user.tag}*
**Date: ** ${newMessage.createdAt}
**Channel: ** <#${newMessage.channel.id}> - *${newMessage.channel.name}*

**Original Message:**
${oldMessage.content.replace(/`/g, "'")}

**Updated Message:**
${newMessage.content.replace(/`/g, "'")}

`,
            color: 16737792,
            timestamp: new Date(),
            footer: { text: "Edited: " },
            author: { name: "Message edited" }
        };
        send(client, newMessage.member.guild, options, embed, "messageDelete");
    });

    // USER JOINED V12
    client.on("guildMemberAdd", (member) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildMemberAdd triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `User joined: ${member.user.tag} | <@${member.user.id}> - ID: *${member.user.id}*\nUser Created on: ${new Date(member.user.createdTimestamp).toDateString()}`,
            color: 65280,
            timestamp: new Date(),
            footer: { text: `${member.nickname || member.user.username}` },
            thumbnail: { url: member.user.displayAvatarURL() },
        }
        send(client, member.guild, options, embed, "guildMemberAdd");
    })

    // USER LEFT V12
    client.on('guildMemberRemove', async (member) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildMemberRemove triggered`);
        await sleep(5000);
        var embed = await KickCheck(member).then(MEMBER_KICK_INFO => {
            if (MEMBER_KICK_INFO) {
                // User was kicked
                return {
                    title: `Moderation | Audit Log`,
                    description: `User Kicked: ${member.user.tag} | <@${member.user.id}> - ID: *${member.user.id}*`,
                    url: member.user.displayAvatarURL(),
                    color: 16748544,
                    timestamp: new Date(),
                    footer: { text: `${member.nickname || member.user.username}` },
                    thumbnail: { url: member.user.displayAvatarURL() },
                    fields: [{ name: "Nickname", value: `**${member.nickname || member.user.username}**`, inline: true }]
                };
            };
        });
        if (typeof embed === "undefined") {
            // User was not kicked
            embed = {
                title: `Moderation | Audit Log`,
                description: `User Left: ${member.user.tag} | <@${member.user.id}> - ID: *${member.user.id}*`,
                url: member.user.displayAvatarURL(),
                color: 16748544,
                timestamp: new Date(),
                footer: { text: `${member.nickname || member.user.username}` },
                thumbnail: { url: member.user.displayAvatarURL() },
                fields: [{ name: "Nickname", value: `**${member.nickname || member.user.username}**`, inline: true }]
            };

        };
        send(client, member.guild, options, embed, "guildMemberRemove")
    });

    // CHANNEL CREATED V12
    client.on("channelCreate", (channel) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: channelCreate triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Channel created.`,
            fields: [{ name: `Channel:`, value: `**#${channel.name}**` }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `#${channel.name}` },
        };
        send(client, channel.guild, options, embed, "channelCreate");
    });

    // CHANNEL DELETED V12
    client.on("channelDelete", (channel) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: channelDelete triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Channel deleted.`,
            fields: [{ name: `Channel:`, value: `**#${channel.name}**` }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `#${channel.name}` },
        };
        send(client, channel.guild, options, embed, "channelDelete");
    });

    // CHANNEL UPDATED V12
    client.on("channelUpdate", (oldChannel, newChannel) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: channelUpdate triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Channel updated: **#${oldChannel.name}**\nNew name: **#${newChannel.name}**`,
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `#${newChannel.name}` },
        };
        send(client, newChannel.guild, options, embed, "channelUpdate");
    });

    // INVITE CREATED V12
    client.on("inviteCreate", (invite) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: inviteCreate triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `New Invite created.`,
            fields: [{ name: `Invite:`, value: invite.url }, { name: `User:`, value: invite.inviter }, { name: `Created:`, value: invite.createdAt }, { name: `Expires:`, value: invite.expiresAt }, { name: `For channel:`, value: invite.channel }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: invite.url },
        };
        send(client, invite.guild, options, embed, "inviteCreate");
    });

    // INVITE DELETED V12
    client.on("inviteDelete", (invite) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: inviteDelete triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Invite deleted.`,
            fields: [{ name: `Invite:`, value: invite.url }, { name: `For channel:`, value: invite.channel }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: invite.url },
        };
        send(client, invite.guild, options, embed, "inviteDelete");
    });

    // ROLE CREATED V12
    client.on("roleCreate", (role) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: roleCreate triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `New role created.`,
            fields: [{ name: `Name:`, value: role.name }, { name: `Created:`, value: role.createdAt }, { name: `ID:`, value: role.id }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: role.name },
        };
        send(client, role.guild, options, embed, "roleCreate");
    });

    // ROLE DELETED V12
    client.on("roleDelete", (role) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: roleDelete triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `Role deleted.`,
            fields: [{ name: `Name:`, value: role.name }, { name: `ID:`, value: role.id }],
            color: 16711901,
            timestamp: new Date(),
            footer: { text: role.name },
        };
        send(client, role.guild, options, embed, "roleDelete");
    });

    // USER BANNED V12
    client.on("guildBanAdd", (banguild, banuser) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildBanAdd triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `User banned: ${banuser.tag} | <@${banuser.id}> - ID: *${banuser.id}*`,
            color: 16711901,
            timestamp: new Date(),
            footer: { text: `${banuser.username}` },
            thumbnail: { url: banuser.displayAvatarURL() },
        };
        send(client, banguild, options, embed, "guildBanAdd");
    });

    // USER UNBANNED V12
    client.on("guildBanRemove", (banguild, banuser) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildBanRemove triggered`);
        var embed = {
            title: `Moderation | Audit Log`,
            description: `User unbanned: ${banuser.tag} | <@${banuser.id}> - ID: *${banuser.id}*`,
            color: 16776960,
            timestamp: new Date(),
            footer: { text: `${banuser.username}` },
            thumbnail: { url: banuser.displayAvatarURL() },
        };
        send(client, banguild, options, embed, "guildBanRemove");
    });

    // USER NICKNAME UPDATE V12
    client.on("guildMemberUpdate", (oldMember, newMember) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildMemberUpdate:nickname triggered`);
        if (oldMember.nickname !== newMember.nickname) {
            var embed = {
                title: `Moderation | Audit Log`,
                description: `User: ${newMember.user.tag} | <@${newMember.user.id}> - ID: *${newMember.user.id}*`,
                color: 29372,
                timestamp: new Date(),
                footer: { text: `${newMember.nickname || newMember.user.username}` },
                thumbnail: { url: newMember.user.displayAvatarURL() },
                fields: [{ name: "Old Nickname", value: `**${oldMember.nickname || oldMember.user.username}**`, inline: true }, { name: "New Nickname", value: `**${newMember.nickname || newMember.user.username}**`, inline: true }]
            };
            send(client, newMember.guild, options, embed, "guildMemberUpdate");
        };
    });


    // MEMBER ROLE (Groups) UPDATE V12
    client.on("guildMemberUpdate", (oldMember, newMember) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: guildMemberUpdate:roles triggered`);

        // Initialize option if empty
        if (!options) {
            options = {};
        };

        if (options[newMember.guild.id]) {
            options = options[newMember.guild.id];
        };

        // Add default empty list
        if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([]);
        if (typeof options.trackroles === "undefined") options.trackroles = false;
        if (options.trackroles !== false) {
            const oldMemberRoles = oldMember.roles.cache.keyArray();
            const newMemberRoles = newMember.roles.cache.keyArray();

            const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x));
            const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x));

            const rolechanged = (newRoles.length || oldRoles.length);

            if (rolechanged) {
                let roleadded = "";
                if (newRoles.length > 0) {
                    for (let i = 0; i < newRoles.length; i++) {
                        if (i > 0) roleadded += ", ";
                        roleadded += `<@&${newRoles[i]}>`;
                    };
                };

                let roleremoved = "";
                if (oldRoles.length > 0) {
                    for (let i = 0; i < oldRoles.length; i++) {
                        if (i > 0) roleremoved += ", ";
                        roleremoved += `<@&${oldRoles[i]}>`;
                    };
                };
                var embed = {
                    title: `Moderation | Audit Log`,
                    description: `Roles changed: ${newMember.user.tag} | <@${newMember.user.id}> - ID: *${newMember.user.id}*`,
                    color: 29372,
                    timestamp: new Date(),
                    footer: { text: `${newMember.nickname || newMember.user.username}` },
                    thumbnail: { url: newMember.user.displayAvatarURL() },
                    fields: [{ name: "Roles removed", value: `**${roleremoved} **`, inline: true }, { name: "Roles added", value: `**${roleadded} **`, inline: true }]
                };
                send(client, newMember.guild, options, embed, "guildMemberUpdate");
            };
        };
    });

    // USER UPDATE AVATAR, USERNAME, DISCRIMINATOR V12
    client.on("userUpdate", (oldUser, newUser) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: userUpdate triggered`);

        // Log quand le user change de username (et possiblement discriminator)
        var usernameChangedMsg = null;
        var discriminatorChangedMsg = null;
        var avatarChangedMsg = null;

        // search the member from all guilds, since the userUpdate event doesn't provide guild information as it is a global event.
        client.guilds.cache.forEach(function (guild) {
            guild.members.cache.forEach(function (member, memberid) {
                if (newUser.id === memberid) {
                    // DISABLE FOR NOW; var member = client.guilds.cache.get(guild.id).members.get(member.id)

                    // USERNAME CHANGED V12
                    if (oldUser.username !== newUser.username) {
                        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: userUpdate:USERNAME triggered`);

                        usernameChangedMsg = {
                            title: `Moderation | Audit Log`,
                            description: `User: ${newUser.tag} | <@${newUser.id}> - ID: *${newUser.id}*`,
                            color: 29372,
                            timestamp: new Date(),
                            footer: { text: `${member.nickname || member.user.username}` },
                            thumbnail: { url: newUser.displayAvatarURL() },
                            fields: [{ name: "Old Username", value: `**${oldUser.username}**`, inline: true }, { name: "New Username", value: `**${newUser.username}**`, inline: true }]
                        };
                    };

                    // DISCRIMINATOR CHANGED V12
                    if (oldUser.discriminator !== newUser.discriminator) {
                        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: userUpdate:DISCRIMINATOR triggered`);

                        discriminatorChangedMsg = {
                            title: `Moderation | Audit Log`,
                            description: `User: ${newUser.tag} | <@${newUser.id}> - ID: *${newUser.id}*`,
                            color: 29372,
                            timestamp: new Date(),
                            footer: { text: `${member.nickname || member.user.username}` },
                            thumbnail: { url: newUser.displayAvatarURL() },
                            fields: [{ name: "Old Discriminator", value: `**${oldUser.discriminator}**`, inline: true }, { name: "New Discriminator", value: `**${newUser.discriminator}**`, inline: true }]
                        };
                    };

                    // AVATAR CHANGED V12
                    if (oldUser.avatar !== newUser.avatar) {
                        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: userUpdate:AVATAR triggered`);

                        avatarChangedMsg = {
                            title: `Moderation | Audit Log`,
                            description: `User: ${newUser.tag} | <@${newUser.id}> - ID: *${newUser.id}*`,
                            color: 29372,
                            timestamp: new Date(),
                            footer: { text: `${member.nickname || member.user.username}` },
                            thumbnail: { url: newUser.displayAvatarURL() },
                            image: { url: oldUser.displayAvatarURL() },
                            fields: [{ name: "Old Avatar", value: `** **` }]
                        };
                    };

                    if (usernameChangedMsg) send(client, guild, options, usernameChangedMsg, "usernameChangedMsg");
                    if (discriminatorChangedMsg) send(client, guild, options, discriminatorChangedMsg, "discriminatorChangedMsg");
                    if (avatarChangedMsg) send(client, guild, options, avatarChangedMsg, "avatarChangedMsg");
                };
            });
        });
    });

    // CHANNEL JOIN LEAVE SWITCH V12
    client.on("voiceStateUpdate", (oldState, newState) => {
        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: voiceStateUpdate triggered`);
        if (oldState.channel === null && newState.channel === null) return;
        var oldChannelName;
        var newChannelName;
        var embed;

        // SET CHANNEL NAME STRING
        let oldparentname = "unknown";
        let oldchannelname = "unknown";
        let oldchanelid = "unknown";
        if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name;
        if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name;
        if (oldState && oldState.channelID) oldchanelid = oldState.channelID;

        let newparentname = "unknown";
        let newchannelname = "unknown";
        let newchanelid = "unknown";
        if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name;
        if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name;
        if (newState && newState.channelID) newchanelid = newState.channelID;

        if (oldState.channelID) {
            if (typeof oldState.channel.parent !== "undefined") {
                oldChannelName = `**${oldchannelname}**`;
            } else {
                oldChannelName = `**${oldchanelid}**`;
            }
        }
        if (newState.channelID) {
            if (typeof newState.channel.parent !== "undefined") {
                newChannelName = `**${newchannelname}**`;
            } else {
                newChannelName = `**${newchannelname}**`;
            }
        }

        // JOINED V12
        if (!oldState.channelID && newState.channelID) {
            if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: voiceStateUpdate:JOINED triggered`);
            embed = {
                title: `Moderation | Audit Log`,
                description: `User: ${newState.member.user.tag} | <@${newState.member.user.id}> - ID: *${newState.member.user.id}*`,
                color: 3381555,
                timestamp: new Date(),
                footer: { text: `${newState.member.nickname || newState.member.user.username}` },
                thumbnail: { url: newState.member.user.displayAvatarURL() },
                fields: [{ name: `Joined the ${newChannelName} voice channel`, value: "** **", }]
            };
        };


        // LEFT V12
        if (oldState.channelID && !newState.channelID) {
            if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: voiceStateUpdate:LEFT triggered`);
            embed = {
                title: `Moderation | Audit Log`,
                description: `User: ${newState.member.user.tag} | <@${newState.member.user.id}> - ID: *${newState.member.user.id}*`,
                color: 10040115,
                timestamp: new Date(),
                footer: { text: `${newState.member.nickname || newState.member.user.username}` },
                thumbnail: { url: newState.member.user.displayAvatarURL() },
                fields: [{ name: `Left the ${oldChannelName} voice channel`, value: "** **", }]
            }
        }


        // SWITCH V12
        if (oldState.channelID && newState.channelID) {
            // False positive check
            if (oldState.channelID !== newState.channelID) {
                if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: voiceStateUpdate:SWITCH triggered`);

                embed = {
                    title: `Moderation | Audit Log`,
                    description: `User: ${newState.member.user.tag} | <@${newState.member.user.id}> - ID: *${newState.member.user.id}*`,
                    color: 13421568,
                    timestamp: new Date(),
                    footer: { text: `${newState.member.nickname || newState.member.user.username}` },
                    thumbnail: { url: newState.member.user.displayAvatarURL() },
                    fields: [{ name: `Left the ${oldChannelName} voice channel`, value: "** **" }, { name: `Switched to the ${newChannelName} voice channel`, value: "** **" }]
                };
            };
        };

        // SEND
        if (embed) {
            send(client, newState.guild, options, embed, "voiceStateUpdate");
        };
    });

    // SEND FUNCTION V12
    function send(client, guild, options, msg, movement) {
        let embed = "";

        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: send - configured options:`, options);

        // Initialize option if empty
        if (!options) {
            options = {};
        };

        // Initialize if options are multi-server
        if (options[guild.id]) {
            options = options[guild.id];
        };

        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: send - specifics options:`, options);

        // Add default channel
        if (typeof options.auditlog === "undefined") options.auditlog = "audit-log";
        if (typeof options.auditmsg === "undefined") options.auditmsg = false;
        if (typeof options.movement === "undefined") options.movement = "in-out";
        if (typeof options.voice === "undefined") options.voice = false;


        if (debugmode) console.log(`[HANDLERS: AUDIT LOG] ${description.name}: send - computed options:`, options);

        const channelname = (options[eventtype[movement]]);
        if (channelname) {
            // define channel object
            const Auditchannel = guild.channels.cache.find(val => val.name === channelname) || guild.channels.cache.find(val => val.id === channelname);
            if (Auditchannel) {
                if (Auditchannel.permissionsFor(client.user).has("SEND_MESSAGES") && Auditchannel.permissionsFor(client.user).has("SEND_MESSAGES")) {
                    if (typeof msg === "object") {
                        // Embed
                        if (Auditchannel.permissionsFor(client.user).has("EMBED_LINKS")) {
                            embed = msg;
                            Auditchannel.send({ embed });
                        } else {
                            console.log(`BOT LOG: [HANDLERS: AUDIT LOG] ${description.name} > The Bot doesn't have the permission 'EMBED_LINKS' in the configured channel ${channelname} on server ${guild.name} (ID: ${guild.id})`);
                        };
                    } else {
                        // Send the Message
                        Auditchannel.send(msg);
                    };
                } else {
                    console.log(`BOT LOG: [HANDLERS: AUDIT LOG] ${description.name} > The Bot doesn't have the permission 'SEND_MESSAGES' in the configured channel ${channelname} on server ${guild.name} (${guild.id})`);
                };
            } else {
                console.log(`BOT LOG: [HANDLERS: AUDIT LOG] ${description.name} > The channel ${channelname} does not exist on server ${guild.name} (ID: ${guild.id})`);
            };
        } else {
            console.log(`BOT LOG: [HANDLERS: AUDIT LOG] No channel option set for event ${movement} on server ${guild.name} (ID: ${guild.id})`);
        };
    };
};