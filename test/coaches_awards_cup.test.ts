import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { getTeamCoach, computeCoachSynergy, Coach } from '../src/coaches.ts';
import { computeMatchRatings, getMatchMotm, buildTeamOfRound } from '../src/awards.ts';
import { initCup2026, recalculateCupGroups, drawNextRegionsRound } from '../src/cup2026.ts';

test('Coaches: retrieves authentic RPL head coaches with designated tactical philosophies', () => {
  const zenitCoach = getTeamCoach('Зенит', 'rpl');
  assert.strictEqual(zenitCoach.name, 'Сергей Семак');
  assert.strictEqual(zenitCoach.style, 'possession');

  const spartakCoach = getTeamCoach('Спартак', 'rpl');
  assert.strictEqual(spartakCoach.name, 'Деян Станкович');
  assert.strictEqual(spartakCoach.style, 'attack');

  const rubinCoach = getTeamCoach('Рубин', 'rpl');
  assert.strictEqual(rubinCoach.name, 'Рашид Рахимов');
  assert.strictEqual(rubinCoach.style, 'bus');

  const lokomotivCoach = getTeamCoach('Локомотив', 'rpl');
  assert.strictEqual(lokomotivCoach.name, 'Михаил Галактионов');
  assert.strictEqual(lokomotivCoach.style, 'press');

  const cskaCoach = getTeamCoach('ЦСКА', 'rpl');
  assert.strictEqual(cskaCoach.name, 'Марко Николич');
  assert.strictEqual(cskaCoach.style, 'counter');
});

test('Coaches: tactical synergy accurately penalizes mismatched playstyles (bus coach with attacking squad)', () => {
  const busCoach: Coach = {
    id: 'test_bus',
    name: 'Иван Оборонный',
    clubName: 'Тест',
    nationality: 'Россия',
    age: 55,
    style: 'bus',
    styleTitle: 'Автобус',
    styleDesc: 'Низкий блок',
    favoriteFormation: '5-3-2',
    reputation: 80,
    temperament: 'Строгий',
    quote: 'Защита'
  };

  // 1. Полная гармония: автобусник + установка на автобус и схема 5-3-2
  const goodTactics = {
    formation: '5-3-2',
    speech: 'Ставим бетон, глухая оборона на ноль',
    training: 'Отработка обороны и стандартов'
  };
  const synGood = computeCoachSynergy(busCoach, goodTactics);
  assert.ok(synGood.score >= 80, `Expected high synergy, got ${synGood.score}`);
  assert.ok(synGood.status === 'excellent' || synGood.status === 'good');
  assert.ok(synGood.xgaMultiplier <= 0.95);

  // 2. Тактический диссонанс: автобусник + установка "все в атаку, штурм" и схема 4-3-3
  const clashTactics = {
    formation: '4-3-3',
    speech: 'Все в атаку! Бежим вперед, тотальный штурм и забивать!',
    training: 'Отработка дальних ударов и атак'
  };
  const synClash = computeCoachSynergy(busCoach, clashTactics);
  assert.ok(synClash.score < 50, `Expected low synergy score, got ${synClash.score}`);
  assert.ok(synClash.status === 'poor' || synClash.status === 'clash');
  assert.ok(synClash.xgMultiplier < 1.0);
  assert.ok(synClash.xgaMultiplier > 1.1);
});

test('Awards: computes MOTM and post-match interview for match winners and key performers', () => {
  const fixture = {
    id: 'fx_1',
    comp: 'rpl',
    date: '2026-08-15',
    time: '19:00',
    hg: 2,
    ag: 1,
    status: 'done'
  };

  const match = {
    events: [],
    ctx: {
      pos: { p1: 'НАП', p2: 'ПЗ', p3: 'ВР' }
    },
    stats: {
      players: {
        p1: { n: 'Артём Дзюба', t: 'akron', side: 'home', min: 90, g: 2, a: 0, xg: 1.4, sh: 4 },
        p2: { n: 'Эдуард Сперцян', t: 'krasnodar', side: 'away', min: 90, g: 1, a: 0, xg: 0.6, sh: 2 },
        p3: { n: 'Сергей Волков', t: 'akron', side: 'home', min: 90, sv: 4, cs: 0 }
      }
    }
  };

  const motm = getMatchMotm(match, fixture, 'Акрон', 'Краснодар');
  assert.ok(motm);
  assert.strictEqual(motm.name, 'Артём Дзюба');
  assert.ok(motm.rating >= 8.0);
  assert.ok(motm.interview.quote.length > 20);
  assert.ok(motm.interview.headline.includes('Дзюба'));
});

