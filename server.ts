import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared Discord Client
let discordClient: Client | null = null;

const getGoogleAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) return null;

  // Clean the key: remove literal quotes if present and handle escapes
  key = key.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.substring(1, key.length - 1);
  }
  key = key.replace(/\\n/g, '\n');

  return new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

// Discord Bot Setup
async function initDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    console.warn("Discord credentials missing. Bot will not start.");
    return;
  }

  discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

  // Command Registration Logic
  const registerCommands = async () => {
    const commands = [
      new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View platform registration statistics'),
      new SlashCommandBuilder()
        .setName('list-registrations')
        .setDescription('List recent registrations')
        .addStringOption(option => 
          option.setName('type')
            .setDescription('Tournament or Scrim')
            .setRequired(true)
            .addChoices(
              { name: 'Tournaments', value: 'tournaments' },
              { name: 'Scrims', value: 'scrims' }
            )
        ),
      new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send a platform announcement to a channel')
        .addStringOption(option => 
          option.setName('message')
            .setDescription('The message to announce')
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName('search-team')
        .setDescription('Search for a team registration detail')
        .addStringOption(option => 
          option.setName('name')
            .setDescription('Team name to search for')
            .setRequired(true)
        )
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(token);

    // Validation: Ensure CID is numeric
    if (!/^\d+$/.test(clientId)) {
      console.error('❌ Discord Error: DISCORD_CLIENT_ID must be a numeric ID, not a token or string.');
      return;
    }

    try {
      console.log('🔄 Discord: Refreshing slash commands...');
      if (guildId && guildId.trim() !== "" && guildId !== "YOUR_GUILD_ID" && /^\d+$/.test(guildId)) {
        console.log(`📡 Targeting Guild Sync: ${guildId}`);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('✅ Discord: Guild commands synced.');
      } else {
        console.log('🌐 Targeting Global Sync (Can take up to 1 hour to propagate)...');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('✅ Discord: Global commands synced.');
      }
    } catch (error: any) {
      console.error('\n' + '🚩'.repeat(20));
      if (error.code === 50001) {
        console.error('⚠️ DISCORD ACCESS ERROR [50001]');
        console.error('The application lacks permission to register commands.');
        console.error('\nDIAGNOSTIC CHECKLIST:');
        console.error(`1. Is the bot in the server with ID [${guildId}]?`);
        console.error('2. Did you invite it with the "applications.commands" scope?');
        console.error('3. Is your DISCORD_CLIENT_ID definitely correct?');
        console.error('\n🔧 RESOLUTION:');
        console.error('Click this link to re-authorize with correct scopes:');
        console.error(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`);
      } else {
        console.error(`❌ Discord Sync Failed: ${error.message}`);
      }
      console.error('🚩'.repeat(20) + '\n');
    }
  };

  // Run registration in background so it doesn't block the bot's login
  registerCommands();

  discordClient.on('ready', () => {
    console.log(`🤖 Discord Bot Active: Logged in as ${discordClient?.user?.tag}`);
  });

  discordClient.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
      if (commandName === 'stats' || commandName === 'list-registrations' || commandName === 'search-team') {
        await interaction.deferReply();

        const serviceAccountAuth = getGoogleAuth();
        if (!serviceAccountAuth || !process.env.GOOGLE_SHEET_ID) {
          return interaction.editReply("❌ Google Sheets credentials not configured on the server.");
        }

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        if (commandName === 'stats') {
          const tSheet = doc.sheetsByTitle['Registrations'];
          const sSheet = doc.sheetsByTitle['Scrims'];
          
          const tCount = tSheet ? tSheet.rowCount - 1 : 0;
          const sCount = sSheet ? sSheet.rowCount - 1 : 0;

          await interaction.editReply({
            content: `📊 **BTS eSports Platform Live Stats**\n\n` +
                     `- **Tournament Registrations:** ${tCount}\n` +
                     `- **Scrim Session Bookings:** ${sCount}\n\n` +
                     `🚀 *Building the next generation of pros.*`
          });
        } 
        
        else if (commandName === 'list-registrations') {
          const type = interaction.options.getString('type');
          const sheetTitle = type === 'tournaments' ? 'Registrations' : 'Scrims';
          const sheet = doc.sheetsByTitle[sheetTitle];

          if (!sheet) {
            return interaction.editReply(`❌ No data found for ${type}.`);
          }

          const rows = await sheet.getRows();
          const recentRows = rows.slice(-5).reverse(); // Last 5 registrations

          if (recentRows.length === 0) {
            return interaction.editReply(`ℹ️ No registrations found in the ${type} sheet.`);
          }

          let response = `📋 **Recent ${type.charAt(0).toUpperCase() + type.slice(1)} Registrations**\n\n`;
          recentRows.forEach((row, i) => {
            if (type === 'tournaments') {
              response += `${i+1}. **${row.get('Team Name')}** registered for *${row.get('Tournament')}*\n`;
            } else {
              response += `${i+1}. **${row.get('Team Name')}** booked *${row.get('Scrim Title')}* at ${row.get('Session Time')}\n`;
            }
          });

          await interaction.editReply(response);
        }

        else if (commandName === 'search-team') {
          const teamName = interaction.options.getString('name', true).toLowerCase();
          const tSheet = doc.sheetsByTitle['Registrations'];
          const sSheet = doc.sheetsByTitle['Scrims'];

          let found = false;
          let response = `🔍 **Search Results for "${teamName}"**\n\n`;

          if (tSheet) {
            const rows = await tSheet.getRows();
            const matches = rows.filter(r => r.get('Team Name').toLowerCase().includes(teamName));
            if (matches.length > 0) {
              found = true;
              response += `🏆 **Tournaments:**\n`;
              matches.forEach(m => response += `- Team: **${m.get('Team Name')}** | Captain: ${m.get('Captain')} | Discord: ${m.get('Discord')} | Event: *${m.get('Tournament')}*\n`);
            }
          }

          if (sSheet) {
            const rows = await sSheet.getRows();
            const matches = rows.filter(r => r.get('Team Name').toLowerCase().includes(teamName));
            if (matches.length > 0) {
              found = true;
              response += `\n🎮 **Scrims:**\n`;
              matches.forEach(m => response += `- Team: **${m.get('Team Name')}** | Captain: ${m.get('Captain')} | Time: ${m.get('Session Time')} | Title: *${m.get('Scrim Title')}*\n`);
            }
          }

          if (!found) {
            return interaction.editReply(`❌ No team found with name "${teamName}".`);
          }

          await interaction.editReply(response);
        }
      }

      else if (commandName === 'announce') {
        const message = interaction.options.getString('message', true);
        
        // Use the current channel for simplicity, or we could specify one
        await interaction.reply({
          content: `📢 **ANNOUNCEMENT**\n\n${message}\n\n@everyone`,
          allowedMentions: { parse: ['everyone'] }
        });
      }

    } catch (error) {
      console.error("Discord Command Error:", error);
      if (interaction.deferred) {
        await interaction.editReply("❌ An error occurred while processing the command.");
      } else {
        await interaction.reply({ content: "❌ An error occurred while processing the command.", ephemeral: true });
      }
    }
  });

  try {
    await discordClient.login(token);
  } catch (err: any) {
    console.error("❌ Discord: Failed to login. Check your DISCORD_BOT_TOKEN.", err.message);
  }
}

// Helper to notify Discord
async function notifyDiscord(title: string, data: any) {
  const channelId = process.env.DISCORD_LOG_CHANNEL_ID;
  if (!discordClient || !channelId) return;

  try {
    const channel = await discordClient.channels.fetch(channelId) as TextChannel;
    if (channel) {
      const embed = new EmbedBuilder()
        .setTitle(`🚀 New Registration: ${title}`)
        .setColor(0xFFD700) // Gold
        .setTimestamp()
        .addFields(
          Object.entries(data).map(([key, value]) => ({
            name: key,
            value: String(value) || 'N/A',
            inline: true
          })).slice(0, 25)
        )
        .setFooter({ text: 'BTS eSports Intel' });

      await channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error("Failed to send Discord notification:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Start Discord Bot (Background)
  initDiscordBot().catch(err => console.error("Discord Bot Failed to initialize:", err));

  app.use(express.json());

  // Google Sheets API Route
  app.post("/api/register", async (req, res) => {
    try {
      const { 
        teamName, 
        captainName, 
        captainDiscord, 
        captainEmail, 
        phoneNumber, 
        game, 
        players,
        tournamentTitle
      } = req.body;

      const serviceAccountAuth = getGoogleAuth();
      if (!serviceAccountAuth || !process.env.GOOGLE_SHEET_ID) {
        console.warn("Google Sheets credentials missing. Skipping automated sheet update.");
        return res.json({ success: true, message: "Registered in database (Sheet skipped)" });
      }

      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
      await doc.loadInfo();

      let sheet = doc.sheetsByTitle['Registrations'];
      if (!sheet) {
        // Create sheet if it doesn't exist
        sheet = await doc.addSheet({ 
          title: 'Registrations', 
          headerValues: ['Timestamp', 'Tournament', 'Team Name', 'Captain', 'Discord', 'Email', 'WhatsApp', 'Game', 'Roster'] 
        });
      }

      const rowData = {
        Timestamp: new Date().toISOString(),
        Tournament: tournamentTitle,
        'Team Name': teamName,
        Captain: captainName,
        Discord: captainDiscord,
        Email: captainEmail,
        WhatsApp: phoneNumber,
        Game: game,
        Roster: players.join(', ')
      };

      await sheet.addRow(rowData);

      // Notify Discord
      notifyDiscord(`Tournament - ${tournamentTitle}`, {
        Team: teamName,
        Captain: captainName,
        Discord: captainDiscord,
        Game: game
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Google Sheets Error:", error);
      res.status(500).json({ error: "Failed to update Google Sheet" });
    }
  });

  // Google Sheets API Route - Scrims
  app.post("/api/register-scrim", async (req, res) => {
    try {
      const { 
        teamName, 
        captainName, 
        captainDiscord, 
        captainEmail, 
        phoneNumber, 
        game, 
        scrimTitle,
        time
      } = req.body;

      const serviceAccountAuth = getGoogleAuth();
      if (!serviceAccountAuth || !process.env.GOOGLE_SHEET_ID) {
        return res.json({ success: true, message: "Registered in database (Sheet skipped)" });
      }

      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
      await doc.loadInfo();

      let sheet = doc.sheetsByTitle['Scrims'];
      if (!sheet) {
        sheet = await doc.addSheet({ 
          title: 'Scrims', 
          headerValues: ['Timestamp', 'Scrim Title', 'Team Name', 'Captain', 'Discord', 'Email', 'WhatsApp', 'Game', 'Session Time'] 
        });
      }

      const rowData = {
        Timestamp: new Date().toISOString(),
        'Scrim Title': scrimTitle,
        'Team Name': teamName,
        Captain: captainName,
        Discord: captainDiscord,
        Email: captainEmail,
        WhatsApp: phoneNumber,
        Game: game,
        'Session Time': time
      };

      await sheet.addRow(rowData);

      // Notify Discord
      notifyDiscord(`Scrim - ${scrimTitle}`, {
        Team: teamName,
        Captain: captainName,
        Discord: captainDiscord,
        Time: time
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Google Sheets Scrim Error:", error);
      res.status(500).json({ error: "Failed to update Google Sheet" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
