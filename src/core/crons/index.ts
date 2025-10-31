import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const eventsHandlers = fs
      .readdirSync(path.resolve(__dirname))
      .filter(command => command.includes('.cron'));

    await Promise.allSettled(
      eventsHandlers.map(async handler => {
        console.debug(`Loading cron ${handler}`);
        await import(`./${handler}`);
      }),
    );
  } catch (err) {
    console.error('Error loading crons:', err);
    throw err;
  }
})();
