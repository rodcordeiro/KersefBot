import { schedule } from 'node-cron';
import { UserService } from '../../services/user.service';
import { client } from '../discord/client.discord';
import {
  GuildMemberManager,
  RoleCreateOptions,
  RoleManager,
  Colors,
} from 'discord.js';
import { config } from '../../common/config';

// const EXECUTION_CRON_TIME = '0 0 * * 0'; // De minuto em minuto
const EXECUTION_CRON_TIME = '* * * * *'; // De minuto em minuto

const firstRole = {
  name: 'Voz de Asgard',
  color: Colors.Green,
  reason:
    'A presença que mais ecoa entre os salões da guilda — fala, inspira e comanda',
  mentionable: true,
};
const secondRole = {
  name: 'Mensageiro de Odin',
  color: Colors.Navy,
  reason: 'O Segundo colocado em interações',
  mentionable: true,
};
const thirdRole = {
  name: 'Bardo de Midgard',
  color: Colors.Blurple,
  reason: 'O Terceiro colocado em interações',
  mentionable: true,
};

async function processUser(
  userId: string,
  role: Record<string, unknown>,
  roles: RoleManager,
  members: GuildMemberManager,
) {
  const member = await members.fetch({
    time: 30000,
    user: userId,
  });
  await member?.roles.add(await roles.create(role as RoleCreateOptions));
}
async function giveWeeklyInteractionReward() {
  console.debug('Executing weekly interaction rewarding job...');

  try {
    const isReady = client.isReady();
    if (!isReady) return;
    const _service = new UserService();
    const kersef = await client.guilds.fetch(config.app.KERSEF_ID);

    if (!kersef) return;

    const [first, second, third, _] = await _service
      .getXpLogsLast7Days(config.app.KERSEF_ID)
      .then(logs => {
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

    const roles = await kersef.fetch().then(guild => guild.roles);
    const rolesList = await roles
      .fetch()
      .then(roles => roles.entries())
      .then(roles => Array.from(roles))
      .then(roles => roles.map(([_, role]) => role));

    const willDelete = rolesList.filter(
      role =>
        role.name === firstRole.name ||
        role.name === secondRole.name ||
        role.name === thirdRole.name,
    );
    for await (const deletable of willDelete) {
      await deletable.delete().catch(console.error);
    }

    if (first)
      await processUser(first.userId, firstRole, roles, kersef.members);
    if (second)
      await processUser(second.userId, secondRole, roles, kersef.members);
    if (third)
      await processUser(third.userId, thirdRole, roles, kersef.members);

    await _service.pruneXpLogs();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

schedule(EXECUTION_CRON_TIME, async () => {
  console.debug('Executing weekly cron job...');
  await giveWeeklyInteractionReward();
});
