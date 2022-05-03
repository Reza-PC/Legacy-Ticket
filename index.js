const Discord = require('discord.js')
const client = new Discord.Client()

const config = {
    token,
    author,
} = require('./config')

client.on('ready', () => {
    console.log(`Ready for ${config.author}`)
})

client.on('message', async message => {


    if (message.content === '!new') {
        const channel = await message.guild.channels.create(`ticket-${message.author.tag}`);
        channel.setParent('970363013599227944')
        channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        })
        channel.updateOverwrite(message.author, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        })

        const reactionMessage = await channel.send(new Discord.MessageEmbed()
            .setColor('#57f781')
            .setDescription(`${message.author} ممنون برای تیکتتون لطفا صبر کنید. بزودی یک نفر کمکتون میکنه\n برای بستن تیکت روی ایموجی 🔒 و برای پاک کردنش ⛔`)
        )

        try {
            await reactionMessage.react('🔒')
            await reactionMessage.react('⛔')
        } catch (err) {
            channel.send('Error to send emojies')
            throw err
        }

        const collector = reactionMessage.createReactionCollector((reaction, user) =>
            message.guild.members.cache.find((member) => member.id === user.id).hasPermission('MANAGE_MESSAGES'), {
                dispose: true
            }
        )

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '🔒':
                    channel.updateOverwrite(message.author, {
                        SEND_MESSAGES: false
                    })
                    break
                case '⛔':
                    channel.send('این چنل در 5 ثانیه دیگه پاک میشه')
                    setTimeout(() => channel.delete(), 5000)
                    break;
            }
        })

        message.channel.send(`لطفا در این چنل منتظر باشید ${channel}`).then((msg) => {
            setTimeout(() => msg.delete(), 7000)
            setTimeout(() => message.delete(), 3000)
        }).catch((err) => {
            throw err
        })
    }else {
        message.delete()
    }
})

client.login(config.token)