test('Russian Cup 2026/2027: generates 4 RPL groups of 4 teams, clean round labels, and dynamic Regions Path rounds', () => {
  const rplTeams = Array.from({ length: 16 }, (_, i) => ({ id: `rpl_${i + 1}`, name: `Клуб РПЛ ${i + 1}` }));
  const fnlTeams = Array.from({ length: 18 }, (_, i) => ({ id: `fnl_${i + 1}`, name: `Клуб ФНЛ ${i + 1}` }));
  const secondLeagueTeams = Array.from({ length: 48 }, (_, i) => ({ id: `2l_${i + 1}`, name: `Клуб 2Л ${i + 1}` }));
  const mediaTeams = Array.from({ length: 16 }, (_, i) => ({ id: `med_${i + 1}`, name: `Медиаклуб ${i + 1}` }));

  let uidCounter = 0;
  const uid = () => `cup_${++uidCounter}`;

  const { cupState, fixtures } = initCup2026('2026/27', rplTeams, fnlTeams, secondLeagueTeams, mediaTeams, uid);

  // Проверяем Путь РПЛ: 4 группы A, B, C, D
  assert.deepStrictEqual(Object.keys(cupState.rplGroups), ['A', 'B', 'C', 'D']);
  for (const gid of ['A', 'B', 'C', 'D']) {
    assert.strictEqual(cupState.rplGroups[gid].teams.length, 4);
    assert.strictEqual(cupState.rplGroups[gid].table.length, 4);
  }

  // В каждой группе 6 туров по 2 матча = 12 матчей на группу * 4 = 48 матчей
  const rplGroupFx = fixtures.filter(f => f.cupPath === 'rpl_group');
  assert.strictEqual(rplGroupFx.length, 48);

  // Проверяем наименование туров Пути РПЛ — БЕЗ групп в названии тура!
  for (const f of rplGroupFx) {
    assert.strictEqual(f.label, `Путь РПЛ · ${f.round}-й тур`);
  }

  // Путь регионов: стартует ТОЛЬКО с 1-го раунда (16 матчей)
  const regQualFx = fixtures.filter(f => f.cupPath === 'regions_qual');
  assert.strictEqual(regQualFx.length, 16);
  assert.ok(regQualFx.every(f => f.qualRound === 1));

  // Проверяем динамическую жеребьевку 2-го раунда
  regQualFx.forEach((f, idx) => {
    f.status = 'done';
    f.hg = idx % 2 === 0 ? 2 : 1;
    f.ag = idx % 2 === 0 ? 0 : 3;
  });
  const r2Fx = drawNextRegionsRound(cupState, 1, regQualFx, uid);
  assert.strictEqual(r2Fx.length, 16);
  assert.ok(r2Fx.every(f => f.qualRound === 2));

  // Проверяем динамическую жеребьевку 3-го раунда
  r2Fx.forEach(f => {
    f.status = 'done';
    f.hg = 2; f.ag = 1;
  });
  const r3Fx = drawNextRegionsRound(cupState, 2, r2Fx, uid);
  assert.strictEqual(r3Fx.length, 16);
  assert.ok(r3Fx.every(f => f.qualRound === 3));

  // Проверяем 4-й раунд: вступают клубы ФНЛ, играют против квалифаеров 3-го раунда (квалифаеры дома)
  r3Fx.forEach(f => {
    f.status = 'done';
    f.hg = 1; f.ag = 0;
  });
  const r4Fx = drawNextRegionsRound(cupState, 3, r3Fx, uid);
  assert.ok(r4Fx.length >= 16);
  assert.ok(r4Fx.every(f => f.qualRound === 4));
  // 16 квалифаеров принимают 16 клубов ФНЛ дома:
  const lowerHosts = r4Fx.filter(f => f.home.startsWith('med_') || f.home.startsWith('2l_'));
  assert.strictEqual(lowerHosts.length, 16, '16 qualifiers host FNL clubs at home');
  const fnlAgainstQualifiers = r4Fx.filter(f => (f.home.startsWith('med_') || f.home.startsWith('2l_')) && f.away.startsWith('fnl_'));
  assert.strictEqual(fnlAgainstQualifiers.length, 16, '16 FNL clubs play away against qualifiers');

  // Проверяем пересчет очков с сериями пенальти
  const testMatch = rplGroupFx[0];
  testMatch.status = 'done';
  testMatch.hg = 1;
  testMatch.ag = 1;
  testMatch.pen = { winner: 'home', hg: 5, ag: 4 };

  recalculateCupGroups(cupState, fixtures);
  const grp = cupState.rplGroups[testMatch.groupId];
  const homeRow = grp.table.find(r => r.id === testMatch.home);
  const awayRow = grp.table.find(r => r.id === testMatch.away);

  assert.strictEqual(homeRow?.pts, 2, 'Winner on penalty shootout gets 2 points');
  assert.strictEqual(awayRow?.pts, 1, 'Loser on penalty shootout gets 1 point');
});

