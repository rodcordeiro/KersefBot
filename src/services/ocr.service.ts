import * as Tesseract from 'tesseract.js';
import sharp from 'sharp';

export interface Stat {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  speedAttack: number;
  critical: number;
  criticalDamage: number;
  criticalDefense: number;
  pvpDamage: number;
  pvpDefense: number;
  penetration: number;
  absorption: number;
  precision: number;
  evasion: number;
  manaEconomy: number;
  movement: number;
}

export const DNweights: Record<string, Record<string, number>> = {
  Huntress: {
    hp: 0.05,
    mp: 0.05,
    attack: 0.25,
    defense: 0.1,
    magicAttack: 0,
    attackSpeed: 0.25,
    crit: 0.2,
    critDamage: 0.15,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.1,
    manaEconomy: 0,
    movement: 0.05,
  },
  'Transknight Trans': {
    hp: 0.25,
    defense: 0.25,
    attack: 0.15,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    pvpAttack: 0.075,
    pvpDefense: 0.075,
    absorption: 0.1,
    penetration: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
    mp: 0.05,
    magicAttack: 0,
    critDefense: 0.05,
  },
  'Transknight Confiança': {
    hp: 0.25,
    mp: 0.05,
    attack: 0.15,
    magicAttack: 0,
    defense: 0.25,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.075,
    pvpDefense: 0.075,
    penetration: 0.05,
    absorption: 0.1,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
  'BeastMaster Elemental': {
    hp: 0.25,
    defense: 0.2,
    attack: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    pvpAttack: 0.1,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
    mp: 0.05,
    magicAttack: 0,
    critDefense: 0.05,
  },
  'BeastMaster Evocação': {
    hp: 0.25,
    mp: 0.05,
    attack: 0.2,
    magicAttack: 0,
    defense: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
  'BeastMaster Natureza': {
    hp: 0.25,
    mp: 0.05,
    attack: 0.2,
    magicAttack: 0,
    defense: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
  'Foema Battle': {
    hp: 0.2,
    mp: 0.05,
    attack: 0.2,
    magicAttack: 0,
    defense: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.1,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
  'Foema White': {
    hp: 0.2,
    mp: 0.05,
    attack: 0.2,
    magicAttack: 0,
    defense: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.1,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
  'Foema Black': {
    hp: 0.2,
    mp: 0.05,
    attack: 0.2,
    magicAttack: 0,
    defense: 0.2,
    attackSpeed: 0.1,
    crit: 0.1,
    critDamage: 0.1,
    critDefense: 0.05,
    pvpAttack: 0.1,
    pvpDefense: 0.1,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0,
    movement: 0.05,
  },
};
export const MGweights: Record<string, Record<string, number>> = {
  'Transknight MG': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'BeastMaster Elemental': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'BeastMaster Evocação': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'BeastMaster Natureza': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'Foema Battle': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'Foema White': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.2,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
  'Foema Black': {
    hp: 0.15,
    mp: 0.15,
    attack: 0,
    magicAttack: 0.4,
    defense: 0.1,
    attackSpeed: 0.05,
    crit: 0.05,
    critDamage: 0.05,
    critDefense: 0.05,
    pvpAttack: 0.05,
    pvpDefense: 0.05,
    penetration: 0.05,
    absorption: 0.05,
    precision: 0.05,
    evasion: 0.05,
    manaEconomy: 0.05,
    movement: 0.05,
  },
};

export class OcrService {
  async extractStats(filename: string) {
    if (!filename) {
      throw new Error(`Arquivo não encontrado no caminho: ${filename}`);
    }

    const processedPath = filename.replace(/(\.\w+)$/, '_clean$1');
    await sharp(filename)
      .grayscale()
      .normalize()
      .threshold(128)
      .toFile(processedPath);

    const { data } = await Tesseract.recognize(filename, 'por');

    const text = data.text.replace(/\s+/g, ' ');

    const getNum = (pattern: RegExp): number => {
      const match = text.match(pattern);
      if (!match) return 0;

      let raw = match[1].toString().trim();
      raw = raw.replace(',', '.');

      const found = raw.match(/(\d+(\.\d+)?)/);
      if (!found) return 0;

      const value = parseFloat(found[1]);
      return isNaN(value) ? 0 : value;
    };
    const hp = getNum(/H[EePp]\s*[:-]?\s*(\d+)/i);
    const mp = getNum(/M[PpEeOo]\s*[:-]?\s*(\d+)/i);
    const attack = getNum(/Ata[qukce]{1,3}\s*[:-]?\s*(\d+)/i);
    const defense = getNum(/Def[e3]sa\s*[:-]?\s*(\d+)/i);
    const magicAttack = getNum(/At[aá@]\s*M[aá]gic[o0]\s*(\d+)/i);
    const speedAttack = getNum(
      /Vel(?:ocidade)?\s*(?:At[aá@]q(?:ue)?|Ataque)\s*([\d.,]+)/i,
    );
    const critical = getNum(/Cr[ií1l]t[ií1l]c[o0]\s*([\d.,]+)/i);
    const criticalDamage = getNum(/Dano\s*Cr[ií1l]t[ií1l]c[o0]\s*([\d.,]+)/i);

    const pvpDamage = getNum(/Dano\s*P[vVuU][pP]\s*([\d.,]+)/i);
    const criticalDefense = getNum(
      /Def[e3]sa\s*(?:Cr[ií1l]t[ií1l]c[o0]|Crit|Cr[ií])\s*([\d.,]+)/i,
    );
    const pvpDefense = getNum(
      /Def[e3]sa\s*P[vVuU][pP]\s*(?:EXT|EX|E)?\s*([\d.,]+)/i,
    );
    const penetration = getNum(/Perfura[cç][aãa]o\s*([\d.,]+)/i);
    const absorption = getNum(/Absor[cç][aãa]o\s*([\d.,]+)/i);
    const precision = getNum(/Precis[aãa]o\s*([\d.,]+)/i);
    const evasion = getNum(/Evas[aãa]o\s*([\d.,]+)/i);
    const manaEconomy = getNum(/Economia\s*(?:de)?\s*Mana\s*([\d.,]+)/i);
    const movement = getNum(/Mov[ií1l]ment[o0]\s*([\d.,]+)/i);

    return {
      hp,
      mp,
      attack,
      defense,
      magicAttack,
      speedAttack,
      critical,
      criticalDamage,
      criticalDefense,
      pvpDamage,
      pvpDefense,
      penetration,
      absorption,
      precision,
      evasion,
      manaEconomy,
      movement,
    };
  }
  calculateScore(stats: Stat, classChar: string, type: 'DN' | 'MG'): number {
    const s = {
      hp: stats.hp ?? 0,
      mp: stats.mp ?? 0,
      attack: stats.attack ?? 0,
      magicAttack: stats.magicAttack ?? 0,
      defense: stats.defense ?? 0,
      attackSpeed: stats.speedAttack ?? 0,
      crit: stats.critical ?? 0,
      critDamage: stats.criticalDamage ?? 0,
      critDefense: stats.criticalDefense ?? 0,
      pvpAttack: stats.pvpDamage ?? 0,
      pvpDefense: stats.pvpDefense ?? 0,
      penetration: stats.penetration ?? 0,
      absorption: stats.absorption ?? 0,
      precision: stats.precision ?? 0,
      evasion: stats.evasion ?? 0,
      manaEconomy: stats.manaEconomy ?? 0,
      movement: stats.movement ?? 0,
    };

    const weights =
      type === 'DN'
        ? (DNweights[classChar] ?? DNweights['Huntress'])
        : (MGweights[classChar] ?? MGweights['Foema Black']);

    let score = 0;
    for (const key in weights) {
      const statValue = s[key as keyof typeof s] ?? 0;
      const weight = weights[key as keyof typeof s] ?? 0;
      score += statValue * weight;
    }

    return Math.round(score);
  }
}
