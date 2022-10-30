const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { REST, Routes } = require('discord.js');
// const { token, clientid } = require('./config.json');

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [];
client.commands = new Collection();

const filepath = path.join(__dirname, 'commands');
const files = fs.readdirSync(filepath).filter(file => file.endsWith('.js'));

for (const file of files) {
	const filePath = path.join(filepath, file);
	const cmd = require(filePath);

	if ('data' in cmd && 'run' in cmd) {
		commands.push(cmd.data.toJSON());
		client.commands.set(cmd.data.name, cmd);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "run" property.`);
	}
}

rest.put(Routes.applicationCommands('1035163453150740510'), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`));

client.on(Events.InteractionCreate, async msg => {
	if (!msg.isChatInputCommand()) return;
	// await msg.deferReply({ fetchReply: true });
	console.log(msg.deferred);

	const cmd = client.commands.get(msg.commandName);
	console.log(cmd);

	if (!cmd) {
		console.error(`No command matching ${msg.commandName} was found.`);
		return;
	}

	rest.post(Routes.channelMessages(msg.channelId), {
		body: {
			content: 'A message via REST!',
		},
	});

	try {
		return await cmd.run(msg);
	} catch (error) {
		console.log(error);
	}
});

client.login(process.env.TOKEN);
module.exports = client;