import 'reflect-metadata';
import { ActivityType } from 'discord.js';

import { config } from './common/config/app.config';
import { client } from './core/discord/client.discord';
// Import AppDataSource from its correct location (I'm assuming ./database)
import { AppDataSource } from './database';

async function startBot() {
  console.log('Starting application...');
  console.log('Initializing database connection...');

  try {
    // 1. Initialize the database FIRST
    await AppDataSource.initialize();
    console.log('Database connection established successfully!');

    // 2. NOW import files that depend on the database
    //    We use dynamic import() here to ensure they load
    //    *after* AppDataSource.initialize() is complete.
    console.log('Loading commands and events...');
    await import('./commands');
    await import('./core/events'); // This is your event handler file
    console.log('Commands and events loaded successfully.');

    // 3. Log in to Discord
    console.log('Logging in to Discord...');
    await client.login(config.TOKEN);
    console.log('Discord login successful!');

    // 4. Set up your presence interval
    // (Your existing logic)
    setInterval(
      () => {
        const timer = setTimeout(
          () => {
            client.user?.setActivity('with some goblins...');
            clearTimeout(timer);
          },
          2 * (60 * 1000),
        );
        client.user?.setPresence({
          status: 'online',
          activities: [
            {
              name: '/help',
              type: ActivityType.Listening,
            },
          ],
        });
      },
      10 * (60 * 1000),
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Start the bot
startBot();
