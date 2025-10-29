import 'reflect-metadata';
import { ActivityType } from 'discord.js';

import { config } from './common/config/app.config';
import { client } from './core/discord/client.discord';
import './commands';
import './core/events';
import { AppDataSource } from './database';

console.log('Starting application...');
console.log('Initializing database connection...');

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established successfully!');
    console.log('Logging in to Discord...');
    
    return client.login(config.TOKEN);
  })
  .then(() => {
    console.log('Discord login successful!');
    
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
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  });
