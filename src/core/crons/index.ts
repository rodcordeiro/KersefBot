import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const eventsHandlers = fs
      .readdirSync(path.resolve(__dirname))
      .filter(command => command.includes('.cron'))
      .filter(
        command =>
          (command.endsWith('.ts') || command.endsWith('.js')) &&
          !command.endsWith('.d.ts'),
      )
      .filter(command => !command.endsWith('.d.ts'));

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
