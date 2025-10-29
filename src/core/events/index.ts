import { Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { client } from '../discord/client.discord';

(async () => {
  try {
    const eventsHandlers = fs
      .readdirSync(path.resolve(__dirname))
      .filter(command => command.includes('.event'));

    await Promise.allSettled(
      eventsHandlers.map(async handler => {
        console.debug(`Loading event ${handler}`);
        await import(`./${handler}`);
      }),
    );
    client.once(Events.ClientReady, instance => {
      console.log(`Instance Ready! Bot ${instance.user.tag} initialized.`);
    });
  } catch (err) {
    console.error('Error loading events:', err);
    throw err;
  }
})();
