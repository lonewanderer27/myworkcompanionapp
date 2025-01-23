// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_productive_white_tiger.sql';
import m0001 from './0001_sad_the_hunter.sql';
import m0002 from './0002_colorful_celestials.sql';
import m0003 from './0003_icy_domino.sql';
import m0004 from './0004_condemned_onslaught.sql';
import m0005 from './0005_mysterious_joseph.sql';
import m0006 from './0006_easy_lizard.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006
    }
  }
  