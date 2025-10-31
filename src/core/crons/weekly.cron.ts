import { schedule } from 'node-cron';
import { UserService } from '../../services/user.service';
import { client } from '../discord/client.discord';
import { RoleCreateOptions } from 'discord.js';
import { config } from '../../common/config';

// const EXECUTION_CRON_TIME = '0 0 * * 0'; // De minuto em minuto
const EXECUTION_CRON_TIME = '* * * * *'; // De minuto em minuto

const firstRole = {
  name: 'Voz de Asgard',
  color: 'Green',
  reason:
    'A presença que mais ecoa entre os salões da guilda — fala, inspira e comanda',
  mentionable: true,
};
const secondRole = {
  name: 'Mensageiro de Odin',
  color: 'Green',
  reason: 'O Segundo colocado em interações',
  mentionable: true,
};
const thirdRole = {
  name: 'Bardo de Midgard',
  color: 'Green',
  reason: 'O Terceiro colocado em interações',
  mentionable: true,
};

async function process() {
  console.log('Executing weekly cron job...');
  const isReady = client.isReady();
  console.log({ isReady });
  if (!isReady) return;
  console.log('processando');
  const _service = new UserService();
  console.log('service instantiated');
  const kersef = await client.guilds.fetch(config.app.KERSEF_ID);

  if (!kersef) return;

  const [first, second, third, _] = await _service
    .getXpLogsLast7Days(config.app.KERSEF_ID)
    .then(logs => {
      console.log({ logs });

      const res = {} as Record<string, number>;
      logs.forEach(log => {
        if (!res[log.userId]) res[log.userId] = 0;
        res[log.userId] += log.amount;
      });
      return res;
    })
    .then(logs =>
      Object.entries(logs)
        .sort((a, b) => b[1] - a[1])
        .map(([userId, _ammount]) => ({ userId })),
    );
  console.log({ first, second, third });

  const roles = await kersef.fetch().then(guild => guild.roles);
  const rolesList = await roles.fetch();

  for (const role of [firstRole, secondRole, thirdRole]) {
    const existing = rolesList.find(r => r.name === role.name);
    if (existing) await existing.delete().catch(console.error);
  }
  console.log('roles removed');
  const guildMembers = await kersef.fetch().then(guild => guild.members);
  const members = await guildMembers.fetch();
  console.log('members fetched');
  const rankedMembers = [first, second, third]
    .map(u => members.get(u.userId))
    .filter(Boolean);
  const [voice, messenger, bard] = rankedMembers;
  console.log({ voice, messenger, bard });

  await voice?.roles.add(await roles.create(firstRole as RoleCreateOptions));
  await messenger?.roles.add(
    await roles.create(secondRole as RoleCreateOptions),
  );
  await bard?.roles.add(await roles.create(thirdRole as RoleCreateOptions));
  console.log('roles granted');

  await _service.pruneXpLogs();
}

schedule(EXECUTION_CRON_TIME, async () => {
  let tries = 3;
  while (tries > 0) {
    try {
      await process();
      tries = 0;
    } catch (err) {
      console.error(err);
      tries -= 1;
    }
  }
});
