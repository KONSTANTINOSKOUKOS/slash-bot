const fs = require('fs');
const path = require('path');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { Player } = require('discord-player');

require('dotenv').config();

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates,] });
const rest = new REST({ version: '10' }).setToken(process.env.token);

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

rest.put(Routes.applicationCommands('1036229560376754247'), { body: commands })
  .then(data => console.log(`Successfully registered ${data.length} application commands.`));

///////////////////////////////////////////   VOICE    ///////////////////////////
const player = new Player(client, {
  initialVolume: 100, ytdlOptions: { quality: 'lowestaudio' }
});
player.on('error', (q, e) => { console.log(e) });
player.on('connectionError', (q, e) => { console.log(e) });
player.on('connectionCreate', (q, c) => { console.log('lol\n', c) });
client.player = player;
///////////////////////////////////////////   VOICE    ///////////////////////////

client.on(Events.InteractionCreate, async msg => {
  if (!msg.isChatInputCommand()) return;
  await msg.deferReply();

  const cmd = client.commands.get(msg.commandName);
  console.log(cmd);

  if (!cmd) {
    console.error(`No command matching ${msg.commandName} was found.`);
    return;
  }

  try {
    return await cmd.run(msg);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.token);
///////////////////////////////////////    KEEP ALIVE    //////////////////////////////////

// const http = require('http');

// http.createServer((req, res) => {
//   res.write("alive");
//   res.end();
// }).listen(8080);

// client.on('ready', () => {
//   console.log('bot alive')
//   setInterval(() => client.user.setActivity(''), 5000);
// });