test('Russian Cup 2026/2027: midweek schedule has exactly 2 Tue, 4 Wed, 2 Thu matches per round', () => {
  const rplTeams = Array.from({ length: 16 }, (_, i) => ({ id: `rpl_${i + 1}`, name: `Клуб РПЛ ${i + 1}` }));
  const fnlTeams = Array.from({ length: 18 }, (_, i) => ({ id: `fnl_${i + 1}`, name: `Клуб ФНЛ ${i + 1}` }));
  const secondLeagueTeams = Array.from({ length: 48 }, (_, i) => ({ id: `2l_${i + 1}`, name: `Клуб 2Л ${i + 1}` }));
  const mediaTeams = Array.from({ length: 16 }, (_, i) => ({ id: `med_${i + 1}`, name: `Медиаклуб ${i + 1}` }));

  let uidCounter = 0;
  const uid = () => `cup_${++uidCounter}`;

  const { cupState, fixtures } = initCup2026('2026/27', rplTeams, fnlTeams, secondLeagueTeams, mediaTeams, uid);

  // Проверяем каждый из 6 туров группового этапа Пути РПЛ
  for (let r = 1; r <= 6; r++) {
    const roundFx = fixtures.filter(f => f.cupPath === 'rpl_group' && f.round === r);
    assert.strictEqual(roundFx.length, 8, `Round ${r} must contain exactly 8 matches`);

    // Проверяем распределение по дням недели (Tue=2, Wed=3, Thu=4)
    const dayCounts: Record<number, number> = { 2: 0, 3: 0, 4: 0 };
    for (const f of roundFx) {
      const dayOfWeek = new Date(f.date + 'T12:00:00Z').getUTCDay();
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    }

    assert.strictEqual(dayCounts[2], 2, `Round ${r} must have exactly 2 matches on Tuesday`);
    assert.strictEqual(dayCounts[3], 4, `Round ${r} must have exactly 4 matches on Wednesday`);
    assert.strictEqual(dayCounts[4], 2, `Round ${r} must have exactly 2 matches on Thursday`);
  }

  // Проверяем чередование недель между Путем регионов и Путем РПЛ
  assert.ok(cupState.regWeeks[0].tue < cupState.rplWeeks[0].tue, 'Regions R1 precedes RPL T1');
  assert.ok(cupState.rplWeeks[0].tue < cupState.regWeeks[1].tue, 'RPL T1 precedes Regions R2');
  assert.ok(cupState.regWeeks[1].tue < cupState.rplWeeks[1].tue, 'Regions R2 precedes RPL T2');
  assert.ok(cupState.rplWeeks[1].tue < cupState.regWeeks[2].tue, 'RPL T2 precedes Regions R3');
});

test('Referee assignment regulations: RPL & Cup only, 1 match per tour for head referee, zero other roles in same tour', () => {
  const db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));

  // 1. Для всех лиг, кроме РПЛ и Кубка, арбитры НЕ назначаются
  const nonRplCupWithRefs = db.fixtures.filter((f: any) => f.comp !== 'rpl' && f.comp !== 'cup' && (f.refereeId || f.refereeName));
  assert.strictEqual(nonRplCupWithRefs.length, 0, 'No non-RPL/Cup fixture should have referees assigned');

  // 2. В каждом туре РПЛ и Кубка России каждый главный арбитр судит строго 1 матч и больше ничего
  function getTourKey(f: any): string {
    if (f.comp === 'rpl') return `rpl:${f.round}`;
    if (f.comp === 'cup') {
      const p = f.cupPath || (f.round <= 6 ? 'rpl_group' : 'regions_qual');
      const r = f.qualRound || f.round || f.cupStage || 1;
      return `cup:${p}:${r}`;
    }
    return `${f.comp}:${f.round || 1}`;
  }

  const tours: Record<string, any[]> = {};
  for (const f of db.fixtures) {
    if (f.comp === 'rpl' || f.comp === 'cup') {
      const k = getTourKey(f);
      tours[k] = tours[k] || [];
      tours[k].push(f);
    }
  }

  for (const [tourKey, list] of Object.entries(tours)) {
    const headRefs = list.map((f: any) => f.refereeName).filter(Boolean);
    const uniqueHeadRefs = new Set(headRefs);

    // Главный арбитр назначен только на 1 матч в туре
    assert.strictEqual(uniqueHeadRefs.size, headRefs.length, `Duplicate head referees found in tour ${tourKey}: ${headRefs.join(', ')}`);

    // Больше ничего судить в этом туре он не может (ни ВАР, ни АВАР, ни резервным)
    for (const f of list) {
      if (f.reserveReferee) {
        assert.ok(!uniqueHeadRefs.has(f.reserveReferee), `Head referee ${f.reserveReferee} is assigned as reserve referee in tour ${tourKey}`);
      }
      if (f.varReferee) {
        assert.ok(!uniqueHeadRefs.has(f.varReferee), `Head referee ${f.varReferee} is assigned as VAR in tour ${tourKey}`);
      }
      if (f.avarReferee) {
        assert.ok(!uniqueHeadRefs.has(f.avarReferee), `Head referee ${f.avarReferee} is assigned as AVAR in tour ${tourKey}`);
      }
    }
  }
});


