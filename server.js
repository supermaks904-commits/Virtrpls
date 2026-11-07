// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// src/logos.ts
var OFFICIAL_LOGOS = {
  // РПЛ
  "\u0437\u0435\u043D\u0438\u0442": "/assets/aistudio/russia_zenit.football-logos.cc_c93ec0ee.svg",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A": "/assets/aistudio/russia_spartak-moskva.football-logos.cc_cd7a4eb7.svg",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_spartak-moskva.football-logos.cc_cd7a4eb7.svg",
  "\u0446\u0441\u043A\u0430": "/assets/aistudio/PFC_CSKA_9a6b044d.svg",
  "\u0446\u0441\u043A\u0430 \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/PFC_CSKA_9a6b044d.svg",
  "\u043F\u0444\u043A \u0446\u0441\u043A\u0430": "/assets/aistudio/PFC_CSKA_9a6b044d.svg",
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432": "/assets/aistudio/russia_lokomotiv-moskva.football-logos.cc_af3d5476.svg",
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432 \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_lokomotiv-moskva.football-logos.cc_af3d5476.svg",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_dynamo-moscow.football-logos.cc_00d01b39.svg",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C": "/assets/aistudio/russia_dynamo-moscow.football-logos.cc_00d01b39.svg",
  "\u043A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440": "/assets/aistudio/russia_krasnodar.football-logos.cc_3eb2641e.svg",
  "\u0440\u043E\u0441\u0442\u043E\u0432": "/assets/aistudio/russia_rostov.football-logos.cc_615b1535.svg",
  "\u0440\u0443\u0431\u0438\u043D": "/assets/aistudio/russia_rubin.football-logos.cc_f471fd8f.svg",
  "\u0440\u0443\u0431\u0438\u043D \u043A\u0430\u0437\u0430\u043D\u044C": "/assets/aistudio/russia_rubin.football-logos.cc_f471fd8f.svg",
  "\u043A\u0440\u044B\u043B\u044C\u044F \u0441\u043E\u0432\u0435\u0442\u043E\u0432": "/assets/aistudio/russia_krylya-sovetov.football-logos.cc_1b424814.svg",
  "\u043A\u0440\u044B\u043B\u044C\u044F": "/assets/aistudio/russia_krylya-sovetov.football-logos.cc_1b424814.svg",
  "\u0430\u0445\u043C\u0430\u0442": "/assets/aistudio/russia_akhmat.football-logos.cc_ec510264.svg",
  "\u0430\u0445\u043C\u0430\u0442 \u0433\u0440\u043E\u0437\u043D\u044B\u0439": "/assets/aistudio/russia_akhmat.football-logos.cc_ec510264.svg",
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430": "/assets/aistudio/russia_baltika.football-logos.cc_dec89199.svg",
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430 \u043A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434": "/assets/aistudio/russia_baltika.football-logos.cc_dec89199.svg",
  "\u0441\u043E\u0447\u0438": "/assets/aistudio/russia_sochi.football-logos.cc_368db1f4.svg",
  "\u043F\u0430\u0440\u0438 \u043D\u043D": "/assets/aistudio/russia_pari-nn.football-logos.cc_3e0b1012.svg",
  "\u043F\u0430\u0440\u0438 \u043D\u0438\u0436\u043D\u0438\u0439 \u043D\u043E\u0432\u0433\u043E\u0440\u043E\u0434": "/assets/aistudio/russia_pari-nn.football-logos.cc_3e0b1012.svg",
  "\u043D\u0438\u0436\u043D\u0438\u0439 \u043D\u043E\u0432\u0433\u043E\u0440\u043E\u0434": "/assets/aistudio/russia_pari-nn.football-logos.cc_3e0b1012.svg",
  "\u043E\u0440\u0435\u043D\u0431\u0443\u0440\u0433": "/assets/aistudio/russia_orenburg.football-logos.cc_e7d8ed34.svg",
  "\u0430\u043A\u0440\u043E\u043D": "/assets/aistudio/russia_akron.football-logos.cc_9b564896.svg",
  "\u0430\u043A\u0440\u043E\u043D \u0442\u043E\u043B\u044C\u044F\u0442\u0442\u0438": "/assets/aistudio/russia_akron.football-logos.cc_9b564896.svg",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430": "/assets/aistudio/russia_dynamo-makhachkala.football-logos.cc_9e55fd99.svg",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u0445": "/assets/aistudio/russia_dynamo-makhachkala.football-logos.cc_9e55fd99.svg",
  "\u0444\u0430\u043A\u0435\u043B": "/assets/aistudio/russia_fakel.football-logos.cc_4beaea45.svg",
  "\u0444\u0430\u043A\u0435\u043B \u0432\u043E\u0440\u043E\u043D\u0435\u0436": "/assets/aistudio/russia_fakel.football-logos.cc_4beaea45.svg",
  // ФНЛ, ПФЛ и клубы России
  "\u0443\u0440\u0430\u043B": "/assets/aistudio/russia_ural.football-logos.cc_d02d7659.svg",
  "\u0443\u0440\u0430\u043B \u0435\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433": "/assets/aistudio/russia_ural.football-logos.cc_d02d7659.svg",
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E": "/assets/aistudio/russia_torpedo-moskva.football-logos.cc_458824bb.svg",
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_torpedo-moskva.football-logos.cc_458824bb.svg",
  "\u0448\u0438\u043D\u043D\u0438\u043A": "/assets/aistudio/russia_shinnik.football-logos.cc_b0a4c239.svg",
  "\u0448\u0438\u043D\u043D\u0438\u043A \u044F\u0440\u043E\u0441\u043B\u0430\u0432\u043B\u044C": "/assets/aistudio/russia_shinnik.football-logos.cc_b0a4c239.svg",
  "\u0430\u0440\u0441\u0435\u043D\u0430\u043B": "/assets/aistudio/russia_arsenal-tula.football-logos.cc_1ce7619a.svg",
  "\u0430\u0440\u0441\u0435\u043D\u0430\u043B \u0442\u0443\u043B\u0430": "/assets/aistudio/russia_arsenal-tula.football-logos.cc_1ce7619a.svg",
  "\u0440\u043E\u0442\u043E\u0440": "/assets/aistudio/russia_rotor.football-logos.cc_be212968.svg",
  "\u0440\u043E\u0442\u043E\u0440 \u0432\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434": "/assets/aistudio/russia_rotor.football-logos.cc_be212968.svg",
  "\u0440\u043E\u0434\u0438\u043D\u0430": "/assets/aistudio/russia_rodina-moscow.football-logos.cc_9872b082.svg",
  "\u0440\u043E\u0434\u0438\u043D\u0430 \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_rodina-moscow.football-logos.cc_9872b082.svg",
  "\u043A\u0430\u043C\u0430\u0437": "/assets/aistudio/russia_kamaz.football-logos.cc_5f0e30b1.svg",
  "\u0447\u0435\u0440\u043D\u043E\u043C\u043E\u0440\u0435\u0446": "/assets/aistudio/russia_chernomorets-novorossiisk.football-logos.cc_69abc7dc.svg",
  "\u0447\u0435\u0440\u043D\u043E\u043C\u043E\u0440\u0435\u0446 \u043D\u043E\u0432\u043E\u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A": "/assets/aistudio/russia_chernomorets-novorossiisk.football-logos.cc_69abc7dc.svg",
  "\u0441\u043A\u0430-\u0445\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A": "/assets/aistudio/russia_ska-khabarovsk.football-logos.cc_5d23a258.svg",
  "\u0441\u043A\u0430 \u0445\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A": "/assets/aistudio/russia_ska-khabarovsk.football-logos.cc_5d23a258.svg",
  "\u0435\u043D\u0438\u0441\u0435\u0439": "/assets/aistudio/russia_yenisey.football-logos.cc_277f7baf.svg",
  "\u0443\u0444\u0430": "/assets/aistudio/russia_ufa.football-logos.cc_b2df7253.svg",
  "\u043D\u0435\u0444\u0442\u0435\u0445\u0438\u043C\u0438\u043A": "/assets/aistudio/russia_neftekhimik-nizhnekamsk.football-logos.cc_7baec74c.svg",
  "\u043D\u0435\u0444\u0442\u0435\u0445\u0438\u043C\u0438\u043A \u043D\u0438\u0436\u043D\u0435\u043A\u0430\u043C\u0441\u043A": "/assets/aistudio/russia_neftekhimik-nizhnekamsk.football-logos.cc_7baec74c.svg",
  "\u0447\u0430\u0439\u043A\u0430": "/assets/aistudio/russia_chayka-peschanokopskoye.football-logos.cc_a336e808.svg",
  "\u0441\u043E\u043A\u043E\u043B": "/assets/aistudio/russia_fc-sokol-saratov.football-logos.cc_340b39fc.svg",
  "\u0441\u043E\u043A\u043E\u043B \u0441\u0430\u0440\u0430\u0442\u043E\u0432": "/assets/aistudio/russia_fc-sokol-saratov.football-logos.cc_340b39fc.svg",
  "\u0441\u0430\u0440\u0430\u0442\u043E\u0432": "/assets/aistudio/russia_fc-sokol-saratov.football-logos.cc_340b39fc.svg",
  "\u0430\u043C\u043A\u0430\u0440": "/assets/aistudio/russia_amkar.football-logos.cc_64e4152c.svg",
  "\u0430\u043C\u043A\u0430\u0440 \u043F\u0435\u0440\u043C\u044C": "/assets/aistudio/russia_amkar.football-logos.cc_64e4152c.svg",
  "\u043B\u0435\u043D\u0438\u043D\u0433\u0440\u0430\u0434\u0435\u0446": "/assets/aistudio/russia_leningradets.football-logos.cc_3c0bef00.svg",
  "\u0432\u0435\u043B\u0435\u0441": "/assets/aistudio/russia_veles-moscow.football-logos.cc_ed792674.svg",
  "\u0432\u0435\u043B\u0435\u0441 \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/russia_veles-moscow.football-logos.cc_ed792674.svg",
  "\u0432\u043E\u043B\u0433\u0430 \u0443\u043B\u044C\u044F\u043D\u043E\u0432\u0441\u043A": "/assets/aistudio/russia_volga-ulyanovsk.football-logos.cc_b8522fda.svg",
  "\u0432\u043E\u043B\u0433\u0430": "/assets/aistudio/russia_volga-ulyanovsk.football-logos.cc_b8522fda.svg",
  "\u0442\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0449\u0438\u043A": "/assets/aistudio/russia_tekstilshchik-ivanovo.football-logos.cc_f9a5bacd.svg",
  "\u0442\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0449\u0438\u043A \u0438\u0432\u0430\u043D\u043E\u0432\u043E": "/assets/aistudio/russia_tekstilshchik-ivanovo.football-logos.cc_f9a5bacd.svg",
  "\u0445\u0438\u043C\u0438\u043A": "/assets/aistudio/russia_khimik-dzerzhinsk.football-logos.cc_36b7d5c1.svg",
  "\u0445\u0438\u043C\u0438\u043A \u0434\u0437\u0435\u0440\u0436\u0438\u043D\u0441\u043A": "/assets/aistudio/russia_khimik-dzerzhinsk.football-logos.cc_36b7d5c1.svg",
  "\u0447\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A": "/assets/aistudio/russia_chelyabinsk.football-logos.cc_74fddc7d.svg",
  "\u0430\u0441\u0442\u0440\u0430\u0445\u0430\u043D\u044C": "/assets/aistudio/astrakhan-logo-2024-145x100_cbd49f65.png",
  "\u0432\u043E\u043B\u0433\u0430\u0440\u044C": "/assets/aistudio/volgar-logo-145x100_5d3f5dfd.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0431\u0440\u044F\u043D\u0441\u043A": "/assets/aistudio/russia_fc-dynamo-bryansk.football-logos.cc_50cc0bb4.svg",
  "\u044D\u043B\u0438\u0441\u0442\u0430": "/assets/aistudio/russia_fc-elista.football-logos.cc_0167d01a.svg",
  "\u0443\u0440\u0430\u043B\u0430\u043D": "/assets/aistudio/russia_fc-elista.football-logos.cc_0167d01a.svg",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043A\u043E\u0441\u0442\u0440\u043E\u043C\u0430": "/assets/aistudio/russia_spartak-kostroma.football-logos.cc_4f38dbc1.svg",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043D\u0430\u043B\u044C\u0447\u0438\u043A": "/assets/aistudio/spartak-nalchik-big_b44c2e71.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A-\u043D\u0430\u043B\u044C\u0447\u0438\u043A": "/assets/aistudio/spartak-nalchik-big_b44c2e71.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u0432\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437": "/assets/aistudio/fk-spartak-alaniya-vladikavkaz-2003-logo-png_seeklogo-538369_59af4f86.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A-\u0430\u043B\u0430\u043D\u0438\u044F": "/assets/aistudio/fk-spartak-alaniya-vladikavkaz-2003-logo-png_seeklogo-538369_59af4f86.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A-\u0430\u043B\u0430\u043D\u0438\u044F \u0432\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437": "/assets/aistudio/fk-spartak-alaniya-vladikavkaz-2003-logo-png_seeklogo-538369_59af4f86.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u0430\u043B\u0430\u043D\u0438\u044F": "/assets/aistudio/fk-spartak-alaniya-vladikavkaz-2003-logo-png_seeklogo-538369_59af4f86.png",
  "\u0437\u0432\u0435\u0437\u0434\u0430": "/logos/zvezda-spb.svg",
  "\u0437\u0432\u0435\u0437\u0434\u0430 \u0441\u043F\u0431": "/logos/zvezda-spb.svg",
  "\u0437\u0432\u0435\u0437\u0434\u0430 \u0441\u0430\u043D\u043A\u0442-\u043F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433": "/logos/zvezda-spb.svg",
  "\u0444\u043A \u0437\u0432\u0435\u0437\u0434\u0430": "/logos/zvezda-spb.svg",
  "\u0447\u0435\u0440\u0442\u0430\u043D\u043E\u0432\u043E": "/assets/aistudio/russia_chertanovo.football-logos.cc_91970b61.svg",
  "\u0430\u043B\u0430\u043D\u0438\u044F": "/assets/aistudio/alania-big_ca72efaa.png",
  "\u0430\u043B\u0430\u043D\u0438\u044F \u0432\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437": "/assets/aistudio/alania-big_ca72efaa.png",
  "\u0430\u043C\u043A\u0430\u043B": "/assets/aistudio/amkal-big_9fc643af.png",
  "2drots": "/assets/aistudio/2drots-big-768x768_24a6f01f.png",
  "2\u0434\u0440\u043E\u0442\u0441": "/assets/aistudio/2drots-big-768x768_24a6f01f.png",
  "\u0442\u044E\u043C\u0435\u043D\u044C": "/assets/aistudio/tyumen-big-2023_361d20f9.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0432\u043B\u0430\u0434\u0438\u0432\u043E\u0441\u0442\u043E\u043A": "/assets/aistudio/dynamo-vladivostok-logo-145x100_35048b53.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0432\u043B\u0430\u0434\u0438\u0432\u043E\u0441\u0442\u043E\u043A": "/assets/aistudio/dynamo-vladivostok-logo-145x100_35048b53.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0441\u0442\u0430\u0432\u0440\u043E\u043F\u043E\u043B\u044C": "/assets/aistudio/dynamo-stavropol-logo-145x100_e57697c6.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0441\u0442\u0430\u0432\u0440\u043E\u043F\u043E\u043B\u044C": "/assets/aistudio/dynamo-stavropol-logo-145x100_e57697c6.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0432\u043E\u043B\u043E\u0433\u0434\u0430": "/assets/aistudio/dynamo-vologda-logo-145x100_d7f12918.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0432\u043E\u043B\u043E\u0433\u0434\u0430": "/assets/aistudio/dynamo-vologda-logo-145x100_d7f12918.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0441\u043F\u0431": "/assets/aistudio/dynamo-saint-petersburg-logo-145x100_9b445321.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0441\u043F\u0431": "/assets/aistudio/dynamo-saint-petersburg-logo-145x100_9b445321.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0441\u0430\u043D\u043A\u0442-\u043F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433": "/assets/aistudio/dynamo-saint-petersburg-logo-145x100_9b445321.png",
  "\u0434\u0440\u0443\u0436\u0431\u0430": "/assets/aistudio/druzhba-maykop-big-768x635_e7d80d49.png",
  "\u0434\u0440\u0443\u0436\u0431\u0430 \u043C\u0430\u0439\u043A\u043E\u043F": "/assets/aistudio/druzhba-maykop-big-768x635_e7d80d49.png",
  "\u043C\u0430\u0448\u0443\u043A-\u043A\u043C\u0432": "/assets/aistudio/mashuk-kmv-big-2023_b9aad6d1.png",
  "\u043C\u0430\u0448\u0443\u043A \u043A\u043C\u0432": "/assets/aistudio/mashuk-kmv-big-2023_b9aad6d1.png",
  "\u043D\u0430\u0440\u0442": "/assets/aistudio/nart-big-768x768_da8dae81.png",
  "\u043D\u0430\u0440\u0442 \u0447\u0435\u0440\u043A\u0435\u0441\u0441\u043A": "/assets/aistudio/nart-big-768x768_da8dae81.png",
  "\u0441\u0435\u0432\u0430\u0441\u0442\u043E\u043F\u043E\u043B\u044C": "/assets/aistudio/sevastopol-big-768x768_a839f7ec.png",
  "\u0441\u0430\u043B\u044E\u0442": "/assets/aistudio/salyut-belgorod-logo-145x100_eda88427.png",
  "\u0441\u0430\u043B\u044E\u0442 \u0431\u0435\u043B\u0433\u043E\u0440\u043E\u0434": "/assets/aistudio/salyut-belgorod-logo-145x100_eda88427.png",
  "\u0441\u0430\u0442\u0443\u0440\u043D": "/assets/aistudio/saturn-logo-145x100_52d01930.png",
  "\u0441\u0430\u0442\u0443\u0440\u043D \u0440\u0430\u043C\u0435\u043D\u0441\u043A\u043E\u0435": "/assets/aistudio/saturn-logo-145x100_52d01930.png",
  "\u043B\u0435\u043E\u043D \u0441\u0430\u0442\u0443\u0440\u043D": "/assets/aistudio/saturn-logo-145x100_52d01930.png",
  "\u0441\u043A\u0430 \u0440\u043E\u0441\u0442\u043E\u0432": "/assets/aistudio/ska-rostov-on-don-big-2024_5888a199.png",
  "\u0441\u043A\u0430 \u0440\u043E\u0441\u0442\u043E\u0432-\u043D\u0430-\u0434\u043E\u043D\u0443": "/assets/aistudio/ska-rostov-on-don-big-2024_5888a199.png",
  "\u043C\u0443\u0440\u043E\u043C": "/assets/aistudio/murom-logo-145x100_6cc929e1.png",
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430-\u0431\u0444\u0443": "/assets/aistudio/baltika-bfu-logo-145x100_7ed174fe.png",
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430 \u0431\u0444\u0443": "/assets/aistudio/baltika-bfu-logo-145x100_7ed174fe.png",
  "\u0432\u043E\u043B\u043D\u0430": "/assets/aistudio/volna-logo-145x100_517e32ba.png",
  "\u0432\u043E\u043B\u0433\u0430\u0440\u044C \u0430\u0441\u0442\u0440\u0430\u0445\u0430\u043D\u044C": "/assets/aistudio/volgar-logo-145x100_5d3f5dfd.png",
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E \u043C\u0438\u0430\u0441\u0441": "/assets/aistudio/torpedo-miass-logo-145x100_2882b291.png",
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E-2": "/assets/aistudio/torpedo-2-logo-2023-145x100_d926e9d3.png",
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E-2 \u043C\u043E\u0441\u043A\u0432\u0430": "/assets/aistudio/torpedo-2-logo-2023-145x100_d926e9d3.png",
  "\u0442\u043E\u0441\u043D\u043E": "/assets/aistudio/tosno-logo-145x100_0a915235.png",
  "\u0440\u0443\u0431\u0438\u043D \u044F\u043B\u0442\u0430": "/assets/aistudio/rubin-yalta-logo-145x100_3fed7b5f.png",
  "\u0440\u0443\u0431\u0438\u043D-\u044F\u043B\u0442\u0430": "/assets/aistudio/rubin-yalta-logo-145x100_3fed7b5f.png",
  "\u043A\u0443\u0431\u0430\u043D\u044C \u0445\u043E\u043B\u0434\u0438\u043D\u0433": "/assets/aistudio/kuban-holding-logo-145x100_a8d8b782.png",
  "\u043A\u0443\u0431\u0430\u043D\u044C-\u0445\u043E\u043B\u0434\u0438\u043D\u0433": "/assets/aistudio/kuban-holding-logo-145x100_a8d8b782.png",
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u0442\u0430\u043C\u0431\u043E\u0432": "/assets/aistudio/spartak-tambov-logo-2023-145x100_cbb80c10.png",
  "\u043A\u043E\u0441\u043C\u043E\u0441": "/assets/aistudio/kosmos-logo-145x100_de30adcf.png",
  "\u043A\u043E\u0441\u043C\u043E\u0441 \u0434\u043E\u043B\u0433\u043E\u043F\u0440\u0443\u0434\u043D\u044B\u0439": "/assets/aistudio/kosmos-logo-145x100_de30adcf.png",
  "\u043A\u0430\u043B\u0443\u0433\u0430": "/assets/aistudio/kaluga-logo-145x100_9361352d.png",
  "\u0437\u0435\u043D\u0438\u0442 \u043F\u0435\u043D\u0437\u0430": "/assets/aistudio/zenit-penza-logo-145x100_7015bb97.png",
  "\u0437\u0435\u043D\u0438\u0442 \u0438\u0436\u0435\u0432\u0441\u043A": "/assets/aistudio/zenit-izhevsk-logo-145x100_912c7ca9.png",
  "\u0437\u0435\u043D\u0438\u0442-\u0438\u0436\u0435\u0432\u0441\u043A": "/assets/aistudio/zenit-izhevsk-logo-145x100_912c7ca9.png",
  "\u0438\u0436\u0435\u0432\u0441\u043A": "/assets/aistudio/zenit-izhevsk-logo-145x100_912c7ca9.png",
  "\u0437\u043D\u0430\u043C\u044F \u0442\u0440\u0443\u0434\u0430": "/assets/aistudio/znamya-truda-logo-2023-145x100_18414f3c.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0431\u0430\u0440\u043D\u0430\u0443\u043B": "/assets/aistudio/dynamo-barnaul-logo-2022-145x100_5ea90613.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0431\u0430\u0440\u043D\u0430\u0443\u043B": "/assets/aistudio/dynamo-barnaul-logo-2022-145x100_5ea90613.png",
  "\u043F\u043E\u0431\u0435\u0434\u0430": "/assets/aistudio/pobeda-logo-145x100_c17677cd.png",
  "\u043F\u043E\u0431\u0435\u0434\u0430 \u0445\u0430\u0441\u0430\u0432\u044E\u0440\u0442": "/assets/aistudio/pobeda-logo-145x100_c17677cd.png",
  "\u043B\u0443\u043A\u0438-\u044D\u043D\u0435\u0440\u0433\u0438\u044F": "/assets/aistudio/luki-energiya-logo-145x100_8ab65adb.png",
  "\u0430\u0432\u0430\u043D\u0433\u0430\u0440\u0434": "/assets/aistudio/avangard-kursk-logo-145x100_5e78c799.png",
  "\u0430\u0432\u0430\u043D\u0433\u0430\u0440\u0434 \u043A\u0443\u0440\u0441\u043A": "/assets/aistudio/avangard-kursk-logo-145x100_5e78c799.png",
  "\u0430\u0440\u043C\u0430\u0432\u0438\u0440": "/assets/aistudio/armavir-logo-145x100_c9472b14.png",
  "\u0430\u043D\u0433\u0443\u0448\u0442": "/assets/aistudio/angusht-logo-145x100_65e74e2b.png",
  "\u0441\u0438\u0431\u0438\u0440\u044C": "/assets/aistudio/sibir-logo-145x100_32fa3466.png",
  "\u0441\u0438\u0431\u0438\u0440\u044C \u043D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A": "/assets/aistudio/sibir-logo-145x100_32fa3466.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043A\u0438\u0440\u043E\u0432": "/assets/aistudio/dynamo-kirov-logo-145x100_635140b3.png",
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u043A\u0438\u0440\u043E\u0432": "/assets/aistudio/dynamo-kirov-logo-145x100_635140b3.png",
  "\u0431\u0440\u043E\u0443\u043A\u0438": "/assets/aistudio/Brokeboys_lightmode_4834bb47.png",
  "\u0431\u0440\u043E\u0443\u043A\u0438 (brokeboys)": "/assets/aistudio/Brokeboys_lightmode_4834bb47.png",
  "brokeboys": "/assets/aistudio/Brokeboys_lightmode_4834bb47.png",
  "broke boys": "/assets/aistudio/Brokeboys_lightmode_4834bb47.png",
  "\u0441\u0438\u043D\u0434\u0435\u043A\u0430\u0442": "/assets/aistudio/i_d0be2178.webp",
  "\u0431\u0430\u043D\u043A\u0430": "/assets/aistudio/Team_BANKA_lightmode_658cabb4.png",
  "team banka": "/assets/aistudio/Team_BANKA_lightmode_658cabb4.png",
  "fc banka": "/assets/aistudio/Team_BANKA_lightmode_658cabb4.png",
  "fight nights": "/assets/aistudio/20250710185733_Fight_Nights_lightmode_ed417a13.png",
  "\u0444\u0430\u0439\u0442 \u043D\u0430\u0439\u0442\u0441": "/assets/aistudio/20250710185733_Fight_Nights_lightmode_ed417a13.png",
  "prime squad": "/assets/aistudio/original__2__f34350ab.png",
  "\u043F\u0440\u0430\u0439\u043C \u0441\u043A\u0432\u0430\u0434": "/assets/aistudio/original__2__f34350ab.png",
  "\u0444\u043A 10": "/assets/aistudio/30549813_47b25a7b.jpg",
  "fc 10": "/assets/aistudio/30549813_47b25a7b.jpg",
  "\u043D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430": "/assets/aistudio/1713435283593698984_492496b6.png",
  "\u043C\u0430\u0442\u0447 \u0442\u0432": "/assets/aistudio/original__1__0c5942f0.png",
  "lit energy": "/assets/aistudio/original_e9317d9e.png",
  "\u043B\u0438\u0442 \u044D\u043D\u0435\u0440\u0434\u0436\u0438": "/assets/aistudio/original_e9317d9e.png",
  "\u0438\u0440\u043A\u0443\u0442\u0441\u043A": "/assets/aistudio/irkutsk-big_32a733f0.png",
  "\u0444\u043A \u0438\u0440\u043A\u0443\u0442\u0441\u043A": "/assets/aistudio/irkutsk-big_32a733f0.png",
  "\u044D\u0433\u0440\u0438\u0441\u0438": "/assets/aistudio/f14322dd6495d94f39ec68f33cf52_b5ba6e96.webp",
  "\u0444\u043A \u044D\u0433\u0440\u0438\u0441\u0438": "/assets/aistudio/f14322dd6495d94f39ec68f33cf52_b5ba6e96.webp",
  "\u0447\u0438\u0441\u0442\u043E \u043F\u0438\u0442\u0435\u0440": "/assets/aistudio/original__3__dab66e2c.png",
  "rocket team": "/assets/aistudio/1713523892825857620_cf3b7ed4.png",
  "\u0440\u043E\u043A\u0435\u0442 \u0442\u0438\u043C": "/assets/aistudio/1713523892825857620_cf3b7ed4.png",
  "\u0441\u0431\u043E\u0440\u043D\u0430\u044F \u0440\u043E\u0441\u0441\u0438\u0438": "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
  "\u0441\u0431\u043E\u0440\u043D\u0430\u044F": "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
  "\u0440\u043E\u0441\u0441\u0438\u044F": "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
  "\u0441\u0431\u043E\u0440\u043D\u0430\u044F \u0440\u0444": "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
  "\u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0431\u043E\u0440\u043D\u0430\u044F": "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg"
};
var OFFICIAL_COLORS = {
  "\u0437\u0435\u043D\u0438\u0442": { primary: "#00a3e0", secondary: "#ffffff", short: "\u0417\u0415\u041D" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A": { primary: "#e11d27", secondary: "#ffffff", short: "\u0421\u041F\u0410" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043C\u043E\u0441\u043A\u0432\u0430": { primary: "#e11d27", secondary: "#ffffff", short: "\u0421\u041F\u0410" },
  "\u0446\u0441\u043A\u0430": { primary: "#003b94", secondary: "#d3202a", short: "\u0426\u0421\u041A" },
  "\u0446\u0441\u043A\u0430 \u043C\u043E\u0441\u043A\u0432\u0430": { primary: "#003b94", secondary: "#d3202a", short: "\u0426\u0421\u041A" },
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432": { primary: "#008542", secondary: "#e30613", short: "\u041B\u041E\u041A" },
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432 \u043C\u043E\u0441\u043A\u0432\u0430": { primary: "#008542", secondary: "#e30613", short: "\u041B\u041E\u041A" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u043E\u0441\u043A\u0432\u0430": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0418\u041D" },
  "\u043A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440": { primary: "#144734", secondary: "#bba15a", short: "\u041A\u0420\u0410" },
  "\u0440\u043E\u0441\u0442\u043E\u0432": { primary: "#ffd200", secondary: "#003da5", short: "\u0420\u041E\u0421" },
  "\u0440\u0443\u0431\u0438\u043D": { primary: "#9d1c24", secondary: "#007a3d", short: "\u0420\u0423\u0411" },
  "\u0440\u0443\u0431\u0438\u043D \u043A\u0430\u0437\u0430\u043D\u044C": { primary: "#9d1c24", secondary: "#007a3d", short: "\u0420\u0423\u0411" },
  "\u043A\u0440\u044B\u043B\u044C\u044F \u0441\u043E\u0432\u0435\u0442\u043E\u0432": { primary: "#55acee", secondary: "#ffffff", short: "\u041A\u0420\u0421" },
  "\u0430\u0445\u043C\u0430\u0442": { primary: "#00843d", secondary: "#ffffff", short: "\u0410\u0425\u041C" },
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430": { primary: "#002d72", secondary: "#009cde", short: "\u0411\u0410\u041B" },
  "\u0441\u043E\u0447\u0438": { primary: "#0a192f", secondary: "#00c0f3", short: "\u0421\u041E\u0427" },
  "\u043F\u0430\u0440\u0438 \u043D\u043D": { primary: "#001838", secondary: "#00e5ff", short: "\u041F\u041D\u041D" },
  "\u043E\u0440\u0435\u043D\u0431\u0443\u0440\u0433": { primary: "#0072ce", secondary: "#ffffff", short: "\u041E\u0420\u0415" },
  "\u0430\u043A\u0440\u043E\u043D": { primary: "#c8102e", secondary: "#111111", short: "\u0410\u041A\u0420" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430": { primary: "#0066b2", secondary: "#ffffff", short: "\u0414\u041C\u0425" },
  "\u0444\u0430\u043A\u0435\u043B": { primary: "#003399", secondary: "#e52b2b", short: "\u0424\u0410\u041A" },
  "\u0443\u0440\u0430\u043B": { primary: "#f36f21", secondary: "#1a1a1a", short: "\u0423\u0420\u0410" },
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E": { primary: "#111111", secondary: "#ffffff", short: "\u0422\u041E\u0420" },
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E \u043C\u043E\u0441\u043A\u0432\u0430": { primary: "#111111", secondary: "#ffffff", short: "\u0422\u041E\u0420" },
  "\u0448\u0438\u043D\u043D\u0438\u043A": { primary: "#002d72", secondary: "#000000", short: "\u0428\u0418\u041D" },
  "\u0430\u0440\u0441\u0435\u043D\u0430\u043B": { primary: "#e5a823", secondary: "#d3202a", short: "\u0410\u0420\u0421" },
  "\u0430\u0440\u0441\u0435\u043D\u0430\u043B \u0442\u0443\u043B\u0430": { primary: "#e5a823", secondary: "#d3202a", short: "\u0410\u0420\u0421" },
  "\u0440\u043E\u0442\u043E\u0440": { primary: "#00a3e0", secondary: "#002d72", short: "\u0420\u041E\u0422" },
  "\u0440\u043E\u0434\u0438\u043D\u0430": { primary: "#00a3e0", secondary: "#ffffff", short: "\u0420\u041E\u0414" },
  "\u043A\u0430\u043C\u0430\u0437": { primary: "#003399", secondary: "#e30613", short: "\u041A\u0410\u041C" },
  "\u0447\u0435\u0440\u043D\u043E\u043C\u043E\u0440\u0435\u0446": { primary: "#006699", secondary: "#ffffff", short: "\u0427\u0415\u0420" },
  "\u0441\u043A\u0430-\u0445\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A": { primary: "#d3202a", secondary: "#002d72", short: "\u0421\u041A\u0410" },
  "\u0435\u043D\u0438\u0441\u0435\u0439": { primary: "#d3202a", secondary: "#003399", short: "\u0415\u041D\u0418" },
  "\u0443\u0444\u0430": { primary: "#3b1c55", secondary: "#a8d8b9", short: "\u0423\u0424\u0410" },
  "\u043D\u0435\u0444\u0442\u0435\u0445\u0438\u043C\u0438\u043A": { primary: "#008542", secondary: "#e30613", short: "\u041D\u0415\u0424" },
  "\u0447\u0430\u0439\u043A\u0430": { primary: "#0055ff", secondary: "#ffffff", short: "\u0427\u0410\u0419" },
  "\u0441\u043E\u043A\u043E\u043B": { primary: "#0080ff", secondary: "#ffffff", short: "\u0421\u041E\u041A" },
  "\u0430\u043C\u043A\u0430\u0440": { primary: "#d3202a", secondary: "#111111", short: "\u0410\u041C\u041A" },
  "\u043B\u0435\u043D\u0438\u043D\u0433\u0440\u0430\u0434\u0435\u0446": { primary: "#0a192f", secondary: "#e30613", short: "\u041B\u0415\u041D" },
  "\u0432\u0435\u043B\u0435\u0441": { primary: "#66b2ff", secondary: "#800020", short: "\u0412\u0415\u041B" },
  "\u0432\u043E\u043B\u0433\u0430 \u0443\u043B\u044C\u044F\u043D\u043E\u0432\u0441\u043A": { primary: "#ffd200", secondary: "#111111", short: "\u0412\u041E\u041B" },
  "\u0442\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0449\u0438\u043A": { primary: "#d3202a", secondary: "#111111", short: "\u0422\u0415\u041A" },
  "\u0445\u0438\u043C\u0438\u043A": { primary: "#00a651", secondary: "#111111", short: "\u0425\u0418\u041C" },
  "\u0447\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A": { primary: "#00a3e0", secondary: "#ffffff", short: "\u0427\u0415\u041B" },
  "\u0430\u0441\u0442\u0440\u0430\u0445\u0430\u043D\u044C": { primary: "#003399", secondary: "#d3202a", short: "\u0410\u0421\u0422" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0431\u0440\u044F\u043D\u0441\u043A": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0411\u0420" },
  "\u044D\u043B\u0438\u0441\u0442\u0430": { primary: "#ffd200", secondary: "#00a3e0", short: "\u042D\u041B\u0418" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043A\u043E\u0441\u0442\u0440\u043E\u043C\u0430": { primary: "#d3202a", secondary: "#ffffff", short: "\u0421\u041F\u041A" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u043D\u0430\u043B\u044C\u0447\u0438\u043A": { primary: "#d3202a", secondary: "#008542", short: "\u0421\u041F\u041D" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u0432\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437": { primary: "#d3202a", secondary: "#ffd200", short: "\u0421\u0410\u041B" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A-\u0430\u043B\u0430\u043D\u0438\u044F": { primary: "#d3202a", secondary: "#ffd200", short: "\u0421\u0410\u041B" },
  "\u0437\u0432\u0435\u0437\u0434\u0430": { primary: "#b71212", secondary: "#ffffff", short: "\u0417\u0412\u0415" },
  "\u0437\u0432\u0435\u0437\u0434\u0430 \u0441\u043F\u0431": { primary: "#b71212", secondary: "#ffffff", short: "\u0417\u0412\u0415" },
  "\u0447\u0435\u0440\u0442\u0430\u043D\u043E\u0432\u043E": { primary: "#0055ff", secondary: "#ffffff", short: "\u0427\u0415\u0420" },
  "\u0430\u043B\u0430\u043D\u0438\u044F": { primary: "#d3202a", secondary: "#ffd200", short: "\u0410\u041B\u0410" },
  "\u0430\u043B\u0430\u043D\u0438\u044F \u0432\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437": { primary: "#d3202a", secondary: "#ffd200", short: "\u0410\u041B\u0410" },
  "\u0430\u043C\u043A\u0430\u043B": { primary: "#d3202a", secondary: "#111111", short: "\u0410\u041C\u041A" },
  "2drots": { primary: "#ff3366", secondary: "#111111", short: "2DR" },
  "\u0442\u044E\u043C\u0435\u043D\u044C": { primary: "#111111", secondary: "#ffffff", short: "\u0422\u042E\u041C" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0432\u043B\u0430\u0434\u0438\u0432\u043E\u0441\u0442\u043E\u043A": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0412\u041B" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0441\u0442\u0430\u0432\u0440\u043E\u043F\u043E\u043B\u044C": { primary: "#004d9c", secondary: "#ffd200", short: "\u0414\u0421\u0422" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0432\u043E\u043B\u043E\u0433\u0434\u0430": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0412\u0413" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0441\u043F\u0431": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0421\u041F" },
  "\u0434\u0438\u043D\u0430\u043C\u043E-\u0441\u043F\u0431": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0421\u041F" },
  "\u0434\u0440\u0443\u0436\u0431\u0430": { primary: "#008542", secondary: "#ffd200", short: "\u0414\u0420\u0423" },
  "\u0434\u0440\u0443\u0436\u0431\u0430 \u043C\u0430\u0439\u043A\u043E\u043F": { primary: "#008542", secondary: "#ffd200", short: "\u0414\u0420\u0423" },
  "\u043C\u0430\u0448\u0443\u043A-\u043A\u043C\u0432": { primary: "#d3202a", secondary: "#ffffff", short: "\u041C\u0410\u0428" },
  "\u043D\u0430\u0440\u0442": { primary: "#008542", secondary: "#ffffff", short: "\u041D\u0410\u0420" },
  "\u043D\u0430\u0440\u0442 \u0447\u0435\u0440\u043A\u0435\u0441\u0441\u043A": { primary: "#008542", secondary: "#ffffff", short: "\u041D\u0410\u0420" },
  "\u0441\u0435\u0432\u0430\u0441\u0442\u043E\u043F\u043E\u043B\u044C": { primary: "#003399", secondary: "#d3202a", short: "\u0421\u0415\u0412" },
  "\u0441\u0430\u043B\u044E\u0442 \u0431\u0435\u043B\u0433\u043E\u0440\u043E\u0434": { primary: "#990000", secondary: "#ffffff", short: "\u0421\u0410\u041B" },
  "\u0441\u0430\u0442\u0443\u0440\u043D": { primary: "#002d72", secondary: "#111111", short: "\u0421\u0410\u0422" },
  "\u043B\u0435\u043E\u043D \u0441\u0430\u0442\u0443\u0440\u043D": { primary: "#002d72", secondary: "#111111", short: "\u0421\u0410\u0422" },
  "\u0441\u043A\u0430 \u0440\u043E\u0441\u0442\u043E\u0432": { primary: "#d3202a", secondary: "#003399", short: "\u0421\u041A\u0420" },
  "\u0438\u0440\u043A\u0443\u0442\u0441\u043A": { primary: "#006633", secondary: "#d3202a", short: "\u0418\u0420\u041A" },
  "\u043A\u0443\u0431\u0430\u043D\u044C \u0445\u043E\u043B\u0434\u0438\u043D\u0433": { primary: "#111111", secondary: "#ffffff", short: "\u041A\u0425" },
  "\u043A\u0443\u0431\u0430\u043D\u044C-\u0445\u043E\u043B\u0434\u0438\u043D\u0433": { primary: "#111111", secondary: "#ffffff", short: "\u041A\u0425" },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A \u0442\u0430\u043C\u0431\u043E\u0432": { primary: "#d3202a", secondary: "#ffffff", short: "\u0421\u041F\u0422" },
  "\u043A\u043E\u0441\u043C\u043E\u0441": { primary: "#001838", secondary: "#e5a823", short: "\u041A\u041E\u0421" },
  "\u043A\u043E\u0441\u043C\u043E\u0441 \u0434\u043E\u043B\u0433\u043E\u043F\u0440\u0443\u0434\u043D\u044B\u0439": { primary: "#001838", secondary: "#e5a823", short: "\u041A\u041E\u0421" },
  "\u043A\u0430\u043B\u0443\u0433\u0430": { primary: "#14385f", secondary: "#b0c4de", short: "\u041A\u0410\u041B" },
  "\u0437\u0435\u043D\u0438\u0442 \u043F\u0435\u043D\u0437\u0430": { primary: "#00a3e0", secondary: "#ffffff", short: "\u0417\u041F\u041D" },
  "\u0437\u0435\u043D\u0438\u0442 \u0438\u0436\u0435\u0432\u0441\u043A": { primary: "#0055a5", secondary: "#ffffff", short: "\u0417\u0418\u0416" },
  "\u0437\u0435\u043D\u0438\u0442-\u0438\u0436\u0435\u0432\u0441\u043A": { primary: "#0055a5", secondary: "#ffffff", short: "\u0417\u0418\u0416" },
  "\u0438\u0436\u0435\u0432\u0441\u043A": { primary: "#0055a5", secondary: "#ffffff", short: "\u0417\u0418\u0416" },
  "\u0437\u043D\u0430\u043C\u044F \u0442\u0440\u0443\u0434\u0430": { primary: "#d3202a", secondary: "#002d72", short: "\u0417\u041D\u0422" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u0431\u0430\u0440\u043D\u0430\u0443\u043B": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u0411\u0420" },
  "\u043F\u043E\u0431\u0435\u0434\u0430": { primary: "#d3202a", secondary: "#008542", short: "\u041F\u041E\u0411" },
  "\u043F\u043E\u0431\u0435\u0434\u0430 \u0445\u0430\u0441\u0430\u0432\u044E\u0440\u0442": { primary: "#d3202a", secondary: "#008542", short: "\u041F\u041E\u0411" },
  "\u043B\u0443\u043A\u0438-\u044D\u043D\u0435\u0440\u0433\u0438\u044F": { primary: "#d3202a", secondary: "#111111", short: "\u041B\u0423\u041A" },
  "\u0430\u0432\u0430\u043D\u0433\u0430\u0440\u0434": { primary: "#0055ff", secondary: "#ffffff", short: "\u0410\u0412\u041A" },
  "\u0430\u0432\u0430\u043D\u0433\u0430\u0440\u0434 \u043A\u0443\u0440\u0441\u043A": { primary: "#0055ff", secondary: "#ffffff", short: "\u0410\u0412\u041A" },
  "\u0430\u0440\u043C\u0430\u0432\u0438\u0440": { primary: "#d3202a", secondary: "#f36f21", short: "\u0410\u0420\u041C" },
  "\u0430\u043D\u0433\u0443\u0448\u0442": { primary: "#008542", secondary: "#ffffff", short: "\u0410\u041D\u0413" },
  "\u0441\u0438\u0431\u0438\u0440\u044C": { primary: "#004d9c", secondary: "#ffffff", short: "\u0421\u0418\u0411" },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043A\u0438\u0440\u043E\u0432": { primary: "#004d9c", secondary: "#ffffff", short: "\u0414\u041A\u0418" },
  "\u0431\u0440\u043E\u0443\u043A\u0438": { primary: "#ff8800", secondary: "#111111", short: "\u0411\u0420\u041E" },
  "\u0431\u0440\u043E\u0443\u043A\u0438 (brokeboys)": { primary: "#ff8800", secondary: "#111111", short: "\u0411\u0420\u041E" },
  "\u0441\u0438\u043D\u0434\u0435\u043A\u0430\u0442": { primary: "#d3202a", secondary: "#111111", short: "\u0421\u0418\u041D" },
  "\u0431\u0430\u043D\u043A\u0430": { primary: "#ffd200", secondary: "#111111", short: "\u0411\u0410\u041D" },
  "fight nights": { primary: "#e52b2b", secondary: "#111111", short: "FN" },
  "prime squad": { primary: "#9900ee", secondary: "#111111", short: "PRM" },
  "\u0444\u043A 10": { primary: "#ffea00", secondary: "#111111", short: "\u0414\u0415\u0421" },
  "\u043D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430": { primary: "#d3202a", secondary: "#ffffff", short: "\u041D\u0410\u0420" },
  "\u043C\u0430\u0442\u0447 \u0442\u0432": { primary: "#d3202a", secondary: "#111111", short: "\u041C\u0422\u0412" },
  "lit energy": { primary: "#ff0055", secondary: "#111111", short: "LIT" },
  "\u0440\u0443\u0431\u0438\u043D \u044F\u043B\u0442\u0430": { primary: "#9d1c24", secondary: "#ffd200", short: "\u0420\u0411\u042F" },
  "\u0442\u043E\u0441\u043D\u043E": { primary: "#111111", secondary: "#ffd200", short: "\u0422\u041E\u0421" },
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E-2": { primary: "#111111", secondary: "#ffffff", short: "\u0422\u04202" },
  "\u0432\u043E\u043B\u0433\u0430\u0440\u044C": { primary: "#004d9c", secondary: "#ffffff", short: "\u0412\u041B\u0413" },
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E \u043C\u0438\u0430\u0441\u0441": { primary: "#111111", secondary: "#ffffff", short: "\u0422\u0420\u041C" },
  "\u043C\u0443\u0440\u043E\u043C": { primary: "#d3202a", secondary: "#ffffff", short: "\u041C\u0423\u0420" },
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430-\u0431\u0444\u0443": { primary: "#002d72", secondary: "#009cde", short: "\u0411\u0424\u0423" },
  "\u0432\u043E\u043B\u043D\u0430": { primary: "#008542", secondary: "#ffd200", short: "\u0412\u041E\u041B" },
  "\u044D\u0433\u0440\u0438\u0441\u0438": { primary: "#ffcc00", secondary: "#111111", short: "\u042D\u0413\u0420" },
  "\u0447\u0438\u0441\u0442\u043E \u043F\u0438\u0442\u0435\u0440": { primary: "#002b66", secondary: "#ffffff", short: "\u0427\u0421\u041F" },
  "rocket team": { primary: "#111111", secondary: "#ffffff", short: "RKT" },
  "\u0440\u043E\u043A\u0435\u0442 \u0442\u0438\u043C": { primary: "#111111", secondary: "#ffffff", short: "RKT" },
  "\u0441\u0431\u043E\u0440\u043D\u0430\u044F \u0440\u043E\u0441\u0441\u0438\u0438": { primary: "#b91c1c", secondary: "#ffffff", short: "\u0420\u041E\u0421" },
  "\u0441\u0431\u043E\u0440\u043D\u0430\u044F": { primary: "#b91c1c", secondary: "#ffffff", short: "\u0420\u041E\u0421" },
  "\u0440\u043E\u0441\u0441\u0438\u044F": { primary: "#b91c1c", secondary: "#ffffff", short: "\u0420\u041E\u0421" }
};
function svgToDataUri(svg) {
  const cleaned = svg.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
}
function generateDynamicLogo(name, comp = "rpl") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);
  const words = name.trim().split(/\s+/);
  let short = "";
  if (words.length >= 2) {
    short = (words[0][0] + words[1][0]).toUpperCase();
  } else if (name.length >= 3) {
    short = name.slice(0, 3).toUpperCase();
  } else {
    short = name.toUpperCase();
  }
  const hue = posHash % 360;
  const c1 = `hsl(${hue}, 75%, 32%)`;
  const c2 = `hsl(${hue}, 85%, 18%)`;
  const accent = `hsl(${(hue + 40) % 360}, 90%, 55%)`;
  const shieldTypes = [
    "M 50,12 L 86,28 L 78,84 L 50,92 L 22,84 L 14,28 Z",
    "M 18,14 L 82,14 L 82,56 C 82,78 50,92 50,92 C 50,92 18,78 18,56 Z",
    "M 20,16 L 80,16 C 84,36 84,64 50,90 C 16,64 16,36 20,16 Z",
    "M 50,14 L 86,50 L 50,86 L 14,50 Z"
  ];
  const shield = shieldTypes[posHash % shieldTypes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="dynSh_${posHash}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <path d="${shield}" fill="url(#dynSh_${posHash})" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="${shield}" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8"/>
  <polygon points="50,18 52,22 57,22.5 53,25.5 54.5,30 50,27 45.5,30 47,25.5 43,22.5 48,22" fill="${accent}"/>
  <text x="50" y="58" text-anchor="middle" font-family="'Unbounded', sans-serif" font-weight="900" font-size="${short.length > 2 ? 14 : 17}" fill="#ffffff" letter-spacing="1">${short}</text>
  <circle cx="50" cy="74" r="5" fill="#ffffff" stroke="${c2}" stroke-width="1"/>
</svg>`;
  return svgToDataUri(svg);
}
var PRESET_LOGOS = {};
for (const [key, logoPath] of Object.entries(OFFICIAL_LOGOS)) {
  const col = OFFICIAL_COLORS[key] || {
    primary: "#144734",
    secondary: "#ffffff",
    short: key.slice(0, 3).toUpperCase()
  };
  PRESET_LOGOS[key] = {
    logo: logoPath,
    primary: col.primary,
    secondary: col.secondary,
    short: col.short
  };
}
function getTeamLogo(name, customLogo, comp = "rpl") {
  if (customLogo && customLogo.trim().length > 0) {
    return customLogo.trim();
  }
  const clean = (name || "").trim().toLowerCase();
  if (clean && OFFICIAL_LOGOS[clean]) {
    return OFFICIAL_LOGOS[clean];
  }
  const base = clean.replace(/\s*\([^)]*\)/g, "").replace(/[-–\s]+(2|3|м|бфу)$/i, "").trim();
  if (base && OFFICIAL_LOGOS[base]) {
    return OFFICIAL_LOGOS[base];
  }
  for (const [key, path2] of Object.entries(OFFICIAL_LOGOS)) {
    if (clean === key || clean.startsWith(key + " ") || clean.endsWith(" " + key) || base && (base === key || base.startsWith(key + " "))) {
      return path2;
    }
  }
  for (const [key, path2] of Object.entries(OFFICIAL_LOGOS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return path2;
    }
  }
  return generateDynamicLogo(name || "\u041A\u043B\u0443\u0431", comp);
}
function getTeamColors(name) {
  const clean = (name || "").trim().toLowerCase();
  if (clean && OFFICIAL_COLORS[clean]) {
    return { primary: OFFICIAL_COLORS[clean].primary, secondary: OFFICIAL_COLORS[clean].secondary };
  }
  for (const [key, col] of Object.entries(OFFICIAL_COLORS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return { primary: col.primary, secondary: col.secondary };
    }
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return {
    primary: `hsl(${hue}, 70%, 40%)`,
    secondary: `hsl(${(hue + 45) % 360}, 80%, 60%)`
  };
}

// src/rules.ts
var LEAGUE_REGULATIONS = {
  rpl: {
    id: "rpl",
    name: "\u041C\u0438\u0440 \u0420\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0430\u044F \u041F\u0440\u0435\u043C\u044C\u0435\u0440-\u041B\u0438\u0433\u0430 (\u0420\u041F\u041B)",
    tier: 1,
    system: "autumn-spring",
    totalTeams: 16,
    zones: [
      {
        posFrom: 1,
        posTo: 1,
        zone: "gold",
        title: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u0420\u043E\u0441\u0441\u0438\u0438",
        description: "\u0417\u043E\u043B\u043E\u0442\u044B\u0435 \u043C\u0435\u0434\u0430\u043B\u0438 \u0438 \u043A\u0443\u0431\u043E\u043A \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u043E\u0432 \u0420\u043E\u0441\u0441\u0438\u0438."
      },
      {
        posFrom: 2,
        posTo: 3,
        zone: "top",
        title: "\u041F\u0440\u0438\u0437\u043E\u0432\u0430\u044F \u0437\u043E\u043D\u0430 (\u0421\u0435\u0440\u0435\u0431\u0440\u043E \u0438 \u0411\u0440\u043E\u043D\u0437\u0430)",
        description: "\u041F\u0440\u0438\u0437\u0451\u0440\u044B \u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0435\u0440\u0432\u0435\u043D\u0441\u0442\u0432\u0430."
      },
      {
        posFrom: 4,
        posTo: 12,
        zone: "neutral",
        title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u043F\u0438\u0441\u043A\u0438",
        description: "\u041A\u043B\u0443\u0431\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432 \u0420\u041F\u041B \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0437\u043E\u043D."
      },
      {
        posFrom: 13,
        posTo: 14,
        zone: "playoff",
        title: "\u041F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u044B\u0435 \u0441\u0442\u044B\u043A\u043E\u0432\u044B\u0435 \u043C\u0430\u0442\u0447\u0438",
        description: "13-\u0435 \u0438 14-\u0435 \u043C\u0435\u0441\u0442\u0430 \u0438\u0433\u0440\u0430\u044E\u0442 \u0434\u0432\u0443\u0445\u043C\u0430\u0442\u0447\u0435\u0432\u044B\u0435 \u0441\u0442\u044B\u043A\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 4-\u0433\u043E \u0438 3-\u0433\u043E \u043C\u0435\u0441\u0442 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0438. \u041E\u0442\u0432\u0435\u0442\u043D\u044B\u0439 \u043C\u0430\u0442\u0447 \u0434\u043E\u043C\u0430 \u0443 \u043A\u043B\u0443\u0431\u0430 \u0420\u041F\u041B. \u041F\u0440\u0438 \u043D\u0438\u0447\u044C\u0435\u0439 \u2014 \u0434\u043E\u043F. \u0432\u0440\u0435\u043C\u044F \u0438 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438 (\u0431\u0435\u0437 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0433\u043E\u0441\u0442\u0435\u0432\u043E\u0433\u043E \u0433\u043E\u043B\u0430)."
      },
      {
        posFrom: 15,
        posTo: 16,
        zone: "bad",
        title: "\u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u043B\u0435\u0442 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443",
        description: "15-\u0435 \u0438 16-\u0435 \u043C\u0435\u0441\u0442\u0430 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u0432\u044B\u0431\u044B\u0432\u0430\u044E\u0442 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0437\u043E\u043D.",
        destinationComp: "fnl"
      }
    ],
    rulesSummary: [
      "\u0421\u0438\u0441\u0442\u0435\u043C\u0430: \xAB\u043E\u0441\u0435\u043D\u044C-\u0432\u0435\u0441\u043D\u0430\xBB (30 \u0442\u0443\u0440\u043E\u0432).",
      "\u041B\u0438\u043C\u0438\u0442 \u043D\u0430 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432: \u0432 \u0441\u0435\u0437\u043E\u043D\u0435 2026/27 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043B\u0438\u043C\u0438\u0442 12+7 (\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 12 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432 \u0432 \u0437\u0430\u044F\u0432\u043A\u0435 \u043D\u0430 \u0441\u0435\u0437\u043E\u043D, \u043D\u0435 \u0431\u043E\u043B\u0435\u0435 7 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0430 \u043F\u043E\u043B\u0435). \u0412 \u0441\u0435\u0437\u043E\u043D\u0435 2027/28 \u2014 11+6, \u0432 \u0441\u0435\u0437\u043E\u043D\u0435 2028/29 \u2014 10+5.",
      "\u0413\u0440\u0430\u0436\u0434\u0430\u043D\u0435 \u0441\u0442\u0440\u0430\u043D \u0415\u0410\u042D\u0421 \u0438 \u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u0438 \u043F\u043E\u0434 \u043B\u0438\u043C\u0438\u0442 \u043D\u0435 \u043F\u043E\u0434\u043F\u0430\u0434\u0430\u044E\u0442: \u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u044F, \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D, \u0410\u0440\u043C\u0435\u043D\u0438\u044F, \u041A\u0438\u0440\u0433\u0438\u0437\u0438\u044F.",
      "\u0420\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439 \u043F\u0430\u0441\u043F\u043E\u0440\u0442 \u043D\u0435 \u0441\u043F\u0430\u0441\u0430\u0435\u0442: \u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0441 \u043F\u0430\u0441\u043F\u043E\u0440\u0442\u043E\u043C \u0420\u0424 \u0443\u0436\u0435 \u0441\u044B\u0433\u0440\u0430\u043B \u0437\u0430 \u0434\u0440\u0443\u0433\u0443\u044E \u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0443\u044E \u0441\u0431\u043E\u0440\u043D\u0443\u044E, \u043F\u043E \u0440\u0435\u0433\u043B\u0430\u043C\u0435\u043D\u0442\u0443 \u0420\u041F\u041B \u043E\u043D \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u043C.",
      "\u041D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u0432\u044B\u043B\u0435\u0442\u0430\u044E\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0441 15-\u0433\u043E \u0438 16-\u0433\u043E \u043C\u0435\u0441\u0442.",
      "13-\u0435 \u043C\u0435\u0441\u0442\u043E \u0420\u041F\u041B \u0438\u0433\u0440\u0430\u0435\u0442 \u0441\u0442\u044B\u043A\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 4-\u0433\u043E \u043C\u0435\u0441\u0442\u0430 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0438.",
      "14-\u0435 \u043C\u0435\u0441\u0442\u043E \u0420\u041F\u041B \u0438\u0433\u0440\u0430\u0435\u0442 \u0441\u0442\u044B\u043A\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 3-\u0433\u043E \u043C\u0435\u0441\u0442\u0430 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0438.",
      "\u0424\u043E\u0440\u043C\u0430\u0442 \u0441\u0442\u044B\u043A\u043E\u0432: 2 \u043C\u0430\u0442\u0447\u0430 (1-\u0439 \u0432 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0435, 2-\u0439 \u0432 \u0420\u041F\u041B). \u041D\u0438\u0447\u044C\u044F -> \u044D\u043A\u0441\u0442\u0440\u0430-\u0442\u0430\u0439\u043C\u044B (2\xD715) -> \u0441\u0435\u0440\u0438\u044F \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438. \u0411\u0435\u0437 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u044B\u0435\u0437\u0434\u043D\u043E\u0433\u043E \u0433\u043E\u043B\u0430."
    ]
  },
  fnl: {
    id: "fnl",
    name: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430 (\u041C\u0415\u041B\u0411\u0415\u0422-\u041F\u0435\u0440\u0432\u0430\u044F \u041B\u0438\u0433\u0430)",
    tier: 2,
    system: "autumn-spring",
    totalTeams: 18,
    zones: [
      {
        posFrom: 1,
        posTo: 2,
        zone: "top",
        title: "\u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434 \u0432 \u0420\u041F\u041B",
        description: "1-\u0435 \u0438 2-\u0435 \u043C\u0435\u0441\u0442\u0430 \u043F\u043E\u043B\u0443\u0447\u0430\u044E\u0442 \u043F\u0440\u044F\u043C\u044B\u0435 \u043F\u0443\u0442\u0451\u0432\u043A\u0438 \u0432 \u041F\u0440\u0435\u043C\u044C\u0435\u0440-\u041B\u0438\u0433\u0443.",
        destinationComp: "rpl"
      },
      {
        posFrom: 3,
        posTo: 4,
        zone: "playoff",
        title: "\u0421\u0442\u044B\u043A\u043E\u0432\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u0437\u0430 \u0432\u044B\u0445\u043E\u0434 \u0432 \u0420\u041F\u041B",
        description: "3-\u0435 \u043C\u0435\u0441\u0442\u043E \u0438\u0433\u0440\u0430\u0435\u0442 \u0441 14-\u043C \u043C\u0435\u0441\u0442\u043E\u043C \u0420\u041F\u041B, 4-\u0435 \u043C\u0435\u0441\u0442\u043E \u0438\u0433\u0440\u0430\u0435\u0442 \u0441 13-\u043C \u043C\u0435\u0441\u0442\u043E\u043C \u0420\u041F\u041B."
      },
      {
        posFrom: 5,
        posTo: 16,
        zone: "neutral",
        title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u043F\u0438\u0441\u043A\u0438",
        description: "\u041A\u043B\u0443\u0431\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0435 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0435\u0437\u043E\u043D."
      },
      {
        posFrom: 17,
        posTo: 18,
        zone: "bad",
        title: "\u0412\u044B\u043B\u0435\u0442 \u0432\u043E \u0412\u0442\u043E\u0440\u0443\u044E \u043B\u0438\u0433\u0443 \xAB\u0410\xBB",
        description: "17-\u0435 \u0438 18-\u0435 \u043C\u0435\u0441\u0442\u0430 \u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432\u043E \u0412\u0442\u043E\u0440\u0443\u044E \u043B\u0438\u0433\u0443 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D \xAB\u0410\xBB.",
        destinationComp: "2la_gold"
      }
    ],
    rulesSummary: [
      "\u0421\u0438\u0441\u0442\u0435\u043C\u0430: \xAB\u043E\u0441\u0435\u043D\u044C-\u0432\u0435\u0441\u043D\u0430\xBB (34 \u0442\u0443\u0440\u0430).",
      "1-\u0435 \u0438 2-\u0435 \u043C\u0435\u0441\u0442\u0430 \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 \u0420\u041F\u041B \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E.",
      "3-\u0435 \u0438 4-\u0435 \u043C\u0435\u0441\u0442\u0430 \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u044B\u0435 \u0441\u0442\u044B\u043A\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 14-\u0433\u043E \u0438 13-\u0433\u043E \u043C\u0435\u0441\u0442 \u0420\u041F\u041B.",
      "17-\u0435 \u0438 18-\u0435 \u043C\u0435\u0441\u0442\u0430 \u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432\u043E \u0412\u0442\u043E\u0440\u0443\u044E \u043B\u0438\u0433\u0443 \xAB\u0410\xBB."
    ]
  },
  "2la_gold": {
    id: "2la_gold",
    name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB",
    tier: 3,
    system: "autumn-spring",
    totalTeams: 10,
    zones: [
      {
        posFrom: 1,
        posTo: 2,
        zone: "top",
        title: "\u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443",
        description: "1-\u0435 \u0438 2-\u0435 \u043C\u0435\u0441\u0442\u0430 \u043F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0432\u0435\u0441\u0435\u043D\u043D\u0435\u0433\u043E \u044D\u0442\u0430\u043F\u0430 \u043F\u043E\u043B\u0443\u0447\u0430\u044E\u0442 \u043F\u0440\u044F\u043C\u044B\u0435 \u043F\u0443\u0442\u0451\u0432\u043A\u0438 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443.",
        destinationComp: "fnl"
      },
      {
        posFrom: 3,
        posTo: 3,
        zone: "playoff",
        title: "\u0421\u0442\u044B\u043A\u043E\u0432\u043E\u0439 \u043C\u0430\u0442\u0447 / \u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443",
        description: "3-\u0435 \u043C\u0435\u0441\u0442\u043E \u0433\u0440\u0443\u043F\u043F\u044B \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u0441\u044B\u0433\u0440\u0430\u0442\u044C \u0441\u0442\u044B\u043A\u043E\u0432\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u0437\u0430 \u043F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E (\u0435\u0441\u043B\u0438 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u043E\u0441\u0435\u043D\u0438 \u0443\u0436\u0435 \u0432 \u0442\u043E\u043F-2)."
      },
      {
        posFrom: 4,
        posTo: 6,
        zone: "neutral",
        title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB",
        description: "\u041A\u043E\u043C\u0430\u043D\u0434\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442 \u043C\u0435\u0441\u0442\u043E \u0432 \u0441\u0438\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u0435 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430 \xAB\u0410\xBB."
      },
      {
        posFrom: 7,
        posTo: 10,
        zone: "bad",
        title: "\u0412\u044B\u043B\u0435\u0442 \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB",
        description: "4 \u0445\u0443\u0434\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043F\u043E\u043B\u0443\u0433\u043E\u0434\u0438\u0447\u043D\u044B\u0439 \u044D\u0442\u0430\u043F.",
        destinationComp: "2la_silver"
      }
    ],
    rulesSummary: [
      "\u0414\u0432\u0443\u0445\u044D\u0442\u0430\u043F\u043D\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430: \u043E\u0441\u0435\u043D\u044C \u0438 \u0432\u0435\u0441\u043D\u0430 (\u043F\u043E 10 \u043A\u043E\u043C\u0430\u043D\u0434).",
      "\u0412\u0435\u0441\u043D\u043E\u0439: 1-\u0435 \u0438 2-\u0435 \u043C\u0435\u0441\u0442\u0430 \u0433\u0440\u0443\u043F\u043F\u044B \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443.",
      "3-\u0435 \u043C\u0435\u0441\u0442\u043E \u0433\u0440\u0443\u043F\u043F\u044B \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB \u0438\u0433\u0440\u0430\u0435\u0442 \u0441\u0442\u044B\u043A\u0438 \u0437\u0430 \u0432\u044B\u0445\u043E\u0434 \u0432 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443.",
      "\u041A\u0430\u0436\u0434\u044B\u0435 \u043F\u043E\u043B\u0433\u043E\u0434\u0430: 4 \u0445\u0443\u0434\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B (7\u201310 \u043C\u0435\u0441\u0442\u0430) \u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB."
    ]
  },
  "2la_silver": {
    id: "2la_silver",
    name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB",
    tier: 3,
    system: "autumn-spring",
    totalTeams: 10,
    zones: [
      {
        posFrom: 1,
        posTo: 4,
        zone: "top",
        title: "\u041F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u0435 \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB",
        description: "4 \u043B\u0443\u0447\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B (1\u20134 \u043C\u0435\u0441\u0442\u0430) \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430 \xAB\u0410\xBB.",
        destinationComp: "2la_gold"
      },
      {
        posFrom: 5,
        posTo: 6,
        zone: "neutral",
        title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB",
        description: "\u041A\u043E\u043C\u0430\u043D\u0434\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB."
      },
      {
        posFrom: 7,
        posTo: 10,
        zone: "bad",
        title: "\u0412\u044B\u043B\u0435\u0442 \u0432\u043E \u0412\u0442\u043E\u0440\u0443\u044E \u043B\u0438\u0433\u0443 \xAB\u0411\xBB",
        description: "4 \u0445\u0443\u0434\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0432\u0435\u0441\u0435\u043D\u043D\u0435\u0433\u043E \u044D\u0442\u0430\u043F\u0430 (7\u201310 \u043C\u0435\u0441\u0442\u0430) \u0432\u044B\u0431\u044B\u0432\u0430\u044E\u0442 \u0432 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D \xAB\u0411\xBB.",
        destinationComp: "2lb"
      }
    ],
    rulesSummary: [
      "\u041A\u0430\u0436\u0434\u044B\u0435 \u043F\u043E\u043B\u0433\u043E\u0434\u0430: 4 \u043B\u0443\u0447\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B (1\u20134 \u043C\u0435\u0441\u0442\u0430) \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB.",
      "\u041F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0432\u0435\u0441\u0435\u043D\u043D\u0435\u0433\u043E \u044D\u0442\u0430\u043F\u0430: 4 \u0445\u0443\u0434\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B (7\u201310 \u043C\u0435\u0441\u0442\u0430) \u0432\u044B\u0431\u044B\u0432\u0430\u044E\u0442 \u0432\u043E \u0412\u0442\u043E\u0440\u0443\u044E \u043B\u0438\u0433\u0443 \xAB\u0411\xBB.",
      "\u041E\u0431\u043C\u0435\u043D \u0441 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u043E\u043C \xAB\u0411\xBB \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u043F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0433\u043E\u0434\u0430 (\u0441\u0442\u044B\u043A\u043E\u0432 \u043D\u0435\u0442, \u043F\u0440\u044F\u043C\u043E\u0439 \u043E\u0431\u043C\u0435\u043D)."
    ]
  },
  "2lb": {
    id: "2lb",
    name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \xAB\u0411\xBB (\u0414\u0438\u0432\u0438\u0437\u0438\u043E\u043D \xAB\u0411\xBB)",
    tier: 4,
    system: "spring-autumn",
    totalTeams: 60,
    zones: [
      {
        posFrom: 1,
        posTo: 1,
        zone: "top",
        title: "\u041F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434 \u0432 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D \xAB\u0410\xBB (\xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB)",
        description: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u043A\u0430\u0436\u0434\u043E\u0439 \u0438\u0437 4 \u0433\u0440\u0443\u043F\u043F \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430 \xAB\u0410\xBB.",
        destinationComp: "2la_silver"
      },
      {
        posFrom: 2,
        posTo: 14,
        zone: "neutral",
        title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043C\u0435\u0441\u0442\u0430 \u0432 \u0433\u0440\u0443\u043F\u043F\u0435",
        description: "\u041A\u043E\u043C\u0430\u043D\u0434\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044E\u0442 \u0432\u044B\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u0435 \u0432\u043E \u0412\u0442\u043E\u0440\u043E\u0439 \u043B\u0438\u0433\u0435 \xAB\u0411\xBB."
      },
      {
        posFrom: 15,
        posTo: 16,
        zone: "bad",
        title: "\u0417\u043E\u043D\u0430 \u0432\u044B\u043B\u0435\u0442\u0430 \u0432 \u0422\u0440\u0435\u0442\u044C\u044E \u043B\u0438\u0433\u0443",
        description: "\u0410\u0443\u0442\u0441\u0430\u0439\u0434\u0435\u0440\u044B \u0433\u0440\u0443\u043F\u043F \u0438\u043B\u0438 \u043A\u043B\u0443\u0431\u044B \u0431\u0435\u0437 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0438 \u0420\u0424\u0421 \u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u0432 \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0422\u0440\u0435\u0442\u044C\u044E \u043B\u0438\u0433\u0443."
      }
    ],
    rulesSummary: [
      "\u0421\u0438\u0441\u0442\u0435\u043C\u0430: \xAB\u0432\u0435\u0441\u043D\u0430-\u043E\u0441\u0435\u043D\u044C\xBB (\u043C\u0430\u0440\u0442\u2014\u043D\u043E\u044F\u0431\u0440\u044C). 4 \u0433\u0435\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B (\u042E\u0433, \u0417\u0430\u043F\u0430\u0434, \u0426\u0435\u043D\u0442\u0440, \u0423\u0440\u0430\u043B-\u0421\u0438\u0431\u0438\u0440\u044C).",
      "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u0438 \u0432\u0441\u0435\u0445 4 \u0433\u0440\u0443\u043F\u043F (1-\u0435 \u043C\u0435\u0441\u0442\u0430) \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 \u0433\u0440\u0443\u043F\u043F\u0443 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430 \xAB\u0410\xBB.",
      "\u0421\u0442\u044B\u043A\u043E\u0432 \u043C\u0435\u0436\u0434\u0443 \xAB\u0410\xBB \u0438 \xAB\u0411\xBB \u043D\u0435\u0442 \u0438\u0437-\u0437\u0430 \u0440\u0430\u0437\u043D\u0438\u0446\u044B \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435\u0439.",
      "\u0425\u0443\u0434\u0448\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0432\u044B\u0431\u044B\u0432\u0430\u044E\u0442 \u0432 \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0443\u044E \u0422\u0440\u0435\u0442\u044C\u044E \u043B\u0438\u0433\u0443."
    ]
  },
  media: {
    id: "media",
    name: "Winline \u041C\u0435\u0434\u0438\u0439\u043D\u0430\u044F \u0424\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u0430\u044F \u041B\u0438\u0433\u0430 (MFL)",
    tier: 5,
    system: "autumn-spring",
    totalTeams: 16,
    zones: [
      {
        posFrom: 1,
        posTo: 4,
        zone: "top",
        title: "\u0412\u044B\u0445\u043E\u0434 \u0432 \u043F\u043E\u043B\u0443\u0444\u0438\u043D\u0430\u043B \u043F\u043B\u0435\u0439-\u043E\u0444\u0444",
        description: "\u0422\u043E\u043F-4 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0433\u043E \u0441\u0435\u0437\u043E\u043D\u0430 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 \u0441\u0442\u0430\u0434\u0438\u044E \u043F\u043B\u0435\u0439-\u043E\u0444\u0444 \u0437\u0430 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0441\u043A\u0438\u0439 \u0442\u0438\u0442\u0443\u043B."
      },
      {
        posFrom: 5,
        posTo: 8,
        zone: "playoff",
        title: "\u041A\u0432\u0430\u043B\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444",
        description: "\u0421\u0442\u044B\u043A\u043E\u0432\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u0437\u0430 \u043F\u0443\u0442\u0435\u0432\u043A\u0438 \u0432 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044C\u0444\u0438\u043D\u0430\u043B MFL."
      },
      {
        posFrom: 9,
        posTo: 16,
        zone: "neutral",
        title: "\u0412\u043D\u0435 \u0437\u043E\u043D\u044B \u043F\u043B\u0435\u0439-\u043E\u0444\u0444",
        description: "\u041A\u043E\u043C\u0430\u043D\u0434\u044B \u0437\u0430\u0432\u0435\u0440\u0448\u0430\u044E\u0442 \u0431\u043E\u0440\u044C\u0431\u0443 \u0432 \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u043C \u0441\u0435\u0437\u043E\u043D\u0435."
      }
    ],
    rulesSummary: [
      "\u041C\u0435\u0434\u0438\u0439\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0441 \u0447\u0438\u0441\u0442\u043E \u0438\u0433\u0440\u043E\u0432\u044B\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C, \u043A\u0440\u0430\u0441\u043D\u044B\u043C\u0438 \u043C\u044F\u0447\u0430\u043C\u0438 \u0438 \u0431\u0443\u043B\u043B\u0438\u0442\u0430\u043B\u0438\u0442\u0438.",
      "\u0422\u043E\u043F-4 \u0432\u044B\u0445\u043E\u0434\u044F\u0442 \u0432 1/2 \u0444\u0438\u043D\u0430\u043B\u0430 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444.",
      "5\u20138 \u043C\u0435\u0441\u0442\u0430 \u0438\u0433\u0440\u0430\u044E\u0442 \u0441\u0442\u044B\u043A\u043E\u0432\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u0437\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044C\u0444\u0438\u043D\u0430\u043B\u044B."
    ]
  }
};
function getTeamZoneClass(compId, pos, totalTeams) {
  const compKey = compId.startsWith("2lb_") ? "2lb" : compId;
  const reg = LEAGUE_REGULATIONS[compKey];
  if (!reg) return { zoneClass: "" };
  for (const z of reg.zones) {
    const maxPos = z.posTo > totalTeams ? totalTeams : z.posTo;
    if (pos >= z.posFrom && pos <= maxPos) {
      if (z.zone === "gold") return { zoneClass: "zone-gold", badgeLabel: "\u0417\u043E\u043B\u043E\u0442\u043E", tooltip: z.title };
      if (z.zone === "top") return { zoneClass: "zone-top", badgeLabel: "\u0412\u044B\u0445\u043E\u0434", tooltip: z.title };
      if (z.zone === "playoff") return { zoneClass: "zone-playoff", badgeLabel: "\u0421\u0442\u044B\u043A\u0438", tooltip: z.title };
      if (z.zone === "bad") return { zoneClass: "zone-bad", badgeLabel: "\u0412\u044B\u043B\u0435\u0442", tooltip: z.title };
      return { zoneClass: "" };
    }
  }
  if (compKey === "2lb" && pos >= totalTeams) {
    return { zoneClass: "zone-bad", badgeLabel: "\u0412\u044B\u043B\u0435\u0442", tooltip: "\u0417\u043E\u043D\u0430 \u0432\u044B\u043B\u0435\u0442\u0430 \u0432 \u0422\u0440\u0435\u0442\u044C\u044E \u043B\u0438\u0433\u0443" };
  }
  return { zoneClass: "" };
}
var EAEU_COUNTRIES = /* @__PURE__ */ new Set([
  "\u0431\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u044F",
  "\u0431\u0435\u043B\u0430\u0440\u0443\u0441\u044C",
  "belarus",
  "\u043A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D",
  "kazakhstan",
  "\u0430\u0440\u043C\u0435\u043D\u0438\u044F",
  "armenia",
  "\u043A\u0438\u0440\u0433\u0438\u0437\u0438\u044F",
  "\u043A\u044B\u0440\u0433\u044B\u0437\u0441\u0442\u0430\u043D",
  "kyrgyzstan"
]);
function getRplLegionLimit(seasonStr) {
  const s = String(seasonStr || "2026/27");
  if (s.includes("2028") || s === "2028/29") return { inSquad: 10, onPitch: 5, label: "10+5" };
  if (s.includes("2027") || s === "2027/28") return { inSquad: 11, onPitch: 6, label: "11+6" };
  return { inSquad: 12, onPitch: 7, label: "12+7" };
}
function isLegionnaire(p) {
  if (!p) return false;
  const hasOtherCap = p.playedForOtherNationalTeam || p.otherNationalTeam && String(p.otherNationalTeam).trim().toLowerCase() !== "\u0440\u043E\u0441\u0441\u0438\u044F" || p.nationalTeam && String(p.nationalTeam).trim().toLowerCase() !== "\u0440\u043E\u0441\u0441\u0438\u044F";
  if (hasOtherCap) return true;
  const rawNat = String(p.nation || p.nationality || p.country || "\u0420\u043E\u0441\u0441\u0438\u044F").trim().toLowerCase();
  if (rawNat === "\u0440\u043E\u0441\u0441\u0438\u044F" || rawNat === "\u0440\u0444" || rawNat === "russia") return false;
  if (EAEU_COUNTRIES.has(rawNat)) return false;
  return true;
}
function getLegionnaireStatus(p) {
  if (!p) return { isLegionnaire: false, label: "\u2014", tagClass: "rus", details: "" };
  const rawNat = String(p.nation || p.nationality || p.country || "\u0420\u043E\u0441\u0441\u0438\u044F").trim();
  const natNorm = rawNat.toLowerCase();
  const hasOtherCap = p.playedForOtherNationalTeam || p.otherNationalTeam && String(p.otherNationalTeam).trim().toLowerCase() !== "\u0440\u043E\u0441\u0441\u0438\u044F" || p.nationalTeam && String(p.nationalTeam).trim().toLowerCase() !== "\u0440\u043E\u0441\u0441\u0438\u044F";
  const otherName = p.otherNationalTeam || p.nationalTeam || "\u0434\u0440\u0443\u0433\u0430\u044F \u0441\u0431\u043E\u0440\u043D\u0430\u044F";
  if (hasOtherCap && (natNorm === "\u0440\u043E\u0441\u0441\u0438\u044F" || natNorm === "\u0440\u0444" || natNorm === "russia")) {
    return {
      isLegionnaire: true,
      label: "\u041B\u0435\u0433\u0438\u043E\u043D\u0435\u0440 (\u0437\u0430\u0438\u0433\u0440\u0430\u043D)",
      tagClass: "legion",
      details: `\u041F\u0430\u0441\u043F\u043E\u0440\u0442 \u0420\u0424, \u043D\u043E \u0437\u0430\u0438\u0433\u0440\u0430\u043D \u0437\u0430 \u0441\u0431\u043E\u0440\u043D\u0443\u044E ${otherName} \u2014 \u043F\u043E \u0440\u0435\u0433\u043B\u0430\u043C\u0435\u043D\u0442\u0443 \u0420\u041F\u041B \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440`
    };
  }
  if (natNorm === "\u0440\u043E\u0441\u0441\u0438\u044F" || natNorm === "\u0440\u0444" || natNorm === "russia") {
    return {
      isLegionnaire: false,
      label: "\u0420\u0424 (\u043D\u0435 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440)",
      tagClass: "rus",
      details: "\u0413\u0440\u0430\u0436\u0434\u0430\u043D\u0438\u043D \u0420\u0424, \u043D\u0435 \u0437\u0430\u0438\u0433\u0440\u0430\u043D \u0437\u0430 \u0434\u0440\u0443\u0433\u0438\u0435 \u0441\u0431\u043E\u0440\u043D\u044B\u0435"
    };
  }
  if (EAEU_COUNTRIES.has(natNorm)) {
    return {
      isLegionnaire: false,
      label: `${rawNat} (\u0415\u0410\u042D\u0421)`,
      tagClass: "eaeu",
      details: "\u0413\u0440\u0430\u0436\u0434\u0430\u043D\u0435 \u0441\u0442\u0440\u0430\u043D \u0415\u0410\u042D\u0421 (\u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u044F, \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D, \u0410\u0440\u043C\u0435\u043D\u0438\u044F, \u041A\u0438\u0440\u0433\u0438\u0437\u0438\u044F) \u043F\u043E\u0434 \u043B\u0438\u043C\u0438\u0442 \u043D\u0435 \u043F\u043E\u0434\u043F\u0430\u0434\u0430\u044E\u0442"
    };
  }
  return {
    isLegionnaire: true,
    label: `${rawNat} (\u041B\u0435\u0433\u0438\u043E\u043D\u0435\u0440)`,
    tagClass: "legion",
    details: "\u0418\u043D\u043E\u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0439 \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0438\u043D \u2014 \u043F\u043E\u0434\u043F\u0430\u0434\u0430\u0435\u0442 \u043F\u043E\u0434 \u043B\u0438\u043C\u0438\u0442 \u043D\u0430 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432 \u0432 \u0420\u041F\u041B"
  };
}

// src/coaches.ts
var COACH_STYLES_INFO = {
  bus: {
    title: "\xAB\u0410\u0432\u0442\u043E\u0431\u0443\u0441\xBB (\u0413\u043B\u0443\u0445\u0430\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0430 \u0438 \u043D\u0438\u0437\u043A\u0438\u0439 \u0431\u043B\u043E\u043A)",
    desc: "\u041F\u0440\u0435\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0443 \u0441\u0432\u043E\u0435\u0439 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439, \u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0430 \u0441\u0443\u0445\u0438\u0435 \u043C\u0430\u0442\u0447\u0438, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u043C\u0438\u043D\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044E \u043E\u0448\u0438\u0431\u043E\u043A.",
    favoredFormations: ["5-3-2", "5-4-1", "4-5-1", "4-4-2"]
  },
  counter: {
    title: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A\u0438",
    desc: "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0430\u044F \u0441\u0440\u0435\u0434\u043D\u044F\u044F \u043B\u0438\u043D\u0438\u044F, \u043F\u0435\u0440\u0435\u0445\u0432\u0430\u0442\u044B \u043C\u044F\u0447\u0430 \u0438 \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u044B\u0435 \u043A\u0438\u043D\u0436\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u044B\u043F\u0430\u0434\u044B \u0447\u0435\u0440\u0435\u0437 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u044B\u0445 \u0432\u0438\u043D\u0433\u0435\u0440\u043E\u0432.",
    favoredFormations: ["4-3-3", "3-5-2", "4-2-3-1", "4-4-2"]
  },
  possession: {
    title: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430 \u0438 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u0438\u0433\u0440\u0430",
    desc: "\u0414\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0432\u043E \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0438, \u043C\u0435\u0442\u043E\u0434\u0438\u0447\u043D\u043E\u0435 \u0440\u0430\u0441\u0448\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u0435 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u043C \u043F\u0430\u0441\u043E\u043C \u0438 \u0442\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430\u043C\u0438.",
    favoredFormations: ["4-3-3", "4-2-3-1", "3-4-3", "4-1-4-1"]
  },
  attack: {
    title: "\u0422\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B",
    desc: "\u0412\u044B\u0441\u043E\u0447\u0430\u0439\u0448\u0438\u0439 \u0442\u0435\u043C\u043F, \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A\u0440\u0430\u0439\u043D\u0438\u0445 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u043E\u0432, \u043C\u0430\u0441\u0441\u0430 \u0443\u0434\u0430\u0440\u043E\u0432 \u043F\u043E \u0432\u043E\u0440\u043E\u0442\u0430\u043C \u0438 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 xG.",
    favoredFormations: ["4-3-3", "3-4-3", "4-2-4", "4-2-3-1"]
  },
  press: {
    title: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433",
    desc: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0431\u043E\u0440 \u043D\u0430 \u0447\u0443\u0436\u043E\u0439 \u0442\u0440\u0435\u0442\u0438 \u043F\u043E\u043B\u044F, \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E\u0435 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u043E\u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430.",
    favoredFormations: ["4-3-3", "4-2-3-1", "3-5-2", "4-4-2"]
  }
};
var DEFAULT_COACHES = {
  // РПЛ
  "\u0437\u0435\u043D\u0438\u0442": {
    id: "semak",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0421\u0435\u043C\u0430\u043A",
    clubName: "\u0417\u0435\u043D\u0438\u0442",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 50,
    style: "possession",
    styleTitle: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430 \u0438 \u0434\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
    styleDesc: "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0441 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435\u043C \u0442\u0435\u043C\u043F\u0430 \u0438 \u0438\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u044B\u043C \u043A\u043B\u0430\u0441\u0441\u043E\u043C \u043B\u0438\u0434\u0435\u0440\u043E\u0432.",
    favoriteFormation: "4-3-3",
    reputation: 92,
    temperament: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439, \u0440\u0430\u0441\u0441\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u0430\u0433\u043C\u0430\u0442\u0438\u043A",
    quote: "\xAB\u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 \u0431\u0430\u043B\u0430\u043D\u0441 \u043C\u0435\u0436\u0434\u0443 \u0430\u0442\u0430\u043A\u043E\u0439 \u0438 \u043E\u0431\u043E\u0440\u043E\u043D\u043E\u0439, \u0432 \u043A\u0430\u0436\u0434\u043E\u043C \u043C\u0430\u0442\u0447\u0435 \u043D\u0443\u0436\u043D\u043E \u0438\u0433\u0440\u0430\u0442\u044C \u0441 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0441\u0438\u043B\u044B\xBB."
  },
  "\u043A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440": {
    id: "musaev",
    name: "\u041C\u0443\u0440\u0430\u0434 \u041C\u0443\u0441\u0430\u0435\u0432",
    clubName: "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 43,
    style: "attack",
    styleTitle: "\u0414\u043E\u043C\u0438\u043D\u0438\u0440\u0443\u044E\u0449\u0430\u044F \u044D\u0441\u0442\u0435\u0442\u0438\u0447\u043D\u0430\u044F \u0430\u0442\u0430\u043A\u0430",
    styleDesc: "\u041A\u0440\u0430\u0441\u0438\u0432\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0413\u0430\u043B\u0438\u0446\u043A\u043E\u0433\u043E \u2014 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0432\u044B\u0445\u043E\u0434 \u0438\u0437 \u043E\u0431\u043E\u0440\u043E\u043D\u044B, \u0443\u043C\u043D\u044B\u0439 \u043F\u0430\u0441 \u0438 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435.",
    favoriteFormation: "4-3-3",
    reputation: 86,
    temperament: "\u042D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439, \u043D\u0430\u0446\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043D\u0430 \u0430\u0442\u0430\u043A\u0443 \u0440\u043E\u043C\u0430\u043D\u0442\u0438\u043A",
    quote: "\xAB\u041C\u044B \u0438\u0433\u0440\u0430\u0435\u043C \u0434\u043B\u044F \u0437\u0440\u0438\u0442\u0435\u043B\u0435\u0439 \u2014 \u0444\u0443\u0442\u0431\u043E\u043B \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u044F\u0440\u043A\u0438\u043C, \u0441\u043C\u0435\u043B\u044B\u043C \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0438\u0432\u043D\u044B\u043C\xBB."
  },
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432": {
    id: "galaktionov",
    name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0413\u0430\u043B\u0430\u043A\u0442\u0438\u043E\u043D\u043E\u0432",
    clubName: "\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 42,
    style: "press",
    styleTitle: "\u041C\u043E\u043B\u043E\u0434\u0451\u0436\u043D\u044B\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433",
    styleDesc: "\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C, \u0434\u043E\u0432\u0435\u0440\u0438\u0435 \u043C\u043E\u043B\u043E\u0434\u044B\u043C \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u043C \u0442\u0430\u043B\u0430\u043D\u0442\u0430\u043C, \u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0430 \u0438 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F.",
    favoriteFormation: "4-2-3-1",
    reputation: 85,
    temperament: "\u042D\u043D\u0435\u0440\u0433\u0438\u0447\u043D\u044B\u0439 \u043C\u0435\u0442\u043E\u0434\u0438\u0441\u0442-\u043C\u043E\u0442\u0438\u0432\u0430\u0442\u043E\u0440",
    quote: "\xAB\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430, \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0438 \u0441\u0430\u043C\u043E\u043E\u0442\u0434\u0430\u0447\u0430 \u2014 \u043C\u043E\u043B\u043E\u0434\u044B\u0435 \u043F\u0430\u0440\u043D\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u0435\u0436\u0430\u0442\u044C \u0432\u043F\u0435\u0440\u0451\u0434 \u0432\u0441\u0435 90 \u043C\u0438\u043D\u0443\u0442\xBB."
  },
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A": {
    id: "stankovic",
    name: "\u0414\u0435\u044F\u043D \u0421\u0442\u0430\u043D\u043A\u043E\u0432\u0438\u0447",
    clubName: "\u0421\u043F\u0430\u0440\u0442\u0430\u043A",
    nationality: "\u0421\u0435\u0440\u0431\u0438\u044F",
    age: 48,
    style: "attack",
    styleTitle: "\u0421\u0442\u0440\u0430\u0441\u0442\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0430\u0442\u0430\u043A\u0430",
    styleDesc: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439, \u043D\u0430\u043F\u043E\u0440\u0438\u0441\u0442\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0441 \u0432\u044B\u0441\u043E\u043A\u0438\u043C \u0438\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433\u043E\u043C \u0438 \u0437\u0430\u0440\u044F\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E \u043D\u0430 \u0431\u043E\u0440\u044C\u0431\u0443.",
    favoriteFormation: "4-3-3",
    reputation: 88,
    temperament: "\u0411\u0443\u0440\u043D\u044B\u0439 \u043B\u0438\u0434\u0435\u0440 \u0441 \u043C\u0435\u043D\u0442\u0430\u043B\u0438\u0442\u0435\u0442\u043E\u043C \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044F",
    quote: '\xAB\u0412 "\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u0435" \u043D\u0443\u0436\u043D\u043E \u043E\u0442\u0434\u0430\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0434\u0446\u0435 \u043D\u0430 \u043F\u043E\u043B\u0435. \u041D\u0438 \u0448\u0430\u0433\u0443 \u043D\u0430\u0437\u0430\u0434, \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0431\u0435\u0434\u0430!\xBB.'
  },
  "\u0446\u0441\u043A\u0430": {
    id: "nikolic",
    name: "\u041C\u0430\u0440\u043A\u043E \u041D\u0438\u043A\u043E\u043B\u0438\u0447",
    clubName: "\u0426\u0421\u041A\u0410",
    nationality: "\u0421\u0435\u0440\u0431\u0438\u044F",
    age: 47,
    style: "counter",
    styleTitle: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043F\u0440\u0430\u0433\u043C\u0430\u0442\u0438\u0447\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440-\u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0441\u0442\u0438\u043B\u044C",
    styleDesc: "\u041F\u043B\u043E\u0442\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438 \u043E\u0431\u043E\u0440\u043E\u043D\u044B, \u043E\u0442\u0442\u043E\u0447\u0435\u043D\u043D\u044B\u0435 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0432 \u0430\u0442\u0430\u043A\u0443.",
    favoriteFormation: "3-5-2",
    reputation: 87,
    temperament: "\u0425\u043E\u043B\u043E\u0434\u043D\u043E\u043A\u0440\u043E\u0432\u043D\u044B\u0439 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A",
    quote: "\xAB\u0422\u0440\u043E\u0444\u0435\u0438 \u0432\u044B\u0438\u0433\u0440\u044B\u0432\u0430\u0435\u0442 \u043E\u0431\u043E\u0440\u043E\u043D\u0430 \u0438 \u0436\u0435\u043B\u0435\u0437\u043D\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u043D\u0430 \u043A\u0430\u0436\u0434\u043E\u043C \u0443\u0447\u0430\u0441\u0442\u043A\u0435 \u0433\u0430\u0437\u043E\u043D\u0430\xBB."
  },
  "\u0434\u0438\u043D\u0430\u043C\u043E": {
    id: "lichka",
    name: "\u041C\u0430\u0440\u0446\u0435\u043B \u041B\u0438\u0447\u043A\u0430",
    clubName: "\u0414\u0438\u043D\u0430\u043C\u043E",
    nationality: "\u0427\u0435\u0445\u0438\u044F",
    age: 49,
    style: "attack",
    styleTitle: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0431\u0435\u0441\u0448\u0430\u0431\u0430\u0448\u043D\u044B\u0439 \u0442\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B",
    styleDesc: "\u0410\u0442\u0430\u043A\u0430 \u0431\u0435\u0437 \u043E\u0433\u043B\u044F\u0434\u043A\u0438 \u043D\u0430 \u0441\u0432\u043E\u0438 \u0432\u043E\u0440\u043E\u0442\u0430, \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F, \u0438\u0437\u043E\u0431\u0438\u043B\u0438\u0435 \u0433\u043E\u043B\u0435\u0432\u044B\u0445 \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u0432 \u0438 \u0440\u0438\u0441\u043A.",
    favoriteFormation: "4-3-3",
    reputation: 85,
    temperament: "\u0418\u0441\u043A\u0440\u0435\u043D\u043D\u0438\u0439, \u0441\u043C\u0435\u043B\u044B\u0439 \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0434\u0443\u0448\u0435\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440",
    quote: "\xAB\u041B\u0443\u0447\u0448\u0435 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u044C 4:3, \u0447\u0435\u043C \u0442\u043E\u0441\u043A\u043B\u0438\u0432\u043E \u0441\u044B\u0433\u0440\u0430\u0442\u044C 0:0. \u0424\u0443\u0442\u0431\u043E\u043B \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u0440\u0430\u0434\u0438 \u0437\u0430\u0431\u0438\u0442\u044B\u0445 \u043C\u044F\u0447\u0435\u0439!\xBB."
  },
  "\u0440\u043E\u0441\u0442\u043E\u0432": {
    id: "karpin",
    name: "\u0412\u0430\u043B\u0435\u0440\u0438\u0439 \u041A\u0430\u0440\u043F\u0438\u043D",
    clubName: "\u0420\u043E\u0441\u0442\u043E\u0432",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 57,
    style: "press",
    styleTitle: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0438 \u0432\u044B\u0445\u043E\u0434 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043F\u0430\u0441",
    styleDesc: "\u0420\u043E\u0437\u044B\u0433\u0440\u044B\u0448 \u043E\u0442 \u0441\u0432\u043E\u0438\u0445 \u0432\u043E\u0440\u043E\u0442 \u043B\u044E\u0431\u043E\u0439 \u0446\u0435\u043D\u043E\u0439, \u0443\u0434\u0443\u0448\u0430\u044E\u0449\u0438\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u043D\u0430 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430.",
    favoriteFormation: "4-3-3",
    reputation: 89,
    temperament: "\u0425\u0430\u0440\u0438\u0437\u043C\u0430\u0442\u0438\u0447\u043D\u044B\u0439, \u0440\u0435\u0437\u043A\u0438\u0439 \u0438 \u0431\u0435\u0441\u043A\u043E\u043C\u043F\u0440\u043E\u043C\u0438\u0441\u0441\u043D\u044B\u0439",
    quote: "\xAB\u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u0432 \u0444\u0443\u0442\u0431\u043E\u043B, \u0430 \u043D\u0435 \u0431\u0435\u0439\u0442\u0435 \u043C\u044F\u0447 \u043A\u0443\u0434\u0430 \u043F\u043E\u043F\u0430\u043B\u043E! \u041E\u0448\u0438\u0431\u0441\u044F \u2014 \u0438\u0441\u043F\u0440\u0430\u0432\u044C \u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439 \u0438\u0433\u0440\u0430\u0442\u044C\xBB."
  },
  "\u0440\u0443\u0431\u0438\u043D": {
    id: "rakhimov",
    name: "\u0420\u0430\u0448\u0438\u0434 \u0420\u0430\u0445\u0438\u043C\u043E\u0432",
    clubName: "\u0420\u0443\u0431\u0438\u043D",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 61,
    style: "bus",
    styleTitle: "\u041A\u0430\u0437\u0430\u043D\u0441\u043A\u0438\u0439 \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0431\u0430\u0441\u0442\u0438\u043E\u043D",
    styleDesc: "\u042D\u0448\u0435\u043B\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0430, \u043F\u043B\u043E\u0442\u043D\u0430\u044F \u043E\u043F\u0435\u043A\u0430, \u0441\u0438\u043B\u043E\u0432\u0430\u044F \u0431\u043E\u0440\u044C\u0431\u0430 \u0438 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432.",
    favoriteFormation: "5-3-2",
    reputation: 83,
    temperament: "\u0421\u0442\u0440\u043E\u0433\u0438\u0439 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0434\u0438\u043A\u0442\u0430\u0442\u043E\u0440",
    quote: "\xAB\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u043A\u0440\u043E\u0435\u043C \u0441\u0432\u043E\u0438 \u0432\u043E\u0440\u043E\u0442\u0430 \u043D\u0430 \u0437\u0430\u043C\u043E\u043A, \u0430 \u0432\u043F\u0435\u0440\u0435\u0434\u0438 \u0441\u0432\u043E\u0439 \u0448\u0430\u043D\u0441 \u043C\u044B \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u043D\u0430\u0439\u0434\u0451\u043C\xBB."
  },
  "\u0430\u0445\u043C\u0430\u0442": {
    id: "tashuev",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0422\u0430\u0448\u0443\u0435\u0432",
    clubName: "\u0410\u0445\u043C\u0430\u0442",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 67,
    style: "press",
    styleTitle: "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u0441\u0438\u043B\u043E\u0432\u043E\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433",
    styleDesc: "\u0416\u0435\u0441\u0442\u043A\u0438\u0435 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0430, \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u0432 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u0437\u043E\u043D\u044B \u0438 \u043C\u043E\u0449\u043D\u043E\u0435 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435.",
    favoriteFormation: "4-2-3-1",
    reputation: 81,
    temperament: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0441\u0442\u0430\u0440\u043E\u0439 \u0437\u0430\u043A\u0430\u043B\u043A\u0438",
    quote: "\xAB\u041D\u0430\u043C \u043D\u0443\u0436\u043D\u0430 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0430. \u0424\u0443\u0442\u0431\u043E\u043B \u043D\u0435 \u043F\u0440\u043E\u0449\u0430\u0435\u0442 \u043C\u044F\u0433\u043A\u043E\u0441\u0442\u0438\xBB."
  },
  "\u043A\u0440\u044B\u043B\u044C\u044F \u0441\u043E\u0432\u0435\u0442\u043E\u0432": {
    id: "osinkin",
    name: "\u0418\u0433\u043E\u0440\u044C \u041E\u0441\u0438\u043D\u044C\u043A\u0438\u043D",
    clubName: "\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 60,
    style: "possession",
    styleTitle: "\u0423\u043C\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B",
    styleDesc: "\u0422\u043E\u043D\u043A\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u043F\u0430\u0441, \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u043C\u043E\u043B\u043E\u0434\u044B\u0445 \u0442\u0430\u043B\u0430\u043D\u0442\u043E\u0432, \u0443\u043C\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u044F \u043C\u0435\u0436\u0434\u0443 \u043B\u0438\u043D\u0438\u044F\u043C\u0438.",
    favoriteFormation: "4-2-3-1",
    reputation: 84,
    temperament: "\u041C\u0443\u0434\u0440\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u0443\u0447\u0438\u0442\u0435\u043B\u044C \u0438 \u0442\u0430\u043A\u0442\u0438\u043A",
    quote: "\xAB\u041C\u044F\u0447 \u0434\u0432\u0438\u0433\u0430\u0435\u0442\u0441\u044F \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430. \u041D\u0430\u0443\u0447\u0438\u0442\u0435\u0441\u044C \u043C\u044B\u0441\u043B\u0438\u0442\u044C \u043D\u0430 \u0448\u0430\u0433 \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430\xBB."
  },
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430": {
    id: "talalaev",
    name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u0422\u0430\u043B\u0430\u043B\u0430\u0435\u0432",
    clubName: "\u0411\u0430\u043B\u0442\u0438\u043A\u0430",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 53,
    style: "press",
    styleTitle: "\u0422\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0438 \u0431\u0435\u0448\u0435\u043D\u0430\u044F \u0441\u0430\u043C\u043E\u043E\u0442\u0434\u0430\u0447\u0430",
    styleDesc: "\u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043C\u043E\u0449\u044C, \u0430\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0431\u043E\u0440 \u043C\u044F\u0447\u0430, \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u043B\u0438\u043D\u0438\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0438 \u0441\u0442\u0440\u0435\u043C\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0444\u043B\u0430\u043D\u0433\u0438.",
    favoriteFormation: "4-3-3",
    reputation: 84,
    temperament: "\u0412\u0437\u0440\u044B\u0432\u043D\u043E\u0439 \u043C\u043E\u0442\u0438\u0432\u0430\u0442\u043E\u0440 \u0441 \u0436\u0435\u043B\u0435\u0437\u043D\u044B\u043C\u0438 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F\u043C\u0438",
    quote: "\xAB\u0415\u0441\u043B\u0438 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A \u0432\u043B\u0430\u0434\u0435\u0435\u0442 \u043C\u044F\u0447\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u0442\u0440\u0451\u0445 \u0441\u0435\u043A\u0443\u043D\u0434 \u2014 \u043C\u044B \u043D\u0435\u0434\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u0438. \u041F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0434\u043E \u0441\u0432\u0438\u0441\u0442\u043A\u0430!\xBB."
  },
  "\u043E\u0440\u0435\u043D\u0431\u0443\u0440\u0433": {
    id: "deogracia",
    name: "\u0414\u0430\u0432\u0438\u0434 \u0414\u0435\u043E\u0433\u0440\u0430\u0441\u0438\u044F",
    clubName: "\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433",
    nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F",
    age: 52,
    style: "possession",
    styleTitle: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C",
    styleDesc: "\u0422\u0435\u0445\u043D\u0438\u0447\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B, \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0441\u0442\u0435\u043D\u043A\u0438, \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0438\u043D\u0441\u0430\u0439\u0434\u043E\u0432 \u0438 \u0440\u043E\u0437\u044B\u0433\u0440\u044B\u0448 \u043B\u0438\u0448\u043D\u0435\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430.",
    favoriteFormation: "4-3-3",
    reputation: 79,
    temperament: "\u0422\u0430\u043A\u0442\u0438\u0447\u043D\u044B\u0439 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u0439 \u043C\u0435\u0442\u043E\u0434\u0438\u0441\u0442",
    quote: "\xAB\u0412\u043B\u0430\u0434\u0435\u044F \u043C\u044F\u0447\u043E\u043C, \u043C\u044B \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0435\u043C \u0445\u043E\u0434 \u0438\u0433\u0440\u044B \u0438 \u0441\u043D\u0438\u0436\u0430\u0435\u043C \u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0443 \u0441\u0432\u043E\u0438\u0445 \u0432\u043E\u0440\u043E\u0442\xBB."
  },
  "\u0430\u043A\u0440\u043E\u043D": {
    id: "tedeev",
    name: "\u0417\u0430\u0443\u0440 \u0422\u0435\u0434\u0435\u0435\u0432",
    clubName: "\u0410\u043A\u0440\u043E\u043D",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 44,
    style: "attack",
    styleTitle: "\u0414\u0435\u0440\u0437\u043A\u0438\u0439 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0431\u0435\u0437 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442\u043E\u0432",
    styleDesc: "\u0421\u043C\u0435\u043B\u0430\u044F \u0438\u0433\u0440\u0430 \u043F\u0435\u0440\u0432\u044B\u043C \u043D\u043E\u043C\u0435\u0440\u043E\u043C, \u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0430 \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432 (\u0414\u0437\u044E\u0431\u0430) \u0438 \u0444\u043B\u0430\u043D\u0433\u043E\u0432\u044B\u0435 \u043F\u043E\u0434\u0430\u0447\u0438.",
    favoriteFormation: "4-3-3",
    reputation: 80,
    temperament: "\u0421\u043C\u0435\u043B\u044B\u0439, \u0430\u043C\u0431\u0438\u0446\u0438\u043E\u0437\u043D\u044B\u0439 \u043D\u043E\u0432\u0430\u0442\u043E\u0440",
    quote: "\xAB\u041D\u0435\u0432\u0430\u0436\u043D\u043E, \u043A\u0442\u043E \u043F\u0440\u043E\u0442\u0438\u0432 \u043D\u0430\u0441 \u2014 \u043C\u044B \u043F\u0440\u0438\u0435\u0445\u0430\u043B\u0438 \u0438\u0433\u0440\u0430\u0442\u044C \u0432 \u0444\u0443\u0442\u0431\u043E\u043B \u0438 \u0437\u0430\u0431\u0438\u0432\u0430\u0442\u044C \u0433\u043E\u043B\u044B\xBB."
  },
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430": {
    id: "bidzhiev",
    name: "\u0425\u0430\u0441\u0430\u043D\u0431\u0438 \u0411\u0438\u0434\u0436\u0438\u0435\u0432",
    clubName: "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 59,
    style: "bus",
    styleTitle: "\u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043D\u0441\u043A\u0438\u0439 \u043C\u043E\u043D\u043E\u043B\u0438\u0442\u043D\u044B\u0439 \u0436\u0435\u043B\u0435\u0437\u043E\u0431\u0435\u0442\u043E\u043D",
    styleDesc: "\u041D\u0435\u043F\u0440\u043E\u0445\u043E\u0434\u0438\u043C\u044B\u0439 \u043D\u0438\u0437\u043A\u0438\u0439 \u0431\u043B\u043E\u043A, \u0441\u0430\u043C\u043E\u043E\u0442\u0432\u0435\u0440\u0436\u0435\u043D\u043D\u044B\u0435 \u043F\u043E\u0434\u043A\u0430\u0442\u044B, \u0436\u0435\u0441\u0442\u043A\u0438\u0439 \u043E\u0442\u0431\u043E\u0440 \u0438 \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0445 \u043C\u044F\u0447\u0435\u0439.",
    favoriteFormation: "5-3-2",
    reputation: 81,
    temperament: "\u041D\u0435\u0432\u043E\u0437\u043C\u0443\u0442\u0438\u043C\u044B\u0439 \u043A\u0430\u0432\u043A\u0430\u0437\u0441\u043A\u0438\u0439 \u0441\u0442\u0440\u0430\u0442\u0435\u0433",
    quote: "\xAB\u0421\u043B\u043E\u043C\u0430\u0442\u044C \u043D\u0430\u0448 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E. \u041A\u0430\u0436\u0434\u044B\u0439 \u043C\u0435\u0442\u0440 \u043F\u043E\u043B\u044F \u0431\u0443\u0434\u0435\u0442 \u0441\u0442\u043E\u0438\u0442\u044C \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0443 \u043A\u0440\u043E\u0432\u0438\xBB."
  },
  "\u0444\u0430\u043A\u0435\u043B": {
    id: "pyatibratov",
    name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041F\u044F\u0442\u0438\u0431\u0440\u0430\u0442\u043E\u0432",
    clubName: "\u0424\u0430\u043A\u0435\u043B",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 49,
    style: "bus",
    styleTitle: "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u0432\u043E\u0440\u043E\u043D\u0435\u0436\u0441\u043A\u0438\u0439 \u0431\u043E\u0439\u0446\u043E\u0432\u0441\u043A\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B",
    styleDesc: "\u0421\u0438\u043B\u043E\u0432\u0430\u044F \u0431\u043E\u0440\u044C\u0431\u0430, \u0432\u044B\u0433\u0440\u044B\u0437\u0430\u043D\u0438\u0435 \u043C\u044F\u0447\u0430, \u0432\u0435\u0440\u0445\u043E\u0432\u044B\u0435 \u0434\u0443\u044D\u043B\u0438 \u0438 \u0431\u0435\u0448\u0435\u043D\u0430\u044F \u044D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u043A\u0430 \u0432\u043E\u0440\u043E\u043D\u0435\u0436\u0441\u043A\u0438\u0445 \u0442\u0440\u0438\u0431\u0443\u043D.",
    favoriteFormation: "5-3-2",
    reputation: 80,
    temperament: "\u0421\u0442\u0440\u0430\u0441\u0442\u043D\u044B\u0439 \u043D\u0430\u0440\u043E\u0434\u043D\u044B\u0439 \u0431\u043E\u0435\u0446",
    quote: "\xAB\u0412 \u0412\u043E\u0440\u043E\u043D\u0435\u0436\u0435 \u043D\u0438\u043A\u043E\u043C\u0443 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043B\u0435\u0433\u043A\u043E. \u041C\u044B \u0432\u044B\u0445\u043E\u0434\u0438\u043C \u0441\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0437\u0430 \u043D\u0430\u0448 \u0433\u043E\u0440\u043E\u0434 \u0438 \u0431\u043E\u043B\u0435\u043B\u044C\u0449\u0438\u043A\u043E\u0432\xBB."
  },
  "\u0440\u043E\u0434\u0438\u043D\u0430": {
    id: "sokolinskiy",
    name: "\u0424\u0438\u043B\u0438\u043F\u043F \u0421\u043E\u043A\u043E\u043B\u0438\u043D\u0441\u043A\u0438\u0439",
    clubName: "\u0420\u043E\u0434\u0438\u043D\u0430",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 39,
    style: "possession",
    styleTitle: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B",
    styleDesc: "\u0422\u0435\u0445\u043D\u0438\u0447\u043D\u044B\u0435 \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u0438, \u043F\u043E\u0438\u0441\u043A \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0437\u043E\u043D, \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u0430\u0441 \u043D\u0438\u0437\u043E\u043C \u0438 \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E\u0441\u0442\u044C.",
    favoriteFormation: "4-3-3",
    reputation: 77,
    temperament: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u0442\u0430\u043A\u0442\u0438\u043A",
    quote: "\xAB\u0423\u043C\u043D\u043E\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0431\u0435\u0437 \u043C\u044F\u0447\u0430 \u0441\u043E\u0437\u0434\u0430\u0435\u0442 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E \u0434\u043B\u044F \u0433\u043E\u043B\u0435\u0432\u043E\u0433\u043E \u0443\u0434\u0430\u0440\u0430\xBB."
  },
  // Первая лига и Вторая лига (ключевые наставники)
  "\u0430\u0440\u0441\u0435\u043D\u0430\u043B": {
    id: "storozhuk",
    name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0421\u0442\u043E\u0440\u043E\u0436\u0443\u043A",
    clubName: "\u0410\u0440\u0441\u0435\u043D\u0430\u043B \u0422\u0443\u043B\u0430",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 44,
    style: "counter",
    styleTitle: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0442\u0443\u043B\u044C\u0441\u043A\u0438\u0435 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A\u0438",
    styleDesc: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0430 \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0440\u0430\u0437\u0433\u043E\u043D \u0430\u0442\u0430\u043A \u0447\u0435\u0440\u0435\u0437 \u0444\u043B\u0430\u043D\u0433\u0438.",
    favoriteFormation: "4-2-3-1",
    reputation: 79,
    temperament: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442",
    quote: "\xAB\u041A\u0430\u0436\u0434\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F \u0432 \u0433\u043E\u043B\u0435\u0432\u043E\u0439 \u043C\u043E\u043C\u0435\u043D\u0442\xBB."
  },
  "\u0442\u043E\u0440\u043F\u0435\u0434\u043E": {
    id: "kononov",
    name: "\u041E\u043B\u0435\u0433 \u041A\u043E\u043D\u043E\u043D\u043E\u0432",
    clubName: "\u0422\u043E\u0440\u043F\u0435\u0434\u043E \u041C\u043E\u0441\u043A\u0432\u0430",
    nationality: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C",
    age: 59,
    style: "possession",
    styleTitle: "\u0420\u043E\u043C\u0430\u043D\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0441\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0430\u0441",
    styleDesc: "\u0421\u0442\u0435\u043D\u043E\u0447\u043A\u0438, \u0437\u0430\u0431\u0435\u0433\u0430\u043D\u0438\u044F, \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430 \u0432 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u0440\u0435\u0442\u0438 \u043F\u043E\u043B\u044F.",
    favoriteFormation: "4-3-3",
    reputation: 81,
    temperament: "\u0418\u043D\u0442\u0435\u043B\u043B\u0438\u0433\u0435\u043D\u0442\u043D\u044B\u0439 \u0440\u043E\u043C\u0430\u043D\u0442\u0438\u043A \u0444\u0443\u0442\u0431\u043E\u043B\u0430",
    quote: "\xAB\u0424\u0443\u0442\u0431\u043E\u043B \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0440\u0438\u043D\u043E\u0441\u0438\u0442\u044C \u044D\u0441\u0442\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0443\u0434\u043E\u0432\u043E\u043B\u044C\u0441\u0442\u0432\u0438\u0435\xBB."
  },
  "\u0443\u0440\u0430\u043B": {
    id: "averianov",
    name: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0410\u0432\u0435\u0440\u044C\u044F\u043D\u043E\u0432",
    clubName: "\u0423\u0440\u0430\u043B",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 47,
    style: "press",
    styleTitle: "\u0423\u0440\u0430\u043B\u044C\u0441\u043A\u0438\u0439 \u0441\u0438\u043B\u043E\u0432\u043E\u0439 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440 \u0438 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433",
    styleDesc: "\u041F\u043B\u043E\u0442\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433, \u0444\u043B\u0430\u043D\u0433\u043E\u0432\u044B\u0435 \u043F\u043E\u0434\u0430\u0447\u0438, \u0441\u0438\u043B\u043E\u0432\u043E\u0435 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439.",
    favoriteFormation: "4-2-3-1",
    reputation: 77,
    temperament: "\u0423\u0440\u0430\u043B\u044C\u0441\u043A\u0438\u0439 \u0431\u043E\u0435\u0446 \u0438 \u0432\u043E\u0441\u043F\u0438\u0442\u0430\u043D\u043D\u0438\u043A \u043A\u043B\u0443\u0431\u0430",
    quote: "\xAB\u0423\u0440\u0430\u043B \u0432\u0441\u0435\u0433\u0434\u0430 \u0441\u043B\u0430\u0432\u0438\u043B\u0441\u044F \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u043E\u043C, \u043C\u044B \u0432\u0435\u0440\u043D\u0435\u043C\u0441\u044F \u0432 \u041F\u0440\u0435\u043C\u044C\u0435\u0440-\u041B\u0438\u0433\u0443\xBB."
  },
  "\u0441\u043E\u0447\u0438": {
    id: "moreno",
    name: "\u0420\u043E\u0431\u0435\u0440\u0442 \u041C\u043E\u0440\u0435\u043D\u043E",
    clubName: "\u0421\u043E\u0447\u0438",
    nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F",
    age: 48,
    style: "possession",
    styleTitle: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0430\u044F \u0442\u0438\u043A\u0438-\u0442\u0430\u043A\u0430 \u0438 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u043E\u0435 \u0434\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
    styleDesc: "\u0422\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430, \u0433\u0435\u043E\u043C\u0435\u0442\u0440\u0438\u044F \u043F\u0430\u0441\u0430, \u044D\u043A\u0441-\u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0418\u0441\u043F\u0430\u043D\u0438\u0438.",
    favoriteFormation: "4-3-3",
    reputation: 85,
    temperament: "\u041F\u0435\u0434\u0430\u043D\u0442\u0438\u0447\u043D\u044B\u0439 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u0439 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u043E\u0440 \u0442\u0430\u043A\u0442\u0438\u043A\u0438",
    quote: "\xAB\u0411\u0435\u0437 \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u044F \u043C\u044F\u0447\u043E\u043C \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\xBB."
  },
  "\u043F\u0430\u0440\u0438 \u043D\u043D": {
    id: "goncharenko",
    name: "\u0412\u0438\u043A\u0442\u043E\u0440 \u0413\u043E\u043D\u0447\u0430\u0440\u0435\u043D\u043A\u043E",
    clubName: "\u041F\u0430\u0440\u0438 \u041D\u041D",
    nationality: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C",
    age: 49,
    style: "counter",
    styleTitle: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0433\u0438\u0431\u043A\u043E\u0441\u0442\u044C \u0438 \u0440\u0435\u0437\u043A\u0438\u0435 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A\u0438",
    styleDesc: "\u0410\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F \u043F\u043E\u0434 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430, \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u043A \u0438 \u043A\u0438\u043D\u0436\u0430\u043B\u044C\u043D\u044B\u0435 \u043A\u043E\u043D\u0442\u0440\u0432\u044B\u043F\u0430\u0434\u044B.",
    favoriteFormation: "3-5-2",
    reputation: 84,
    temperament: "\u042D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043C\u0430\u0441\u0442\u0435\u0440",
    quote: "\xAB\u041D\u0443\u0436\u043D\u043E \u0443\u043C\u0435\u0442\u044C \u0442\u0435\u0440\u043F\u0435\u0442\u044C \u0438 \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u0437\u0430 \u043C\u0430\u043B\u0435\u0439\u0448\u0443\u044E \u0440\u0430\u0441\u0441\u043B\u0430\u0431\u043B\u0435\u043D\u043D\u043E\u0441\u0442\u044C\xBB."
  },
  "\u0440\u043E\u0442\u043E\u0440": {
    id: "boyarintsev",
    name: "\u0414\u0435\u043D\u0438\u0441 \u0411\u043E\u044F\u0440\u0438\u043D\u0446\u0435\u0432",
    clubName: "\u0420\u043E\u0442\u043E\u0440",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 47,
    style: "counter",
    styleTitle: "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434\u0441\u043A\u0438\u0439 \u0431\u043E\u0439\u0446\u043E\u0432\u0441\u043A\u0438\u0439 \u0434\u0443\u0445 \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0444\u043B\u0430\u043D\u0433",
    styleDesc: "\u0411\u0435\u0441\u043A\u043E\u043C\u043F\u0440\u043E\u043C\u0438\u0441\u0441\u043D\u0430\u044F \u0431\u043E\u0440\u044C\u0431\u0430, \u044F\u0440\u043E\u0441\u0442\u044C \u043D\u0430 \u0444\u043B\u0430\u043D\u0433\u0430\u0445, \u0433\u043E\u043B\u044B \u043D\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u043C\u0438\u043D\u0443\u0442\u0430\u0445.",
    favoriteFormation: "4-4-2",
    reputation: 77,
    temperament: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u0441\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u0431\u043E\u0435\u0446-\u0437\u0430\u0432\u043E\u0434\u0438\u043B\u0430",
    quote: "\xAB\u0418\u0433\u0440\u0430\u0442\u044C \u0434\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0435\u043A\u0443\u043D\u0434\u044B \u043A\u043E\u043C\u043F\u0435\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438!\xBB."
  },
  "\u0430\u043C\u043A\u0430\u0440": {
    id: "bobrov",
    name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u0411\u043E\u0431\u0440\u043E\u0432",
    clubName: "\u0410\u043C\u043A\u0430\u0440 \u041F\u0435\u0440\u043C\u044C",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 46,
    style: "bus",
    styleTitle: "\u041F\u0435\u0440\u043C\u0441\u043A\u0438\u0439 \u043D\u0435\u0443\u0441\u0442\u0443\u043F\u0447\u0438\u0432\u044B\u0439 \u0431\u043B\u043E\u043A",
    styleDesc: "\u0424\u0438\u0440\u043C\u0435\u043D\u043D\u0430\u044F \u043F\u0435\u0440\u043C\u0441\u043A\u0430\u044F \u0436\u0435\u0441\u0442\u043A\u043E\u0441\u0442\u044C, \u0441\u0442\u0440\u043E\u0433\u0430\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0430 \u0438 \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432.",
    favoriteFormation: "5-3-2",
    reputation: 75,
    temperament: "\u0423\u0440\u0430\u043B\u044C\u0441\u043A\u0438\u0439 \u0441\u0443\u0440\u043E\u0432\u044B\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A",
    quote: "\xAB\u0410\u043C\u043A\u0430\u0440 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0441\u0434\u0430\u0432\u0430\u043B\u0441\u044F \u0431\u0435\u0437 \u0431\u043E\u044F \u043D\u0430 \u0434\u043E\u043C\u0430\u0448\u043D\u0435\u043C \u043F\u043E\u043B\u0435\xBB."
  },
  // Медиалига
  "2drots": {
    id: "kuznetsov",
    name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041A\u0443\u0437\u043D\u0435\u0446\u043E\u0432",
    clubName: "2DROTS",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 60,
    style: "press",
    styleTitle: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0441\u043A\u0438\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \xAB\u0441\u0430\u043C\u0443\u0440\u0430\u0435\u0432\xBB",
    styleDesc: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430 \u0426\u0421\u041A\u0410 \u0438 \u042D\u0441\u043F\u0430\u043D\u044C\u043E\u043B\u0430, \u0441\u0442\u0430\u0432\u0438\u0442 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443 \u043F\u0440\u043E\u0444\u0438-\u0443\u0440\u043E\u0432\u043D\u044F \u0441 \u043C\u043E\u0449\u043D\u0435\u0439\u0448\u0438\u043C \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433\u043E\u043C.",
    favoriteFormation: "4-3-3",
    reputation: 87,
    temperament: "\u0425\u0430\u0440\u0438\u0437\u043C\u0430\u0442\u0438\u0447\u043D\u044B\u0439 \u0441\u0442\u0440\u043E\u0433\u0438\u0439 \u043C\u044D\u0442\u0440 \u043C\u0435\u0434\u0438\u0430\u0444\u0443\u0442\u0431\u043E\u043B\u0430",
    quote: "\xAB\u0412 \u043C\u0435\u0434\u0438\u0430\u0444\u0443\u0442\u0431\u043E\u043B\u0435 \u043F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 \u0442\u043E\u0442, \u043A\u0442\u043E \u043F\u0430\u0448\u0435\u0442 \u043A\u0430\u043A \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\xBB."
  },
  "\u0430\u043C\u043A\u0430\u043B": {
    id: "panov",
    name: "\u0412\u0438\u0442\u0430\u043B\u0438\u0439 \u041F\u0430\u043D\u043E\u0432",
    clubName: "\u0410\u043C\u043A\u0430\u043B",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 46,
    style: "attack",
    styleTitle: "\u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043C\u0435\u0434\u0438\u0439\u043D\u044B\u0439 \u0448\u0442\u0443\u0440\u043C",
    styleDesc: "\u042F\u0440\u043A\u0430\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0430\u044F \u0438\u0433\u0440\u0430, \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433, \u0441\u043C\u0435\u043B\u044B\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043A\u0440\u0430\u0439\u043D\u0438\u0445 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u043E\u0432.",
    favoriteFormation: "4-3-3",
    reputation: 83,
    temperament: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u044D\u043D\u0435\u0440\u0433\u0438\u0447\u043D\u044B\u0439 \u0442\u0430\u043A\u0442\u0438\u043A",
    quote: '\xAB"\u0410\u043C\u043A\u0430\u043B" \u043E\u0431\u044F\u0437\u0430\u043D \u0438\u0433\u0440\u0430\u0442\u044C \u0432 \u0430\u0442\u0430\u043A\u0443 \u0438 \u0440\u0430\u0434\u043E\u0432\u0430\u0442\u044C \u043C\u0438\u043B\u043B\u0438\u043E\u043D\u044B \u0431\u043E\u043B\u0435\u043B\u044C\u0449\u0438\u043A\u043E\u0432\xBB.'
  },
  "\u0431\u0440\u043E\u0443\u043A \u0431\u043E\u0439\u0437": {
    id: "soslan",
    name: "\u0421\u043E\u0441\u043B\u0430\u043D \u0413\u0430\u0442\u0430\u0433\u043E\u0432",
    clubName: "Broke Boys",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 33,
    style: "possession",
    styleTitle: "\u0422\u0435\u0445\u043D\u0438\u0447\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0431\u0440\u043E\u0443\u043A\u043E\u0432",
    styleDesc: "\u0423\u043C\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430, \u0442\u0435\u0445\u043D\u0438\u043A\u0430 \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u043E\u0432 \u0420\u041F\u041B \u0438 \u043D\u0435\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F.",
    favoriteFormation: "4-3-3",
    reputation: 81,
    temperament: "\u041A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043C\u0435\u0434\u0438\u0439\u043D\u044B\u0439 \u043B\u0438\u0434\u0435\u0440",
    quote: "\xAB\u0411\u0440\u043E\u0443\u043A\u0438 \u0438\u0433\u0440\u0430\u044E\u0442 \u043A\u0440\u0430\u0441\u0438\u0432\u043E \u0438 \u0434\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u043A\u043B\u0430\u0441\u0441 \u043D\u0430 \u043F\u043E\u043B\u0435\xBB."
  },
  "\u0447\u0438\u0441\u0442\u043E \u043F\u0438\u0442\u0435\u0440": {
    id: "radimov",
    name: "\u0412\u043B\u0430\u0434\u0438\u0441\u043B\u0430\u0432 \u0420\u0430\u0434\u0438\u043C\u043E\u0432",
    clubName: "\u0427\u0438\u0441\u0442\u043E \u041F\u0438\u0442\u0435\u0440",
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 50,
    style: "possession",
    styleTitle: "\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0441\u043A\u0438\u0439 \u0443\u043C\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0432 \u043F\u0430\u0441",
    styleDesc: "\u0418\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F, \u0437\u0435\u043D\u0438\u0442\u043E\u0432\u0441\u043A\u0438\u0439 \u0434\u0443\u0445 \u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C.",
    favoriteFormation: "4-3-3",
    reputation: 84,
    temperament: "\u041E\u0441\u0442\u0440\u044B\u0439 \u043D\u0430 \u044F\u0437\u044B\u043A \u043B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043D",
    quote: "\xAB\u0412 \u0444\u0443\u0442\u0431\u043E\u043B \u0438\u0433\u0440\u0430\u044E\u0442 \u0433\u043E\u043B\u043E\u0432\u043E\u0439, \u0430 \u043D\u043E\u0433\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0442\xBB."
  }
};
function getTeamCoach(teamName, compId = "rpl") {
  const normName = (teamName || "").toLowerCase().trim();
  for (const [k, c] of Object.entries(DEFAULT_COACHES)) {
    if (normName.includes(k) || k.includes(normName)) {
      return { ...c, clubName: teamName };
    }
  }
  const styles = compId === "rpl" ? ["possession", "attack", "press", "counter"] : compId === "media" ? ["attack", "press", "counter"] : ["bus", "counter", "press"];
  const hash = normName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const pickedStyle = styles[hash % styles.length];
  const info = COACH_STYLES_INFO[pickedStyle];
  const firstNames = ["\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440", "\u0421\u0435\u0440\u0433\u0435\u0439", "\u0414\u043C\u0438\u0442\u0440\u0438\u0439", "\u0410\u043D\u0434\u0440\u0435\u0439", "\u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440", "\u0418\u0433\u043E\u0440\u044C", "\u041E\u043B\u0435\u0433", "\u041C\u0438\u0445\u0430\u0438\u043B", "\u0415\u0432\u0433\u0435\u043D\u0438\u0439", "\u0412\u0430\u043B\u0435\u0440\u0438\u0439"];
  const lastNames = ["\u0418\u0432\u0430\u043D\u043E\u0432", "\u0421\u043C\u0438\u0440\u043D\u043E\u0432", "\u041A\u0443\u0437\u043D\u0435\u0446\u043E\u0432", "\u041F\u043E\u043F\u043E\u0432", "\u0412\u0430\u0441\u0438\u043B\u044C\u0435\u0432", "\u041F\u0435\u0442\u0440\u043E\u0432", "\u0421\u043E\u043A\u043E\u043B\u043E\u0432", "\u041C\u043E\u0440\u043E\u0437\u043E\u0432", "\u041D\u043E\u0432\u0438\u043A\u043E\u0432", "\u0424\u0451\u0434\u043E\u0440\u043E\u0432"];
  const fn = firstNames[hash % firstNames.length];
  const ln = lastNames[hash * 7 % lastNames.length];
  return {
    id: `coach_${hash}`,
    name: `${fn} ${ln}`,
    clubName: teamName,
    nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
    age: 40 + hash % 25,
    style: pickedStyle,
    styleTitle: info.title,
    styleDesc: info.desc,
    favoriteFormation: info.favoredFormations[0] || "4-3-3",
    reputation: compId === "rpl" ? 75 + hash % 15 : 65 + hash % 18,
    temperament: "\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A",
    quote: "\xAB\u0422\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u043F\u0440\u0438\u043D\u0435\u0441\u0443\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\xBB."
  };
}
function computeCoachSynergy(coach, tactics) {
  const coachStyle = coach.style;
  const teamFormation = (tactics?.formation || "4-3-3").trim();
  const teamSpeech = (tactics?.speech || "").toLowerCase();
  const teamTraining = (tactics?.training || "").toLowerCase();
  let teamOrientation = "balanced";
  if (teamSpeech.includes("\u0430\u0432\u0442\u043E\u0431\u0443\u0441") || teamSpeech.includes("\u0433\u043B\u0443\u0445\u0430\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0430") || teamSpeech.includes("\u0431\u0435\u0442\u043E\u043D") || teamSpeech.includes("\u043D\u0430 \u043D\u043E\u043B\u044C") || teamTraining.includes("\u043E\u0431\u043E\u0440\u043E\u043D")) {
    teamOrientation = "bus";
  } else if (teamSpeech.includes("\u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A") || teamSpeech.includes("\u0432\u0442\u043E\u0440\u044B\u043C \u043D\u043E\u043C\u0435\u0440\u043E\u043C") || teamSpeech.includes("\u043B\u043E\u0432\u0438\u0442\u044C \u043D\u0430 \u043E\u0448\u0438\u0431\u043A") || teamTraining.includes("\u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A")) {
    teamOrientation = "counter";
  } else if (teamSpeech.includes("\u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433") || teamSpeech.includes("\u0434\u0443\u0448\u0438\u0442\u044C") || teamSpeech.includes("\u0434\u0430\u0432\u0438\u0442\u044C") || teamSpeech.includes("\u0432\u044B\u0441\u043E\u043A\u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0442\u044C") || teamTraining.includes("\u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433")) {
    teamOrientation = "press";
  } else if (teamSpeech.includes("\u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0435") || teamSpeech.includes("\u043A\u043E\u043D\u0442\u0440\u043E\u043B") || teamSpeech.includes("\u043F\u0430\u0441") || teamSpeech.includes("\u043D\u0435 \u0441\u043F\u0435\u0448\u0438\u0442\u044C") || teamTraining.includes("\u043F\u0430\u0441")) {
    teamOrientation = "possession";
  } else if (teamSpeech.includes("\u0430\u0442\u0430\u043A\u0430") || teamSpeech.includes("\u0432\u043F\u0435\u0440\u0451\u0434") || teamSpeech.includes("\u0448\u0442\u0443\u0440\u043C") || teamSpeech.includes("\u0437\u0430\u0431\u0438\u0432\u0430\u0442\u044C") || teamTraining.includes("\u0443\u0434\u0430\u0440") || teamTraining.includes("\u0430\u0442\u0430\u043A")) {
    teamOrientation = "attack";
  } else {
    if (teamFormation.startsWith("5-") || teamFormation === "4-5-1") teamOrientation = "bus";
    else if (teamFormation === "3-5-2" || teamFormation === "4-4-2") teamOrientation = "counter";
    else if (teamFormation === "4-3-3" || teamFormation === "3-4-3") teamOrientation = "attack";
    else teamOrientation = "balanced";
  }
  let score = 70;
  let desc = "";
  if (coachStyle === teamOrientation) {
    score += 25;
    desc = `\u041F\u043E\u043B\u043D\u0430\u044F \u0433\u0430\u0440\u043C\u043E\u043D\u0438\u044F: \u0442\u0440\u0435\u043D\u0435\u0440 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432 \u043C\u044B\u0441\u043B\u044F\u0442 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u043E \u0432 \u0441\u0442\u0438\u043B\u0435 \xAB${coach.styleTitle}\xBB. \u0418\u0433\u0440\u043E\u043A\u0438 \u0431\u0435\u0437\u0443\u043F\u0440\u0435\u0447\u043D\u043E \u043F\u043E\u043D\u0438\u043C\u0430\u044E\u0442 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443.`;
  } else if (coachStyle === "attack" && teamOrientation === "possession" || coachStyle === "possession" && teamOrientation === "attack" || coachStyle === "counter" && teamOrientation === "press" || coachStyle === "press" && teamOrientation === "attack" || coachStyle === "bus" && teamOrientation === "counter") {
    score += 15;
    desc = `\u0425\u043E\u0440\u043E\u0448\u0430\u044F \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u043E\u0447\u0435\u0442\u0430\u0435\u043C\u043E\u0441\u0442\u044C: \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u044B \u0442\u0440\u0435\u043D\u0435\u0440\u0430 \u0434\u043E\u043F\u043E\u043B\u043D\u044F\u044E\u0442 \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0438\u0433\u0440\u043E\u0432\u0443\u044E \u043C\u043E\u0434\u0435\u043B\u044C \u043A\u043B\u0443\u0431\u0430.`;
  } else if (teamOrientation === "balanced") {
    score += 5;
    desc = `\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C: \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442 \u0431\u0430\u0437\u043E\u0432\u044B\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430 \u0431\u0435\u0437 \u043F\u0435\u0440\u0435\u043A\u043E\u0441\u043E\u0432.`;
  } else if (coachStyle === "bus" && (teamOrientation === "attack" || teamOrientation === "press") || coachStyle === "attack" && teamOrientation === "bus") {
    score -= 42;
    desc = `\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0434\u0438\u0441\u0441\u043E\u043D\u0430\u043D\u0441: \u0442\u0440\u0435\u043D\u0435\u0440 \u0441\u0442\u0430\u0432\u0438\u0442 ${COACH_STYLES_INFO[coachStyle].title}, \u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0438\u0433\u0440\u0430\u0435\u0442 \u0432 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0444\u0430\u0437\u0435 (${COACH_STYLES_INFO[teamOrientation]?.title || teamOrientation}). \u0412\u043E\u0437\u043D\u0438\u043A\u0430\u044E\u0442 \u0440\u0430\u0437\u0440\u044B\u0432\u044B \u043C\u0435\u0436\u0434\u0443 \u043B\u0438\u043D\u0438\u044F\u043C\u0438 \u0438 \u043F\u043E\u0442\u0435\u0440\u0438.`;
  } else {
    score -= 15;
    desc = `\u0423\u043C\u0435\u0440\u0435\u043D\u043D\u044B\u0435 \u0440\u0430\u0437\u043D\u043E\u0433\u043B\u0430\u0441\u0438\u044F: \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430 \u043D\u0435 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u043B\u043E\u0436\u0430\u0442\u0441\u044F \u043D\u0430 \u0441\u0445\u0435\u043C\u0443 \u0438 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432.`;
  }
  const favored = COACH_STYLES_INFO[coachStyle].favoredFormations || [];
  if (favored.includes(teamFormation)) {
    score += 8;
  } else if (teamFormation.startsWith("5-") && coachStyle === "attack") {
    score -= 10;
  } else if (teamFormation.startsWith("3-") && coachStyle === "bus") {
    score -= 8;
  }
  score = Math.max(15, Math.min(100, score));
  let status = "neutral";
  let statusTitle = "\u0423\u043C\u0435\u0440\u0435\u043D\u043D\u0430\u044F \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u043E\u0441\u0442\u044C";
  let statusBadgeClass = "neutral";
  let xgMultiplier = 1;
  let xgaMultiplier = 1;
  let defenseBonus = 0;
  let tackleBonus = 0;
  let foulModifier = 1;
  if (score >= 85) {
    status = "excellent";
    statusTitle = "\u0418\u0434\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0438\u043D\u0435\u0440\u0433\u0438\u044F";
    statusBadgeClass = "top";
    xgMultiplier = coachStyle === "attack" || coachStyle === "possession" ? 1.15 : 1.08;
    xgaMultiplier = coachStyle === "bus" || coachStyle === "counter" ? 0.85 : 0.92;
    defenseBonus = 0.2;
    tackleBonus = 0.25;
    foulModifier = 0.85;
  } else if (score >= 70) {
    status = "good";
    statusTitle = "\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0441\u044B\u0433\u0440\u0430\u043D\u043D\u043E\u0441\u0442\u044C";
    statusBadgeClass = "gold";
    xgMultiplier = 1.06;
    xgaMultiplier = 0.94;
    defenseBonus = 0.1;
    tackleBonus = 0.12;
  } else if (score >= 50) {
    status = "neutral";
    statusTitle = "\u0420\u0430\u0431\u043E\u0447\u0430\u044F \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C";
    statusBadgeClass = "playoff";
    xgMultiplier = 1;
    xgaMultiplier = 1;
  } else if (score >= 35) {
    status = "poor";
    statusTitle = "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0430\u0437\u043B\u0430\u0434";
    statusBadgeClass = "bad";
    xgMultiplier = 0.9;
    xgaMultiplier = 1.14;
    foulModifier = 1.2;
  } else {
    status = "clash";
    statusTitle = "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043A\u0440\u0438\u0437\u0438\u0441";
    statusBadgeClass = "bad";
    xgMultiplier = 0.82;
    xgaMultiplier = 1.25;
    foulModifier = 1.35;
  }
  return {
    score,
    status,
    statusTitle,
    statusBadgeClass,
    xgMultiplier,
    xgaMultiplier,
    defenseBonus,
    tackleBonus,
    foulModifier,
    description: desc
  };
}
var STAFF_ROLES = {
  head: { title: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", short: "\u0413\u043B. \u0442\u0440\u0435\u043D\u0435\u0440", desc: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439, \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F, \u0432\u044B\u0431\u043E\u0440 \u0442\u0430\u043A\u0442\u0438\u043A\u0438 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0430", icon: "\u{1F454}" },
  assistant: { title: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", short: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442", desc: "\u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A\u0430, \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0443\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u0439 \u0438 \u0430\u043D\u0430\u043B\u0438\u0437", icon: "\u{1F4CB}" },
  gk: { title: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", short: "\u0422\u0440. \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", desc: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440\u043E\u0432, \u0440\u0435\u0430\u043A\u0446\u0438\u044F, \u0438\u0433\u0440\u0430 \u043D\u0430 \u0432\u044B\u0445\u043E\u0434\u0430\u0445 \u0438 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438", icon: "\u{1F9E4}" },
  fitness: { title: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", short: "\u0424\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430", desc: "\u0412\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C, \u0432\u0437\u0440\u044B\u0432\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C, \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u0438 \u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u0430\u043A\u0442\u0438\u043A\u0430 \u0442\u0440\u0430\u0432\u043C", icon: "\u26A1" },
  attack: { title: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432", short: "\u0422\u0440. \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", desc: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0430\u0442\u0430\u043A, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B, \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u0432 \u0438 \u0440\u0430\u0431\u043E\u0442\u0430 \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432", icon: "\u{1F3AF}" },
  doctor: { title: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", short: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447", desc: "\u041C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0439 \u0448\u0442\u0430\u0431, \u0440\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0442\u0440\u0430\u0432\u043C \u0438 \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C", icon: "\u{1FA7A}" }
};
var REAL_RPL_STAFFS = {
  "\u0437\u0435\u043D\u0438\u0442": [
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0421\u0435\u043C\u0430\u043A", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 50, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "possession", styleTitle: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043C\u044F\u0447\u0430 \u0438 \u0434\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435", favoriteFormation: "4-3-3", specialty: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u0432\u0451\u0437\u0434\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u0430\u0432\u043E\u043C \u0438 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430", bio: "\u041F\u044F\u0442\u0438\u043A\u0440\u0430\u0442\u043D\u044B\u0439 \u0447\u0435\u043C\u043F\u0438\u043E\u043D \u0420\u043E\u0441\u0441\u0438\u0438 \u0432\u043E \u0433\u043B\u0430\u0432\u0435 \xAB\u0417\u0435\u043D\u0438\u0442\u0430\xBB. \u0421\u0442\u0430\u0432\u0438\u0442 \u0441\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0441 \u0434\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F." },
    { name: "\u0412\u0438\u043B\u044C\u044F\u043C \u0434\u0435 \u041E\u043B\u0438\u0432\u0435\u0439\u0440\u0430", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 43, nationality: "\u0411\u0440\u0430\u0437\u0438\u043B\u0438\u044F", specialty: "\u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F \u043B\u0430\u0442\u0438\u043D\u043E\u0430\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u0438\u0445 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432 \u0438 \u0442\u0430\u043A\u0442\u0438\u043A\u0430", bio: "\u041F\u0440\u0430\u0432\u0430\u044F \u0440\u0443\u043A\u0430 \u0421\u0435\u043C\u0430\u043A\u0430, \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0445\u0435\u043C\u044B \u0438 \u043A\u043E\u043C\u043C\u0443\u043D\u0438\u043A\u0430\u0446\u0438\u044E \u0441 \u043B\u0438\u0434\u0435\u0440\u0430\u043C\u0438." },
    { name: "\u0410\u043D\u0430\u0442\u043E\u043B\u0438\u0439 \u0422\u0438\u043C\u043E\u0449\u0443\u043A", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 46, nationality: "\u0423\u043A\u0440\u0430\u0438\u043D\u0430", specialty: "\u041E\u043F\u043E\u0440\u043D\u0430\u044F \u0437\u043E\u043D\u0430 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0432 \u043E\u0431\u043E\u0440\u043E\u043D\u0435", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u044D\u043A\u0441-\u043A\u0430\u043F\u0438\u0442\u0430\u043D \xAB\u0417\u0435\u043D\u0438\u0442\u0430\xBB, \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u041A\u0443\u0431\u043A\u0430 \u0423\u0415\u0424\u0410. \u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0431\u043E\u0439\u0446\u043E\u0432\u0441\u043A\u0438\u0439 \u0434\u0443\u0445 \u0438 \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u043B\u0438\u043D\u0438\u0439." },
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0411\u0438\u0440\u044E\u043A\u043E\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 67, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0435\u0445\u043D\u0438\u043A\u0430 \u043B\u043E\u0432\u043B\u0438, \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", bio: "\u041C\u044D\u0442\u0440 \u043E\u0442\u0435\u0447\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u043E\u0433\u043E \u0446\u0435\u0445\u0430, \u0447\u0435\u043C\u043F\u0438\u043E\u043D \u0421\u0421\u0421\u0420 1984 \u0433\u043E\u0434\u0430. \u0412\u043E\u0441\u043F\u0438\u0442\u0430\u043B \u0446\u0435\u043B\u043E\u0435 \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0435 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440\u043E\u0432." },
    { name: "\u0418\u0432\u0430\u043D \u041A\u0430\u0440\u043C\u0438\u043D\u0430\u0442\u0438", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 71, nationality: "\u0418\u0442\u0430\u043B\u0438\u044F", specialty: "\u041F\u0438\u043A\u043E\u0432\u0430\u044F \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u0438 \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C", bio: "\u042D\u043A\u0441-\u0442\u0440\u0435\u043D\u0435\u0440 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0410\u043D\u0433\u043B\u0438\u0438 \u0438 \xAB\u041C\u0430\u043D\u0447\u0435\u0441\u0442\u0435\u0440 \u0421\u0438\u0442\u0438\xBB \u0432\u0440\u0435\u043C\u0451\u043D \u0420\u043E\u0431\u0435\u0440\u0442\u043E \u041C\u0430\u043D\u0447\u0438\u043D\u0438." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u041D\u0438\u0437\u0435\u043B\u0438\u043A", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A", age: 39, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0430\u0442\u0430\u043A, \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u043D\u0438\u044F \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432 \u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u043E\u0432", bio: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A \u0448\u0442\u0430\u0431\u0430, \u0438\u0437\u0443\u0447\u0430\u043B \u0444\u0443\u0442\u0431\u043E\u043B \u0432 \u041F\u043E\u0440\u0442\u0443\u0433\u0430\u043B\u0438\u0438 \u0438 \u0418\u0442\u0430\u043B\u0438\u0438." },
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0413\u0440\u0438\u0448\u0438\u043D", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 48, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F \u0438 \u0431\u044B\u0441\u0442\u0440\u043E\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435", bio: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u0434\u0435\u043F\u0430\u0440\u0442\u0430\u043C\u0435\u043D\u0442\u0430 \xAB\u0417\u0435\u043D\u0438\u0442\u0430\xBB \u0441 \u043C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u043C \u0441\u0442\u0430\u0436\u0435\u043C \u0432 \u0435\u0432\u0440\u043E\u043A\u0443\u0431\u043A\u0430\u0445." }
  ],
  "\u043A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440": [
    { name: "\u041C\u0443\u0440\u0430\u0434 \u041C\u0443\u0441\u0430\u0435\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 43, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "attack", styleTitle: "\u0414\u043E\u043C\u0438\u043D\u0438\u0440\u0443\u044E\u0449\u0430\u044F \u044D\u0441\u0442\u0435\u0442\u0438\u0447\u043D\u0430\u044F \u0430\u0442\u0430\u043A\u0430", favoriteFormation: "4-3-3", specialty: "\u041A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u0430\u0442\u0430\u043A\u0430 \u0438 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u0432\u043E\u0441\u043F\u0438\u0442\u0430\u043D\u043D\u0438\u043A\u043E\u0432 \u0430\u043A\u0430\u0434\u0435\u043C\u0438\u0438", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \xAB\u0431\u044B\u043A\u043E\u0432\xBB. \u0412\u043E\u043F\u043B\u043E\u0449\u0430\u0435\u0442 \u0444\u0438\u043B\u043E\u0441\u043E\u0444\u0438\u044E \u0421\u0435\u0440\u0433\u0435\u044F \u0413\u0430\u043B\u0438\u0446\u043A\u043E\u0433\u043E \u2014 \u0441\u043C\u0435\u043B\u044B\u0439 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B." },
    { name: "\u0410\u0440\u0442\u0443\u0440 \u041E\u043B\u0435\u043D\u0438\u043D", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 54, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0438 \u043F\u0435\u0440\u0435\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440-\u043C\u0435\u0442\u043E\u0434\u0438\u0441\u0442, \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432 \u0442\u0430\u043D\u0434\u0435\u043C\u0435 \u0441 \u041C\u0443\u0441\u0430\u0435\u0432\u044B\u043C." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0427\u0438\u0441\u0442\u044F\u043A\u043E\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 48, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0418\u0433\u0440\u0430 \u043D\u0430 \u0432\u044B\u0445\u043E\u0434\u0430\u0445 \u0438 \u043D\u0430\u0447\u0430\u043B\u043E \u0430\u0442\u0430\u043A \u0447\u0435\u0440\u0435\u0437 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440\u0430 (\u043D\u043E\u0433\u0430\u043C\u0438)", bio: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0430\u043A\u0430\u0434\u0435\u043C\u0438\u0438 \u0438 \u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u044B, \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u0435\u0442 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0443\u044E \u0438\u0433\u0440\u0443." },
    { name: "\u0414\u0430\u043D\u0438\u044D\u043B\u044C \u0411\u0435\u043D\u0435\u0434\u0438\u0442\u043E", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 45, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", specialty: "\u0410\u044D\u0440\u043E\u0431\u043D\u0430\u044F \u0431\u0430\u0437\u0430 \u0438 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u0440\u044B\u0432\u043A\u043E\u0432\u044B\u0439 \u0442\u0440\u0435\u043D\u0438\u043D\u0433", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435 \u0441 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u043C \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u043C." },
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041C\u0430\u0442\u0432\u0435\u0435\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A", age: 53, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432\u0438\u043D\u0433\u0435\u0440\u043E\u0432 \u0438 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0435\u0433\u043E \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439", bio: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u043C \u0444\u0430\u0437\u0430\u043C \u0438\u0433\u0440\u044B \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B." },
    { name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u0411\u0430\u0433\u0434\u0430\u0441\u0430\u0440\u044F\u043D", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0430 \u0438 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433 \u043A\u0430\u0440\u0434\u0438\u043E\u043D\u0430\u0433\u0440\u0443\u0437\u043E\u043A", bio: "\u0412\u043E\u0437\u0433\u043B\u0430\u0432\u043B\u044F\u0435\u0442 \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0439 \u0448\u0442\u0430\u0431 \xAB\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440\u0430\xBB, \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u0432 \u0440\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u0438 \u0441\u0432\u044F\u0437\u043E\u043A." }
  ],
  "\u043B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432": [
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0413\u0430\u043B\u0430\u043A\u0442\u0438\u043E\u043D\u043E\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "press", styleTitle: "\u041C\u043E\u043B\u043E\u0434\u0451\u0436\u043D\u044B\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433", favoriteFormation: "4-2-3-1", specialty: "\u0420\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u043C\u043E\u043B\u043E\u0434\u044B\u0445 \u0442\u0430\u043B\u0430\u043D\u0442\u043E\u0432 \u0438 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u044B\u043F\u0430\u0434\u044B", bio: "\u042D\u043A\u0441-\u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u043C\u043E\u043B\u043E\u0434\u0451\u0436\u043D\u043E\u0439 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438. \u041F\u043E\u0441\u0442\u0440\u043E\u0438\u043B \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u043C\u043E\u043B\u043E\u0434\u044B\u0445 \u0438 \u0434\u0435\u0440\u0437\u043A\u0438\u0445 \u043A\u043E\u043C\u0430\u043D\u0434 \u0420\u041F\u041B." },
    { name: "\u041E\u043B\u0435\u0433 \u041B\u0435\u0432\u0438\u043D", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 40, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0430", bio: "\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0441\u043E\u0440\u0430\u0442\u043D\u0438\u043A \u0413\u0430\u043B\u0430\u043A\u0442\u0438\u043E\u043D\u043E\u0432\u0430, \u043A\u0443\u0440\u0438\u0440\u0443\u0435\u0442 \u0443\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u044F \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C\u044E." },
    { name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041B\u043E\u0441\u044C\u043A\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432", age: 52, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B, \u0437\u0430\u0432\u0435\u0440\u0448\u0430\u044E\u0449\u0438\u0435 \u043F\u0430\u0441\u044B \u0438 \u0443\u0434\u0430\u0440\u044B \u0438\u0437-\u0437\u0430 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439", bio: "\u0416\u0438\u0432\u0430\u044F \u043B\u0435\u0433\u0435\u043D\u0434\u0430 \xAB\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432\u0430\xBB, \u0440\u0435\u043A\u043E\u0440\u0434\u0441\u043C\u0435\u043D \u043F\u043E \u0433\u043E\u043B\u0435\u0432\u044B\u043C \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430\u043C \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0420\u041F\u041B." },
    { name: "\u0417\u0430\u0443\u0440 \u0425\u0430\u043F\u043E\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 61, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0420\u0435\u0430\u043A\u0446\u0438\u044F, \u0438\u0433\u0440\u0430 \u043E\u0434\u0438\u043D \u043D\u0430 \u043E\u0434\u0438\u043D \u0438 \u043F\u043E\u0434\u0441\u043A\u0430\u0437 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u0430\u043C", bio: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u0420\u043E\u0441\u0441\u0438\u0438 1995 \u0433\u043E\u0434\u0430. \u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0438\u0445 \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u0439 \xAB\u041B\u043E\u043A\u043E\xBB." },
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0410\u043B\u0435\u043A\u0441\u0435\u0435\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0438 \u0441\u043F\u0440\u0438\u043D\u0442\u0435\u0440\u0441\u043A\u0430\u044F \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C", bio: "\u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0430\u0442\u043B\u0435\u0442\u0438\u0437\u043C \u0438 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u043E\u0441\u043D\u043E\u0432\u044B." },
    { name: "\u0418\u0433\u043E\u0440\u044C \u041A\u0430\u043B\u044E\u0436\u043D\u044B\u0439", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 49, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u044B\u0448\u0446", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \xAB\u0436\u0435\u043B\u0435\u0437\u043D\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u0438\u043A\u043E\u0432\xBB \u0441 \u043E\u043F\u044B\u0442\u043E\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u0432 \u0435\u0432\u0440\u043E\u043A\u0443\u0431\u043A\u0430\u0445." }
  ],
  "\u0441\u043F\u0430\u0440\u0442\u0430\u043A": [
    { name: "\u0414\u0435\u044F\u043D \u0421\u0442\u0430\u043D\u043A\u043E\u0432\u0438\u0447", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 48, nationality: "\u0421\u0435\u0440\u0431\u0438\u044F", style: "attack", styleTitle: "\u0421\u0442\u0440\u0430\u0441\u0442\u043D\u0430\u044F \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0430\u0442\u0430\u043A\u0430", favoriteFormation: "4-3-3", specialty: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u041B\u0438\u0433\u0438 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u043E\u0432, \u043B\u0438\u0434\u0435\u0440\u0441\u043A\u0430\u044F \u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0438 \u0430\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u0448\u0442\u0443\u0440\u043C", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430 \u043C\u0438\u043B\u0430\u043D\u0441\u043A\u043E\u0433\u043E \xAB\u0418\u043D\u0442\u0435\u0440\u0430\xBB \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0421\u0435\u0440\u0431\u0438\u0438. \u041F\u0440\u0438\u0432\u0438\u0432\u0430\u0435\u0442 \u0441\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0446\u0430\u043C \u043D\u0435\u0441\u0433\u0438\u0431\u0430\u0435\u043C\u0443\u044E \u0432\u043E\u043B\u044E \u0438 \u0430\u0442\u0430\u043A\u0443." },
    { name: "\u041D\u0435\u043D\u0430\u0434 \u0421\u0430\u043A\u0438\u0447", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 54, nationality: "\u0421\u0435\u0440\u0431\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u043A\u0430 \u0437\u0430\u0449\u0438\u0442\u043D\u044B\u0445 \u043B\u0438\u043D\u0438\u0439 \u0438 \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E\u0441\u0442\u044C", bio: "\u041F\u0440\u0430\u0432\u0430\u044F \u0440\u0443\u043A\u0430 \u0421\u0442\u0430\u043D\u043A\u043E\u0432\u0438\u0447\u0430 \u0441\u043E \u0432\u0440\u0435\u043C\u0451\u043D \xAB\u0426\u0440\u0432\u0435\u043D\u044B \u0417\u0432\u0435\u0437\u0434\u044B\xBB \u0438 \xAB\u0421\u0430\u043C\u043F\u0434\u043E\u0440\u0438\u0438\xBB." },
    { name: "\u041F\u044C\u0435\u0440\u043B\u0443\u0438\u0434\u0436\u0438 \u0411\u0440\u0438\u0432\u0438\u043E", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 57, nationality: "\u0418\u0442\u0430\u043B\u0438\u044F", specialty: "\u0418\u0442\u0430\u043B\u044C\u044F\u043D\u0441\u043A\u0430\u044F \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u0448\u043A\u043E\u043B\u0430: \u0432\u044B\u0431\u043E\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0438 \u0447\u0442\u0435\u043D\u0438\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0438\u0442\u0430\u043B\u044C\u044F\u043D\u0441\u043A\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \u0438\u0437 \u0421\u0435\u0440\u0438\u0438 \u0410." },
    { name: "\u0424\u0435\u0434\u0435\u0440\u0438\u043A\u043E \u041F\u0430\u043D\u043D\u043E\u043D\u0447\u0438\u043D\u0438", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 46, nationality: "\u0418\u0442\u0430\u043B\u0438\u044F", specialty: "\u0421\u0438\u043B\u043E\u0432\u0430\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0438 \u0432\u044B\u0441\u043E\u043A\u043E\u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B", bio: "\u0415\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u044F\u043C \u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u0430\u043A\u0442\u0438\u043A\u0435 \u043F\u0435\u0440\u0435\u0443\u0442\u043E\u043C\u043B\u0435\u043D\u0438\u044F." },
    { name: "\u0412\u0430\u0434\u0438\u043C \u0420\u043E\u043C\u0430\u043D\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A", age: 47, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0410\u043D\u0430\u043B\u0438\u0437 \u0441\u043B\u0430\u0431\u043E\u0441\u0442\u0435\u0439 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u043E\u0432", bio: "\u0412\u043E\u0441\u043F\u0438\u0442\u0430\u043D\u043D\u0438\u043A \u0441\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0441\u043A\u043E\u0439 \u0448\u043A\u043E\u043B\u044B, \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0435 \u0441\u0432\u044F\u0437\u043A\u0438." },
    { name: "\u041A\u0438\u0440\u0438\u043B\u043B \u041A\u043E\u0437\u043B\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 43, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F \u0438 \u044D\u043A\u0441\u0442\u0440\u0435\u043D\u043D\u0430\u044F \u043F\u043E\u043C\u043E\u0449\u044C \u043D\u0430 \u043F\u043E\u043B\u0435", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u0440\u0430\u0441\u043D\u043E-\u0431\u0435\u043B\u044B\u0445, \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0441\u0443\u0441\u0442\u0430\u0432\u043D\u044B\u043C \u0442\u0440\u0430\u0432\u043C\u0430\u043C." }
  ],
  "\u0446\u0441\u043A\u0430": [
    { name: "\u041C\u0430\u0440\u043A\u043E \u041D\u0438\u043A\u043E\u043B\u0438\u0447", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 47, nationality: "\u0421\u0435\u0440\u0431\u0438\u044F", style: "counter", styleTitle: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043F\u0440\u0430\u0433\u043C\u0430\u0442\u0438\u0447\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440-\u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0441\u0442\u0438\u043B\u044C", favoriteFormation: "3-5-2", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u0440\u043E\u0433\u043E\u0441\u0442\u044C, \u043E\u0431\u043E\u0440\u043E\u043D\u0430 \u0438 \u0438\u0433\u0440\u0430 \u043D\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", bio: "\u041E\u0431\u043B\u0430\u0434\u0430\u0442\u0435\u043B\u044C \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438. \u041C\u0430\u0441\u0442\u0435\u0440 \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0439 \u0438 \u043D\u0430\u0434\u0435\u0436\u043D\u043E\u0439 \u0438\u0433\u0440\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B." },
    { name: "\u0420\u0430\u0434\u043E\u0435 \u0421\u043C\u0438\u043B\u044F\u043D\u0438\u0447", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 49, nationality: "\u0421\u0435\u0440\u0431\u0438\u044F", specialty: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u0438 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0446\u0438\u044F \u043B\u0438\u043D\u0438\u0439", bio: "\u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u041D\u0438\u043A\u043E\u043B\u0438\u0447\u0430." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0411\u0435\u0440\u0435\u0437\u0443\u0446\u043A\u0438\u0439", role: "assistant", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u043E\u0432 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043B\u0438\u043D\u0438\u044F \u0438 \u0438\u0433\u0440\u0430 \u0433\u043E\u043B\u043E\u0432\u043E\u0439", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A \u0426\u0421\u041A\u0410 \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438, \u043E\u0431\u043B\u0430\u0434\u0430\u0442\u0435\u043B\u044C \u041A\u0443\u0431\u043A\u0430 \u0423\u0415\u0424\u0410 2005." },
    { name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041A\u0440\u0430\u043C\u0430\u0440\u0435\u043D\u043A\u043E", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 51, nationality: "\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D", specialty: "\u041F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u044F \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043D\u043E\u043C\u0435\u0440\u0430 \u0438 \u0440\u0435\u0430\u043A\u0446\u0438\u044F", bio: "\u0420\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0441 \u0418\u0433\u043E\u0440\u0435\u043C \u0410\u043A\u0438\u043D\u0444\u0435\u0435\u0432\u044B\u043C \u0438 \u043C\u043E\u043B\u043E\u0434\u044B\u043C\u0438 \u0430\u0440\u043C\u0435\u0439\u0441\u043A\u0438\u043C\u0438 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440\u0430\u043C\u0438." },
    { name: "\u0413\u043E\u0440\u0430\u043D \u0411\u0430\u0441\u0438\u0447", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 48, nationality: "\u0421\u0435\u0440\u0431\u0438\u044F", specialty: "\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C, \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0439 \u0430\u0442\u043B\u0435\u0442\u0438\u0437\u043C \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435", bio: "\u0421\u0435\u0440\u0431\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0432\u044B\u0441\u0448\u0435\u0439 \u043A\u0432\u0430\u043B\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435." },
    { name: "\u042D\u0434\u0443\u0430\u0440\u0434 \u0411\u0435\u0437\u0443\u0433\u043B\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0444\u0430\u0440\u043C\u0430\u043A\u043E\u043B\u043E\u0433\u0438\u044F, \u0431\u0438\u043E\u0445\u0438\u043C\u0438\u044F \u0438 \u0440\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u044F", bio: "\u041E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u044B\u0445 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0445 \u0432\u0440\u0430\u0447\u0435\u0439 \u0441\u0442\u0440\u0430\u043D\u044B, \u044D\u043A\u0441-\u0433\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." }
  ],
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u043E\u0441\u043A\u0432\u0430": [
    { name: "\u041C\u0430\u0440\u0446\u0435\u043B \u041B\u0438\u0447\u043A\u0430", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 49, nationality: "\u0427\u0435\u0445\u0438\u044F", style: "attack", styleTitle: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0431\u0435\u0441\u0448\u0430\u0431\u0430\u0448\u043D\u044B\u0439 \u0442\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B", favoriteFormation: "4-3-3", specialty: "\u0412\u044B\u0441\u043E\u0447\u0430\u0439\u0448\u0438\u0439 \u0442\u0435\u043C\u043F, \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0430\u0437\u0430\u0440\u0442 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0431\u0435\u043B\u043E-\u0433\u043E\u043B\u0443\u0431\u044B\u0445. \u0421\u0442\u0430\u0432\u0438\u0442 \u0441\u0430\u043C\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0438 \u044F\u0440\u043A\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0432 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442\u0435." },
    { name: "\u0420\u043E\u043B\u0430\u043D \u0413\u0443\u0441\u0435\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 48, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0424\u043B\u0430\u043D\u0433\u043E\u0432\u044B\u0435 \u043F\u043E\u0434\u0430\u0447\u0438, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u043C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u044F \u0438\u0433\u0440\u043E\u043A\u043E\u0432", bio: "\u042D\u043A\u0441-\u0437\u0432\u0435\u0437\u0434\u0430 \xAB\u0414\u0438\u043D\u0430\u043C\u043E\xBB, \u0426\u0421\u041A\u0410 \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438. \u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u0440\u0430\u0431\u043E\u0442\u0443 \u0441 \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u043E\u0439." },
    { name: "\u041C\u0430\u0440\u0438\u043E \u041B\u0438\u0447\u043A\u0430", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A", age: 44, nationality: "\u0427\u0435\u0445\u0438\u044F", specialty: "\u041A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u0438 \u0432 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0442\u0440\u0435\u0442\u0438 \u043F\u043E\u043B\u044F", bio: "\u0411\u0440\u0430\u0442 \u041C\u0430\u0440\u0446\u0435\u043B\u0430 \u041B\u0438\u0447\u043A\u0438, \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0430\u044E\u0449\u0435\u0439 \u0441\u0442\u0430\u0434\u0438\u0438 \u0430\u0442\u0430\u043A." },
    { name: "\u0420\u043E\u043C\u0430\u043D \u0411\u0435\u0440\u0435\u0437\u043E\u0432\u0441\u043A\u0438\u0439", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 51, nationality: "\u0410\u0440\u043C\u0435\u043D\u0438\u044F", specialty: "\u041E\u0442\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438 \u0438 \u0445\u043B\u0430\u0434\u043D\u043E\u043A\u0440\u043E\u0432\u0438\u0435 \u0432 \u0441\u0442\u0432\u043E\u0440\u0435", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430 \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u043E\u0433\u043E \u0446\u0435\u0445\u0430 \u0420\u041F\u041B, \u0440\u0435\u043A\u043E\u0440\u0434\u0441\u043C\u0435\u043D \u043B\u0438\u0433\u0438 \u043F\u043E \u043E\u0442\u0440\u0430\u0436\u0451\u043D\u043D\u044B\u043C \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438." },
    { name: "\u0425\u043E\u0441\u0435 \u041F\u0430\u0441\u0442\u043E\u0440 \u0412\u0435\u0440\u0447\u0443\u0440\u0438", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 47, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", specialty: "\u0412\u044B\u0441\u043E\u043A\u043E\u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u0438 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435 \u0441 \u0431\u043E\u0433\u0430\u0442\u044B\u043C \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u043C \u043E\u043F\u044B\u0442\u043E\u043C." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0420\u043E\u0434\u0438\u043E\u043D\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 45, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041C\u0438\u043E\u0444\u0430\u0441\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0442\u0435\u0440\u0430\u043F\u0438\u044F \u0438 \u043C\u044B\u0448\u0435\u0447\u043D\u044B\u0435 \u043C\u0438\u043A\u0440\u043E\u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u0424\u041A \xAB\u0414\u0438\u043D\u0430\u043C\u043E\xBB \u041C\u043E\u0441\u043A\u0432\u0430." }
  ],
  "\u0440\u043E\u0441\u0442\u043E\u0432": [
    { name: "\u0412\u0430\u043B\u0435\u0440\u0438\u0439 \u041A\u0430\u0440\u043F\u0438\u043D", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 57, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "press", styleTitle: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0438 \u0432\u044B\u0445\u043E\u0434 \u0447\u0435\u0440\u0435\u0437 \u043F\u0430\u0441", favoriteFormation: "4-3-3", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u0440\u043E\u0433\u043E\u0441\u0442\u044C, \u0432\u044B\u0445\u043E\u0434 \u0438\u0437 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0438 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \xAB\u0420\u043E\u0441\u0442\u043E\u0432\u0430\xBB \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438. \u041D\u0435\u043F\u0440\u0435\u0440\u0435\u043A\u0430\u0435\u043C\u044B\u0439 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442 \u0438 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043B\u0438\u0434\u0435\u0440." },
    { name: "\u0412\u0438\u043A\u0442\u043E\u0440 \u041E\u043D\u043E\u043F\u043A\u043E", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 56, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043F\u043E\u0440\u044F\u0434\u043A\u043E\u0432", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043D \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438 (113 \u043C\u0430\u0442\u0447\u0435\u0439), \u0441\u0442\u043E\u043B\u043F \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0438 \u043C\u0443\u0434\u0440\u044B\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A." },
    { name: "\u0412\u0438\u0442\u0430\u043B\u0438\u0439 \u041A\u0430\u0444\u0430\u043D\u043E\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 65, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041B\u0443\u0447\u0448\u0430\u044F \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u043C\u0435\u0442\u043E\u0434\u043E\u043B\u043E\u0433\u0438\u044F \u0432 \u0441\u0442\u0440\u0430\u043D\u0435, \u0432\u0432\u043E\u0434 \u043C\u044F\u0447\u0430 \u0438 \u0442\u0430\u043A\u0442\u0438\u043A\u0430 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", bio: "\u041C\u044D\u0442\u0440 \u043E\u0442\u0435\u0447\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0430, \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438 \u0438 \xAB\u0420\u043E\u0441\u0442\u043E\u0432\u0430\xBB." },
    { name: "\u0410\u043B\u044C\u0432\u0430\u0440\u043E \u0421\u0430\u044F\u0431\u0435\u0440\u0430", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 44, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", specialty: "\u0422\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0444\u043E\u0440\u043C\u044B \u0438 \u0430\u044D\u0440\u043E\u0431\u043D\u044B\u0439 \u0444\u0443\u043D\u0434\u0430\u043C\u0435\u043D\u0442", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0448\u0442\u0430\u0431\u0430 \u041A\u0430\u0440\u043F\u0438\u043D\u0430, \u0441\u0442\u0430\u0432\u0438\u0442 \u0437\u043D\u0430\u043C\u0435\u043D\u0438\u0442\u0443\u044E \u0440\u043E\u0441\u0442\u043E\u0432\u0441\u043A\u0443\u044E \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C." },
    { name: "\u0414\u0436\u043E\u043D\u0430\u0442\u0430\u043D \u0410\u043B\u044C\u0431\u0430", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A", age: 43, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", specialty: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0437\u043E\u043D \u0438 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440-\u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A, \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430\u0434 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u043D\u044B\u043C \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433\u043E\u043C \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445." },
    { name: "\u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440 \u0425\u043E\u0445\u043B\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 50, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u0438\u0442\u0430\u043D\u0438\u0435 \u0438 \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441-\u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435", bio: "\u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u0440\u043E\u0441\u0442\u043E\u0432\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0443\u0431\u0430." }
  ],
  "\u0440\u0443\u0431\u0438\u043D": [
    { name: "\u0420\u0430\u0448\u0438\u0434 \u0420\u0430\u0445\u0438\u043C\u043E\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 61, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "bus", styleTitle: "\u041A\u0430\u0437\u0430\u043D\u0441\u043A\u0438\u0439 \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0431\u0430\u0441\u0442\u0438\u043E\u043D", favoriteFormation: "5-3-2", specialty: "\u0421\u0438\u043B\u043E\u0432\u0430\u044F \u0431\u043E\u0440\u044C\u0431\u0430, \u043F\u043B\u043E\u0442\u043D\u044B\u0439 \u043D\u0438\u0437\u043A\u0438\u0439 \u0431\u043B\u043E\u043A \u0438 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u0430\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043A\u043E\u0439 \u0438 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u0439 \u0448\u043A\u043E\u043B\u044B. \u041F\u043E\u0441\u0442\u0440\u043E\u0438\u043B \u043D\u0435\u043F\u0440\u043E\u0431\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u043A\u0430\u0437\u0430\u043D\u0441\u043A\u0438\u0439 \u043A\u043E\u043B\u043B\u0435\u043A\u0442\u0438\u0432." },
    { name: "\u0411\u0435\u043D\u0434\u0436\u0430\u043C\u0438\u043D \u0414\u044E\u0440\u0440\u0435\u0439", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 45, nationality: "\u0413\u0435\u0440\u043C\u0430\u043D\u0438\u044F", specialty: "\u041D\u0435\u043C\u0435\u0446\u043A\u0430\u044F \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430", bio: "\u041D\u0435\u043C\u0435\u0446\u043A\u0438\u0439 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0420\u0430\u0445\u0438\u043C\u043E\u0432\u0430, \u043A\u0443\u0440\u0438\u0440\u0443\u0435\u0442 \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0441\u0445\u0435\u043C." },
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u043E\u0437\u043A\u043E", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 50, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u0440\u0435\u0430\u043A\u0446\u0438\u044F \u0438 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0446\u0438\u044F", bio: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u0420\u043E\u0441\u0441\u0438\u0438 \u0432 \u0441\u043E\u0441\u0442\u0430\u0432\u0435 \xAB\u0420\u0443\u0431\u0438\u043D\u0430\xBB, \u043C\u043D\u043E\u0433\u043E \u043B\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u043A\u0430\u0437\u0430\u043D\u0441\u043A\u0438\u0445 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439." },
    { name: "\u0425\u0430\u0432\u044C\u0435\u0440 \u041D\u043E\u0439\u044F \u0421\u0430\u043B\u044C\u0441\u0435\u0434\u043E", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 46, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", specialty: "\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u0430\u044F \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C \u0432 \u0431\u043E\u0440\u044C\u0431\u0435", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0441\u0438\u043B\u043E\u0432\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435." },
    { name: "\u041E\u043B\u0435\u0433 \u041A\u0443\u0437\u044C\u043C\u0438\u043D", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u043C \u0438 \u0444\u043B\u0430\u043D\u0433\u043E\u0432\u043E\u0439 \u0438\u0433\u0440\u0435", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041A\u0440\u043E\u0441\u0441\u044B, \u0444\u043B\u0430\u043D\u0433\u043E\u0432\u044B\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B", bio: "\u042D\u043A\u0441-\u043A\u0430\u043F\u0438\u0442\u0430\u043D \xAB\u0420\u0443\u0431\u0438\u043D\u0430\xBB \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." },
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0411\u0443\u0442\u043E\u0432\u0441\u043A\u0438\u0439", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 47, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \xAB\u0420\u0443\u0431\u0438\u043D\u0430\xBB, \u043E\u0434\u0438\u043D \u0438\u0437 \u043B\u0443\u0447\u0448\u0438\u0445 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u043E\u0432 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0445 \u0442\u0440\u0430\u0432\u043C." }
  ],
  "\u043A\u0440\u044B\u043B\u044C\u044F \u0441\u043E\u0432\u0435\u0442\u043E\u0432": [
    { name: "\u0418\u0433\u043E\u0440\u044C \u041E\u0441\u0438\u043D\u044C\u043A\u0438\u043D", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 60, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "possession", styleTitle: "\u0423\u043C\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B", favoriteFormation: "4-2-3-1", specialty: "\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043C\u043E\u043B\u043E\u0434\u044B\u0445 \u0434\u0430\u0440\u043E\u0432\u0430\u043D\u0438\u0439 \u0438 \u0438\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0441", bio: "\u041E\u0434\u0438\u043D \u0438\u0437 \u043B\u0443\u0447\u0448\u0438\u0445 \u0442\u0440\u0435\u043D\u0435\u0440\u043E\u0432-\u043F\u0435\u0434\u0430\u0433\u043E\u0433\u043E\u0432 \u0432 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u043C \u0444\u0443\u0442\u0431\u043E\u043B\u0435, \u043E\u0442\u043A\u0440\u044B\u0432\u0448\u0438\u0439 \u041F\u0438\u043D\u044F\u0435\u0432\u0430, \u0417\u0438\u043D\u044C\u043A\u043E\u0432\u0441\u043A\u043E\u0433\u043E, \u0421\u0435\u0440\u0433\u0435\u0435\u0432\u0430." },
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0411\u0443\u043B\u0430\u0442\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 53, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0438 \u0440\u0430\u0431\u043E\u0442\u0430 \u0441 \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u043E\u0439", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u041E\u0441\u0438\u043D\u044C\u043A\u0438\u043D\u0430." },
    { name: "\u0412\u0438\u043A\u0442\u043E\u0440 \u0413\u0430\u0443\u0441", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 61, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u0442\u0435\u0445\u043D\u0438\u043A\u0430 \u0438 \u0441\u0430\u043C\u043E\u043E\u0431\u043B\u0430\u0434\u0430\u043D\u0438\u0435", bio: "\u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \u0441\u0430\u043C\u0430\u0440\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0443\u0431\u0430." },
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0421\u043E\u043B\u043E\u0432\u0435\u0439", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 43, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041B\u0435\u0433\u043A\u043E\u0441\u0442\u044C \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F \u0438 \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C \u043C\u043E\u043B\u043E\u0434\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432", bio: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u0438." },
    { name: "\u0410\u0440\u0442\u0435\u043C \u0411\u0443\u043B\u043E\u0439\u0447\u0438\u043A", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 33, nationality: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C", specialty: "\u0414\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0430\u0442\u0430\u043A", bio: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0435\u0433\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F." },
    { name: "\u041A\u044E\u0440\u0438 \u0421\u0443\u043B\u0442\u0430\u043D\u0431\u0438\u0435\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 49, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041F\u0440\u043E\u0444\u0438\u043B\u0430\u043A\u0442\u0438\u043A\u0430 \u043F\u0435\u0440\u0435\u0433\u0440\u0443\u0437\u043E\u043A \u0438 \u0440\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u044F", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \xAB\u041A\u0440\u044B\u043B\u044C\u0435\u0432 \u0421\u043E\u0432\u0435\u0442\u043E\u0432\xBB." }
  ],
  "\u0430\u0445\u043C\u0430\u0442": [
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0422\u0430\u0448\u0443\u0435\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 67, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "press", styleTitle: "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u0441\u0438\u043B\u043E\u0432\u043E\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433", favoriteFormation: "4-2-3-1", specialty: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0431\u043E\u0440, \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0432\u0435\u0440\u0445\u043E\u0432\u0430\u044F \u0431\u043E\u0440\u044C\u0431\u0430", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0441 \u0436\u0435\u043B\u0435\u0437\u043D\u044B\u043C\u0438 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F\u043C\u0438 \u043A \u0441\u0430\u043C\u043E\u043E\u0442\u0434\u0430\u0447\u0435." },
    { name: "\u0412\u044F\u0447\u0435\u0441\u043B\u0430\u0432 \u041C\u043E\u043B\u0447\u0430\u043D\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 53, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0446\u0438\u044F \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0431\u043B\u043E\u043A\u0430", bio: "\u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0422\u0430\u0448\u0443\u0435\u0432\u0430." },
    { name: "\u0420\u0430\u043C\u0437\u0430\u043D \u0426\u0443\u0446\u0443\u043B\u0430\u0435\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 49, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0420\u0435\u0430\u043A\u0446\u0438\u044F \u0438 \u0441\u043C\u0435\u043B\u043E\u0441\u0442\u044C \u043D\u0430 \u0432\u044B\u0445\u043E\u0434\u0430\u0445", bio: "\u0413\u0440\u043E\u0437\u043D\u0435\u043D\u0441\u043A\u0438\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439." },
    { name: "\u0410\u0440\u0442\u0435\u043C \u0422\u0430\u0448\u0443\u0435\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 35, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u0438\u043B\u043E\u0432\u044B\u0435 \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u0438 \u0438 \u0440\u044B\u0432\u043A\u043E\u0432\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430", bio: "\u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0444\u0438\u0437\u0438\u043A\u0443 \u0438 \u043C\u044B\u0448\u0435\u0447\u043D\u044B\u0439 \u0442\u043E\u043D\u0443\u0441." },
    { name: "\u0410\u0434\u043B\u0430\u043D \u041A\u0430\u0446\u0430\u0435\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 37, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0418\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u0430\u044F \u0442\u0435\u0445\u043D\u0438\u043A\u0430 \u0438 \u0434\u0440\u0438\u0431\u043B\u0438\u043D\u0433 \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432", bio: "\u042D\u043A\u0441-\u0445\u0430\u0432\u0431\u0435\u043A \xAB\u0422\u0435\u0440\u0435\u043A\u0430\xBB/\xAB\u0410\u0445\u043C\u0430\u0442\u0430\xBB." },
    { name: "\u0410\u0441\u043B\u0430\u043D \u041A\u0430\u0431\u0438\u0441\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0430", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u0424\u041A \xAB\u0410\u0445\u043C\u0430\u0442\xBB." }
  ],
  "\u0431\u0430\u043B\u0442\u0438\u043A\u0430": [
    { name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u0422\u0430\u043B\u0430\u043B\u0430\u0435\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 53, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "press", styleTitle: "\u0422\u043E\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u0438 \u0431\u0435\u0448\u0435\u043D\u0430\u044F \u0441\u0430\u043C\u043E\u043E\u0442\u0434\u0430\u0447\u0430", favoriteFormation: "4-3-3", specialty: "\u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043C\u043E\u0449\u044C, \u0430\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0431\u043E\u0440 \u043C\u044F\u0447\u0430 \u0438 \u0444\u043B\u0430\u043D\u0433\u043E\u0432\u044B\u0435 \u043F\u0440\u043E\u0440\u044B\u0432\u044B", bio: "\u041E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u044F\u0440\u043A\u0438\u0445 \u0438 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0442\u0440\u0435\u043D\u0435\u0440\u043E\u0432 \u0441\u0442\u0440\u0430\u043D\u044B. \u0421\u0442\u0430\u0432\u0438\u0442 \u0430\u0442\u043B\u0435\u0442\u0438\u0447\u043D\u044B\u0439 \u0438 \u044D\u043D\u0435\u0440\u0433\u043E\u0437\u0430\u0442\u0440\u0430\u0442\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B." },
    { name: "\u042E\u0440\u0438\u0439 \u041D\u0430\u0433\u0430\u0439\u0446\u0435\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 52, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u043A\u0430 \u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u043E\u0432", bio: "\u0411\u0435\u0441\u0441\u043C\u0435\u043D\u043D\u044B\u0439 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A \u0432 \u0448\u0442\u0430\u0431\u0435 \u0422\u0430\u043B\u0430\u043B\u0430\u0435\u0432\u0430." },
    { name: "\u0413\u043B\u0435\u0431 \u041F\u0440\u0435\u0441\u043D\u044F\u043A\u043E\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0418\u0433\u0440\u0430 \u043D\u043E\u0433\u0430\u043C\u0438 \u0438 \u043A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0430\u0446\u0438\u044F", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \u043A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434\u0446\u0435\u0432." },
    { name: "\u0421\u0435\u0440\u0445\u0438\u043E \u0414\u0436\u043E\u0432\u0430\u043D\u043D\u0438", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 44, nationality: "\u0418\u0442\u0430\u043B\u0438\u044F", specialty: "\u0412\u044B\u0441\u043E\u043A\u043E\u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u0431\u0435\u0433\u043E\u0432\u043E\u0439 \u043E\u0431\u044A\u0451\u043C", bio: "\u0418\u0442\u0430\u043B\u044C\u044F\u043D\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0430\u0442\u043B\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438." },
    { name: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0412\u0430\u0440\u043B\u0430\u043C\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u043C \u0438 \u043E\u0431\u043E\u0440\u043E\u043D\u0435", age: 50, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0435\u0440\u0445\u043E\u0432\u044B\u0435 \u0434\u0443\u044D\u043B\u0438 \u0438 \u0443\u0433\u043B\u043E\u0432\u044B\u0435", bio: "\u042D\u043A\u0441-\u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A \u0426\u0421\u041A\u0410 \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." },
    { name: "\u041F\u0430\u0432\u0435\u043B \u0414\u0437\u044E\u0431\u0430", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435", bio: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \xAB\u0411\u0430\u043B\u0442\u0438\u043A\u0438\xBB." }
  ],
  "\u043E\u0440\u0435\u043D\u0431\u0443\u0440\u0433": [
    { name: "\u0414\u0430\u0432\u0438\u0434 \u0414\u0435\u043E\u0433\u0440\u0430\u0441\u0438\u044F", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 52, nationality: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", style: "possession", styleTitle: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C", favoriteFormation: "4-3-3", specialty: "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043F\u0430\u0441, \u0433\u0435\u043E\u043C\u0435\u0442\u0440\u0438\u044F \u0430\u0442\u0430\u043A \u0438 \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0435 \u043C\u044F\u0447\u043E\u043C", bio: "\u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A, \u0432\u043E\u0437\u0433\u043B\u0430\u0432\u043B\u044F\u0432\u0448\u0438\u0439 \u0430\u043A\u0430\u0434\u0435\u043C\u0438\u044E \u043A\u043B\u0443\u0431\u0430 \u0434\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u0442\u0440\u0435\u043D\u0435\u0440\u043E\u043C." },
    { name: "\u0418\u043B\u044C\u0434\u0430\u0440 \u0410\u0445\u043C\u0435\u0442\u0437\u044F\u043D\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041F\u043E\u043C\u043E\u0449\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u043C\u0443 \u0442\u0440\u0435\u043D\u0435\u0440\u0443 \u0438 \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F \u0441\u0445\u0435\u043C\u044B", bio: "\u0420\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0442\u0440\u0435\u043D\u0435\u0440\u0441\u043A\u043E\u0433\u043E \u0448\u0442\u0430\u0431\u0430." },
    { name: "\u041F\u043B\u0430\u0442\u043E\u043D \u0417\u0430\u0445\u0430\u0440\u0447\u0443\u043A", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 53, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u0432\u043E\u0440\u043E\u0442\u0430\u0445", bio: "\u0418\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440 90-\u0445 \u0438 2000-\u0445." },
    { name: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0421\u0442\u0443\u043A\u0430\u043B\u043E\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 40, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044C\u043D\u044B\u0439 \u0431\u0435\u0433 \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u044F\u043C." },
    { name: "\u0420\u0430\u0434\u0438\u043A \u042F\u043C\u043B\u0438\u0445\u0430\u043D\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 57, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439", bio: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0435\u0439 \u043B\u0438\u043D\u0438\u0438." },
    { name: "\u041C\u0430\u043A\u0441\u0438\u043C \u0412\u0430\u0445\u043B\u0430\u043A\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0420\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u044F \u0438 \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0430", bio: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \xAB\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433\u0430\xBB." }
  ],
  "\u0430\u043A\u0440\u043E\u043D": [
    { name: "\u0417\u0430\u0443\u0440 \u0422\u0435\u0434\u0435\u0435\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "attack", styleTitle: "\u0414\u0435\u0440\u0437\u043A\u0438\u0439 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B \u0431\u0435\u0437 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442\u043E\u0432", favoriteFormation: "4-3-3", specialty: "\u0421\u043C\u0435\u043B\u0430\u044F \u0438\u0433\u0440\u0430 \u043F\u0435\u0440\u0432\u044B\u043C \u043D\u043E\u043C\u0435\u0440\u043E\u043C \u0438 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F \u0444\u043E\u0440\u0432\u0430\u0440\u0434\u043E\u0432", bio: "\u0412\u044B\u0432\u0435\u043B \u0442\u043E\u043B\u044C\u044F\u0442\u0442\u0438\u043D\u0441\u043A\u0438\u0439 \xAB\u0410\u043A\u0440\u043E\u043D\xBB \u0432 \u044D\u043B\u0438\u0442\u0443 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0430." },
    { name: "\u0418\u043B\u044C\u044F \u041A\u0430\u043B\u0430\u0448\u043D\u0438\u043A\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u043B\u0430\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u044C", bio: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0448\u0442\u0430\u0431\u0430 \u0422\u0435\u0434\u0435\u0435\u0432\u0430." },
    { name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041B\u0443\u043A\u043E\u0448\u043A\u0438\u043D", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 48, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041E\u0442\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u0440\u043E\u0432 \u0432 \u0443\u043F\u043E\u0440", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \xAB\u0410\u043A\u0440\u043E\u043D\u0430\xBB." },
    { name: "\u0420\u0430\u043C\u0438\u043B\u044C \u0428\u0430\u0440\u0438\u043F\u043E\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 39, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0438 \u043F\u043E\u0434\u0432\u0438\u0436\u043D\u043E\u0441\u0442\u044C", bio: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0430\u0442\u043B\u0435\u0442\u0438\u0437\u043C\u0443." },
    { name: "\u0410\u043B\u0430\u043D \u041A\u0443\u0441\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0435\u0445\u043D\u0438\u043A\u0430 \u0443\u0434\u0430\u0440\u0430 \u0438 \u0445\u043B\u0430\u0434\u043D\u043E\u043A\u0440\u043E\u0432\u0438\u0435", bio: "\u042D\u043A\u0441-\u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." },
    { name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u0411\u0430\u0440\u0438\u043D\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 43, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0430", bio: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \xAB\u0410\u043A\u0440\u043E\u043D\u0430\xBB." }
  ],
  "\u0434\u0438\u043D\u0430\u043C\u043E \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430": [
    { name: "\u0425\u0430\u0441\u0430\u043D\u0431\u0438 \u0411\u0438\u0434\u0436\u0438\u0435\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 59, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "bus", styleTitle: "\u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043D\u0441\u043A\u0438\u0439 \u043C\u043E\u043D\u043E\u043B\u0438\u0442\u043D\u044B\u0439 \u0436\u0435\u043B\u0435\u0437\u043E\u0431\u0435\u0442\u043E\u043D", favoriteFormation: "5-3-2", specialty: "\u041E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0438 \u0441\u0430\u043C\u043E\u043E\u0442\u0432\u0435\u0440\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u044C", bio: "\u041D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0438\u043D\u0446\u0435\u0432, \u043F\u043E\u0441\u0442\u0440\u043E\u0438\u0432\u0448\u0438\u0439 \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u043C\u0430\u043B\u043E\u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0449\u0438\u0445 \u043A\u043E\u043C\u0430\u043D\u0434 \u043B\u0438\u0433\u0438." },
    { name: "\u0410\u0440\u0442\u0435\u043C \u041A\u0443\u043B\u0438\u043A\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0437 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u043E\u0432", bio: "\u0421\u0442\u0430\u0440\u0448\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0448\u0442\u0430\u0431\u0430 \u0411\u0438\u0434\u0436\u0438\u0435\u0432\u0430." },
    { name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u0440\u0430\u0449\u0435\u043D\u043A\u043E", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 55, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u0448\u043A\u043E\u043B\u0430 \u0438 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432 \u0440\u0430\u043C\u043A\u0435", bio: "\u041C\u043D\u043E\u0433\u043E\u043B\u0435\u0442\u043D\u0438\u0439 \u0432\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0438\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442." },
    { name: "\u041C\u0430\u0433\u043E\u043C\u0435\u0434 \u0420\u0430\u043C\u0430\u0437\u0430\u043D\u043E\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 41, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u0438\u043B\u043E\u0432\u0430\u044F \u043C\u043E\u0449\u044C \u0438 \u043C\u044B\u0448\u0435\u0447\u043D\u0430\u044F \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435." },
    { name: "\u0428\u0430\u043C\u0438\u043B\u044C \u041B\u0430\u0445\u0438\u044F\u043B\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0423\u0434\u0430\u0440\u044B \u0438 \u043D\u0435\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F", bio: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u0434\u0430\u0433\u0435\u0441\u0442\u0430\u043D\u0441\u043A\u0438\u0439 \u0444\u043E\u0440\u0432\u0430\u0440\u0434." },
    { name: "\u041C\u0430\u0440\u0430\u0442 \u041C\u0430\u0433\u043E\u043C\u0435\u0434\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 45, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F", bio: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \u043C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0438\u043D\u0441\u043A\u043E\u0433\u043E \xAB\u0414\u0438\u043D\u0430\u043C\u043E\xBB." }
  ],
  "\u0444\u0430\u043A\u0435\u043B": [
    { name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041F\u044F\u0442\u0438\u0431\u0440\u0430\u0442\u043E\u0432", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 49, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "bus", styleTitle: "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u0432\u043E\u0440\u043E\u043D\u0435\u0436\u0441\u043A\u0438\u0439 \u0431\u043E\u0439\u0446\u043E\u0432\u0441\u043A\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B", favoriteFormation: "5-3-2", specialty: "\u0411\u0435\u0448\u0435\u043D\u0430\u044F \u044D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u043A\u0430, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u0432\u0435\u0440\u0445\u043E\u0432\u044B\u0435 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0430", bio: "\u0425\u0430\u0440\u0438\u0437\u043C\u0430\u0442\u0438\u0447\u043D\u044B\u0439 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u043A \xAB\u043D\u0430\u0433\u043B\u0435\u0446\u043E\u0432 \u0438\u0437 \u0412\u043E\u0440\u043E\u043D\u0435\u0436\u0430\xBB." },
    { name: "\u0412\u0430\u043B\u0435\u0440\u0438\u0439 \u041A\u043B\u0438\u043C\u043E\u0432", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 52, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432", bio: "\u0418\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A \u0420\u041F\u041B." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0427\u0438\u0445\u0440\u0430\u0434\u0437\u0435", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 50, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0418\u0433\u0440\u0430 \u043D\u0430 \u0432\u044B\u0445\u043E\u0434\u0430\u0445 \u043F\u0440\u0438 \u0432\u0435\u0440\u0445\u043E\u0432\u044B\u0445 \u043F\u043E\u0434\u0430\u0447\u0430\u0445", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439 \xAB\u0424\u0430\u043A\u0435\u043B\u0430\xBB." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0417\u0430\u0439\u0446\u0435\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0411\u043E\u0439\u0446\u043E\u0432\u0441\u043A\u0430\u044F \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C", bio: "\u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0430\u0442\u043B\u0435\u0442\u0438\u0437\u043C \u0432\u043E\u0440\u043E\u043D\u0435\u0436\u0446\u0435\u0432." },
    { name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0421\u043C\u0438\u0440\u043D\u043E\u0432", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 35, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u044F \u0432 \u0447\u0443\u0436\u043E\u0439 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B." },
    { name: "\u041C\u0430\u043A\u0441\u0438\u043C \u0420\u0443\u043C\u044F\u043D\u0446\u0435\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 46, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0430", bio: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \xAB\u0424\u0430\u043A\u0435\u043B\u0430\xBB." }
  ],
  "\u0440\u043E\u0434\u0438\u043D\u0430": [
    { name: "\u0424\u0438\u043B\u0438\u043F\u043F \u0421\u043E\u043A\u043E\u043B\u0438\u043D\u0441\u043A\u0438\u0439", role: "head", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440", age: 39, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", style: "possession", styleTitle: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B", favoriteFormation: "4-3-3", specialty: "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043F\u0430\u0441, \u043F\u043E\u0438\u0441\u043A \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0445 \u0437\u043E\u043D \u0438 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433", bio: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u0441\u0442\u043E\u043B\u0438\u0447\u043D\u043E\u0439 \xAB\u0420\u043E\u0434\u0438\u043D\u044B\xBB." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u041F\u0430\u0432\u043B\u0435\u043D\u043A\u043E", role: "assistant", roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430", age: 41, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u0430 \u0438 \u0442\u0435\u0445\u043D\u0438\u043A\u0430 \u043F\u0430\u0441\u0430", bio: "\u042D\u043A\u0441-\u043F\u043B\u0435\u0439\u043C\u0435\u0439\u043A\u0435\u0440 \xAB\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u0430\xBB \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." },
    { name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0417\u0443\u0435\u0432", role: "gk", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439", age: 45, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0412\u0440\u0430\u0442\u0430\u0440\u0441\u043A\u0430\u044F \u0440\u0435\u0430\u043A\u0446\u0438\u044F \u0438 \u043F\u0440\u044B\u0433\u0443\u0447\u0435\u0441\u0442\u044C", bio: "\u042D\u043A\u0441-\u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440 \u043C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0433\u043E \xAB\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u0430\xBB." },
    { name: "\u0414\u0435\u043D\u0438\u0441 \u0413\u043E\u043B\u043E\u0431\u043E\u0440\u043E\u0434\u043E\u0432", role: "fitness", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435", age: 38, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u0444\u0438\u0442\u043D\u0435\u0441-\u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433", bio: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u044F\u043C." },
    { name: "\u0420\u043E\u043C\u0430\u043D \u041F\u0430\u0432\u043B\u044E\u0447\u0435\u043D\u043A\u043E", role: "attack", roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445", age: 44, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u0423\u0434\u0430\u0440\u043D\u043E\u0435 \u043C\u0430\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043E, \u0433\u043E\u043B\u0435\u0432\u043E\u0435 \u0447\u0443\u0442\u044C\u0451 \u0438 \u0432\u044B\u0431\u043E\u0440 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439", bio: "\u0411\u0440\u043E\u043D\u0437\u043E\u0432\u044B\u0439 \u043F\u0440\u0438\u0437\u0451\u0440 \u0415\u0432\u0440\u043E-2008, \u043B\u0435\u0433\u0435\u043D\u0434\u0430 \xAB\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u0430\xBB, \xAB\u0422\u043E\u0442\u0442\u0435\u043D\u0445\u044D\u043C\u0430\xBB \u0438 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438." },
    { name: "\u0410\u0440\u0442\u0443\u0440 \u0421\u0430\u0444\u0430\u0440\u043E\u0432", role: "doctor", roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430", age: 42, nationality: "\u0420\u043E\u0441\u0441\u0438\u044F", specialty: "\u041C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0438 \u0440\u0435\u0430\u0431\u0438\u043B\u0438\u0442\u0430\u0446\u0438\u044F", bio: "\u0413\u043B\u0430\u0432\u0432\u0440\u0430\u0447 \xAB\u0420\u043E\u0434\u0438\u043D\u044B\xBB." }
  ]
};
function generateClubStaff(team2) {
  const normName = (team2.name || "").toLowerCase().trim();
  for (const [k, list] of Object.entries(REAL_RPL_STAFFS)) {
    if (normName.includes(k) || k.includes(normName)) {
      return list.map((item, idx) => ({
        ...item,
        id: `staff_${team2.id}_${item.role}_${idx}`,
        teamId: team2.id,
        teamName: team2.name
      }));
    }
  }
  const headCoach = getTeamCoach(team2.name, team2.comp || "fnl");
  const hash = normName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const assistantFirstNames = ["\u041E\u043B\u0435\u0433", "\u0421\u0435\u0440\u0433\u0435\u0439", "\u0410\u043D\u0434\u0440\u0435\u0439", "\u0418\u0433\u043E\u0440\u044C", "\u041C\u0438\u0445\u0430\u0438\u043B", "\u0410\u043B\u0435\u043A\u0441\u0435\u0439", "\u0414\u043C\u0438\u0442\u0440\u0438\u0439", "\u0412\u0438\u0442\u0430\u043B\u0438\u0439"];
  const assistantLastNames = ["\u0412\u0430\u0441\u0438\u043B\u044C\u0435\u0432", "\u041F\u043E\u043F\u043E\u0432", "\u0413\u0440\u0438\u0433\u043E\u0440\u044C\u0435\u0432", "\u041D\u0438\u043A\u043E\u043B\u0430\u0435\u0432", "\u041A\u0443\u0437\u044C\u043C\u0438\u043D", "\u0421\u0435\u043C\u0451\u043D\u043E\u0432", "\u0411\u043E\u0433\u0434\u0430\u043D\u043E\u0432"];
  const gkFirstNames = ["\u041F\u043B\u0430\u0442\u043E\u043D", "\u0415\u0432\u0433\u0435\u043D\u0438\u0439", "\u0414\u043C\u0438\u0442\u0440\u0438\u0439", "\u0412\u0438\u043A\u0442\u043E\u0440", "\u0413\u0435\u043D\u043D\u0430\u0434\u0438\u0439", "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440", "\u0420\u043E\u043C\u0430\u043D"];
  const gkLastNames = ["\u0413\u043E\u043D\u0447\u0430\u0440\u043E\u0432", "\u041A\u043E\u0440\u043D\u0435\u0435\u0432", "\u0429\u0435\u0440\u0431\u0430\u043A\u043E\u0432", "\u0410\u0444\u0430\u043D\u0430\u0441\u044C\u0435\u0432", "\u041A\u0443\u0434\u0440\u044F\u0432\u0446\u0435\u0432", "\u0411\u0435\u043B\u043E\u0432"];
  const fitFirstNames = ["\u0410\u043D\u0442\u043E\u043D\u0438\u043E", "\u041C\u0430\u0440\u043A\u043E", "\u0418\u0432\u0430\u043D", "\u0414\u0435\u043D\u0438\u0441", "\u0421\u0435\u0440\u0433\u0435\u0439", "\u041A\u0430\u0440\u043B\u043E\u0441", "\u041C\u0430\u043A\u0441\u0438\u043C"];
  const fitLastNames = ["\u041C\u0430\u0440\u0442\u0438\u043D\u0435\u0441", "\u0421\u043E\u043B\u043E\u0432\u044C\u0435\u0432", "\u041A\u043E\u0432\u0430\u043B\u0435\u0432", "\u0415\u0433\u043E\u0440\u043E\u0432", "\u0421\u0442\u0435\u043F\u0430\u043D\u043E\u0432", "\u041F\u0430\u0432\u043B\u043E\u0432"];
  const attFirstNames = ["\u0420\u043E\u043C\u0430\u043D", "\u0414\u0435\u043D\u0438\u0441", "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440", "\u0412\u0430\u043B\u0435\u0440\u0438\u0439", "\u0415\u0432\u0433\u0435\u043D\u0438\u0439", "\u0410\u0440\u0442\u0435\u043C", "\u041C\u0430\u043A\u0441\u0438\u043C"];
  const attLastNames = ["\u0411\u0443\u0437\u043D\u0438\u043A\u0438\u043D", "\u0428\u0438\u0448\u043A\u0438\u043D", "\u0421\u0435\u043D\u043D\u0438\u043A\u043E\u0432", "\u041F\u0438\u043C\u0435\u043D\u043E\u0432", "\u041A\u0438\u0440\u0438\u0447\u0435\u043D\u043A\u043E", "\u041C\u0435\u0434\u0432\u0435\u0434\u0435\u0432"];
  const docFirstNames = ["\u041C\u0438\u0445\u0430\u0438\u043B", "\u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440", "\u0410\u0440\u0442\u0443\u0440", "\u041A\u0438\u0440\u0438\u043B\u043B", "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440", "\u0414\u043C\u0438\u0442\u0440\u0438\u0439", "\u041F\u0430\u0432\u0435\u043B"];
  const docLastNames = ["\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043E\u0432", "\u0411\u0435\u043B\u043E\u0443\u0441\u043E\u0432", "\u0421\u0443\u0445\u0430\u043D\u043E\u0432", "\u0422\u0430\u0440\u0430\u0441\u043E\u0432", "\u0418\u043B\u044C\u0438\u043D", "\u0421\u043E\u0440\u043E\u043A\u0438\u043D"];
  return [
    {
      id: `staff_${team2.id}_head`,
      name: headCoach.name,
      role: "head",
      roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440",
      teamId: team2.id,
      teamName: team2.name,
      age: headCoach.age,
      nationality: headCoach.nationality,
      style: headCoach.style,
      styleTitle: headCoach.styleTitle,
      favoriteFormation: headCoach.favoriteFormation,
      specialty: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439 \u0438 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
      bio: headCoach.styleDesc
    },
    {
      id: `staff_${team2.id}_assistant`,
      name: `${assistantFirstNames[(hash + 1) % assistantFirstNames.length]} ${assistantLastNames[hash * 3 % assistantLastNames.length]}`,
      role: "assistant",
      roleTitle: "\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430",
      teamId: team2.id,
      teamName: team2.name,
      age: 38 + hash % 18,
      nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
      specialty: "\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0446\u0438\u044F \u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043E\u043A \u0438 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0445 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
      bio: `\u0421\u0442\u0430\u0440\u0448\u0438\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0448\u0442\u0430\u0431\u0430 \u043A\u043B\u0443\u0431\u0430 \xAB${team2.name}\xBB. \u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0443\u044E \u0440\u0430\u0431\u043E\u0442\u0443 \u0438 \u0441\u0432\u044F\u0437\u044C \u0441 \u043E\u0441\u043D\u043E\u0432\u043E\u0439.`
    },
    {
      id: `staff_${team2.id}_gk`,
      name: `${gkFirstNames[(hash + 2) % gkFirstNames.length]} ${gkLastNames[hash * 5 % gkLastNames.length]}`,
      role: "gk",
      roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0432\u0440\u0430\u0442\u0430\u0440\u0435\u0439",
      teamId: team2.id,
      teamName: team2.name,
      age: 44 + hash % 20,
      nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
      specialty: "\u0418\u0433\u0440\u0430 \u043D\u0430 \u0432\u044B\u0445\u043E\u0434\u0430\u0445, \u0440\u0435\u0430\u043A\u0446\u0438\u044F \u0438 \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u044F \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440\u043E\u0432",
      bio: `\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u043E \u0440\u0430\u0431\u043E\u0442\u0435 \u0441 \u0432\u0440\u0430\u0442\u0430\u0440\u044F\u043C\u0438 \u0424\u041A \xAB${team2.name}\xBB. \u042D\u043A\u0441-\u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0433\u043E\u043B\u043A\u0438\u043F\u0435\u0440.`
    },
    {
      id: `staff_${team2.id}_fitness`,
      name: `${fitFirstNames[(hash + 3) % fitFirstNames.length]} ${fitLastNames[hash * 7 % fitLastNames.length]}`,
      role: "fitness",
      roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u043E \u0444\u0438\u0437\u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0435",
      teamId: team2.id,
      teamName: team2.name,
      age: 35 + hash % 15,
      nationality: hash % 3 === 0 ? "\u0418\u0441\u043F\u0430\u043D\u0438\u044F" : "\u0420\u043E\u0441\u0441\u0438\u044F",
      specialty: "\u0410\u044D\u0440\u043E\u0431\u043D\u0430\u044F \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C, \u0432\u0437\u0440\u044B\u0432\u043D\u0430\u044F \u0441\u0438\u043B\u0430 \u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u0430\u043A\u0442\u0438\u043A\u0430 \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u0438\u0437\u043C\u0430",
      bio: `\u041E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u0437\u0430 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0443\u044E \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043A \u043C\u0430\u0442\u0447\u0430\u043C.`
    },
    {
      id: `staff_${team2.id}_attack`,
      name: `${attFirstNames[(hash + 4) % attFirstNames.length]} ${attLastNames[hash * 11 % attLastNames.length]}`,
      role: "attack",
      roleTitle: "\u0422\u0440\u0435\u043D\u0435\u0440 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432",
      teamId: team2.id,
      teamName: team2.name,
      age: 38 + hash % 16,
      nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
      specialty: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0430\u0442\u0430\u043A, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u043D\u0438\u044F \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445",
      bio: `\u0422\u0440\u0435\u043D\u0435\u0440 \u0430\u0442\u0430\u043A\u0443\u044E\u0449\u0435\u0439 \u0433\u0440\u0443\u043F\u043F\u044B \u0438\u0433\u0440\u043E\u043A\u043E\u0432. \u041E\u0442\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0443\u0434\u0430\u0440\u044B, \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044B \u0438 \u0438\u0433\u0440\u0443 \u0432 \u0447\u0443\u0436\u043E\u0439 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439.`
    },
    {
      id: `staff_${team2.id}_doctor`,
      name: `${docFirstNames[(hash + 5) % docFirstNames.length]} ${docLastNames[hash * 13 % docLastNames.length]}`,
      role: "doctor",
      roleTitle: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0432\u0440\u0430\u0447 \u043A\u043B\u0443\u0431\u0430",
      teamId: team2.id,
      teamName: team2.name,
      age: 42 + hash % 18,
      nationality: "\u0420\u043E\u0441\u0441\u0438\u044F",
      specialty: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u044F, \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435",
      bio: `\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u0448\u0442\u0430\u0431\u0430 \xAB${team2.name}\xBB. \u041E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435 \u0438 \u0441\u043A\u043E\u0440\u0435\u0439\u0448\u0435\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0438\u0433\u0440\u043E\u043A\u043E\u0432.`
    }
  ];
}
function getAllInitialStaff(teams) {
  const result = [];
  for (const t of teams) {
    result.push(...generateClubStaff(t));
  }
  return result;
}

// src/awards.ts
function computeMatchRatings(m, f, HName, AName) {
  if (!m || !m.stats || !m.stats.players) return [];
  const homeWin = f.hg > f.ag;
  const awayWin = f.ag > f.hg;
  const draw = f.hg === f.ag;
  const ratings = [];
  for (const [pid, s] of Object.entries(m.stats.players)) {
    if (!s || (s.min || 0) < 10) continue;
    const isHome = s.side === "home";
    const won = isHome ? homeWin : awayWin;
    const lost = isHome ? awayWin : homeWin;
    const teamName = isHome ? HName : AName;
    const oppName = isHome ? AName : HName;
    const pos = m.ctx?.pos?.[pid] || "\u041F\u0417";
    let r = 6;
    if (s.min >= 75) r += 0.2;
    if (won) r += 0.4;
    else if (lost) r -= 0.3;
    if (pos === "\u0412\u0420" || pos === "\u0417\u0410\u0429") {
      r += (s.g || 0) * 1.5;
    } else {
      r += (s.g || 0) * 1.15;
    }
    r += (s.a || 0) * 0.75;
    r += (s.xg || 0) * 0.4;
    if (s.sh > 3) r += 0.2;
    if (pos === "\u0412\u0420") {
      r += (s.sv || 0) * 0.35;
      if (s.cs) r += 0.9;
      const goalsConceded = isHome ? f.ag : f.hg;
      if (goalsConceded > 2) r -= (goalsConceded - 2) * 0.4;
    }
    if (pos === "\u0417\u0410\u0429") {
      r += (s.tk || 0) * 0.25;
      if (s.cs && s.min >= 60) r += 0.6;
    }
    if (s.yc) r -= 0.4;
    if (s.rc) r -= 2;
    if ((s.ff || 0) > 3) r -= 0.2;
    if ((s.fa || 0) > 3) r += 0.2;
    const finalRating = Math.max(4, Math.min(10, +r.toFixed(1)));
    let highlight = "";
    if (s.g >= 3) highlight = `\u0425\u0435\u0442-\u0442\u0440\u0438\u043A (${s.g} \u0433\u043E\u043B\u0430)`;
    else if (s.g === 2) highlight = `\u0414\u0443\u0431\u043B\u044C \u0432 \u043C\u0430\u0442\u0447\u0435`;
    else if (s.g === 1 && s.a >= 1) highlight = `\u0413\u043E\u043B + \u0433\u043E\u043B\u0435\u0432\u0430\u044F \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430`;
    else if (s.g === 1) highlight = `\u0417\u0430\u0431\u0438\u0442\u044B\u0439 \u043C\u044F\u0447`;
    else if (s.a >= 2) highlight = `\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u0441\u043A\u0438\u0439 \u0434\u0443\u0431\u043B\u044C (${s.a} \u043F\u0430\u0441\u0430)`;
    else if (s.a === 1) highlight = `\u0413\u043E\u043B\u0435\u0432\u0430\u044F \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430`;
    else if (pos === "\u0412\u0420" && s.sv >= 5) highlight = `${s.sv} \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0445 \u0441\u0435\u0439\u0432\u043E\u0432`;
    else if (pos === "\u0412\u0420" && s.cs) highlight = `\u0421\u0443\u0445\u043E\u0439 \u043C\u0430\u0442\u0447`;
    else if (pos === "\u0417\u0410\u0429" && s.tk >= 4) highlight = `${s.tk} \u0443\u0441\u043F\u0435\u0448\u043D\u044B\u0445 \u043E\u0442\u0431\u043E\u0440\u0430`;
    else highlight = `\u041D\u0430\u0434\u0435\u0436\u043D\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u043E\u0441\u043D\u043E\u0432\u0435 (${s.min}')`;
    ratings.push({
      pid,
      name: s.n || "\u0418\u0433\u0440\u043E\u043A",
      pos,
      teamId: s.t,
      teamName,
      side: s.side,
      rating: finalRating,
      min: s.min,
      goals: s.g || 0,
      assists: s.a || 0,
      saves: s.sv || 0,
      tackles: s.tk || 0,
      shots: s.sh || 0,
      xg: s.xg || 0,
      cleanSheet: s.cs || 0,
      yc: s.yc || 0,
      rc: s.rc || 0,
      highlight
    });
  }
  ratings.sort((a, b) => b.rating - a.rating || b.goals + b.assists - (a.goals + a.assists) || b.min - a.min);
  return ratings;
}
function getMatchMotm(m, f, HName, AName, coachHome, coachAway) {
  const ratings = computeMatchRatings(m, f, HName, AName);
  if (!ratings.length) return null;
  const best = ratings[0];
  const isHome = best.side === "home";
  const coach = isHome ? coachHome : coachAway;
  const oppCoach = isHome ? coachAway : coachHome;
  const myTeam = best.teamName;
  const oppTeam = isHome ? AName : HName;
  const won = isHome && f.hg > f.ag || !isHome && f.ag > f.hg;
  const draw = f.hg === f.ag;
  let headline = `\xAB${best.name}: \u0437\u0430\u043B\u043E\u0433 \u0443\u0441\u043F\u0435\u0445\u0430 \u2014 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043F\u043B\u0430\u043D\u0430 \u043D\u0430 \u0438\u0433\u0440\u0443\xBB`;
  let quote = "";
  let tacticsComment = "";
  let mood = won ? "euphoric" : draw ? "calm" : "frustrated";
  if (best.goals >= 2) {
    headline = `\xAB${best.name}: \u043F\u043E\u0441\u0432\u044F\u0449\u0430\u044E \u044D\u0442\u043E\u0442 \u0434\u0443\u0431\u043B\u044C \u043D\u0430\u0448\u0438\u043C \u043F\u0440\u0435\u0434\u0430\u043D\u043D\u044B\u043C \u0431\u043E\u043B\u0435\u043B\u044C\u0449\u0438\u043A\u0430\u043C!\xBB`;
    quote = `\u042D\u043C\u043E\u0446\u0438\u0438 \u0444\u0430\u043D\u0442\u0430\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435! \u041C\u044F\u0447 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043E\u0442\u043B\u0438\u0447\u043D\u043E \u0441\u043B\u0443\u0448\u0430\u043B\u0441\u044F, \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u044B \u0432\u044B\u043A\u0430\u0442\u044B\u0432\u0430\u043B\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u043F\u0440\u044F\u043C\u043E \u043F\u043E\u0434 \u0443\u0434\u0430\u0440. \u041C\u044B \u043F\u0440\u043E\u0432\u0435\u043B\u0438 \u043A\u043E\u043B\u043E\u0441\u0441\u0430\u043B\u044C\u043D\u0443\u044E \u0440\u0430\u0431\u043E\u0442\u0443 \u043D\u0430 \u043F\u0440\u0435\u0434\u043C\u0430\u0442\u0447\u0435\u0432\u044B\u0445 \u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043A\u0430\u0445, \u0438 \u044D\u0442\u043E \u0434\u0430\u043B\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442.`;
  } else if (best.goals === 1 && won) {
    headline = `\xAB${best.name}: \u043C\u043E\u0439 \u0433\u043E\u043B \u2014 \u044D\u0442\u043E \u0437\u0430\u0441\u043B\u0443\u0433\u0430 \u0432\u0441\u0435\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u044B\xBB`;
    quote = `\u0421\u0430\u043C\u043E\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u2014 \u0442\u0440\u0438 \u043E\u0447\u043A\u0430 \u0432 \u043A\u043E\u043F\u0438\u043B\u043A\u0443 \u043A\u043B\u0443\u0431\u0430. \u0417\u043D\u0430\u043B\u0438, \u0447\u0442\u043E ${oppTeam} \u0431\u0443\u0434\u0435\u0442 \u0431\u0438\u0442\u044C\u0441\u044F \u0437\u0430 \u043A\u0430\u0436\u0434\u044B\u0439 \u043C\u0435\u0442\u0440 \u043F\u043E\u043B\u044F, \u043D\u043E \u043C\u044B \u0432\u044B\u0434\u0435\u0440\u0436\u0430\u043B\u0438 \u0442\u0435\u043C\u043F \u0438 \u0440\u0435\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043B\u0438 \u0441\u0432\u043E\u0439 \u0448\u0430\u043D\u0441.`;
  } else if (best.pos === "\u0412\u0420" && (best.saves >= 4 || best.cleanSheet)) {
    headline = `\xAB${best.name}: \u043A\u043E\u0433\u0434\u0430 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u0438 \u0441\u0442\u0440\u0430\u0445\u0443\u044E\u0442, \u043B\u043E\u0432\u0438\u0442\u044C \u043A\u0443\u0440\u0430\u0436 \u043D\u0430\u043C\u043D\u043E\u0433\u043E \u043B\u0435\u0433\u0447\u0435\xBB`;
    quote = `\u0422\u044F\u0436\u0435\u043B\u0435\u0439\u0448\u0438\u0439 \u043C\u0430\u0442\u0447 \u0434\u043B\u044F \u0432\u0440\u0430\u0442\u0430\u0440\u044F. \u041D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E \u043D\u0430\u0433\u0440\u0443\u0436\u0430\u043B\u0438 \u0448\u0442\u0440\u0430\u0444\u043D\u0443\u044E \u0438 \u043E\u043F\u0430\u0441\u043D\u043E \u0431\u0438\u043B\u0438 \u0438\u0437 \u043B\u044E\u0431\u044B\u0445 \u043F\u043E\u0437\u0438\u0446\u0438\u0439. \u0420\u0430\u0434, \u0447\u0442\u043E \u0432\u044B\u0440\u0443\u0447\u0438\u043B \u043F\u0430\u0440\u043D\u0435\u0439 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u043B \u0432\u043E\u0440\u043E\u0442\u0430 \u0432 \u043D\u0435\u043F\u0440\u0438\u043A\u043E\u0441\u043D\u043E\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438.`;
  } else if (best.assists >= 1) {
    headline = `\xAB${best.name}: \u0432\u0441\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u0442\u0430\u043A\u0443\u044E \u043F\u043B\u043E\u0442\u043D\u0443\u044E \u043E\u0431\u043E\u0440\u043E\u043D\u0443 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u0438\u044F\u0442\u043D\u043E\xBB`;
    quote = `\u0422\u0440\u0435\u043D\u0435\u0440 \u043F\u0435\u0440\u0435\u0434 \u0432\u044B\u0445\u043E\u0434\u043E\u043C \u043D\u0430 \u043F\u043E\u043B\u0435 \u043F\u0440\u044F\u043C\u043E \u0441\u043A\u0430\u0437\u0430\u043B: \u0438\u0449\u0438 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u043A\u043E\u0440\u0438\u0434\u043E\u0440\u044B \u043C\u0435\u0436\u0434\u0443 \u043B\u0438\u043D\u0438\u044F\u043C\u0438. \u0423\u0432\u0438\u0434\u0435\u043B \u0440\u044B\u0432\u043E\u043A \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0430, \u0432\u043B\u043E\u0436\u0438\u043B \u043C\u044F\u0447 \u0432 \u043D\u043E\u0433\u0443 \u2014 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u0431\u044B\u043B\u043E \u0434\u0435\u043B\u043E\u043C \u0442\u0435\u0445\u043D\u0438\u043A\u0438.`;
  } else if (won) {
    headline = `\xAB${best.name}: \u043C\u044B \u0434\u043E\u043A\u0430\u0437\u0430\u043B\u0438, \u0447\u0442\u043E \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0438 \u0433\u043E\u0442\u043E\u0432\u044B \u0431\u043E\u0440\u043E\u0442\u044C\u0441\u044F \u0437\u0430 \u0441\u0430\u043C\u044B\u0435 \u0432\u044B\u0441\u043E\u043A\u0438\u0435 \u043C\u0435\u0441\u0442\u0430\xBB`;
    quote = `\u041F\u043E\u0431\u0435\u0434\u0430 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0430\u0441\u044C \u0442\u0440\u0443\u0434\u043E\u0432\u043E\u0439. \u041C\u044B \u043D\u0435 \u0443\u0441\u0442\u0443\u043F\u0438\u043B\u0438 \u043D\u0438 \u0432 \u043E\u0434\u043D\u043E\u043C \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0435 \u0438 \u043F\u0435\u0440\u0435\u0442\u0435\u0440\u043F\u0435\u043B\u0438 \u0432\u0441\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0438 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u043F\u0435\u0440\u0435\u043B\u043E\u043C\u0438\u0442\u044C \u0438\u0433\u0440\u0443.`;
  } else {
    headline = `\xAB${best.name}: \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043E\u0441\u0430\u0434\u043E\u043A, \u043D\u043E \u043C\u044B \u0441\u0434\u0435\u043B\u0430\u043B\u0438 \u0432\u0441\u0451 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0435\xBB`;
    quote = `\u0425\u043E\u0442\u0435\u043B\u043E\u0441\u044C \u0431\u043E\u043B\u044C\u0448\u0435\u0433\u043E, \u0438\u0433\u0440\u0430 \u0434\u0430\u0432\u0430\u043B\u0430\u0441\u044C, \u043D\u043E \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u043F\u043E\u0434\u0432\u0435\u043B\u0430. \u0421\u0434\u0435\u043B\u0430\u0435\u043C \u0432\u044B\u0432\u043E\u0434\u044B \u0438 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0442\u0443\u0440\u0435 \u0432\u044B\u0439\u0434\u0435\u043C \u0435\u0449\u0451 \u0431\u043E\u043B\u0435\u0435 \u0437\u0430\u0440\u044F\u0436\u0435\u043D\u043D\u044B\u043C\u0438.`;
  }
  if (coach) {
    if (coach.style === "bus") {
      tacticsComment = `\xAB\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 ${coach.name} \u0431\u044B\u043B\u0430 \u043F\u0440\u0435\u0434\u0435\u043B\u044C\u043D\u043E \u043F\u043E\u043D\u044F\u0442\u043D\u0430: \u0441\u044B\u0433\u0440\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E, \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E \u0443 \u0441\u0432\u043E\u0435\u0439 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0438 \u043F\u0435\u0440\u0435\u043A\u0440\u044B\u0442\u044C \u0432\u0441\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0435 \u0437\u043E\u043D\u044B. \u041C\u044B "\u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0430\u0432\u0442\u043E\u0431\u0443\u0441", \u043A\u043E\u0433\u0434\u0430 \u044D\u0442\u043E \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C, \u0438 \u043D\u0435 \u0434\u0430\u043B\u0438 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0443 \u043D\u0438\u0447\u0435\u0433\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C\xBB.`;
    } else if (coach.style === "attack") {
      tacticsComment = `\xAB${coach.name} \u0441 \u043F\u0435\u0440\u0432\u044B\u0445 \u043C\u0438\u043D\u0443\u0442 \u0437\u0430\u0440\u044F\u0436\u0430\u043B \u043D\u0430\u0441 \u043D\u0430 \u0430\u0442\u0430\u043A\u0443. \u041D\u0430\u043C \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u043B\u0438 \u043F\u0440\u0438\u0436\u0438\u043C\u0430\u0442\u044C\u0441\u044F \u043D\u0430\u0437\u0430\u0434 \u0434\u0430\u0436\u0435 \u043F\u0440\u0438 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E\u043C \u0441\u0447\u0451\u0442\u0435 \u2014 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u0438 \u0431\u0435\u0436\u0430\u0442\u044C \u0432\u043F\u0435\u0440\u0451\u0434, \u0431\u0438\u0442\u044C \u0438 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433\u043E\u0432\u0430\u0442\u044C \u0434\u043E \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u0432\u0438\u0441\u0442\u043A\u0430\xBB.`;
    } else if (coach.style === "press") {
      tacticsComment = `\xAB\u041F\u0440\u0435\u0441\u0441\u0438\u043D\u0433 \u043E\u0442\u043D\u044F\u043B \u043C\u043D\u043E\u0433\u043E \u0441\u0438\u043B, \u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0442\u0440\u0435\u043D\u0435\u0440\u0430 \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u0430 \u043D\u0430 100%. \u041C\u044B \u0431\u0443\u043A\u0432\u0430\u043B\u044C\u043D\u043E \u0437\u0430\u0434\u0443\u0448\u0438\u043B\u0438 ${oppTeam} \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F \u0438 \u0437\u0430\u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0438\u0445 \u043E\u0448\u0438\u0431\u0430\u0442\u044C\u0441\u044F\xBB.`;
    } else if (coach.style === "possession") {
      tacticsComment = `\xAB\u041C\u044B \u0432\u043B\u0430\u0434\u0435\u043B\u0438 \u043C\u044F\u0447\u043E\u043C \u0438 \u0434\u0438\u043A\u0442\u043E\u0432\u0430\u043B\u0438 \u0441\u0432\u043E\u0439 \u0440\u0438\u0442\u043C. ${coach.name} \u0443\u0447\u0438\u0442 \u043D\u0430\u0441 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u044E \u2014 \u0440\u0430\u0441\u0448\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u0447\u0443\u0436\u0438\u0435 \u043E\u0431\u043E\u0440\u043E\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u0434\u0443\u0442\u044B \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u043C \u043F\u0430\u0441\u043E\u043C \u0434\u043E \u0432\u0435\u0440\u043D\u043E\u0433\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u0430\xBB.`;
    } else {
      tacticsComment = `\xAB\u041F\u043B\u0430\u043D \u043D\u0430 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A\u0438 \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u043B \u0432\u0435\u043B\u0438\u043A\u043E\u043B\u0435\u043F\u043D\u043E. \u0422\u0440\u0435\u043D\u0435\u0440 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u043B \u0441\u043B\u0430\u0431\u044B\u0435 \u0437\u043E\u043D\u044B \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430, \u0438 \u043D\u0430\u0448\u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0435 \u0432\u044B\u043F\u0430\u0434\u044B \u0441\u0442\u0430\u043B\u0438 \u0434\u043B\u044F \u043D\u0438\u0445 \u043F\u043E\u043B\u043D\u043E\u0439 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u043E\u0441\u0442\u044C\u044E\xBB.`;
    }
  } else {
    tacticsComment = `\xAB\u0422\u0440\u0435\u043D\u0435\u0440\u0441\u043A\u0438\u0439 \u0448\u0442\u0430\u0431 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u043B \u043D\u0430\u0441 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043A \u044D\u0442\u043E\u0439 \u0438\u0433\u0440\u0435\xBB.`;
  }
  return {
    pid: best.pid,
    name: best.name,
    pos: best.pos,
    teamId: best.teamId,
    teamName: best.teamName,
    rating: best.rating,
    interview: {
      headline,
      quote,
      tacticsComment,
      mood
    }
  };
}
function buildTeamOfRound(roundLabelText, comp, fixtures, matchesMap, teamsMap) {
  const roundFixtures = fixtures.filter((f) => f.comp === comp && (f.label === roundLabelText || `${f.round}-\u0439 \u0442\u0443\u0440` === roundLabelText || String(f.round) === roundLabelText) && f.status === "done");
  if (!roundFixtures.length) return null;
  const allRatings = [];
  for (const f of roundFixtures) {
    const m = matchesMap[f.id];
    if (!m || !m.stats) continue;
    const H = teamsMap[f.home]?.name || f.home;
    const A = teamsMap[f.away]?.name || f.away;
    const list = computeMatchRatings(m, f, H, A);
    for (const r of list) {
      r.teamLogo = teamsMap[r.teamId]?.logo;
      allRatings.push(r);
    }
  }
  if (allRatings.length < 11) return null;
  const gks = allRatings.filter((p) => p.pos === "\u0412\u0420").sort((a, b) => b.rating - a.rating);
  const defs = allRatings.filter((p) => p.pos === "\u0417\u0410\u0429").sort((a, b) => b.rating - a.rating);
  const mids = allRatings.filter((p) => p.pos === "\u041F\u0417").sort((a, b) => b.rating - a.rating);
  const fwds = allRatings.filter((p) => p.pos === "\u041D\u0410\u041F").sort((a, b) => b.rating - a.rating);
  const pickedGk = gks[0] || allRatings[0];
  const pickedDefs = defs.slice(0, 4);
  const pickedMids = mids.slice(0, 3);
  const pickedFwds = fwds.slice(0, 3);
  const usedPids = /* @__PURE__ */ new Set([pickedGk.pid, ...pickedDefs.map((p) => p.pid), ...pickedMids.map((p) => p.pid), ...pickedFwds.map((p) => p.pid)]);
  const remaining = allRatings.filter((p) => !usedPids.has(p.pid)).sort((a, b) => b.rating - a.rating);
  while (pickedDefs.length < 4 && remaining.length) {
    const p = remaining.shift();
    pickedDefs.push(p);
    usedPids.add(p.pid);
  }
  while (pickedMids.length < 3 && remaining.length) {
    const p = remaining.shift();
    pickedMids.push(p);
    usedPids.add(p.pid);
  }
  while (pickedFwds.length < 3 && remaining.length) {
    const p = remaining.shift();
    pickedFwds.push(p);
    usedPids.add(p.pid);
  }
  const starting11 = [pickedGk, ...pickedDefs, ...pickedMids, ...pickedFwds];
  const bestOfAll = [...starting11].sort((a, b) => b.rating - a.rating)[0];
  const winningFx = [...roundFixtures].sort((a, b) => Math.abs(b.hg - b.ag) - Math.abs(a.hg - a.ag))[0];
  const winTeamId = winningFx ? winningFx.hg >= winningFx.ag ? winningFx.home : winningFx.away : roundFixtures[0]?.home;
  const winTeam = teamsMap[winTeamId];
  return {
    title: `\u0421\u0431\u043E\u0440\u043D\u0430\u044F ${roundLabelText}`,
    periodLabel: roundLabelText,
    comp,
    formation: "4-3-3",
    playerOfThePeriod: bestOfAll,
    coachOfThePeriod: {
      name: winTeam?.coach?.name || "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440",
      teamName: winTeam?.name || "\u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u0442\u0443\u0440\u0430",
      teamLogo: winTeam?.logo,
      reason: `\u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0442\u0440\u0438\u0443\u043C\u0444 \u0438 \u0434\u043E\u043C\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043D\u0430\u0434 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u043E\u043C \u0432 \u0442\u0443\u0440\u0435`
    },
    lineup: {
      gk: pickedGk,
      def: pickedDefs,
      mid: pickedMids,
      fwd: pickedFwds
    },
    bench: remaining.slice(0, 5)
  };
}
function buildTeamOfMonth(yearMonth, comp, fixtures, matchesMap, teamsMap) {
  const monthNames = {
    "01": "\u042F\u043D\u0432\u0430\u0440\u044C",
    "02": "\u0424\u0435\u0432\u0440\u0430\u043B\u044C",
    "03": "\u041C\u0430\u0440\u0442",
    "04": "\u0410\u043F\u0440\u0435\u043B\u044C",
    "05": "\u041C\u0430\u0439",
    "06": "\u0418\u044E\u043D\u044C",
    "07": "\u0418\u044E\u043B\u044C",
    "08": "\u0410\u0432\u0433\u0443\u0441\u0442",
    "09": "\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C",
    "10": "\u041E\u043A\u0442\u044F\u0431\u0440\u044C",
    "11": "\u041D\u043E\u044F\u0431\u0440\u044C",
    "12": "\u0414\u0435\u043A\u0430\u0431\u0440\u044C"
  };
  const [y, mStr] = yearMonth.split("-");
  const label = `${monthNames[mStr] || mStr} ${y}`;
  const monthFx = fixtures.filter((f) => f.comp === comp && (f.date || "").startsWith(yearMonth) && f.status === "done");
  if (!monthFx.length) return null;
  const playerStats = {};
  for (const f of monthFx) {
    const m = matchesMap[f.id];
    if (!m || !m.stats) continue;
    const H = teamsMap[f.home]?.name || f.home;
    const A = teamsMap[f.away]?.name || f.away;
    const list = computeMatchRatings(m, f, H, A);
    for (const r of list) {
      const cur = playerStats[r.pid] ||= {
        pid: r.pid,
        name: r.name,
        pos: r.pos,
        teamId: r.teamId,
        teamName: r.teamName,
        ratings: [],
        goals: 0,
        assists: 0,
        saves: 0,
        tackles: 0,
        shots: 0,
        xg: 0,
        cleanSheets: 0,
        matches: 0
      };
      cur.ratings.push(r.rating);
      cur.goals += r.goals;
      cur.assists += r.assists;
      cur.saves += r.saves;
      cur.tackles += r.tackles;
      cur.shots += r.shots;
      cur.xg += r.xg;
      cur.cleanSheets += r.cleanSheet;
      cur.matches += 1;
    }
  }
  const allRatings = Object.values(playerStats).map((p) => {
    const avgRating = +(p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length).toFixed(2);
    const weightedRating = +(avgRating + Math.min(0.3, p.matches * 0.05)).toFixed(1);
    return {
      pid: p.pid,
      name: p.name,
      pos: p.pos,
      teamId: p.teamId,
      teamName: p.teamName,
      teamLogo: teamsMap[p.teamId]?.logo,
      side: "home",
      rating: weightedRating,
      min: p.matches * 90,
      goals: p.goals,
      assists: p.assists,
      saves: p.saves,
      tackles: p.tackles,
      shots: p.shots,
      xg: +p.xg.toFixed(2),
      cleanSheet: p.cleanSheets,
      yc: 0,
      rc: 0,
      highlight: `${p.matches} \u043C\u0430\u0442\u0447\u0435\u0439, ${p.goals ? p.goals + " \u0433. " : ""}${p.assists ? p.assists + " \u043F\u0430\u0441. " : ""}${p.cleanSheets ? p.cleanSheets + " \u0441\u0443\u0445\u0438\u0445" : ""}`.trim() || "\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u0438\u0433\u0440\u0430"
    };
  }).sort((a, b) => b.rating - a.rating);
  if (allRatings.length < 11) return null;
  const gks = allRatings.filter((p) => p.pos === "\u0412\u0420");
  const defs = allRatings.filter((p) => p.pos === "\u0417\u0410\u0429");
  const mids = allRatings.filter((p) => p.pos === "\u041F\u0417");
  const fwds = allRatings.filter((p) => p.pos === "\u041D\u0410\u041F");
  const pickedGk = gks[0] || allRatings[0];
  const pickedDefs = defs.slice(0, 4);
  const pickedMids = mids.slice(0, 3);
  const pickedFwds = fwds.slice(0, 3);
  const starting11 = [pickedGk, ...pickedDefs, ...pickedMids, ...pickedFwds];
  const bestOfAll = [...starting11].sort((a, b) => b.rating - a.rating)[0];
  const topTeam = teamsMap[bestOfAll.teamId];
  return {
    title: `\u0421\u0431\u043E\u0440\u043D\u0430\u044F \u043C\u0435\u0441\u044F\u0446\u0430 \xB7 ${label}`,
    periodLabel: label,
    comp,
    formation: "4-3-3",
    playerOfThePeriod: bestOfAll,
    coachOfThePeriod: {
      name: topTeam?.coach?.name || "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u043C\u0435\u0441\u044F\u0446\u0430",
      teamName: topTeam?.name || bestOfAll.teamName,
      teamLogo: topTeam?.logo,
      reason: `\u0421\u0435\u0440\u0438\u044F \u043F\u043E\u0431\u0435\u0434 \u0438 \u0431\u0435\u0437\u0443\u043F\u0440\u0435\u0447\u043D\u0430\u044F \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0444\u043E\u0440\u043C\u0430 \u043F\u043E\u0434\u043E\u043F\u0435\u0447\u043D\u044B\u0445 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043C\u0435\u0441\u044F\u0446\u0430`
    },
    lineup: {
      gk: pickedGk,
      def: pickedDefs,
      mid: pickedMids,
      fwd: pickedFwds
    },
    bench: allRatings.slice(11, 16)
  };
}

// server.ts
import { GoogleGenAI } from "@google/genai";

// src/cup2026.ts
var DEFAULT_REG_WEEKS = [
  { tue: "2026-07-21", wed: "2026-07-22", thu: "2026-07-23" },
  // Раунд 1
  { tue: "2026-08-04", wed: "2026-08-05", thu: "2026-08-06" },
  // Раунд 2
  { tue: "2026-08-18", wed: "2026-08-19", thu: "2026-08-20" },
  // Раунд 3
  { tue: "2026-09-15", wed: "2026-09-16", thu: "2026-09-17" },
  // Раунд 4 (старт Первой лиги)
  { tue: "2026-09-29", wed: "2026-09-30", thu: "2026-10-01" },
  // Раунд 5
  { tue: "2026-10-27", wed: "2026-10-28", thu: "2026-10-29" }
  // Раунд 6
];
var DEFAULT_RPL_WEEKS = [
  { tue: "2026-07-28", wed: "2026-07-29", thu: "2026-07-30" },
  // Тур 1
  { tue: "2026-08-11", wed: "2026-08-12", thu: "2026-08-13" },
  // Тур 2
  { tue: "2026-08-25", wed: "2026-08-26", thu: "2026-08-27" },
  // Тур 3
  { tue: "2026-09-22", wed: "2026-09-23", thu: "2026-09-24" },
  // Тур 4
  { tue: "2026-10-20", wed: "2026-10-21", thu: "2026-10-22" },
  // Тур 5
  { tue: "2026-11-03", wed: "2026-11-04", thu: "2026-11-05" }
  // Тур 6
];
function scheduleMidweekFixtures(pairs, weekDates, season, roundNum, roundTitle, uidFn) {
  const fixtures = [];
  const n = pairs.length;
  pairs.forEach(([homeTeam, awayTeam], idx) => {
    let date = weekDates.wed;
    let time = "17:30";
    if (n === 8) {
      if (idx < 2) {
        date = weekDates.tue;
        time = idx === 0 ? "16:00" : "18:30";
      } else if (idx < 6) {
        date = weekDates.wed;
        time = ["14:00", "16:30", "18:30", "20:00"][idx - 2];
      } else {
        date = weekDates.thu;
        time = idx === 6 ? "16:00" : "18:30";
      }
    } else if (n >= 14 && n <= 18) {
      if (idx < 4) {
        date = weekDates.tue;
        time = ["15:00", "17:00", "19:00", "20:45"][idx % 4];
      } else if (idx < 12) {
        date = weekDates.wed;
        time = ["14:00", "15:00", "16:30", "17:30", "18:30", "19:30", "20:00", "20:45"][(idx - 4) % 8];
      } else {
        date = weekDates.thu;
        time = ["15:00", "17:00", "19:00", "20:45"][(idx - 12) % 4];
      }
    } else if (n === 4) {
      if (idx === 0) {
        date = weekDates.tue;
        time = "18:00";
      } else if (idx === 1 || idx === 2) {
        date = weekDates.wed;
        time = idx === 1 ? "17:30" : "20:00";
      } else {
        date = weekDates.thu;
        time = "18:00";
      }
    } else {
      const slot = idx % 3;
      date = slot === 0 ? weekDates.tue : slot === 1 ? weekDates.wed : weekDates.thu;
      time = ["15:00", "17:30", "19:30", "20:30"][Math.floor(idx / 3) % 4];
    }
    fixtures.push({
      id: uidFn(),
      season,
      comp: "cup",
      cupPath: "regions_qual",
      qualRound: roundNum,
      round: 100 + roundNum,
      label: roundTitle,
      date,
      time,
      home: typeof homeTeam === "string" ? homeTeam : homeTeam.id,
      away: typeof awayTeam === "string" ? awayTeam : awayTeam.id,
      status: "scheduled",
      hg: null,
      ag: null,
      pos: 0
    });
  });
  return fixtures;
}
function drawNextRegionsRound(cupState, completedRoundNum, completedRoundFixtures, uidFn) {
  const nextRound = completedRoundNum + 1;
  if (nextRound > 6) return [];
  const winners = completedRoundFixtures.map((f) => {
    if (f.hg > f.ag) return f.home;
    if (f.ag > f.hg) return f.away;
    if (f.pen) return f.pen.winner === "home" ? f.home : f.away;
    return f.home;
  });
  const weekDates = cupState.regWeeks[nextRound - 1] || DEFAULT_REG_WEEKS[nextRound - 1];
  const pairs = [];
  let roundTitle = `\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 ${nextRound}-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434`;
  if (nextRound === 2) {
    const incoming = cupState.regionsPools.round2Incoming || [];
    roundTitle = "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 2-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434";
    for (let i = 0; i < winners.length; i++) {
      const opp = incoming[i] || winners[(i + 1) % winners.length];
      pairs.push([winners[i], opp]);
    }
  } else if (nextRound === 3) {
    const incoming = cupState.regionsPools.round3Incoming || [];
    roundTitle = "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 3-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434";
    for (let i = 0; i < winners.length; i++) {
      const opp = incoming[i] || winners[(i + 1) % winners.length];
      pairs.push([winners[i], opp]);
    }
  } else if (nextRound === 4) {
    roundTitle = "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 4-\u0439 \u0440\u0430\u0443\u043D\u0434 (\u0441\u0442\u0430\u0440\u0442 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0438)";
    const fnl = [...cupState.regionsPools.fnlIncoming || []].sort(() => Math.random() - 0.5);
    const numQualMatches = Math.min(winners.length, fnl.length);
    for (let i = 0; i < numQualMatches; i++) {
      pairs.push([winners[i], fnl[i]]);
    }
    for (let j = numQualMatches; j < fnl.length - 1; j += 2) {
      pairs.push([fnl[j], fnl[j + 1]]);
    }
  } else if (nextRound === 5) {
    roundTitle = "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 5-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434";
    const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffledWinners.length - 1; i += 2) {
      pairs.push([shuffledWinners[i], shuffledWinners[i + 1]]);
    }
  } else if (nextRound === 6) {
    roundTitle = "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 6-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434";
    const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffledWinners.length - 1; i += 2) {
      pairs.push([shuffledWinners[i], shuffledWinners[i + 1]]);
    }
  }
  const prevRoundInfo = cupState.regionsQualRounds.find((r) => r.round === completedRoundNum);
  if (prevRoundInfo) prevRoundInfo.completed = true;
  const nextRoundInfo = cupState.regionsQualRounds.find((r) => r.round === nextRound);
  if (nextRoundInfo) nextRoundInfo.drawn = true;
  return scheduleMidweekFixtures(pairs, weekDates, cupState.season, nextRound, roundTitle, uidFn);
}
function initCup2026(season, rplTeams, fnlTeams, secondLeagueTeams, mediaTeams, uidFn, calendarDates) {
  const fixtures = [];
  const rplDates = calendarDates?.rplWeeks || DEFAULT_RPL_WEEKS;
  const regDates = calendarDates?.regWeeks || DEFAULT_REG_WEEKS;
  const shuffledRpl = [...rplTeams].sort(() => Math.random() - 0.5);
  const groupIds = ["A", "B", "C", "D"];
  const rplGroups = {};
  const groupRoundPairs = {};
  groupIds.forEach((gid, gi) => {
    const gTeams = shuffledRpl.slice(gi * 4, (gi + 1) * 4).map((t) => t.id);
    rplGroups[gid] = {
      id: gid,
      name: `\u0413\u0440\u0443\u043F\u043F\u0430 ${gid}`,
      teams: gTeams,
      table: gTeams.map((tid, idx) => {
        const teamObj = rplTeams.find((t) => t.id === tid);
        return {
          id: tid,
          name: teamObj?.name || tid,
          pos: idx + 1,
          p: 0,
          w: 0,
          d: 0,
          l: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0,
          zone: idx < 2 ? "top" : idx === 2 ? "playoff" : "bad",
          zoneLabel: idx < 2 ? "1/8 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B" : idx === 2 ? "\u0412 \u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432" : "\u0412\u044B\u043B\u0435\u0442 \u0438\u0437 \u0442\u0443\u0440\u043D\u0438\u0440\u0430"
        };
      })
    };
    groupRoundPairs[gid] = [
      [[0, 1], [2, 3]],
      // 1 тур
      [[0, 2], [3, 1]],
      // 2 тур
      [[3, 0], [1, 2]],
      // 3 тур
      [[1, 0], [3, 2]],
      // 4 тур
      [[2, 0], [1, 3]],
      // 5 тур
      [[0, 3], [2, 1]]
      // 6 тур
    ];
  });
  for (let roundIdx = 0; roundIdx < 6; roundIdx++) {
    const dates = rplDates[roundIdx] || DEFAULT_RPL_WEEKS[roundIdx];
    const roundMatches = [];
    for (const gid of groupIds) {
      const pairs = groupRoundPairs[gid][roundIdx];
      const gTeams = rplGroups[gid].teams;
      for (const [hIdx, aIdx] of pairs) {
        roundMatches.push({ home: gTeams[hIdx], away: gTeams[aIdx], gid });
      }
    }
    const shuffledRoundMatches = [...roundMatches].sort(() => Math.random() - 0.5);
    const slotSchedule = [
      { date: dates.tue, time: "17:30" },
      { date: dates.tue, time: "20:00" },
      { date: dates.wed, time: "15:00" },
      { date: dates.wed, time: "17:30" },
      { date: dates.wed, time: "19:30" },
      { date: dates.wed, time: "20:45" },
      { date: dates.thu, time: "17:30" },
      { date: dates.thu, time: "20:00" }
    ];
    shuffledRoundMatches.forEach((m, slotIdx) => {
      const schedule = slotSchedule[slotIdx] || { date: dates.wed, time: "18:00" };
      fixtures.push({
        id: uidFn(),
        season,
        comp: "cup",
        cupPath: "rpl_group",
        groupId: m.gid,
        round: roundIdx + 1,
        label: `\u041F\u0443\u0442\u044C \u0420\u041F\u041B \xB7 ${roundIdx + 1}-\u0439 \u0442\u0443\u0440`,
        date: schedule.date,
        time: schedule.time,
        home: m.home,
        away: m.away,
        status: "scheduled",
        hg: null,
        ag: null,
        pos: 0
      });
    });
  }
  const earlyTeams = [...mediaTeams, ...secondLeagueTeams].sort(() => Math.random() - 0.5);
  const r1Count = earlyTeams.length >= 32 ? 32 : Math.floor(earlyTeams.length / 2) * 2;
  const r1Teams = earlyTeams.slice(0, r1Count);
  const r2Incoming = earlyTeams.slice(r1Count, r1Count + 16).map((t) => typeof t === "string" ? t : t.id);
  const r3Incoming = earlyTeams.slice(r1Count + 16, r1Count + 32).map((t) => typeof t === "string" ? t : t.id);
  const fnlIncoming = [...fnlTeams].map((t) => typeof t === "string" ? t : t.id);
  const r1Pairs = [];
  for (let i = 0; i < r1Teams.length - 1; i += 2) {
    r1Pairs.push([r1Teams[i], r1Teams[i + 1]]);
  }
  const r1Fixtures = scheduleMidweekFixtures(
    r1Pairs,
    regDates[0],
    season,
    1,
    "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 1-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434",
    uidFn
  );
  fixtures.push(...r1Fixtures);
  const cupState = {
    season,
    stage: "groups_and_qual",
    finalDate: "2027-06-06",
    rplGroups,
    rplWeeks: rplDates,
    regWeeks: regDates,
    regionsQualRounds: [
      { round: 1, title: "1-\u0439 \u0440\u0430\u0443\u043D\u0434 (\u041C\u0435\u0434\u0438\u0430\u043B\u0438\u0433\u0430 \u0438 2-\u044F \u043B\u0438\u0433\u0430)", completed: false, drawn: true },
      { round: 2, title: "2-\u0439 \u0440\u0430\u0443\u043D\u0434 (\u041E\u0442\u0431\u043E\u0440 2-\u0439 \u043B\u0438\u0433\u0438)", completed: false, drawn: false },
      { round: 3, title: "3-\u0439 \u0440\u0430\u0443\u043D\u0434 (\u0412\u044B\u0445\u043E\u0434 \u043D\u0430 \u041F\u0435\u0440\u0432\u0443\u044E \u043B\u0438\u0433\u0443)", completed: false, drawn: false },
      { round: 4, title: "4-\u0439 \u0440\u0430\u0443\u043D\u0434 (\u0412\u0441\u0442\u0443\u043F\u0430\u044E\u0442 18 \u043A\u043B\u0443\u0431\u043E\u0432 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0438)", completed: false, drawn: false },
      { round: 5, title: "5-\u0439 \u0440\u0430\u0443\u043D\u0434 \u041F\u0443\u0442\u0438 \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432", completed: false, drawn: false },
      { round: 6, title: "6-\u0439 \u0440\u0430\u0443\u043D\u0434 \u041F\u0443\u0442\u0438 \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 (\u0412\u044B\u0445\u043E\u0434 \u0432 \u0432\u0435\u0441\u0435\u043D\u043D\u0438\u0439 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444)", completed: false, drawn: false }
    ],
    regionsPools: {
      round2Incoming: r2Incoming,
      round3Incoming: r3Incoming,
      fnlIncoming
    },
    playoff: {
      rplBracket: { r16: [], qf: [], sf: [] },
      regionsBracket: { r16: [], qf: [], sf: [], final: [] },
      superFinal: null
    }
  };
  return { cupState, fixtures };
}
function recalculateCupGroups(cupState, fixtures) {
  if (!cupState || !cupState.rplGroups) return;
  const cupFx = fixtures.filter((f) => f.comp === "cup" && f.cupPath === "rpl_group" && f.status === "done");
  for (const gid of ["A", "B", "C", "D"]) {
    const grp = cupState.rplGroups[gid];
    if (!grp) continue;
    const stats = {};
    for (const tid of grp.teams) {
      stats[tid] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    }
    const gMatches = cupFx.filter((f) => f.groupId === gid);
    for (const f of gMatches) {
      const h = stats[f.home], a = stats[f.away];
      if (!h || !a) continue;
      h.p += 1;
      a.p += 1;
      h.gf += f.hg;
      h.ga += f.ag;
      a.gf += f.ag;
      a.ga += f.hg;
      h.gd = h.gf - h.ga;
      a.gd = a.gf - a.ga;
      if (f.hg > f.ag) {
        h.w += 1;
        h.pts += 3;
        a.l += 1;
      } else if (f.ag > f.hg) {
        a.w += 1;
        a.pts += 3;
        h.l += 1;
      } else {
        h.d += 1;
        a.d += 1;
        if (f.pen) {
          if (f.pen.winner === "home" || f.pen.hg > f.pen.ag) {
            h.pts += 2;
            a.pts += 1;
          } else {
            a.pts += 2;
            h.pts += 1;
          }
        } else {
          h.pts += 1;
          a.pts += 1;
        }
      }
    }
    const sorted = grp.teams.map((tid) => {
      const s = stats[tid] || { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      const teamRow = grp.table.find((r) => r.id === tid);
      return {
        id: tid,
        name: teamRow?.name || tid,
        pos: 1,
        ...s,
        zone: "top",
        zoneLabel: ""
      };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    sorted.forEach((r, idx) => {
      r.pos = idx + 1;
      if (idx < 2) {
        r.zone = "top";
        r.zoneLabel = "1/8 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B";
      } else if (idx === 2) {
        r.zone = "playoff";
        r.zoneLabel = "\u0412 \u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432";
      } else {
        r.zone = "bad";
        r.zoneLabel = "\u0412\u044B\u043B\u0435\u0442";
      }
    });
    grp.table = sorted;
  }
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = 3e3;
var DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
var MDIR = path.join(DATA_DIR, "matches");
fs.mkdirSync(MDIR, { recursive: true });
var DB_FILE = path.join(DATA_DIR, "db.json");
var SYS_DEFAULT = "";
try {
  SYS_DEFAULT = fs.readFileSync(path.join(__dirname, "prompt.txt"), "utf8");
} catch {
  SYS_DEFAULT = "\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0442\u043E\u0440 \u0438 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442\u0430 \u0420\u043E\u0441\u0441\u0438\u0438 \u043F\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0443 (\u0412\u0438\u0440\u0442 \u0420\u041F\u041B). \u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439 \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439 \u043E\u0442\u0440\u0435\u0437\u043E\u043A \u043C\u0430\u0442\u0447\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 JSON.";
}
var uid = () => crypto.randomBytes(5).toString("hex");
var mkCode = () => {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[crypto.randomInt(a.length)];
  return s.slice(0, 4) + "-" + s.slice(4);
};
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "\u0435").replace(/[^a-zа-я0-9]+/g, " ").trim();
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var addDays = (d, n) => {
  const t = /* @__PURE__ */ new Date(d + "T12:00:00Z");
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};
var daysBetween = (a, b) => Math.round(((/* @__PURE__ */ new Date(b + "T12:00:00Z")).getTime() - (/* @__PURE__ */ new Date(a + "T12:00:00Z")).getTime()) / 864e5);
var at = (f) => /* @__PURE__ */ new Date(`${f.date}T${f.time}:00`);
var esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c);
function rng(seed2) {
  let a = 0;
  for (const c of String(seed2)) a = a * 31 + c.charCodeAt(0) >>> 0;
  return () => {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(arr, r) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function km(a, b) {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const R = 6371, t = (x) => x * Math.PI / 180;
  const dLa = t(b.lat - a.lat), dLo = t(b.lon - a.lon);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dLo / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) / 10) * 10;
}
var RPL = [
  ["\u0417\u0435\u043D\u0438\u0442", "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", 59.95, 30.32, "\u0413\u0430\u0437\u043F\u0440\u043E\u043C \u0410\u0440\u0435\u043D\u0430"],
  ["\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440", "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440", 45.04, 38.97, "\u041F\u0430\u0440\u043A \u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440"],
  ["\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.81, 37.74, "\u0420\u0416\u0414 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.82, 37.44, "\u041B\u0443\u043A\u043E\u0439\u043B \u0410\u0440\u0435\u043D\u0430"],
  ["\u0426\u0421\u041A\u0410", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.79, 37.53, "\u0412\u042D\u0411 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0411\u0430\u043B\u0442\u0438\u043A\u0430", "\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434", 54.71, 20.51, "\u0420\u043E\u0441\u0442\u0435\u0445 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.79, 37.56, "\u0412\u0422\u0411 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0420\u0443\u0431\u0438\u043D", "\u041A\u0430\u0437\u0430\u043D\u044C", 55.79, 49.12, "\u0410\u043A \u0411\u0430\u0440\u0441 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0410\u0445\u043C\u0430\u0442", "\u0413\u0440\u043E\u0437\u043D\u044B\u0439", 43.32, 45.69, "\u0410\u0445\u043C\u0430\u0442-\u0410\u0440\u0435\u043D\u0430"],
  ["\u0420\u043E\u0441\u0442\u043E\u0432", "\u0420\u043E\u0441\u0442\u043E\u0432-\u043D\u0430-\u0414\u043E\u043D\u0443", 47.22, 39.72, "\u0420\u043E\u0441\u0442\u043E\u0432 \u0410\u0440\u0435\u043D\u0430"],
  ["\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432", "\u0421\u0430\u043C\u0430\u0440\u0430", 53.2, 50.15, "\u0421\u043E\u043B\u0438\u0434\u0430\u0440\u043D\u043E\u0441\u0442\u044C \u0410\u0440\u0435\u043D\u0430"],
  ["\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433", "\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433", 51.77, 55.1, "\u0413\u0430\u0437\u043E\u0432\u0438\u043A"],
  ["\u0410\u043A\u0440\u043E\u043D", "\u0422\u043E\u043B\u044C\u044F\u0442\u0442\u0438", 53.5, 49.42, "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B"],
  ["\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430", "\u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430", 42.98, 47.5, "\u0410\u043D\u0436\u0438-\u0410\u0440\u0435\u043D\u0430"],
  ["\u0420\u043E\u0434\u0438\u043D\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.75, 37.61, "\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0435\u0446"],
  ["\u0424\u0430\u043A\u0435\u043B", "\u0412\u043E\u0440\u043E\u043D\u0435\u0436", 51.67, 39.18, "\u0424\u0430\u043A\u0435\u043B \u0410\u0440\u0435\u043D\u0430"]
];
var FNL_TEAMS = [
  ["\u0410\u0440\u0441\u0435\u043D\u0430\u043B \u0422\u0443\u043B\u0430", "\u0422\u0443\u043B\u0430", 54.19, 37.61, "\u0410\u0440\u0441\u0435\u043D\u0430\u043B"],
  ["\u0412\u0435\u043B\u0435\u0441", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.7, 37.6, "\u0421\u043F\u0430\u0440\u0442\u0430\u043A\u043E\u0432\u0435\u0446"],
  ["\u0412\u043E\u043B\u0433\u0430 \u0423\u043B\u044C\u044F\u043D\u043E\u0432\u0441\u043A", "\u0423\u043B\u044C\u044F\u043D\u043E\u0432\u0441\u043A", 54.32, 48.39, "\u0422\u0440\u0443\u0434"],
  ["\u0415\u043D\u0438\u0441\u0435\u0439", "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A", 56.01, 92.87, "\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439"],
  ["\u041A\u0410\u041C\u0410\u0417", "\u041D\u0430\u0431\u0435\u0440\u0435\u0436\u043D\u044B\u0435 \u0427\u0435\u043B\u043D\u044B", 55.74, 52.41, "\u041A\u0410\u041C\u0410\u0417"],
  ["\u041B\u0435\u043D\u0438\u043D\u0433\u0440\u0430\u0434\u0435\u0446", "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", 59.93, 30.3, "\u0420\u043E\u0449\u0438\u043D\u043E \u0410\u0440\u0435\u043D\u0430"],
  ["\u041D\u0435\u0444\u0442\u0435\u0445\u0438\u043C\u0438\u043A", "\u041D\u0438\u0436\u043D\u0435\u043A\u0430\u043C\u0441\u043A", 55.64, 51.82, "\u041D\u0435\u0444\u0442\u0435\u0445\u0438\u043C\u0438\u043A"],
  ["\u041F\u0430\u0440\u0438 \u041D\u041D", "\u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434", 56.33, 44, "\u0421\u0442\u0430\u0434\u0438\u043E\u043D \u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434"],
  ["\u0420\u043E\u0442\u043E\u0440", "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434", 48.73, 44.55, "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0421\u041A\u0410-\u0425\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A", "\u0425\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A", 48.48, 135.07, "\u0421\u0442\u0430\u0434\u0438\u043E\u043D \u0438\u043C. \u041B\u0435\u043D\u0438\u043D\u0430"],
  ["\u0421\u043E\u0447\u0438", "\u0421\u043E\u0447\u0438", 43.6, 39.73, "\u0424\u0438\u0448\u0442"],
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A \u041A\u043E\u0441\u0442\u0440\u043E\u043C\u0430", "\u041A\u043E\u0441\u0442\u0440\u043E\u043C\u0430", 57.77, 40.93, "\u0423\u0440\u043E\u0436\u0430\u0439"],
  ["\u0422\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0449\u0438\u043A", "\u0418\u0432\u0430\u043D\u043E\u0432\u043E", 57, 40.97, "\u0422\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0449\u0438\u043A"],
  ["\u0422\u043E\u0440\u043F\u0435\u0434\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 55.71, 37.65, "\u0411\u0421\u0410 \u041B\u0443\u0436\u043D\u0438\u043A\u0438"],
  ["\u0423\u0440\u0430\u043B", "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", 56.83, 60.57, "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433 \u0410\u0440\u0435\u043D\u0430"],
  ["\u0423\u0444\u0430", "\u0423\u0444\u0430", 54.74, 55.97, "\u041D\u0435\u0444\u0442\u044F\u043D\u0438\u043A"],
  ["\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A", "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A", 55.16, 61.4, "\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439"],
  ["\u0428\u0438\u043D\u043D\u0438\u043A", "\u042F\u0440\u043E\u0441\u043B\u0430\u0432\u043B\u044C", 57.63, 39.87, "\u0428\u0438\u043D\u043D\u0438\u043A"]
];
var LOWER = {
  "2la_gold": [
    "\u0421\u043E\u043A\u043E\u043B",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0411\u0440\u044F\u043D\u0441\u043A",
    "\u0410\u043B\u0430\u043D\u0438\u044F",
    "\u0420\u043E\u0434\u0438\u043D\u0430-2",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u041A\u0438\u0440\u043E\u0432",
    "\u0410\u043C\u043A\u0430\u0440",
    "\u0422\u044E\u043C\u0435\u043D\u044C",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0412\u043B\u0430\u0434\u0438\u0432\u043E\u0441\u0442\u043E\u043A",
    "\u0421\u0438\u0431\u0438\u0440\u044C",
    "\u0421\u043F\u0430\u0440\u0442\u0430\u043A \u0412\u043B\u0430\u0434\u0438\u043A\u0430\u0432\u043A\u0430\u0437"
  ],
  "2la_silver": [
    "\u041A\u0430\u043B\u0443\u0433\u0430",
    "\u0422\u043E\u0440\u043F\u0435\u0434\u043E \u041C\u0438\u0430\u0441\u0441",
    "\u0412\u043E\u043B\u0433\u0430\u0440\u044C",
    "\u0417\u0435\u043D\u0438\u0442-2",
    "\u0420\u043E\u0442\u043E\u0440-2",
    "\u0423\u0440\u0430\u043B-2",
    "\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432-2",
    "\u0411\u0430\u043B\u0442\u0438\u043A\u0430-2",
    "\u0420\u043E\u0434\u0438\u043D\u0430-3",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0421\u0442\u0430\u0432\u0440\u043E\u043F\u043E\u043B\u044C"
  ],
  "2lb_1": [
    "\u0421\u0435\u0432\u0430\u0441\u0442\u043E\u043F\u043E\u043B\u044C",
    "\u041D\u0430\u0440\u0442 \u0427\u0435\u0440\u043A\u0435\u0441\u0441\u043A",
    "\u041F\u043E\u0431\u0435\u0434\u0430 \u0425\u0430\u0441\u0430\u0432\u044E\u0440\u0442",
    "\u0420\u043E\u0441\u0442\u043E\u0432-2",
    "\u0414\u0440\u0443\u0436\u0431\u0430 \u041C\u0430\u0439\u043A\u043E\u043F",
    "\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043D\u044C",
    "\u0420\u0443\u0431\u0438\u043D \u042F\u043B\u0442\u0430",
    "\u0410\u043D\u0433\u0443\u0448\u0442",
    "\u0421\u043F\u0430\u0440\u0442\u0430\u043A-\u041D\u0430\u043B\u044C\u0447\u0438\u043A",
    "\u0414\u0438\u043D\u0430\u043C\u043E-2 \u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430",
    "\u0417\u0430\u0440\u044F \u041B\u0443\u0433\u0430\u043D\u0441\u043A",
    "\u041A\u044B\u0437\u044B\u043B\u0442\u0430\u0448",
    "\u041D\u0435\u0444\u0442\u044F\u043D\u0438\u043A \u0410\u0445\u0442\u044B\u0440\u0441\u043A\u0438\u0439",
    "\u041F\u0421\u041A \u0414\u0438\u043D\u0441\u043A\u0430\u044F",
    "\u0427\u0430\u0439\u043A\u0430-\u041C",
    "\u0428\u0430\u0445\u0442\u0435\u0440 \u0414\u043E\u043D\u0435\u0446\u043A"
  ],
  "2lb_2": [
    "\u041C\u0443\u0440\u043E\u043C",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0412\u043E\u043B\u043E\u0433\u0434\u0430",
    "\u0418\u0440\u043A\u0443\u0442\u0441\u043A",
    "\u0421\u043F\u0430\u0440\u0442\u0430\u043A-2",
    "\u0411\u0430\u043B\u0442\u0438\u043A\u0430-\u0411\u0424\u0423",
    "\u0422\u0432\u0435\u0440\u044C",
    "\u0422\u043E\u0440\u043F\u0435\u0434\u043E \u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440",
    "\u0427\u0435\u0440\u0435\u043F\u043E\u0432\u0435\u0446",
    "\u0427\u0435\u0440\u0442\u0430\u043D\u043E\u0432\u043E",
    "\u0417\u0432\u0435\u0437\u0434\u0430",
    "\u041B\u0443\u043A\u0438-\u042D\u043D\u0435\u0440\u0433\u0438\u044F",
    "\u041A\u043E\u0441\u043C\u043E\u0441 \u0414\u043E\u043B\u0433\u043E\u043F\u0440\u0443\u0434\u043D\u044B\u0439",
    "\u0415\u043D\u0438\u0441\u0435\u0439-2",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0421\u041F\u0431",
    "\u0418\u0441\u043A\u0440\u0430 \u0421\u043C\u043E\u043B\u0435\u043D\u0441\u043A"
  ],
  "2lb_3": [
    "\u0410\u0432\u0430\u043D\u0433\u0430\u0440\u0434 \u041A\u0443\u0440\u0441\u043A",
    "\u0421\u0430\u043B\u044E\u0442 \u0411\u0435\u043B\u0433\u043E\u0440\u043E\u0434",
    "\u0421\u043F\u0430\u0440\u0442\u0430\u043A \u0422\u0430\u043C\u0431\u043E\u0432",
    "\u0420\u044F\u0437\u0430\u043D\u044C",
    "\u041C\u0435\u0442\u0430\u043B\u043B\u0443\u0440\u0433 \u041B\u0438\u043F\u0435\u0446\u043A",
    "\u041E\u0440\u0435\u043B",
    "\u0410\u0440\u0441\u0435\u043D\u0430\u043B-2",
    "\u0420\u043E\u0434\u0438\u043D\u0430-\u041C",
    "\u0417\u0435\u043D\u0438\u0442 \u041F\u0435\u043D\u0437\u0430",
    "\u0421\u041A\u0410-\u0425\u0430\u0431\u0430\u0440\u043E\u0432\u0441\u043A-2",
    "\u0420\u043E\u0442\u043E\u0440-2",
    "\u0421\u0442\u0440\u043E\u0433\u0438\u043D\u043E",
    "\u041A\u0432\u0430\u043D\u0442 \u041E\u0431\u043D\u0438\u043D\u0441\u043A",
    "\u0421\u0430\u0442\u0443\u0440\u043D \u0420\u0430\u043C\u0435\u043D\u0441\u043A\u043E\u0435",
    "\u0412\u043E\u043B\u043D\u0430",
    "\u0428\u0443\u043C\u0431\u0440\u0430\u0442"
  ],
  "2lb_4": [
    "\u0425\u0438\u043C\u0438\u043A",
    "\u041A\u0414\u0412 \u0422\u043E\u043C\u0441\u043A",
    "\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433-2",
    "\u0414\u0438\u043D\u0430\u043C\u043E \u0411\u0430\u0440\u043D\u0430\u0443\u043B",
    "\u0420\u0443\u0431\u0438\u043D-2",
    "\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432-2",
    "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A-2",
    "\u0410\u043A\u0440\u043E\u043D-2",
    "\u0423\u0440\u0430\u043B-2",
    "\u041D\u043E\u0441\u0442\u0430",
    "\u041B\u0435\u0433\u0438\u043E\u043D",
    "\u0418\u0436\u0435\u0432\u0441\u043A"
  ],
  "media": [
    "2Drots",
    "\u0410\u043C\u043A\u0430\u043B",
    "\u0411\u0440\u043E\u0443\u043A\u0438 (Brokeboys)",
    "\u0424\u041A 10",
    "Lit Energy",
    "\u0421\u0438\u043D\u0434\u0415\u043A\u0430\u0442",
    "\u0421\u041A\u0410 \u0420\u043E\u0441\u0442\u043E\u0432",
    "\u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u041A\u043E\u043C\u0430\u043D\u0434\u0430",
    "Fight Nights",
    "Prime Squad",
    "\u0410\u043F\u0441\u043D\u044B",
    "\u041C\u0430\u0442\u0447 \u0422\u0412"
  ],
  "media_div2": [
    "FC ARS",
    "\xAB\u0424\xBB \u041C\u043E\u0441\u043A\u0432\u0430",
    "\u0410\u043B\u044C\u0442\u0435\u0440\u043E\u043D",
    "\u0410\u043D\u0436\u0438",
    "\u0413\u043E\u0440\u043A\u0438",
    "\u0424\u041A Vibe",
    "\u0424\u041A \u041F\u041F",
    "\u0424\u041A \u042E\u041D\u0418\u0421\u041E\u041D"
  ]
};
var COMPS = [
  { id: "rpl", name: "\u0420\u041F\u041B", type: "league", tier: 1, level: "1-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (16 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/rpl.svg" },
  { id: "cup", name: "\u041A\u0443\u0431\u043E\u043A \u0420\u043E\u0441\u0441\u0438\u0438", type: "cup", level: "\u041D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0443\u0431\u043E\u043A", logo: "/logos/leagues/cup.svg" },
  { id: "fnl", name: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", type: "league", tier: 2, level: "2-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (18 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/fnl.svg" },
  { id: "2la_gold", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0410 \xB7 \u0417\u043E\u043B\u043E\u0442\u043E", type: "league", tier: 3, cat: "2la", level: "3-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (10 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2la.svg" },
  { id: "2la_silver", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0410 \xB7 \u0421\u0435\u0440\u0435\u0431\u0440\u043E", type: "league", tier: 3, cat: "2la", level: "3-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (10 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2la.svg" },
  { id: "2lb_1", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0411 \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 1 (\u042E\u0433)", type: "league", tier: 4, cat: "2lb", level: "4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (16 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2lb.svg" },
  { id: "2lb_2", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0411 \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 2 (\u0417\u0430\u043F\u0430\u0434)", type: "league", tier: 4, cat: "2lb", level: "4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (15 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2lb.svg" },
  { id: "2lb_3", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0411 \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 3 (\u0426\u0435\u043D\u0442\u0440)", type: "league", tier: 4, cat: "2lb", level: "4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (16 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2lb.svg" },
  { id: "2lb_4", name: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \u0411 \xB7 \u0413\u0440\u0443\u043F\u043F\u0430 4 (\u0423\u0440\u0430\u043B)", type: "league", tier: 4, cat: "2lb", level: "4-\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C (12 \u043A\u043E\u043C\u0430\u043D\u0434)", logo: "/logos/leagues/2lb.svg" },
  { id: "media", name: "Winline \u041C\u0435\u0434\u0438\u0439\u043D\u0430\u044F \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u0430\u044F \u043B\u0438\u0433\u0430 (7-\u0441\u0435\u0437\u043E\u043D)", type: "league", tier: 5, level: "\u041C\u0435\u0434\u0438\u0430\u043B\u0438\u0433\u0430 \xB7 2 \u0433\u0440\u0443\u043F\u043F\u044B \u043F\u043E 6 \u043A\u043E\u043C\u0430\u043D\u0434", logo: "/logos/leagues/media.svg" },
  { id: "media_div2", name: "\u0412\u0442\u043E\u0440\u043E\u0439 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D (\u041C\u0435\u0434\u0438\u0430\u043B\u0438\u0433\u0430)", type: "league", tier: 6, level: "8 \u043A\u043E\u043C\u0430\u043D\u0434 \xB7 \u041F\u043B\u0435\u0439-\u043E\u0444\u0444 \u0442\u043E\u043F-4", logo: "/logos/leagues/media.svg" },
  { id: "media_cup", name: "Winline \u041A\u0443\u0431\u043E\u043A \u041B\u0438\u0433\u0438 (2026)", type: "cup", tier: 5, level: "20 \u043A\u043E\u043C\u0430\u043D\u0434 \xB7 4 \u0433\u0440\u0443\u043F\u043F\u044B \u043F\u043E 5 \u043A\u043E\u043C\u0430\u043D\u0434", logo: "/logos/leagues/media.svg" }
];
var DERBIES = [
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u0426\u0421\u041A\u0410", "\u0414\u0435\u0440\u0431\u0438 \u0432\u0441\u0435\u044F \u0420\u0443\u0441\u0438", "\u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u044B, \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u043D\u0430\u043A\u0430\u043B \u0438 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0440\u0438\u0431\u0443\u043D."],
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0435\u0435 \u043C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0421\u0442\u0430\u0440\u0435\u0439\u0448\u0435\u0435 \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u0447\u0435\u0441\u0442\u0432\u043E."],
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u041F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u0430\u0442\u0447, \u0432\u0441\u0435\u0433\u0434\u0430 \u0436\u0430\u0440\u043A\u043E."],
  ["\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u0420\u043E\u0434\u0438\u043D\u0430", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0410\u043C\u0431\u0438\u0446\u0438\u043E\u0437\u043D\u044B\u0439 \u043D\u043E\u0432\u0438\u0447\u043E\u043A \u0441\u0442\u043E\u043B\u0438\u0446\u044B \u0431\u0440\u043E\u0441\u0430\u0435\u0442 \u0432\u044B\u0437\u043E\u0432 \u043D\u0430\u0440\u043E\u0434\u043D\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u0435."],
  ["\u0426\u0421\u041A\u0410", "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u0411\u0440\u0430\u0442\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0418\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0441\u0442\u043E\u043B\u0438\u0447\u043D\u043E\u0435 \u0434\u0435\u0440\u0431\u0438."],
  ["\u0426\u0421\u041A\u0410", "\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0418\u0433\u0440\u0430 \u0430\u0440\u043C\u0435\u0439\u0446\u0435\u0432 \u0438 \u0436\u0435\u043B\u0435\u0437\u043D\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u0438\u043A\u043E\u0432 \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u043D\u0430 \u043D\u0435\u0440\u0432\u0435."],
  ["\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0411\u043E\u0440\u044C\u0431\u0430 \u0437\u0430 \u043C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442."],
  ["\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430", "\u0420\u043E\u0434\u0438\u043D\u0430", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0421\u0442\u043E\u043B\u0438\u0447\u043D\u043E\u0435 \u0434\u0435\u0440\u0431\u0438 \u0434\u0432\u0443\u0445 \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0439."],
  ["\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432", "\u0420\u043E\u0434\u0438\u043D\u0430", "\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0411\u043E\u0440\u044C\u0431\u0430 \u043C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0438\u0445 \u043A\u043B\u0443\u0431\u043E\u0432."],
  ["\u0417\u0435\u043D\u0438\u0442", "\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u0411\u0438\u0442\u0432\u0430 \u0434\u0432\u0443\u0445 \u0441\u0442\u043E\u043B\u0438\u0446", "\u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0430 \u0438 \u041C\u043E\u0441\u043A\u0432\u044B."],
  ["\u0417\u0435\u043D\u0438\u0442", "\u0426\u0421\u041A\u0410", "\u041F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435", "\u0418\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438 \u043E\u0441\u0442\u0440\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0430 \u0438 \u041C\u043E\u0441\u043A\u0432\u044B."],
  ["\u0420\u043E\u0441\u0442\u043E\u0432", "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440", "\u042E\u0436\u043D\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0413\u043B\u0430\u0432\u043D\u0430\u044F \u0431\u0438\u0442\u0432\u0430 \u0437\u0430 \u044E\u0433 \u0420\u043E\u0441\u0441\u0438\u0438."],
  ["\u0410\u0445\u043C\u0430\u0442", "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430", "\u041A\u0430\u0432\u043A\u0430\u0437\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0420\u0435\u0433\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0438 \u044D\u043C\u043E\u0446\u0438\u0438."],
  ["\u0420\u0443\u0431\u0438\u043D", "\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432", "\u0412\u043E\u043B\u0436\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438", "\u0412\u043E\u043B\u0436\u0441\u043A\u043E\u0435 \u0434\u0435\u0440\u0431\u0438 \u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043D\u0430 \u0438 \u0421\u0430\u043C\u0430\u0440\u0441\u043A\u043E\u0439 \u043E\u0431\u043B\u0430\u0441\u0442\u0438."],
  ["\u0424\u0430\u043A\u0435\u043B", "\u0421\u043F\u0430\u0440\u0442\u0430\u043A", "\u041E\u0433\u043D\u0435\u043D\u043D\u043E\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435", "\u041D\u0435\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u0430\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0432\u043E\u0440\u043E\u043D\u0435\u0436\u0441\u043A\u0438\u0445 \u0442\u0440\u0438\u0431\u0443\u043D."]
];
function seed() {
  const d = {
    settings: {
      season: "2026/27",
      secPerMin: 4,
      breakSec: 20,
      chunks: 2,
      auto: false,
      squadMax: 25,
      grounding: false,
      tgToken: "",
      tgChat: "",
      siteUrl: "",
      systemPrompt: "",
      keys: {},
      models: {},
      adminCode: mkCode()
    },
    comps: COMPS,
    teams: [],
    players: [],
    squads: {},
    lineups: {},
    tactics: {},
    fixtures: [],
    derbies: [],
    transfers: [],
    sessions: {},
    llmlog: [],
    cup: null
  };
  for (const [name, city, lat, lon, stadium] of RPL) {
    d.teams.push({ id: uid(), name, comp: "rpl", city, lat, lon, stadium, code: mkCode(), logo: getTeamLogo(name, null, "rpl") });
  }
  for (const [name, city, lat, lon, stadium] of FNL_TEAMS) {
    d.teams.push({ id: uid(), name, comp: "fnl", city, lat, lon, stadium, code: mkCode(), logo: getTeamLogo(name, null, "fnl") });
  }
  for (const c of Object.keys(LOWER)) {
    for (const name of LOWER[c]) {
      d.teams.push({ id: uid(), name, comp: c, city: "", lat: null, lon: null, stadium: "", code: "", logo: getTeamLogo(name, null, c) });
    }
  }
  const T = (n) => d.teams.find((t) => t.name === n);
  for (const [a, b, name, note] of DERBIES) {
    if (T(a) && T(b)) d.derbies.push({ id: uid(), a: T(a).id, b: T(b).id, name, note });
  }
  return d;
}
var DEFAULT_REFEREES = [
  {
    id: "ref_abrosimov",
    name: "\u0418\u0432\u0430\u043D \u0410\u0431\u0440\u043E\u0441\u0438\u043C\u043E\u0432",
    city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "european",
    styleDesc: "\u0414\u0438\u043D\u0430\u043C\u0438\u0447\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u043D\u043E\u0432\u043E\u0439 \u0432\u043E\u043B\u043D\u044B, \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043D\u0430 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0443\u044E \u043F\u043B\u0430\u043D\u043A\u0443 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432. \u041D\u0435 \u043B\u044E\u0431\u0438\u0442 \u0434\u0440\u043E\u0431\u0438\u0442\u044C \u0438\u0433\u0440\u0443 \u043C\u0435\u043B\u043A\u0438\u043C\u0438 \u0441\u0432\u0438\u0441\u0442\u043A\u0430\u043C\u0438, \u043F\u043E\u043E\u0449\u0440\u044F\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0432 \u0430\u0442\u0430\u043A\u0443, \u043D\u043E \u0436\u0451\u0441\u0442\u043A\u043E \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0435\u0442 \u043E\u043F\u0430\u0441\u043D\u044B\u0435 \u043F\u043E\u0434\u043A\u0430\u0442\u044B.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.4,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0418\u0432\u0430\u043D \u0410\u0431\u0440\u043E\u0441\u0438\u043C\u043E\u0432 (\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433) \u2014 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043E\u0442\u043B\u0438\u0447\u0430\u044E\u0449\u0438\u0439\u0441\u044F \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0438 \u0441\u0442\u0440\u0435\u043C\u043B\u0435\u043D\u0438\u0435\u043C \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u043C\u0430\u0442\u0447\u0430. \u0420\u0435\u0434\u043A\u043E \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0438\u0433\u0440\u0443 \u043F\u0440\u0438 \u043B\u0451\u0433\u043A\u0438\u0445 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430\u0445, \u0434\u0430\u0432\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C \u0431\u043E\u0440\u043E\u0442\u044C\u0441\u044F, \u043D\u043E \u0447\u0451\u0442\u043A\u043E \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u0441\u0440\u044B\u0432\u044B \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0430\u0442\u0430\u043A."
  },
  {
    id: "ref_bobrovsky",
    name: "\u042F\u043D \u0411\u043E\u0431\u0440\u043E\u0432\u0441\u043A\u0438\u0439",
    city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439, \u0440\u0430\u0441\u0441\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u0445\u043E\u0440\u043E\u0448\u0438\u043C \u0447\u0443\u0432\u0441\u0442\u0432\u043E\u043C \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u0438. \u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u0442 \u0443\u0441\u0442\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435 \u0440\u0430\u043D\u043D\u0435\u0439 \u0436\u0451\u043B\u0442\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435, \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435 \u0412\u0410\u0420 \u0438 \u0440\u0435\u0434\u043A\u043E \u0442\u0435\u0440\u044F\u0435\u0442 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430\u0434 \u044D\u043C\u043E\u0446\u0438\u044F\u043C\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.5,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u042F\u043D \u0411\u043E\u0431\u0440\u043E\u0432\u0441\u043A\u0438\u0439 (\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433) \u2014 \u0443\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0443\u043C\u0435\u0435\u0442 \u0433\u0430\u0441\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u043D\u0430 \u043F\u043E\u043B\u0435 \u0431\u0435\u0437 \u043B\u0438\u0448\u043D\u0435\u0439 \u0434\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438. \u041F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043D \u0432 \u0442\u0440\u0430\u043A\u0442\u043E\u0432\u043A\u0435 \u0444\u043E\u043B\u043E\u0432 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F \u0438 \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0441\u043B\u0435\u0434\u0438\u0442 \u0437\u0430 \u0431\u043E\u0440\u044C\u0431\u043E\u0439 \u043F\u0440\u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0445 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u0445."
  },
  {
    id: "ref_bulanov",
    name: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0411\u0443\u043B\u0430\u043D\u043E\u0432",
    city: "\u0421\u0430\u0440\u0430\u043D\u0441\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u041D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043F\u0440\u0438\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0438\u0439\u0441\u044F \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0442\u0440\u0430\u043A\u0442\u043E\u0432\u043A\u0438 \u043F\u0440\u0430\u0432\u0438\u043B. \u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u0435\u043D \u043A \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0444\u043E\u043B\u0430\u043C \u0438 \u0438\u0433\u0440\u0435 \u0440\u0443\u043A\u043E\u0439, \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u0432\u0437\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0431\u0435\u0437 \u0441\u043F\u0435\u0448\u043A\u0438.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.3,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0411\u0443\u043B\u0430\u043D\u043E\u0432 (\u0421\u0430\u0440\u0430\u043D\u0441\u043A) \u2014 \u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F, \u043F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0439 \u0432\u0441\u0435 \u0441\u0442\u0443\u043F\u0435\u043D\u0438 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0430. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0445\u043E\u0440\u043E\u0448\u0435\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u043E\u0439, \u0447\u0451\u0442\u043A\u043E\u0439 \u0436\u0435\u0441\u0442\u0438\u043A\u0443\u043B\u044F\u0446\u0438\u0435\u0439 \u0438 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0432 \u043E\u0446\u0435\u043D\u043A\u0435 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432."
  },
  {
    id: "ref_zaika",
    name: "\u041C\u0430\u0442\u0432\u0435\u0439 \u0417\u0430\u0438\u043A\u0430",
    city: "\u043D\u043E\u0432\u0438\u0447\u043E\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "liberal",
    styleDesc: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043F\u043B\u0430\u043D\u043A\u043E\u0439 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0439 \u0431\u043E\u0440\u044C\u0431\u044B. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0432\u043C\u0435\u0448\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u0438\u0433\u0440\u0443 \u0431\u0435\u0437 \u0432\u0435\u0441\u043A\u043E\u0439 \u043F\u0440\u0438\u0447\u0438\u043D\u044B, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044F \u0444\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442\u0430\u043C \u0432\u0435\u0441\u0442\u0438 \u043F\u043B\u043E\u0442\u043D\u044B\u0435 \u0434\u0443\u044D\u043B\u0438.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.7,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041C\u0430\u0442\u0432\u0435\u0439 \u0417\u0430\u0438\u043A\u0430 \u2014 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0434\u0435\u043B\u0430\u044E\u0449\u0438\u0439 \u0441\u0442\u0430\u0432\u043A\u0443 \u043D\u0430 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438 \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043E\u043A. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u043F\u0435\u0440\u0435\u0433\u0440\u0443\u0436\u0430\u0442\u044C \u043C\u0430\u0442\u0447 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438 \u0432 \u0434\u0435\u0431\u044E\u0442\u0435."
  },
  {
    id: "ref_ivanov",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0418\u0432\u0430\u043D\u043E\u0432",
    city: "\u0420\u043E\u0441\u0442\u043E\u0432-\u043D\u0430-\u0414\u043E\u043D\u0443",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "principled",
    styleDesc: "\u041E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u044B\u0445 \u0438 \u0436\u0451\u0441\u0442\u043A\u0438\u0445 \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u0432 \u0420\u041F\u041B. \u0414\u0435\u0440\u0436\u0438\u0442 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443 \u0436\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0440\u0443\u043A\u043E\u0439, \u043D\u0435 \u0442\u0435\u0440\u043F\u0438\u0442 \u0441\u043F\u043E\u0440\u043E\u0432, \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u0439 \u0438 \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u0438. \u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438 \u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043A\u0440\u0430\u0441\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0440\u0438 \u044F\u0432\u043D\u044B\u0445 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u044F\u0445.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 8.2,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0418\u0432\u0430\u043D\u043E\u0432 (\u0420\u043E\u0441\u0442\u043E\u0432-\u043D\u0430-\u0414\u043E\u043D\u0443) \u2014 \u0442\u043E\u043F\u043E\u0432\u044B\u0439 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u043E\u0433\u0440\u043E\u043C\u043D\u044B\u043C \u043E\u043F\u044B\u0442\u043E\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u044B\u0445 \u0434\u0435\u0440\u0431\u0438 \u0441\u0442\u0440\u0430\u043D\u044B \u0438 \u0435\u0432\u0440\u043E\u043A\u0443\u0431\u043A\u0430\u0445. \u0415\u0433\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442 \u0431\u0435\u0441\u043A\u043E\u043C\u043F\u0440\u043E\u043C\u0438\u0441\u0441\u043D\u043E\u0441\u0442\u044C, \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0435 \u0447\u0442\u0435\u043D\u0438\u0435 \u0438\u0433\u0440\u044B \u0438 \u0443\u043C\u0435\u043D\u0438\u0435 \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0442\u044C \u043B\u044E\u0431\u044B\u0435 \u043F\u0440\u043E\u0432\u043E\u043A\u0430\u0446\u0438\u0438 \u043D\u0430 \u043F\u043E\u043B\u0435."
  },
  {
    id: "ref_karasev",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u0430\u0440\u0430\u0441\u0435\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "european",
    styleDesc: "\u0422\u043E\u043F-\u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u043E\u0433\u0440\u043E\u043C\u043D\u044B\u043C \u043C\u0435\u0436\u0434\u0443\u043D\u0430\u0440\u043E\u0434\u043D\u044B\u043C \u043E\u043F\u044B\u0442\u043E\u043C (\u041B\u0438\u0433\u0430 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u043E\u0432, \u0415\u0432\u0440\u043E). \u0414\u0430\u0451\u0442 \u0432\u0435\u0441\u0442\u0438 \u043F\u043B\u043E\u0442\u043D\u0443\u044E \u0441\u0438\u043B\u043E\u0432\u0443\u044E \u0431\u043E\u0440\u044C\u0431\u0443 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F, \u043D\u0435 \u0434\u0440\u043E\u0431\u0438\u0442 \u0438\u0433\u0440\u0443 \u043C\u0435\u043B\u043A\u0438\u043C\u0438 \u0441\u0432\u0438\u0441\u0442\u043A\u0430\u043C\u0438, \u043D\u043E \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0435\u0442 \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u044C, \u043E\u043F\u0430\u0441\u043D\u044B\u0435 \u043F\u043E\u0434\u043A\u0430\u0442\u044B \u0438 \u043D\u0435\u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435. \u0412 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0445\u043B\u0430\u0434\u043D\u043E\u043A\u0440\u043E\u0432\u043D\u043E, \u0440\u0435\u0434\u043A\u043E \u043F\u043E\u0434\u0434\u0430\u0451\u0442\u0441\u044F \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u044E \u0442\u0440\u0438\u0431\u0443\u043D.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 8.4,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u0430\u0440\u0430\u0441\u0435\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u0441\u0430\u043C\u044B\u0439 \u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u043D\u044B\u0439 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0432\u0448\u0438\u0439 \u043D\u0430 \u043C\u0430\u0442\u0447\u0430\u0445 \u041B\u0438\u0433\u0438 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u043E\u0432, \u041B\u0438\u0433\u0438 \u0415\u0432\u0440\u043E\u043F\u044B \u0438 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442\u043E\u0432 \u0415\u0432\u0440\u043E\u043F\u044B. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043F\u043B\u0430\u043D\u043A\u043E\u0439 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0439 \u0431\u043E\u0440\u044C\u0431\u044B, \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C\u044E \u0438 \u0430\u0432\u0442\u043E\u0440\u0438\u0442\u0435\u0442\u043E\u043C \u0441\u0440\u0435\u0434\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432. \u0423\u043C\u0435\u0435\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u043C \u043D\u0430\u043A\u0430\u043B\u043E\u043C \u0434\u0435\u0440\u0431\u0438 \u0431\u0435\u0437 \u043B\u0438\u0448\u043D\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A, \u043D\u043E \u043F\u0440\u0438 \u044F\u0432\u043D\u043E\u0439 \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u0438 \u0438\u043B\u0438 \u0441\u0440\u044B\u0432\u0435 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0430\u0442\u0430\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0436\u0451\u0441\u0442\u043A\u043E \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E."
  },
  {
    id: "ref_levnikov",
    name: "\u041A\u0438\u0440\u0438\u043B\u043B \u041B\u0435\u0432\u043D\u0438\u043A\u043E\u0432",
    city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439, \u043C\u0435\u0442\u043E\u0434\u0438\u0447\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u043E\u0442\u043B\u0438\u0447\u043D\u044B\u043C \u0447\u0442\u0435\u043D\u0438\u0435\u043C \u0438\u0433\u0440\u044B. \u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u0442 \u0434\u0438\u0430\u043B\u043E\u0433 \u0441 \u0444\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442\u0430\u043C\u0438 \u0432\u043C\u0435\u0441\u0442\u043E \u0440\u0430\u043D\u043D\u0438\u0445 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0439, \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438 \u0434\u0430\u0432\u0430\u0442\u044C \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u0440\u0438 \u0444\u043E\u043B\u0430\u0445 \u0432 \u0430\u0442\u0430\u043A\u0435. \u0427\u0451\u0442\u043A\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0441 \u0412\u0410\u0420, \u043D\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u0441\u0430\u043C.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 8.1,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041A\u0438\u0440\u0438\u043B\u043B \u041B\u0435\u0432\u043D\u0438\u043A\u043E\u0432 (\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433) \u2014 \u043E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0445 \u0438 \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u044B\u0445 \u0441\u0443\u0434\u0435\u0439 \u0420\u041F\u041B. \u0420\u0435\u0434\u043A\u043E \u0442\u0435\u0440\u044F\u0435\u0442 \u043D\u0438\u0442\u044C \u0438\u0433\u0440\u044B \u0434\u0430\u0436\u0435 \u0432 \u0441\u0430\u043C\u044B\u0445 \u043D\u0430\u043F\u0440\u044F\u0436\u0451\u043D\u043D\u044B\u0445 \u043C\u0430\u0442\u0447\u0430\u0445, \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u043F\u0440\u0438\u043D\u0446\u0438\u043F \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u0438 \u043D\u0435 \u043B\u044E\u0431\u0438\u0442 \u0438\u0437\u043B\u0438\u0448\u043D\u0435\u0439 \u0442\u0435\u0430\u0442\u0440\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438. \u0418\u0433\u0440\u043E\u043A\u0438 \u0446\u0435\u043D\u044F\u0442 \u0435\u0433\u043E \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0442\u0440\u0430\u043A\u0442\u043E\u0432\u043E\u043A \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432 \u043D\u0430 \u043F\u0440\u043E\u0442\u044F\u0436\u0435\u043D\u0438\u0438 \u0432\u0441\u0435\u0445 90 \u043C\u0438\u043D\u0443\u0442."
  },
  {
    id: "ref_kukuyan",
    name: "\u041F\u0430\u0432\u0435\u043B \u041A\u0443\u043A\u0443\u044F\u043D",
    city: "\u0421\u043E\u0447\u0438",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "principled",
    styleDesc: "\u041F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0438 \u0431\u0435\u0441\u043A\u043E\u043C\u043F\u0440\u043E\u043C\u0438\u0441\u0441\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440. \u041D\u0435 \u0431\u043E\u0438\u0442\u0441\u044F \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u0440\u0435\u0437\u043E\u043D\u0430\u043D\u0441\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F: \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438 \u0437\u0430 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0438 \u0440\u0443\u043A\u0430\u043C\u0438 \u0438 \u043D\u0430\u0441\u0442\u0443\u043F\u044B \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439, \u0436\u0451\u0441\u0442\u043A\u043E \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0437\u0430 \u0441\u043F\u043E\u0440\u044B, \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u0438 \u0438 \u0437\u0430\u0442\u044F\u0436\u043A\u0443 \u0432\u0440\u0435\u043C\u0435\u043D\u0438. \u0414\u0435\u0440\u0436\u0438\u0442 \u0438\u0433\u0440\u0443 \u0432 \u0435\u0436\u043E\u0432\u044B\u0445 \u0440\u0443\u043A\u0430\u0432\u0438\u0446\u0430\u0445.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 7.9,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041F\u0430\u0432\u0435\u043B \u041A\u0443\u043A\u0443\u044F\u043D (\u0421\u043E\u0447\u0438) \u2014 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u043E\u043C, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043F\u0440\u044F\u0447\u0435\u0442\u0441\u044F \u0437\u0430 \u0441\u043F\u0438\u043D\u044B \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u043E\u0432. \u0418\u0437\u0432\u0435\u0441\u0442\u0435\u043D \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u043A \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0435: \u0437\u0430 \u043D\u0435\u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u0441 \u0440\u0435\u0448\u0435\u043D\u0438\u0435\u043C \u0438\u043B\u0438 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u0432\u044B\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0434\u043B\u044F \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u043C\u043E\u0436\u043D\u043E \u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435. \u041F\u0440\u0438 \u044D\u0442\u043E\u043C \u0432 \u0447\u0438\u0441\u0442\u043E\u0439 \u0441\u0438\u043B\u043E\u0432\u043E\u0439 \u0431\u043E\u0440\u044C\u0431\u0435 \u0434\u0430\u0451\u0442 \u0438\u0433\u0440\u0430\u0442\u044C."
  },
  {
    id: "ref_sukhoy",
    name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0421\u0443\u0445\u043E\u0439",
    city: "\u041B\u044E\u0431\u0435\u0440\u0446\u044B",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "liberal",
    styleDesc: "\u041B\u0438\u0431\u0435\u0440\u0430\u043B\u044C\u043D\u044B\u0439, \xAB\u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439\xBB \u0441\u0442\u0438\u043B\u044C \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0430. \u0412\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u043B\u0430\u043D\u043A\u0430 \u0444\u043E\u043B\u0430, \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043E\u043A, \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C \u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0438. \u041F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0443\u044E \u0431\u043E\u0440\u044C\u0431\u0443 \u043F\u043B\u0435\u0447\u043E \u0432 \u043F\u043B\u0435\u0447\u043E \u0438 \u0436\u0451\u0441\u0442\u043A\u0438\u0435 \u0441\u0442\u044B\u043A\u0438, \u0435\u0441\u043B\u0438 \u043E\u043D\u0438 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B \u0432 \u043C\u044F\u0447. \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0434\u043E\u0441\u0442\u0430\u0451\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430 \u043E\u0442\u043A\u0440\u043E\u0432\u0435\u043D\u043D\u0443\u044E \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u044C \u0438\u043B\u0438 \u0441\u0440\u044B\u0432 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.8,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0421\u0443\u0445\u043E\u0439 (\u041B\u044E\u0431\u0435\u0440\u0446\u044B) \u2014 \u043E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0437\u0440\u0435\u043B\u0438\u0449\u043D\u044B\u0445 \u0441\u0443\u0434\u0435\u0439 \u0434\u043B\u044F \u0431\u043E\u043B\u0435\u043B\u044C\u0449\u0438\u043A\u043E\u0432, \u0442\u0430\u043A \u043A\u0430\u043A \u0435\u0433\u043E \u043C\u0430\u0442\u0447\u0438 \u0440\u0435\u0434\u043A\u043E \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F \u0432 \u0447\u0435\u0440\u0435\u0434\u0443 \u0448\u0442\u0440\u0430\u0444\u043D\u044B\u0445 \u0443\u0434\u0430\u0440\u043E\u0432. \u041E\u043D \u043E\u0442\u043B\u0438\u0447\u043D\u043E \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442 \u0440\u0438\u0442\u043C \u0438\u0433\u0440\u044B, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C \u0431\u043E\u0440\u043E\u0442\u044C\u0441\u044F \u0438 \u043D\u0435 \u0441\u0432\u0438\u0441\u0442\u0438\u0442 \u043F\u0440\u0438 \u043A\u0430\u0436\u0434\u043E\u043C \u043F\u0430\u0434\u0435\u043D\u0438\u0438. \u041E\u0434\u043D\u0430\u043A\u043E \u043F\u0440\u0438 \u0433\u0440\u0443\u0431\u044B\u0445 \u0444\u043E\u043B\u0430\u0445 \u0441\u0437\u0430\u0434\u0438 \u0438\u043B\u0438 \u043E\u043F\u0430\u0441\u043D\u043E\u0439 \u0438\u0433\u0440\u0435 \u0432\u044B\u0441\u043E\u043A\u043E \u043F\u043E\u0434\u043D\u044F\u0442\u043E\u0439 \u043D\u043E\u0433\u043E\u0439 \u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043D\u0435\u0437\u0430\u043C\u0435\u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E."
  },
  {
    id: "ref_kukulyak",
    name: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u041A\u0443\u043A\u0443\u043B\u044F\u043A",
    city: "\u041A\u0430\u043B\u0443\u0433\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u0418\u043D\u0442\u0435\u043B\u043B\u0438\u0433\u0435\u043D\u0442\u043D\u044B\u0439 \u0438 \u0443\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440. \u0425\u043E\u0440\u043E\u0448\u043E \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043F\u043E\u0437\u0438\u0446\u0438\u044E \u043D\u0430 \u043F\u043E\u043B\u0435, \u0440\u0435\u0434\u043A\u043E \u043C\u0435\u0448\u0430\u0435\u0442 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430\u043C. \u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u0435\u043D \u043A \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0444\u043E\u043B\u0430\u043C \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F \u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430\u043C \u043F\u0440\u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u0445. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u0433\u0430\u0441\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u043C \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043E\u043C, \u043D\u043E \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0442\u0432\u0451\u0440\u0434\u043E \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u0435\u0442 \u0441\u0430\u043D\u043A\u0446\u0438\u0438.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 7.7,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u041A\u0443\u043A\u0443\u043B\u044F\u043A (\u041A\u0430\u043B\u0443\u0433\u0430) \u2014 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u0435\u043B\u044C \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u0432\u043E\u043B\u043D\u044B \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0445 \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u0432, \u0434\u0435\u043B\u0430\u044E\u0449\u0438\u0439 \u0441\u0442\u0430\u0432\u043A\u0443 \u043D\u0430 \u043F\u0440\u043E\u0444\u0438\u043B\u0430\u043A\u0442\u0438\u043A\u0443 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439. \u041E\u043D \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0430\u0435\u0442 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u043F\u0440\u0438 \u043F\u043E\u0434\u0430\u0447\u0430\u0445 \u0443\u0433\u043B\u043E\u0432\u044B\u0445 \u0438 \u0448\u0442\u0440\u0430\u0444\u043D\u044B\u0445, \u0447\u0451\u0442\u043A\u043E \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u0442\u043E\u043B\u0447\u043A\u0438 \u0432 \u0441\u043F\u0438\u043D\u0443 \u0438 \u0440\u0435\u0434\u043A\u043E \u0434\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442 \u0433\u0440\u0443\u0431\u044B\u0435 \u043F\u0440\u043E\u043C\u0430\u0445\u0438 \u0432 \u043E\u0446\u0435\u043D\u043A\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432."
  },
  {
    id: "ref_moskalev",
    name: "\u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440 \u041C\u043E\u0441\u043A\u0430\u043B\u0435\u0432",
    city: "\u0412\u043E\u0440\u043E\u043D\u0435\u0436",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "principled",
    styleDesc: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0438 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043A \u044D\u043F\u0438\u0437\u043E\u0434\u0430\u043C \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u043F\u043B\u043E\u0449\u0430\u0434\u0438. \u0424\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u043C\u0430\u043B\u0435\u0439\u0448\u0438\u0435 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0438 \u0437\u0430 \u0444\u0443\u0442\u0431\u043E\u043B\u043A\u0443 \u0438 \u043D\u0435\u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u044B\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0432 \u043D\u043E\u0433\u0430\u0445. \u041B\u044E\u0431\u0438\u0442 \u0447\u0451\u0442\u043A\u0438\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043D\u0430 \u043F\u043E\u043B\u0435, \u043D\u0435 \u0442\u0435\u0440\u043F\u0438\u0442 \u043D\u0435\u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0441\u043A\u0430\u043C\u0435\u0435\u043A \u0437\u0430\u043F\u0430\u0441\u043D\u044B\u0445.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 7.6,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0412\u043B\u0430\u0434\u0438\u043C\u0438\u0440 \u041C\u043E\u0441\u043A\u0430\u043B\u0435\u0432 (\u0412\u043E\u0440\u043E\u043D\u0435\u0436) \u2014 \u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F \u0420\u041F\u041B, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u043E\u0448\u0451\u043B \u0447\u0435\u0440\u0435\u0437 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u0441\u043B\u043E\u0436\u043D\u044B\u0445 \u043C\u0430\u0442\u0447\u0435\u0439 \u0438 \u0434\u0435\u0440\u0431\u0438. \u0415\u0433\u043E \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442 \u0441\u043A\u0440\u0443\u043F\u0443\u043B\u0451\u0437\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u0438 \u0440\u0430\u0437\u0431\u043E\u0440\u0435 \u0441\u043F\u043E\u0440\u043D\u044B\u0445 \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u0432 \u0438 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u0438\u0434\u0442\u0438 \u043A \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0443 \u0412\u0410\u0420, \u0435\u0441\u043B\u0438 \u0435\u0441\u0442\u044C \u043C\u0430\u043B\u0435\u0439\u0448\u0438\u0435 \u0441\u043E\u043C\u043D\u0435\u043D\u0438\u044F. \u0412 \u0435\u0433\u043E \u043C\u0430\u0442\u0447\u0430\u0445 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u0430\u043C \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u043E \u0432 \u0441\u0432\u043E\u0435\u0439 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439."
  },
  {
    id: "ref_cheban",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0427\u0435\u0431\u0430\u043D",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "strict",
    styleDesc: "\u0421\u0442\u0440\u043E\u0433\u0438\u0439 \u0438 \u043F\u0435\u0434\u0430\u043D\u0442\u0438\u0447\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440. \u0411\u044B\u0441\u0442\u0440\u043E \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0435\u0442 \u043B\u044E\u0431\u044B\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0438 \u0433\u0440\u0443\u0431\u043E\u0439 \u0438\u0433\u0440\u044B, \u0430\u043A\u0442\u0438\u0432\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u0436\u0451\u043B\u0442\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0443\u0436\u0435 \u0432 \u043F\u0435\u0440\u0432\u043E\u043C \u0442\u0430\u0439\u043C\u0435, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0434\u0430\u0442\u044C \u0436\u0451\u0441\u0442\u043A\u0438\u0435 \u0440\u0430\u043C\u043A\u0438. \u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0441\u043B\u0435\u0434\u0438\u0442 \u0437\u0430 \u0441\u043E\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u0435\u043C \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u0438 \u0441\u0442\u0435\u043D\u043A\u0438 \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u0432\u0432\u043E\u0434\u0430 \u043C\u044F\u0447\u0430.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.5,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0427\u0435\u0431\u0430\u043D (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u0442 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0442\u0447 \u0447\u0435\u0440\u0435\u0437 \u0441\u0442\u0440\u043E\u0433\u0443\u044E \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443. \u0415\u0441\u043B\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043D\u0430\u0447\u0438\u043D\u0430\u044E\u0442 \u0438\u0433\u0440\u0430\u0442\u044C \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0436\u0451\u0441\u0442\u043A\u043E, \u043E\u043D \u0431\u0435\u0437 \u043A\u043E\u043B\u0435\u0431\u0430\u043D\u0438\u0439 \u0434\u043E\u0441\u0442\u0430\u0451\u0442 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F, \u0431\u044B\u0441\u0442\u0440\u043E \u043E\u0445\u043B\u0430\u0436\u0434\u0430\u044F \u043F\u044B\u043B \u043D\u0430\u0440\u0443\u0448\u0438\u0442\u0435\u043B\u0435\u0439. \u0425\u043E\u0440\u043E\u0448\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432 \u0431\u0440\u0438\u0433\u0430\u0434\u0435 \u0438 \u0440\u0435\u0434\u043A\u043E \u043E\u0448\u0438\u0431\u0430\u0435\u0442\u0441\u044F \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0430\u0443\u0442\u043E\u0432 \u0438 \u0443\u0433\u043B\u043E\u0432\u044B\u0445."
  },
  {
    id: "ref_chistyakov",
    name: "\u0410\u0440\u0442\u0435\u043C \u0427\u0438\u0441\u0442\u044F\u043A\u043E\u0432",
    city: "\u0410\u0437\u043E\u0432",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "strict",
    styleDesc: "\u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043A \u0434\u0435\u0442\u0430\u043B\u044F\u043C \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0442\u0435\u0440\u043F\u0435\u0442\u044C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u0439, \u043F\u0440\u043E\u0432\u043E\u043A\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0442\u044F\u0436\u0435\u043A \u0432\u0440\u0435\u043C\u0435\u043D\u0438. \u0421\u0432\u0438\u0441\u0442\u0438\u0442 \u0447\u0451\u0442\u043A\u043E \u0438 \u0433\u0440\u043E\u043C\u043A\u043E, \u043D\u0435 \u0431\u043E\u0438\u0442\u0441\u044F \u0434\u0430\u0432\u0430\u0442\u044C \u0432\u0442\u043E\u0440\u044B\u0435 \u0436\u0451\u043B\u0442\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0437\u0430 \u043D\u0435\u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435. \u0412 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0430\u0445 \u043F\u0440\u0438\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0441\u0440\u0435\u0434\u043D\u0435\u0439 \u043F\u043B\u0430\u043D\u043A\u0438 \u0444\u043E\u043B\u0430.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.5,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0410\u0440\u0442\u0435\u043C \u0427\u0438\u0441\u0442\u044F\u043A\u043E\u0432 (\u0410\u0437\u043E\u0432) \u2014 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0438 \u0441\u043E\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0432\u0441\u0435\u0433\u0434\u0430 \u0434\u0435\u0440\u0436\u0438\u0442 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0430\u0446\u0438\u0438. \u041E\u043D \u043E\u0442\u043B\u0438\u0447\u043D\u043E \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0451\u0442 \xAB\u043D\u044B\u0440\u043A\u0438\xBB \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0438 \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0435\u0442 \u043F\u043E\u043F\u044B\u0442\u043A\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0432\u044B\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u043E\u043B. \u041F\u0440\u0438 \u044D\u0442\u043E\u043C \u0432 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u043D\u044B\u0445 \u0430\u0442\u0430\u043A\u0430\u0445 \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u043C\u0435\u0448\u0430\u0442\u044C \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044E \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u0439."
  },
  {
    id: "ref_shadykhanov",
    name: "\u041F\u0430\u0432\u0435\u043B \u0428\u0430\u0434\u044B\u0445\u0430\u043D\u043E\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u0420\u043E\u0432\u043D\u044B\u0439, \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0431\u0435\u0437 \u043F\u0435\u0440\u0435\u043A\u043E\u0441\u043E\u0432 \u0432 \u0438\u0437\u043B\u0438\u0448\u043D\u044E\u044E \u043C\u044F\u0433\u043A\u043E\u0441\u0442\u044C \u0438\u043B\u0438 \u0436\u0435\u0441\u0442\u043E\u043A\u043E\u0441\u0442\u044C. \u0425\u043E\u0440\u043E\u0448\u043E \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442 \u043C\u043E\u043C\u0435\u043D\u0442, \u043A\u043E\u0433\u0434\u0430 \u043D\u0443\u0436\u043D\u043E \u0434\u0430\u0442\u044C \u0434\u043E\u0438\u0433\u0440\u0430\u0442\u044C \u044D\u043F\u0438\u0437\u043E\u0434, \u0430 \u043A\u043E\u0433\u0434\u0430 \u2014 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438\u0433\u0440\u0443 \u0441\u0432\u0438\u0441\u0442\u043A\u043E\u043C. \u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043A\u0430\u043A \u0432 \u043F\u043E\u043B\u0435, \u0442\u0430\u043A \u0438 \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435 \u0412\u0410\u0420.",
    leagues: ["rpl", "cup", "friendly"],
    rating: 7.4,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041F\u0430\u0432\u0435\u043B \u0428\u0430\u0434\u044B\u0445\u0430\u043D\u043E\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u043D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0440\u0435\u0434\u043A\u043E \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u0433\u0435\u0440\u043E\u0435\u043C \u043F\u043E\u0441\u043B\u0435\u043C\u0430\u0442\u0447\u0435\u0432\u044B\u0445 \u0441\u043A\u0430\u043D\u0434\u0430\u043B\u043E\u0432. \u0415\u0433\u043E \u0441\u0442\u0438\u043B\u044C \u0441\u0442\u0440\u043E\u0438\u0442\u0441\u044F \u043D\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438: \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u0435 \u0444\u043E\u043B\u044B \u0432 \u043D\u0430\u0447\u0430\u043B\u0435 \u0438 \u0432 \u043A\u043E\u043D\u0446\u0435 \u043C\u0430\u0442\u0447\u0430 \u0442\u0440\u0430\u043A\u0442\u0443\u044E\u0442\u0441\u044F \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u043E. \u0423\u043C\u0435\u0435\u0442 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C \u043E\u0431\u0449\u0438\u0439 \u044F\u0437\u044B\u043A \u0441 \u043A\u0430\u043F\u0438\u0442\u0430\u043D\u0430\u043C\u0438 \u043A\u043E\u043C\u0430\u043D\u0434."
  },
  {
    id: "ref_tsyganok",
    name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0426\u044B\u0433\u0430\u043D\u043E\u043A",
    city: "\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "european",
    styleDesc: "\u0421\u0442\u0440\u0435\u043C\u0438\u0442\u0441\u044F \u043A \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u043E\u0439 \u043C\u0430\u043D\u0435\u0440\u0435 \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0430: \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u043B\u0438\u0448\u043D\u0438\u0445 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043E\u043A, \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0430, \u0434\u043E\u0432\u0435\u0440\u0438\u0435 \u043A \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u0430\u043C. \u041D\u0435 \u043B\u044E\u0431\u0438\u0442 \u0441\u0432\u0438\u0441\u0442\u0435\u0442\u044C \u043C\u0435\u043B\u043A\u0438\u0435 \u0442\u043E\u043B\u0447\u043A\u0438 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F, \u043F\u043E\u043E\u0449\u0440\u044F\u044F \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 \u043E\u0431\u043E\u0440\u043E\u043D\u044B \u0432 \u0430\u0442\u0430\u043A\u0443.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.4,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0426\u044B\u0433\u0430\u043D\u043E\u043A (\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434) \u2014 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0444\u0443\u0442\u0431\u043E\u043B \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u044B\u043C \u0438 \u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u043C. \u041E\u043D \u0440\u0435\u0434\u043A\u043E \u0437\u0430\u0442\u044F\u0433\u0438\u0432\u0430\u0435\u0442 \u043F\u0430\u0443\u0437\u044B \u043F\u0440\u0438 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435 \u0412\u0410\u0420, \u0431\u044B\u0441\u0442\u0440\u043E \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0438 \u043D\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0438\u0433\u0440\u043E\u043A\u0430\u043C \u043F\u043E\u0434\u043E\u043B\u0433\u0443 \u0441\u043F\u043E\u0440\u0438\u0442\u044C. \u0425\u043E\u0440\u043E\u0448\u043E \u0441\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0441 \u043C\u0430\u0442\u0447\u0430\u043C\u0438 \u043A\u043E\u043C\u0430\u043D\u0434, \u0438\u0433\u0440\u0430\u044E\u0449\u0438\u0445 \u0432 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u043F\u0440\u0435\u0441\u0441\u0438\u043D\u0433."
  },
  {
    id: "ref_kazartsev",
    name: "\u0412\u0430\u0441\u0438\u043B\u0438\u0439 \u041A\u0430\u0437\u0430\u0440\u0446\u0435\u0432",
    city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "strict",
    styleDesc: "\u0421\u043A\u0440\u0443\u043F\u0443\u043B\u0451\u0437\u043D\u044B\u0439 \u0438 \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0447\u0430\u0441\u0442\u043E \u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u043F\u043E\u043C\u043E\u0449\u044C \u0412\u0410\u0420 \u0432 \u043F\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u043D\u044B\u0445 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044F\u0445. \u0424\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u043C\u0435\u043B\u043A\u0438\u0435 \u0444\u043E\u043B\u044B \u0438 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439, \u0438\u0437-\u0437\u0430 \u0447\u0435\u0433\u043E \u0432 \u0435\u0433\u043E \u043C\u0430\u0442\u0447\u0430\u0445 \u043D\u0435\u0440\u0435\u0434\u043A\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0430\u044E\u0442\u0441\u044F \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438. \u0422\u0440\u0435\u0431\u0443\u0435\u0442 \u0441\u0442\u0440\u043E\u0433\u043E\u0433\u043E \u0441\u043E\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044F \u043F\u0440\u0430\u0432\u0438\u043B.",
    leagues: ["rpl", "fnl", "cup"],
    rating: 7.3,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0412\u0430\u0441\u0438\u043B\u0438\u0439 \u041A\u0430\u0437\u0430\u0440\u0446\u0435\u0432 (\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433) \u2014 \u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0441\u0432\u043E\u0435\u0439 \u0434\u043E\u0442\u043E\u0448\u043D\u043E\u0441\u0442\u044C\u044E \u043F\u0440\u0438 \u0440\u0430\u0437\u0431\u043E\u0440\u0435 \u0438\u0433\u0440\u043E\u0432\u044B\u0445 \u044D\u043F\u0438\u0437\u043E\u0434\u043E\u0432. \u041E\u043D \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u044F \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u043F\u043B\u043E\u0449\u0430\u0434\u0438, \u0430\u043A\u0442\u0438\u0432\u043D\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0441 \u0432\u0438\u0434\u0435\u043E\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u0430\u043C\u0438 \u0438 \u0441\u0442\u0440\u043E\u0433\u043E \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0437\u0430 \u0438\u0433\u0440\u0443 \u0440\u0443\u043A\u043E\u0439."
  },
  {
    id: "ref_shafeev",
    name: "\u0420\u0430\u0444\u0430\u044D\u043B\u044C \u0428\u0430\u0444\u0435\u0435\u0432",
    city: "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "liberal",
    styleDesc: "\u042D\u043D\u0435\u0440\u0433\u0438\u0447\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0438\u0439 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438\u0433\u0440\u044B. \u0414\u0430\u0451\u0442 \u0431\u043E\u0440\u043E\u0442\u044C\u0441\u044F \u0432\u0432\u0435\u0440\u0445\u0443 \u0438 \u0432\u043D\u0438\u0437\u0443, \u043D\u0435 \u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043D\u0430 \u043A\u0440\u0438\u043A\u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u043F\u0440\u0438 \u043B\u0451\u0433\u043A\u0438\u0445 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430\u0445. \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u0437\u0430 \u0441\u0440\u044B\u0432 \u0431\u044B\u0441\u0442\u0440\u044B\u0445 \u0430\u0442\u0430\u043A \u0438 \u043E\u0442\u043A\u0440\u043E\u0432\u0435\u043D\u043D\u0443\u044E \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u044C.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.3,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0420\u0430\u0444\u0430\u044D\u043B\u044C \u0428\u0430\u0444\u0435\u0435\u0432 (\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434) \u2014 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0438 \u0430\u043C\u0431\u0438\u0446\u0438\u043E\u0437\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u043E\u0439. \u041E\u043D \u0432\u0441\u0435\u0433\u0434\u0430 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0440\u044F\u0434\u043E\u043C \u0441 \u043C\u044F\u0447\u043E\u043C, \u0447\u0442\u043E \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0435\u043C\u0443 \u0442\u043E\u0447\u043D\u043E \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u0442\u044C \u0441\u0438\u043B\u0443 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430 \u0432 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432\u0430\u0445. \u0412 \u0435\u0433\u043E \u043C\u0430\u0442\u0447\u0430\u0445 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043C\u043D\u043E\u0433\u043E \u0431\u0435\u0433\u0430\u044E\u0442 \u0438 \u0440\u0435\u0434\u043A\u043E \u0442\u0440\u0430\u0442\u044F\u0442 \u0432\u0440\u0435\u043C\u044F \u043D\u0430 \u0441\u043F\u043E\u0440\u044B."
  },
  {
    id: "ref_frolov",
    name: "\u0410\u043D\u0442\u043E\u043D \u0424\u0440\u043E\u043B\u043E\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "liberal",
    styleDesc: "\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043E\u0442\u043B\u0438\u0447\u043D\u043E \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0434\u0443\u0445 \u0438\u0433\u0440\u044B \u0432 \u043B\u044E\u0431\u044B\u0445 \u0442\u0443\u0440\u043D\u0438\u0440\u0430\u0445 \u2014 \u043E\u0442 \u0420\u041F\u041B \u0434\u043E \u041C\u0435\u0434\u0438\u0430\u043B\u0438\u0433\u0438. \u041D\u0435 \u0431\u043E\u0438\u0442\u0441\u044F \u043D\u0435\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0445 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0439, \u0443\u043C\u0435\u0435\u0442 \u043E\u0431\u0449\u0430\u0442\u044C\u0441\u044F \u0441 \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0438\u0433\u0440\u043E\u043A\u0430\u043C\u0438 \u0438 \u0442\u0440\u0435\u043D\u0435\u0440\u0430\u043C\u0438, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0437\u0440\u0435\u043B\u0438\u0449\u043D\u044B\u0439, \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B.",
    leagues: ["rpl", "2la", "2lb", "media", "cup", "friendly"],
    rating: 7.2,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0410\u043D\u0442\u043E\u043D \u0424\u0440\u043E\u043B\u043E\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u043E\u0434\u0438\u043D \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u0433\u0438\u0431\u043A\u0438\u0445 \u0438 \u043A\u043E\u043C\u043C\u0443\u043D\u0438\u043A\u0430\u0431\u0435\u043B\u044C\u043D\u044B\u0445 \u0441\u0443\u0434\u0435\u0439, \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u044B\u0439 \u0430\u0434\u0430\u043F\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F \u043A \u043B\u044E\u0431\u043E\u043C\u0443 \u0443\u0440\u043E\u0432\u043D\u044E \u043D\u0430\u043A\u0430\u043B\u0430. \u041E\u043D \u043D\u0435 \u043B\u043E\u043C\u0430\u0435\u0442 \u0438\u0433\u0440\u0443 \u043B\u0438\u0448\u043D\u0438\u043C\u0438 \u0441\u0432\u0438\u0441\u0442\u043A\u0430\u043C\u0438, \u043D\u043E \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0435 \u0433\u0440\u0430\u043D\u0438 \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0431\u044B\u0441\u0442\u0440\u043E \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0432 \u0440\u0430\u043C\u043A\u0438 \u043F\u0440\u0430\u0432\u0438\u043B."
  },
  {
    id: "ref_opeykina",
    name: "\u0412\u0435\u0440\u0430 \u041E\u043F\u0435\u0439\u043A\u0438\u043D\u0430",
    city: "\u0421\u043E\u0447\u0438",
    role: "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F",
    varRole: "\u0412\u0410\u0420/\u0410\u0412\u0410\u0420",
    style: "balanced",
    styleDesc: "\u0412\u044B\u0441\u043E\u043A\u043E\u043A\u0432\u0430\u043B\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E\u0449\u0438\u0439\u0441\u044F \u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u043C \u0441\u0443\u0434\u044C\u0451\u0439 \u0438 \u0432\u0438\u0434\u0435\u043E\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u043E\u043C (\u0412\u0410\u0420/\u0410\u0412\u0410\u0420). \u0411\u0435\u0437\u0443\u043F\u0440\u0435\u0447\u043D\u043E \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0435\u0442 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u043E\u043D\u0443, \u0437\u0430\u043C\u0435\u043D\u044B \u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F, \u043E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u043E \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0433\u043B\u0430\u0432\u043D\u043E\u043C\u0443 \u0430\u0440\u0431\u0438\u0442\u0440\u0443 \u043F\u0440\u0438 \u0441\u043A\u0440\u044B\u0442\u044B\u0445 \u0444\u043E\u043B\u0430\u0445.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.2,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0412\u0435\u0440\u0430 \u041E\u043F\u0435\u0439\u043A\u0438\u043D\u0430 (\u0421\u043E\u0447\u0438) \u2014 \u043E\u0434\u043D\u0430 \u0438\u0437 \u0441\u0430\u043C\u044B\u0445 \u043E\u043F\u044B\u0442\u043D\u044B\u0445 \u0436\u0435\u043D\u0449\u0438\u043D-\u0430\u0440\u0431\u0438\u0442\u0440\u043E\u0432 \u0432 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u043C \u0444\u0443\u0442\u0431\u043E\u043B\u0435. \u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043D\u0430\u0437\u043D\u0430\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u043C\u0430\u0442\u0447\u0438 \u0420\u041F\u041B \u0438 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438 \u0432 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0433\u043E \u0430\u0440\u0431\u0438\u0442\u0440\u0430 \u0438 \u0412\u0410\u0420/\u0410\u0412\u0410\u0420. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0436\u0435\u043B\u0435\u0437\u043D\u043E\u0439 \u0432\u044B\u0434\u0435\u0440\u0436\u043A\u043E\u0439 \u0443 \u0431\u0440\u043E\u0432\u043A\u0438 \u0438 \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C\u044E \u043F\u0440\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u043E\u0444\u0441\u0430\u0439\u0434\u043E\u0432 \u0438 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438."
  },
  {
    id: "ref_matveev",
    name: "\u0421\u0442\u0430\u043D\u0438\u0441\u043B\u0430\u0432 \u041C\u0430\u0442\u0432\u0435\u0435\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "strict",
    styleDesc: "\u0416\u0451\u0441\u0442\u043A\u0438\u0439 \u0432 \u0432\u043E\u043F\u0440\u043E\u0441\u0430\u0445 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0444\u043E\u043B\u043E\u0432 \u0430\u0440\u0431\u0438\u0442\u0440. \u041C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0436\u0451\u043B\u0442\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u043E\u0439 \u0437\u0430 \u043F\u0440\u0438\u0445\u0432\u0430\u0442\u044B \u0440\u0443\u043A\u0430\u043C\u0438 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F \u0438 \u0441\u0440\u044B\u0432 \u043A\u043E\u043D\u0442\u0440\u0430\u0442\u0430\u043A. \u0422\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0439 \u043A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0430\u0446\u0438\u0438 \u0438 \u043D\u0435 \u043F\u0440\u043E\u0449\u0430\u0435\u0442 \u0433\u0440\u0443\u0431\u044B\u0445 \u043F\u043E\u0434\u043A\u0430\u0442\u043E\u0432.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7.1,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0421\u0442\u0430\u043D\u0438\u0441\u043B\u0430\u0432 \u041C\u0430\u0442\u0432\u0435\u0435\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043D\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C \u0440\u0430\u0437\u0440\u0443\u0448\u0430\u0442\u044C \u0438\u0433\u0440\u0443 \u043C\u0435\u043B\u043A\u0438\u043C \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0444\u043E\u043B\u043E\u043C. \u0415\u0441\u043B\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u043F\u044B\u0442\u0430\u0435\u0442\u0441\u044F \u0441\u0431\u0438\u0432\u0430\u0442\u044C \u0442\u0435\u043C\u043F \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u043C\u0438 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u044F\u043C\u0438 \u0432 \u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0435 \u043F\u043E\u043B\u044F, \u043E\u043D \u0431\u044B\u0441\u0442\u0440\u043E \u0432\u044B\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u0435\u0442 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044E \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F\u043C\u0438."
  },
  {
    id: "ref_tanashev",
    name: "\u0418\u043D\u0430\u043B \u0422\u0430\u043D\u0430\u0448\u0435\u0432",
    city: "\u041D\u0430\u043B\u044C\u0447\u0438\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "principled",
    styleDesc: "\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u043D\u044B\u0439 \u0438 \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F. \u041D\u0435 \u043F\u043E\u0434\u0434\u0430\u0451\u0442\u0441\u044F \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u044E \u0445\u043E\u0437\u044F\u0435\u0432 \u043F\u043E\u043B\u044F, \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u043E \u0441\u0442\u0440\u043E\u0433\u043E \u0441\u0443\u0434\u0438\u0442 \u043E\u0431\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B. \u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u0435\u043D \u043A \u0431\u043E\u0440\u044C\u0431\u0435 \u043D\u0430 \xAB\u0432\u0442\u043E\u0440\u043E\u043C \u044D\u0442\u0430\u0436\u0435\xBB \u0438 \u043B\u043E\u043A\u0442\u044F\u043C \u043F\u0440\u0438 \u0432\u0435\u0440\u0445\u043E\u0432\u044B\u0445 \u0434\u0443\u044D\u043B\u044F\u0445.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 7,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0418\u043D\u0430\u043B \u0422\u0430\u043D\u0430\u0448\u0435\u0432 (\u041D\u0430\u043B\u044C\u0447\u0438\u043A) \u2014 \u0430\u0440\u0431\u0438\u0442\u0440, \u043F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0439 \u0441\u0443\u0440\u043E\u0432\u0443\u044E \u0448\u043A\u043E\u043B\u0443 \u0424\u041D\u041B \u0438 \u0412\u0442\u043E\u0440\u043E\u0439 \u043B\u0438\u0433\u0438. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C\u044E \u0438 \u0436\u0451\u0441\u0442\u043A\u0438\u043C \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435\u043C \u0432\u0435\u0440\u0445\u043E\u0432\u044B\u0445 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432: \u0437\u0430 \u043E\u0442\u043C\u0430\u0448\u043A\u0438 \u0438 \u043E\u043F\u0430\u0441\u043D\u0443\u044E \u0438\u0433\u0440\u0443 \u043B\u043E\u043A\u0442\u044F\u043C\u0438 \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0431\u0435\u0437 \u043A\u043E\u043B\u0435\u0431\u0430\u043D\u0438\u0439."
  },
  {
    id: "ref_prokopov",
    name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u041F\u0440\u043E\u043A\u043E\u043F\u043E\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "liberal",
    styleDesc: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0441\u0442\u0430\u0440\u0430\u044E\u0449\u0438\u0439\u0441\u044F \u043D\u0435 \u043F\u0435\u0440\u0435\u0433\u0440\u0443\u0436\u0430\u0442\u044C \u0438\u0433\u0440\u0443 \u0441\u0432\u0438\u0441\u0442\u043A\u0430\u043C\u0438. \u0414\u0430\u0451\u0442 \u0431\u043E\u0440\u043E\u0442\u044C\u0441\u044F \u0432 \u0440\u0430\u043C\u043A\u0430\u0445 \u043F\u0440\u0430\u0432\u0438\u043B, \u0440\u0435\u0434\u043A\u043E \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u043C\u0430\u0442\u0447 \u043F\u0440\u0438 \u043D\u0435\u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430\u0445, \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u044F \u0443\u0441\u0442\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u0447\u0430\u043D\u0438\u044F.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.9,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0410\u043D\u0434\u0440\u0435\u0439 \u041F\u0440\u043E\u043A\u043E\u043F\u043E\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0434\u0435\u043B\u0430\u044E\u0449\u0438\u0439 \u0441\u0442\u0430\u0432\u043A\u0443 \u043D\u0430 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043C\u0430\u0442\u0447\u0430. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u0431\u044B\u0442\u044C \u043D\u0435\u0437\u0430\u043C\u0435\u0442\u043D\u044B\u043C \u043D\u0430 \u043F\u043E\u043B\u0435 \u0438 \u0432\u043C\u0435\u0448\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u043E\u0433\u0434\u0430, \u043A\u043E\u0433\u0434\u0430 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0432\u043B\u0438\u044F\u0435\u0442 \u043D\u0430 \u044D\u043F\u0438\u0437\u043E\u0434."
  },
  {
    id: "ref_novikov",
    name: "\u041D\u0438\u043A\u0438\u0442\u0430 \u041D\u043E\u0432\u0438\u043A\u043E\u0432",
    city: "\u041C\u043E\u0441\u043A\u0432\u0430",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "balanced",
    styleDesc: "\u0410\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u044B\u0439 \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440. \u041F\u0440\u0438\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0442\u0440\u0430\u043A\u0442\u043E\u0432\u043A\u0438 \u043F\u0440\u0430\u0432\u0438\u043B, \u0440\u043E\u0432\u043D\u043E \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435 \u043C\u0435\u0436\u0434\u0443 \u043E\u0431\u043E\u0438\u043C\u0438 \u0442\u0430\u0439\u043C\u0430\u043C\u0438, \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u0438\u0437\u0431\u0435\u0433\u0430\u0442\u044C \u043D\u0435\u043E\u043F\u0440\u0430\u0432\u0434\u0430\u043D\u043D\u044B\u0445 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0439.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.8,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041D\u0438\u043A\u0438\u0442\u0430 \u041D\u043E\u0432\u0438\u043A\u043E\u0432 (\u041C\u043E\u0441\u043A\u0432\u0430) \u2014 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0441\u0443\u0434\u044C\u044F, \u043D\u0430\u0431\u0438\u0440\u0430\u044E\u0449\u0438\u0439 \u043E\u043F\u044B\u0442 \u043D\u0430 \u0443\u0440\u043E\u0432\u043D\u0435 \u0420\u041F\u041B \u0438 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0445\u043E\u0440\u043E\u0448\u0435\u0439 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u043E\u0439, \u0447\u0451\u0442\u043A\u043E\u0439 \u0436\u0435\u0441\u0442\u0438\u043A\u0443\u043B\u044F\u0446\u0438\u0435\u0439 \u0438 \u0441\u0442\u0440\u0435\u043C\u043B\u0435\u043D\u0438\u0435\u043C \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0432\u0437\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F."
  },
  {
    id: "ref_kaplenkov",
    name: "\u0418\u0433\u043E\u0440\u044C \u041A\u0430\u043F\u043B\u0435\u043D\u043A\u043E\u0432",
    city: "\u043D\u043E\u0432\u0438\u0447\u043E\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "balanced",
    styleDesc: "\u041D\u0430\u0447\u0438\u043D\u0430\u044E\u0449\u0438\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u044D\u043B\u0438\u0442\u043D\u043E\u0433\u043E \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430, \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0441\u0442\u0440\u043E\u0433\u043E \u043F\u043E \u043C\u0435\u0442\u043E\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u044F\u043C. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u0442\u044C, \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u043E\u0447\u0435\u0432\u0438\u0434\u043D\u044B\u0435 \u0444\u043E\u043B\u044B \u0438 \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0441\u043B\u0435\u0434\u0438\u0442 \u0437\u0430 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u043E\u0439.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.7,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0418\u0433\u043E\u0440\u044C \u041A\u0430\u043F\u043B\u0435\u043D\u043A\u043E\u0432 \u2014 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043D\u0435\u0434\u0430\u0432\u043D\u043E \u043F\u043E\u043F\u043E\u043B\u043D\u0438\u0432\u0448\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u0443\u0434\u0435\u0439 \u0432\u044B\u0441\u0448\u0435\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F. \u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u043E\u0431\u0440\u0430\u043D\u043D\u043E \u0438 \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E, \u0441\u0442\u0430\u0440\u0430\u044F\u0441\u044C \u043D\u0435 \u0434\u043E\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0433\u0440\u0443\u0431\u044B\u0445 \u043E\u0448\u0438\u0431\u043E\u043A \u0432 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0445 \u044D\u043F\u0438\u0437\u043E\u0434\u0430\u0445."
  },
  {
    id: "ref_kashirin",
    name: "\u0414\u0430\u043D\u0438\u043B \u041A\u0430\u0448\u0438\u0440\u0438\u043D",
    city: "\u043D\u043E\u0432\u0438\u0447\u043E\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "liberal",
    styleDesc: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043F\u043B\u0430\u043D\u043A\u043E\u0439 \u0444\u043E\u043B\u0430. \u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0435 \u0441\u0432\u0438\u0441\u0442\u0435\u0442\u044C \u043C\u0435\u043B\u043A\u0438\u0435 \u0441\u0442\u044B\u043A\u0438, \u0434\u0430\u0451\u0442 \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C \u0438\u0433\u0440\u0430\u0442\u044C \u0432 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.6,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0414\u0430\u043D\u0438\u043B \u041A\u0430\u0448\u0438\u0440\u0438\u043D \u2014 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0441\u0443\u0434\u044C\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0441\u0442\u0440\u0435\u043C\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438\u0433\u0440\u044B \u0438 \u043D\u0435 \u0434\u0440\u043E\u0431\u0438\u0442\u044C \u043C\u0430\u0442\u0447 \u0447\u0430\u0441\u0442\u044B\u043C\u0438 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430\u043C\u0438."
  },
  {
    id: "ref_naboka",
    name: "\u0414\u0430\u043D\u0438\u043B \u041D\u0430\u0431\u043E\u043A\u0430",
    city: "\u043D\u043E\u0432\u0438\u0447\u043E\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "balanced",
    styleDesc: "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043F\u0440\u0438\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0438\u0439\u0441\u044F \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u0439 \u043F\u043B\u0430\u043D\u043A\u0438 \u0435\u0434\u0438\u043D\u043E\u0431\u043E\u0440\u0441\u0442\u0432. \u0412\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u0435\u043D \u043A \u0438\u0433\u0440\u0435 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u0438 \u0441\u043E\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u044E \u043F\u0440\u0430\u0432\u0438\u043B \u043F\u0440\u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u0445.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.6,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u0414\u0430\u043D\u0438\u043B \u041D\u0430\u0431\u043E\u043A\u0430 \u2014 \u043D\u0430\u0447\u0438\u043D\u0430\u044E\u0449\u0438\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u0442\u0430\u0432\u043A\u0443 \u043D\u0430 \u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u043E\u0441\u0442\u044C, \u0445\u043E\u0440\u043E\u0448\u0443\u044E \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0444\u043E\u0440\u043C\u0443 \u0438 \u0447\u0451\u0442\u043A\u043E\u0435 \u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C \u0438\u0433\u0440\u044B."
  },
  {
    id: "ref_plisko",
    name: "\u041C\u0438\u0445\u0430\u0438\u043B \u041F\u043B\u0438\u0441\u043A\u043E",
    city: "\u043D\u043E\u0432\u0438\u0447\u043E\u043A",
    role: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440",
    varRole: "",
    style: "strict",
    styleDesc: "\u0421\u0442\u0440\u043E\u0433\u0438\u0439 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u0442 \u0441\u0440\u0430\u0437\u0443 \u043F\u0440\u0435\u0441\u0435\u043A\u0430\u0442\u044C \u0433\u0440\u0443\u0431\u043E\u0441\u0442\u044C \u0438 \u043D\u0435\u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0436\u0451\u043B\u0442\u044B\u043C\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0443\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430\u0434 \u0438\u0433\u0440\u043E\u0439.",
    leagues: ["rpl", "fnl", "cup", "friendly"],
    rating: 6.5,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0,
    bio: "\u041C\u0438\u0445\u0430\u0438\u043B \u041F\u043B\u0438\u0441\u043A\u043E \u2014 \u043C\u043E\u043B\u043E\u0434\u043E\u0439 \u0441\u0443\u0434\u044C\u044F \u0441 \u0436\u0451\u0441\u0442\u043A\u043E\u0439 \u043C\u0430\u043D\u0435\u0440\u043E\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u044B. \u0411\u044B\u0441\u0442\u0440\u043E \u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043D\u0430 \u0433\u0440\u0443\u0431\u044B\u0435 \u043F\u043E\u0434\u043A\u0430\u0442\u044B \u0438 \u0441\u043F\u043E\u0440\u044B \u0441 \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u043C."
  }
];
var ASSISTANT_REFEREES = [
  "\u041C\u0430\u043A\u0441\u0438\u043C \u0411\u0435\u043B\u043E\u043A\u0443\u0440",
  "\u0414\u0435\u043D\u0438\u0441 \u0411\u0435\u0440\u0435\u0437\u043D\u043E\u0432",
  "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0411\u043E\u0433\u0434\u0430\u043D\u043E\u0432",
  "\u0410\u043D\u0434\u0440\u0435\u0439 \u0411\u043E\u043B\u043E\u0442\u0435\u043D\u043A\u043E\u0432",
  "\u0415\u0433\u043E\u0440 \u0411\u043E\u043B\u0445\u043E\u0432\u0438\u0442\u0438\u043D",
  "\u041A\u0438\u0440\u0438\u043B\u043B \u0411\u043E\u043B\u044C\u0448\u0430\u043A\u043E\u0432",
  "\u0410\u043D\u0434\u0440\u0435\u0439 \u0412\u0435\u0440\u0435\u0442\u0435\u0448\u043A\u0438\u043D",
  "\u041C\u0430\u043A\u0441\u0438\u043C \u0413\u0430\u0432\u0440\u0438\u043B\u0438\u043D",
  "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u0415\u0440\u043C\u0430\u043A\u043E\u0432",
  "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0415\u0440\u043C\u0438\u043B\u043E\u0432",
  "\u041C\u0438\u0445\u0430\u0438\u043B \u0418\u0432\u0430\u043D\u043E\u0432",
  "\u042F\u0440\u043E\u0441\u043B\u0430\u0432 \u041A\u0430\u043B\u0438\u043D\u0438\u0447\u0435\u043D\u043A\u043E",
  "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041A\u0443\u0440\u043E\u0447\u043A\u0438\u043D\u0430",
  "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041B\u0443\u043D\u0435\u0432",
  "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041C\u0430\u043B\u0438\u043A\u043E\u0432",
  "\u041D\u0438\u043A\u0438\u0442\u0430 \u041C\u0430\u0442\u0438\u0435\u0441\u043A\u0443",
  "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041C\u043E\u0441\u044F\u043A\u0438\u043D",
  "\u0420\u0443\u0441\u0442\u0430\u043C \u041C\u0443\u0445\u0442\u0430\u0440\u043E\u0432",
  "\u0410\u043D\u0434\u0440\u0435\u0439 \u041E\u0431\u0440\u0430\u0437\u043A\u043E",
  "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u041F\u0430\u0432\u043B\u043E\u0432",
  "\u0414\u0435\u043D\u0438\u0441 \u041F\u0435\u0442\u0440\u043E\u0432",
  "\u0412\u0430\u0440\u0430\u043D\u0446\u043E \u041F\u0435\u0442\u0440\u043E\u0441\u044F\u043D",
  "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u0421\u0430\u0444\u044C\u044F\u043D",
  "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u0421\u0435\u043C\u0435\u043D\u043E\u0432",
  "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0422\u0443\u0440\u043A\u0438\u043D",
  "\u0410\u043D\u0434\u0440\u0435\u0439 \u0424\u0438\u043B\u0438\u043F\u043A\u0438\u043D",
  "\u0410\u043B\u044C\u043C\u0438\u0440 \u0425\u0430\u0442\u043C\u0443\u043B\u043B\u0438\u043D",
  "\u0410\u0434\u043B\u0430\u043D \u0425\u0430\u0442\u0443\u0435\u0432",
  "\u0420\u0443\u0441\u043B\u0430\u043D \u0428\u0435\u043A\u0435\u043C\u043E\u0432",
  "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u0428\u0438\u0440\u044F\u0435\u0432"
];
var DEFAULT_INTERNATIONAL_BREAKS = [
  { id: "ib_sep", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C)", start: "2026-08-31", end: "2026-09-09" },
  { id: "ib_oct", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043E\u043A\u0442\u044F\u0431\u0440\u044C)", start: "2026-10-05", end: "2026-10-14" },
  { id: "ib_nov", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043D\u043E\u044F\u0431\u0440\u044C)", start: "2026-11-09", end: "2026-11-18" },
  { id: "ib_mar", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043C\u0430\u0440\u0442)", start: "2027-03-22", end: "2027-03-31" },
  { id: "ib_jun", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u0438\u044E\u043D\u044C)", start: "2027-06-01", end: "2027-06-11" }
];
function isInInternationalBreak(dateStr) {
  if (!dateStr || !db?.internationalBreaks) return false;
  return db.internationalBreaks.some((b) => dateStr >= b.start && dateStr <= b.end);
}
function getFixtureTourKey(f) {
  if (f.comp === "rpl") return `rpl:${f.round}`;
  if (f.comp === "cup") {
    const p = f.cupPath || (f.round <= 6 ? "rpl_group" : "regions_qual");
    const r = f.qualRound || f.round || f.cupStage || 1;
    return `cup:${p}:${r}`;
  }
  return `${f.comp}:${f.round || 1}`;
}
function assignTourReferees(tourList) {
  const validMatches = tourList.filter((f) => f.comp === "rpl" || f.comp === "cup");
  const invalidMatches = tourList.filter((f) => f.comp !== "rpl" && f.comp !== "cup");
  for (const f of invalidMatches) {
    delete f.refereeId;
    delete f.refereeName;
    delete f.assistants;
    delete f.reserveReferee;
    delete f.varReferee;
    delete f.avarReferee;
  }
  if (!validMatches.length || !db?.referees?.length) return;
  const usedHeadIds = /* @__PURE__ */ new Set();
  const comp = validMatches[0].comp;
  let eligible = db.referees.filter((r) => !r.leagues || r.leagues.includes(comp));
  if (!eligible.length) eligible = db.referees;
  const teamPower = (tid) => {
    const ps = db.players.filter((p) => p.teamId === tid);
    if (!ps.length) return 70;
    return ps.reduce((s, p) => s + (p.rating || 70), 0) / ps.length;
  };
  const sortedMatches = [...validMatches].sort((a, b) => {
    const aDerby = db.derbies?.some((x) => x.a === a.home && x.b === a.away || x.a === a.away && x.b === a.home) ? 1 : 0;
    const bDerby = db.derbies?.some((x) => x.a === b.home && x.b === b.away || x.a === b.away && x.b === b.home) ? 1 : 0;
    if (bDerby !== aDerby) return bDerby - aDerby;
    return teamPower(b.home) + teamPower(b.away) - (teamPower(a.home) + teamPower(a.away));
  });
  for (const f of sortedMatches) {
    let pool = eligible.filter((r) => !usedHeadIds.has(r.id));
    if (!pool.length) pool = eligible;
    const homeCity = (team(f.home)?.city || "").trim().toLowerCase();
    const awayCity = (team(f.away)?.city || "").trim().toLowerCase();
    const nonSameCity = pool.filter((r) => {
      const rc = (r.city || "").trim().toLowerCase();
      if (!rc) return true;
      return rc !== homeCity && rc !== awayCity;
    });
    const candidatePool = nonSameCity.length ? nonSameCity : pool;
    const sorted = [...candidatePool].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const chosen = sorted[0];
    if (chosen) {
      f.refereeId = chosen.id;
      f.refereeName = chosen.name;
      usedHeadIds.add(chosen.id);
    }
  }
  const allHeadNames = new Set(validMatches.map((f) => f.refereeName).filter(Boolean));
  const nonHeadRefs = db.referees.filter((r) => !usedHeadIds.has(r.id) && !allHeadNames.has(r.name));
  const nonHeadPool = nonHeadRefs.length ? nonHeadRefs : db.referees.filter((r) => !usedHeadIds.has(r.id));
  const asstPool = (db.assistants || []).length ? db.assistants : ASSISTANT_REFEREES.map((n, i) => ({ id: "asst_" + i, name: n }));
  const shuffledAssts = [...asstPool].sort(() => Math.random() - 0.5);
  let asstIdx = 0;
  for (const f of validMatches) {
    const a1 = shuffledAssts[asstIdx % shuffledAssts.length]?.name || "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041C\u043E\u0441\u044F\u043A\u0438\u043D";
    const a2 = shuffledAssts[(asstIdx + 1) % shuffledAssts.length]?.name || "\u0415\u0433\u043E\u0440 \u0411\u043E\u043B\u0445\u043E\u0432\u0438\u0442\u0438\u043D";
    asstIdx += 2;
    f.assistants = [a1, a2];
    const resList = nonHeadPool.filter((r) => r.id !== f.refereeId);
    const chosenRes = resList.find((r) => r.role === "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F") || resList[Math.floor(Math.random() * resList.length)];
    f.reserveReferee = chosenRes?.name || "\u0412\u0435\u0440\u0430 \u041E\u043F\u0435\u0439\u043A\u0438\u043D\u0430";
    let varList = nonHeadPool.filter((r) => r.varRole && r.id !== f.refereeId && r.name !== f.reserveReferee);
    if (!varList.length) varList = nonHeadPool.filter((r) => r.name !== f.reserveReferee);
    const chosenVar = varList[Math.floor(Math.random() * varList.length)];
    f.varReferee = chosenVar?.name || "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u0430\u0440\u0430\u0441\u0435\u0432";
    let avarList = nonHeadPool.filter((r) => r.id !== f.refereeId && r.name !== f.reserveReferee && r.name !== f.varReferee);
    if (!avarList.length) avarList = nonHeadPool;
    const chosenAvar = avarList[Math.floor(Math.random() * avarList.length)];
    f.avarReferee = chosenAvar?.name || "\u041F\u0430\u0432\u0435\u043B \u041A\u0443\u043A\u0443\u044F\u043D";
  }
}
function assignReferee(f, siblingList) {
  if (f.comp !== "rpl" && f.comp !== "cup") {
    delete f.refereeId;
    delete f.refereeName;
    delete f.assistants;
    delete f.reserveReferee;
    delete f.varReferee;
    delete f.avarReferee;
    return;
  }
  if (!db?.referees?.length) return;
  const tourKey = getFixtureTourKey(f);
  const validSiblings = Array.isArray(siblingList) ? siblingList : db.fixtures || [];
  const siblings = validSiblings.filter((x) => x.id !== f.id && getFixtureTourKey(x) === tourKey);
  assignTourReferees([f, ...siblings]);
}
function updateRefereeStats(f, events = []) {
  if (!f?.refereeId || !db?.referees) return;
  const r = db.referees.find((x) => x.id === f.refereeId);
  if (!r) return;
  const yc = events.filter((e) => e.type === "yellow").length;
  const rc = events.filter((e) => e.type === "red").length;
  const pen = events.filter((e) => e.type === "pen_goal" || e.type === "pen_miss").length;
  r.matches = (r.matches || 0) + 1;
  r.yellows = (r.yellows || 0) + yc;
  r.reds = (r.reds || 0) + rc;
  r.penalties = (r.penalties || 0) + pen;
  const base = r.rating > 0 ? r.rating : 7.5;
  const delta = yc <= 4 && rc === 0 ? 0.1 : rc > 0 ? -0.1 : 0.05;
  r.rating = Math.min(9.9, Math.max(5.5, +(base + delta).toFixed(1)));
  if (Array.isArray(f.assistants) && db.assistants) {
    for (const aname of f.assistants) {
      const a = db.assistants.find((x) => x.name === aname);
      if (a) {
        a.matches = (a.matches || 0) + 1;
        a.rating = a.rating > 0 ? Math.min(9.9, +(a.rating + 0.05).toFixed(1)) : 7.5;
      }
    }
  }
}
var db;
function load() {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    db = seed();
  }
  const def = seed();
  for (const k of Object.keys(def.settings)) {
    if (db.settings[k] === void 0) db.settings[k] = def.settings[k];
  }
  for (const k of ["comps", "teams", "players", "fixtures", "derbies", "transfers", "llmlog", "tournaments", "transferRequests"]) {
    if (!db[k]) db[k] = [];
  }
  if (!db.referees || db.referees.length < 26) db.referees = JSON.parse(JSON.stringify(DEFAULT_REFEREES));
  if (!db.assistants || !db.assistants.length) {
    db.assistants = ASSISTANT_REFEREES.map((name, i) => ({
      id: "asst_" + (i + 1),
      name,
      rating: 0,
      matches: 0,
      bio: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u043E\u0440\u0442\u0440\u0435\u0442 (\u0418\u0418)\xBB, \u0447\u0442\u043E\u0431\u044B \u0441\u0444\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0435 \u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u0430."
    }));
  }
  if (!db.internationalBreaks || !db.internationalBreaks.length) {
    db.internationalBreaks = JSON.parse(JSON.stringify(DEFAULT_INTERNATIONAL_BREAKS));
  } else {
    for (const def2 of DEFAULT_INTERNATIONAL_BREAKS) {
      if (!db.internationalBreaks.some((b) => b.id === def2.id)) {
        db.internationalBreaks.push(JSON.parse(JSON.stringify(def2)));
      }
    }
  }
  for (const k of ["squads", "lineups", "tactics", "sessions"]) {
    if (!db[k]) db[k] = {};
  }
  for (const f of db.fixtures) {
    if (f.comp !== "rpl" && f.comp !== "cup") {
      delete f.refereeId;
      delete f.refereeName;
      delete f.assistants;
      delete f.reserveReferee;
      delete f.varReferee;
      delete f.avarReferee;
    }
  }
  const tours = {};
  for (const f of db.fixtures) {
    if (f.comp === "rpl" || f.comp === "cup") {
      const k = getFixtureTourKey(f);
      tours[k] = tours[k] || [];
      tours[k].push(f);
    }
  }
  for (const list of Object.values(tours)) {
    assignTourReferees(list);
  }
  save();
  db.comps = COMPS;
  const wantedMap = /* @__PURE__ */ new Map();
  for (const [name, city, lat, lon, stadium] of RPL) wantedMap.set(name, { comp: "rpl", city, stadium, lat, lon });
  for (const [name, city, lat, lon, stadium] of FNL_TEAMS) wantedMap.set(name, { comp: "fnl", city, stadium, lat, lon });
  for (const c of Object.keys(LOWER)) {
    for (const name of LOWER[c]) wantedMap.set(name, { comp: c });
  }
  const UPPER_DUPES = /* @__PURE__ */ new Set(["2DROTS", "\u0410\u041C\u041A\u0410\u041B", "BROKE BOYS", "LIT ENERGY", "\u0421\u0418\u041D\u0414\u0415\u041A\u0410\u0422", "\u0421\u041A\u0410 \u0420\u041E\u0421\u0422\u041E\u0412", "\u041D\u0410\u0420\u041E\u0414\u041D\u0410\u042F \u041A\u041E\u041C\u0410\u041D\u0414\u0410", "FIGHT NIGHTS", "PRIME SQUAD", "\u0424\u041A \u0410\u043F\u0441\u043D\u044B", "\u0424\u041A \u041C\u0410\u0422\u0427"]);
  const seenNames = /* @__PURE__ */ new Set();
  db.teams = db.teams.filter((t) => {
    if (UPPER_DUPES.has(t.name)) return false;
    const key = String(t.name || "").toLowerCase().trim();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
  for (const t of db.teams) {
    if (wantedMap.has(t.name)) {
      const w = wantedMap.get(t.name);
      t.comp = w.comp;
      if (w.city) t.city = w.city;
      if (w.stadium) t.stadium = w.stadium;
      if (w.lat != null) t.lat = w.lat;
      if (w.lon != null) t.lon = w.lon;
    }
    t.logo = getTeamLogo(t.name, t.logo, t.comp);
  }
  for (const [name, w] of wantedMap.entries()) {
    if (!db.teams.some((t) => t.name === name)) {
      db.teams.push({
        id: uid(),
        name,
        comp: w.comp,
        city: w.city || "",
        lat: w.lat ?? null,
        lon: w.lon ?? null,
        stadium: w.stadium || "",
        code: w.comp === "rpl" || w.comp === "fnl" ? mkCode() : "",
        logo: getTeamLogo(name, null, w.comp)
      });
    }
  }
  const T = (n) => db.teams.find((t) => t.name === n);
  db.derbies = [];
  for (const [a, b, name, note] of DERBIES) {
    if (T(a) && T(b)) db.derbies.push({ id: uid(), a: T(a).id, b: T(b).id, name, note });
  }
  if (!db.staff || !Array.isArray(db.staff) || db.staff.length < 50) {
    db.staff = getAllInitialStaff(db.teams);
  } else {
    const existingTeamIds = new Set(db.staff.map((s) => s.teamId));
    for (const t of db.teams) {
      if (!existingTeamIds.has(t.id)) {
        db.staff.push(...generateClubStaff(t));
      }
    }
  }
  const hasModernSchedule = db.fixtures.some((f) => f.comp === "cup" && f.cupPath === "regions_qual" && f.date === "2026-07-21");
  if (!db.settings.manualDraw && (!hasModernSchedule || !db.cupState2026)) {
    genSeason("2026-07-18", S());
  } else if (db.cupState2026 && db.fixtures.length) {
    recalculateCupGroups(db.cupState2026, db.fixtures);
  }
  ensureInitialBudgets();
  save();
}
var saveT = null;
function save() {
  if (saveT) return;
  saveT = setTimeout(saveNow, 250);
}
function saveNow() {
  saveT = null;
  try {
    fs.writeFileSync(DB_FILE + ".tmp", JSON.stringify(db));
    fs.renameSync(DB_FILE + ".tmp", DB_FILE);
  } catch (e) {
    console.error("save:", e.message);
  }
}
var mcache = /* @__PURE__ */ new Map();
var getMatch = (id) => {
  if (mcache.has(id)) return mcache.get(id);
  try {
    const m = JSON.parse(fs.readFileSync(path.join(MDIR, id + ".json"), "utf8"));
    mcache.set(id, m);
    if (mcache.size > 40) mcache.delete(mcache.keys().next().value);
    return m;
  } catch {
    return null;
  }
};
var putMatch = (id, m) => {
  mcache.set(id, m);
  fs.writeFileSync(path.join(MDIR, id + ".json"), JSON.stringify(m));
};
var S = () => db.settings.season;
var team = (id) => db.teams.find((t) => t.id === id);
var tn = (id) => team(id)?.name || "?";
var teamLogo = (id) => {
  const t = team(id);
  if (!t) return getTeamLogo("?");
  const official = getTeamLogo(t.name, null, t.comp);
  return official.startsWith("/assets/") ? official : t.logo || official;
};
var player = (id) => db.players.find((p) => p.id === id);
var fx = (id) => db.fixtures.find((f) => f.id === id);
var compOf = (id) => db.comps.find((c) => c.id === id);
var seasonFx = () => db.fixtures.filter((f) => f.season === S());
var GROUP = { \u0412\u0420: "gk", \u0426\u0417: "def", \u041B\u0417: "def", \u041F\u0417: "def", \u041E\u041F: "mid", \u0426\u041F: "mid", \u0410\u041F: "mid", \u041B\u0412: "fwd", \u041F\u0412: "fwd", \u0426\u0424: "fwd" };
var POSES = Object.keys(GROUP);
function squadOf(tid) {
  const ids = db.squads[tid];
  return (ids ? ids.map(player) : db.players.filter((p) => p.teamId === tid)).filter(Boolean);
}
function isAvail(p, date) {
  if (!p) return false;
  if (p.banLeft > 0) return false;
  if (p.out && p.out.until >= date) return false;
  return true;
}
function age(p, date) {
  const y = parseInt(String(p.born || "").slice(0, 4));
  return y ? +date.slice(0, 4) - y : null;
}
function roundLabel(f) {
  if (f.label) return f.label;
  if (f.comp === "cup") {
    if (f.cupPath === "rpl_group") {
      return `\u041F\u0443\u0442\u044C \u0420\u041F\u041B \xB7 ${f.round}-\u0439 \u0442\u0443\u0440`;
    }
    if (f.cupPath === "regions_qual") {
      return `\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 ${f.qualRound || f.round}-\u0439 \u043E\u0442\u0431\u043E\u0440\u043E\u0447\u043D\u044B\u0439 \u0440\u0430\u0443\u043D\u0434`;
    }
    if (f.cupPath === "rpl_playoff") {
      return `\u041F\u0443\u0442\u044C \u0420\u041F\u041B \xB7 1/8 \u0444\u0438\u043D\u0430\u043B\u0430`;
    }
    if (f.cupPath === "regions_playoff") {
      return `\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 1/8 \u0444\u0438\u043D\u0430\u043B\u0430`;
    }
    const n = seasonFx().filter((x) => x.comp === "cup" && x.round === f.round).length;
    return { 16: "1/16 \u0444\u0438\u043D\u0430\u043B\u0430", 8: "1/8 \u0444\u0438\u043D\u0430\u043B\u0430", 4: "1/4 \u0444\u0438\u043D\u0430\u043B\u0430", 2: "\u041F\u043E\u043B\u0443\u0444\u0438\u043D\u0430\u043B", 1: "\u0424\u0438\u043D\u0430\u043B" }[n] || `\u0420\u0430\u0443\u043D\u0434 ${f.round}`;
  }
  return `${f.round}-\u0439 \u0442\u0443\u0440`;
}
var compName = (f) => compOf(f.comp)?.name || f.comp;
var winnerOf = (f) => f.hg > f.ag ? f.home : f.hg < f.ag ? f.away : f.pen ? f.pen.winner === "home" ? f.home : f.away : null;
function parseFeeAmount(feeStr) {
  if (typeof feeStr === "number") return feeStr;
  const s = String(feeStr || "").trim();
  const numMatch = s.match(/([0-9]+(?:[.,][0-9]+)?)/);
  if (!numMatch) return 0;
  let val = parseFloat(numMatch[1].replace(",", "."));
  if (/тыс|k|k\b/i.test(s) && !/млн|m|m\b/i.test(s)) {
    val = val / 1e3;
  } else if (/млрд|b|b\b/i.test(s)) {
    val = val * 1e3;
  }
  if (/₽|руб/i.test(s)) {
    val = val / 100;
  }
  return Math.round(val * 100) / 100;
}
function executeTransferIfBothApproved(t) {
  if (t.status === "approved") return true;
  const needClub2 = !!t.isRplToRpl;
  const clubOk = !needClub2 || t.clubApproval === "approved";
  const adminOk = t.adminApproval === "approved";
  if (clubOk && adminOk) {
    t.status = "approved";
    const p = player(t.pid);
    if (p) {
      if (t.from && db.squads[t.from]) {
        db.squads[t.from] = db.squads[t.from].filter((id) => id !== p.id);
      }
      db.squads[t.to] = [.../* @__PURE__ */ new Set([...squadOf(t.to).map((x) => x.id), p.id])];
      p.teamId = t.to;
      if (t.type === "loan") {
        p.loanFrom = t.from;
        p.loanTerm = t.note || "\u0410\u0440\u0435\u043D\u0434\u0430";
      } else {
        delete p.loanFrom;
        delete p.loanTerm;
      }
      t.statsForNewClub = {
        matches: p.matches || 0,
        goals: p.goals || 0,
        assists: p.assists || 0,
        rating: Number(p.rating || 7),
        impactScore: (p.goals || 0) * 4 + (p.assists || 0) * 2.5 + (p.matches || 0) * 1.2 + ((p.rating || 7) >= 6.5 ? ((p.rating || 7) - 6) * 10 : 0),
        summary: `${p.goals || 0} \u0433\u043E\u043B\u043E\u0432, ${p.assists || 0} \u0430\u0441\u0441\u0438\u0441\u0442\u043E\u0432 \u0432 ${p.matches || 0} \u043C\u0430\u0442\u0447\u0430\u0445`
      };
      const feeAmt = t.feeAmount !== void 0 ? t.feeAmount : parseFeeAmount(t.fee);
      if (feeAmt && feeAmt > 0) {
        const feeEuros = Math.round(feeAmt * 1e6);
        const buyer = team(t.to);
        const seller = team(t.from);
        if (buyer) {
          const prev = buyer.budget || 0;
          buyer.budget = Math.max(0, prev - feeEuros);
          if (!db.budgetHistory) db.budgetHistory = [];
          db.budgetHistory.push({
            id: uid(),
            teamId: buyer.id,
            teamName: buyer.name,
            amount: -feeEuros,
            prevBudget: prev,
            newBudget: buyer.budget,
            type: "transfer_buy",
            typeLabel: "\u041F\u043E\u043A\u0443\u043F\u043A\u0430 \u0438\u0433\u0440\u043E\u043A\u0430",
            description: `\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440: ${p.name} \u0438\u0437 \xAB${seller?.name || t.fromName}\xBB (-\u20AC${feeEuros.toLocaleString("ru-RU")})`,
            date: (/* @__PURE__ */ new Date()).toISOString(),
            byAdmin: !!t.byAdmin
          });
        }
        if (seller) {
          const prev = seller.budget || 0;
          seller.budget = prev + feeEuros;
          if (!db.budgetHistory) db.budgetHistory = [];
          db.budgetHistory.push({
            id: uid(),
            teamId: seller.id,
            teamName: seller.name,
            amount: feeEuros,
            prevBudget: prev,
            newBudget: seller.budget,
            type: "transfer_sell",
            typeLabel: "\u041F\u0440\u043E\u0434\u0430\u0436\u0430 \u0438\u0433\u0440\u043E\u043A\u0430",
            description: `\u041F\u0440\u043E\u0434\u0430\u0436\u0430: ${p.name} \u0432 \xAB${buyer?.name || t.toName}\xBB (+\u20AC${feeEuros.toLocaleString("ru-RU")})`,
            date: (/* @__PURE__ */ new Date()).toISOString(),
            byAdmin: !!t.byAdmin
          });
        }
      }
    }
    return true;
  }
  return false;
}
function formatTransferForPublic(t) {
  const fromT = team(t.from);
  const toT = team(t.to);
  const p = player(t.pid);
  const feeAmt = t.feeAmount !== void 0 ? t.feeAmount : parseFeeAmount(t.fee);
  return {
    id: t.id,
    pid: t.pid,
    playerName: t.playerName || p?.name || "\u0418\u0433\u0440\u043E\u043A",
    pos: t.pos || p?.pos || "\u0426\u041F",
    from: t.from,
    fromName: fromT?.name || t.fromName || "\u041A\u043B\u0443\u0431",
    fromLogo: teamLogo(t.from),
    to: t.to,
    toName: toT?.name || t.toName || "\u041A\u043B\u0443\u0431",
    toLogo: teamLogo(t.to),
    fee: t.fee || (feeAmt ? `\u20AC${feeAmt.toFixed(1)}M` : "\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u0430\u0433\u0435\u043D\u0442"),
    feeAmount: feeAmt,
    type: t.type || "transfer",
    note: t.note || (t.type === "loan" ? "\u0410\u0440\u0435\u043D\u0434\u0430" : "\u041F\u043E\u043B\u043D\u043E\u0446\u0435\u043D\u043D\u044B\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440"),
    date: t.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    isRplToRpl: !!t.isRplToRpl,
    stats: t.statsForNewClub || {
      matches: p?.matches || 0,
      goals: p?.goals || 0,
      assists: p?.assists || 0,
      rating: Number(p?.rating || 7),
      impactScore: (p?.goals || 0) * 4 + (p?.assists || 0) * 2.5 + (p?.matches || 0) * 1.2,
      summary: `${p?.goals || 0} \u0433\u043E\u043B\u043E\u0432, ${p?.assists || 0} \u0430\u0441\u0441\u0438\u0441\u0442\u043E\u0432 \u0432 ${p?.matches || 0} \u043C\u0430\u0442\u0447\u0430\u0445`
    }
  };
}
var INITIAL_RPL_BUDGETS = {
  "\u0417\u0435\u043D\u0438\u0442": 45e6,
  "\u0421\u043F\u0430\u0440\u0442\u0430\u043A": 3e7,
  "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u043E\u0441\u043A\u0432\u0430": 18e6,
  "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440": 15e6,
  "\u0426\u0421\u041A\u0410": 105e5,
  "\u0420\u0443\u0431\u0438\u043D": 5e6,
  "\u041B\u043E\u043A\u043E\u043C\u043E\u0442\u0438\u0432": 39e5,
  "\u0411\u0430\u043B\u0442\u0438\u043A\u0430": 36e5,
  "\u0420\u043E\u0434\u0438\u043D\u0430": 3e6,
  "\u0410\u0445\u043C\u0430\u0442": 3e6,
  "\u0420\u043E\u0441\u0442\u043E\u0432": 3e6,
  "\u0410\u043A\u0440\u043E\u043D": 25e5,
  "\u041A\u0440\u044B\u043B\u044C\u044F \u0421\u043E\u0432\u0435\u0442\u043E\u0432": 2e6,
  "\u041E\u0440\u0435\u043D\u0431\u0443\u0440\u0433": 2e6,
  "\u0414\u0438\u043D\u0430\u043C\u043E \u041C\u0430\u0445\u0430\u0447\u043A\u0430\u043B\u0430": 17e5,
  "\u0424\u0430\u043A\u0435\u043B": 12e5
};
var RPL_PRIZE_SCALE = [
  { place: 1, prize: 13e6, label: "1 \u043C\u0435\u0441\u0442\u043E \u2014 \u0427\u0435\u043C\u043F\u0438\u043E\u043D \u0420\u041F\u041B" },
  { place: 2, prize: 118e5, label: "2 \u043C\u0435\u0441\u0442\u043E \u2014 \u0421\u0435\u0440\u0435\u0431\u0440\u044F\u043D\u044B\u0439 \u043F\u0440\u0438\u0437\u0451\u0440" },
  { place: 3, prize: 1e7, label: "3 \u043C\u0435\u0441\u0442\u043E \u2014 \u0411\u0440\u043E\u043D\u0437\u043E\u0432\u044B\u0439 \u043F\u0440\u0438\u0437\u0451\u0440" },
  { place: 4, prize: 9e6, label: "4 \u043C\u0435\u0441\u0442\u043E" },
  { place: 5, prize: 8e6, label: "5 \u043C\u0435\u0441\u0442\u043E" },
  { place: 6, prize: 7e6, label: "6 \u043C\u0435\u0441\u0442\u043E" },
  { place: 7, prize: 62e5, label: "7 \u043C\u0435\u0441\u0442\u043E" },
  { place: 8, prize: 55e5, label: "8 \u043C\u0435\u0441\u0442\u043E" },
  { place: 9, prize: 49e5, label: "9 \u043C\u0435\u0441\u0442\u043E" },
  { place: 10, prize: 44e5, label: "10 \u043C\u0435\u0441\u0442\u043E" },
  { place: 11, prize: 41e5, label: "11 \u043C\u0435\u0441\u0442\u043E" },
  { place: 12, prize: 39e5, label: "12 \u043C\u0435\u0441\u0442\u043E" },
  { place: 13, prize: 37e5, label: "13 \u043C\u0435\u0441\u0442\u043E (\u0421\u0442\u044B\u043A\u0438)" },
  { place: 14, prize: 36e5, label: "14 \u043C\u0435\u0441\u0442\u043E (\u0421\u0442\u044B\u043A\u0438)" },
  { place: 15, prize: 35e5, label: "15 \u043C\u0435\u0441\u0442\u043E (\u0412\u044B\u043B\u0435\u0442)" },
  { place: 16, prize: 34e5, label: "16 \u043C\u0435\u0441\u0442\u043E (\u0412\u044B\u043B\u0435\u0442)" }
];
var CUP_PRIZE_SCALE = {
  groupParticipation: 3e5,
  // 300 тысяч за участие в групповом этапе
  groupWin: 1e5,
  // 100 тысяч за победу в группе
  r16Participation: 11e4,
  // 110 тысяч за участие в 1/8 финала
  r16Win: 125e3,
  // 125 тысяч за победу в 1/8 финала
  qfParticipation: 11e4,
  // 110 тысяч за участие в 1/4 финала
  qfWin: 25e4,
  // 250 тысяч за победу в 1/4 финала
  sfParticipation: 11e4,
  // 110 тысяч за участие в полуфинале Пути РПЛ
  sfWin: 5e5,
  // 500 тысяч за победу в полуфинале
  finalWinner: 113e4,
  // 1 130 000 € для победителя финала
  finalRunnerUp: 38e4
  // 380 000 € для проигравшего финалиста
};
function ensureInitialBudgets() {
  if (!db.budgetHistory) db.budgetHistory = [];
  let changed = false;
  for (const t of db.teams) {
    if (t.budget === void 0 || t.budget === 0 && INITIAL_RPL_BUDGETS[t.name] !== void 0) {
      if (INITIAL_RPL_BUDGETS[t.name] !== void 0) {
        t.budget = INITIAL_RPL_BUDGETS[t.name];
      } else if (t.comp === "fnl") {
        t.budget = 1e6;
      } else {
        t.budget = 5e5;
      }
      changed = true;
    }
  }
  if (db.budgetHistory.length === 0) {
    const rplTeams = db.teams.filter((t) => t.comp === "rpl");
    for (const t of rplTeams) {
      db.budgetHistory.push({
        id: uid(),
        teamId: t.id,
        teamName: t.name,
        amount: t.budget || 0,
        prevBudget: 0,
        newBudget: t.budget || 0,
        type: "initial",
        typeLabel: "\u0421\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442 \u0441\u0435\u0437\u043E\u043D\u0430",
        description: `\u0423\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442 \u0441\u0435\u0437\u043E\u043D\u0430 2026/27: \u20AC${(t.budget || 0).toLocaleString("ru-RU")}`,
        date: "2026-07-01T10:00:00.000Z",
        byAdmin: true
      });
    }
    changed = true;
  }
  if (changed) save();
}
function calculateCupPrizeSuggestions() {
  const rplTeams = db.teams.filter((t) => t.comp === "rpl");
  const suggestions = [];
  const cupFx = (db.fixtures || []).filter((f) => f.comp === "cup");
  for (const t of rplTeams) {
    let stage = "\u0413\u0440\u0443\u043F\u043F\u043E\u0432\u043E\u0439 \u044D\u0442\u0430\u043F";
    let base = CUP_PRIZE_SCALE.groupParticipation;
    let groupWins = 0;
    let r16Wins = 0;
    let qfWins = 0;
    let sfWins = 0;
    let isFinalWinner = false;
    let isFinalRunnerUp = false;
    for (const f of cupFx) {
      if (f.status !== "done") continue;
      const isHome = f.home === t.id;
      const isAway = f.away === t.id;
      if (!isHome && !isAway) continue;
      const teamWon = isHome && f.homeScore > f.awayScore || isAway && f.awayScore > f.homeScore;
      const isPenWon = f.penalties && (isHome && f.homePen > f.awayPen || isAway && f.awayPen > f.homePen);
      const won = teamWon || isPenWon;
      const label = String(f.label || "").toLowerCase();
      const stageField = String(f.stage || "").toLowerCase();
      if (label.includes("\u0444\u0438\u043D\u0430\u043B") && !label.includes("1/2") && !label.includes("1/4") && !label.includes("1/8")) {
        stage = "\u0424\u0438\u043D\u0430\u043B \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438";
        if (won) isFinalWinner = true;
        else isFinalRunnerUp = true;
      } else if (label.includes("1/2") || stageField.includes("semi")) {
        stage = "\u041F\u043E\u043B\u0443\u0444\u0438\u043D\u0430\u043B \u041F\u0443\u0442\u0438 \u0420\u041F\u041B";
        if (won) sfWins++;
      } else if (label.includes("1/4") || stageField.includes("quarter")) {
        stage = "1/4 \u0444\u0438\u043D\u0430\u043B\u0430";
        if (won) qfWins++;
      } else if (label.includes("1/8") || stageField.includes("r16")) {
        stage = "1/8 \u0444\u0438\u043D\u0430\u043B\u0430";
        if (won) r16Wins++;
      } else {
        if (won) groupWins++;
      }
    }
    let totalPrize = base + groupWins * CUP_PRIZE_SCALE.groupWin;
    if (stage === "1/8 \u0444\u0438\u043D\u0430\u043B\u0430") {
      totalPrize += CUP_PRIZE_SCALE.r16Participation + r16Wins * CUP_PRIZE_SCALE.r16Win;
    } else if (stage === "1/4 \u0444\u0438\u043D\u0430\u043B\u0430") {
      totalPrize += CUP_PRIZE_SCALE.r16Participation + CUP_PRIZE_SCALE.qfParticipation + qfWins * CUP_PRIZE_SCALE.qfWin;
    } else if (stage === "\u041F\u043E\u043B\u0443\u0444\u0438\u043D\u0430\u043B \u041F\u0443\u0442\u0438 \u0420\u041F\u041B") {
      totalPrize += CUP_PRIZE_SCALE.r16Participation + CUP_PRIZE_SCALE.qfParticipation + CUP_PRIZE_SCALE.sfParticipation + sfWins * CUP_PRIZE_SCALE.sfWin;
    } else if (stage === "\u0424\u0438\u043D\u0430\u043B \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438") {
      totalPrize += CUP_PRIZE_SCALE.r16Participation + CUP_PRIZE_SCALE.qfParticipation + CUP_PRIZE_SCALE.sfParticipation + (isFinalWinner ? CUP_PRIZE_SCALE.finalWinner : CUP_PRIZE_SCALE.finalRunnerUp);
    }
    suggestions.push({
      teamId: t.id,
      teamName: t.name,
      logo: teamLogo(t.id),
      stage,
      groupWins,
      playoffWins: r16Wins + qfWins + sfWins,
      prize: totalPrize,
      formattedPrize: "\u20AC" + totalPrize.toLocaleString("ru-RU"),
      breakdown: `\u0423\u0447\u0430\u0441\u0442\u0438\u0435 \u20AC300K + ${groupWins} \u043F\u043E\u0431\u0435\u0434 \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 (\u20AC${(groupWins * 100).toLocaleString("ru-RU")}K)`
    });
  }
  return suggestions.sort((a, b) => b.prize - a.prize);
}
async function getTransferAiAdvice(t, p, fromT, toT) {
  const pName = p?.name || t.playerName || "\u0424\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442";
  const pos = p?.pos || t.pos || "\u0418\u0433\u0440\u043E\u043A";
  const playerAge = p ? p.age || 25 : 25;
  const fromName = fromT?.name || t.fromName || "\u041F\u0440\u0435\u0436\u043D\u0438\u0439 \u043A\u043B\u0443\u0431";
  const toName = toT?.name || t.toName || "\u041D\u043E\u0432\u044B\u0439 \u043A\u043B\u0443\u0431";
  const fee = t.fee || "\u041F\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044E";
  const typeStr = t.type === "loan" ? "\u0410\u0440\u0435\u043D\u0434\u0430" : "\u041F\u043E\u043B\u043D\u043E\u0446\u0435\u043D\u043D\u044B\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440";
  const stats = p ? `\u041C\u0430\u0442\u0447\u0435\u0439: ${p.matches || 0}, \u0433\u043E\u043B\u043E\u0432: ${p.goals || 0}, \u0430\u0441\u0441\u0438\u0441\u0442\u043E\u0432: ${p.assists || 0}, \u0441\u0440. \u043E\u0446\u0435\u043D\u043A\u0430: ${Number(p.rating || 7).toFixed(2)}, OVR: ${p.ovr || 75}` : "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0444\u043E\u0440\u043C\u0438\u0440\u0443\u0435\u0442\u0441\u044F";
  const sys = "\u0422\u044B \u2014 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u0438 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u043D\u0442 \u043B\u0438\u0433\u0438 \u0412\u0438\u0440\u0442 \u0420\u041F\u041B. \u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u043D\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u043C\u0435\u0436\u0434\u0443 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u043C\u0438 \u043A\u043B\u0443\u0431\u0430\u043C\u0438 \u0438 \u0434\u0430\u0439 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0440\u0434\u0438\u043A\u0442 \u0434\u043B\u044F \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u043B\u0438\u0433\u0438. \u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON.";
  const prompt = `\u0421\u0434\u0435\u043B\u043A\u0430:
\u0418\u0433\u0440\u043E\u043A: ${pName} (${pos}, \u0432\u043E\u0437\u0440\u0430\u0441\u0442: ${playerAge} \u043B\u0435\u0442, \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0438\u043D: ${p?.nat || "\u0420\u043E\u0441\u0441\u0438\u044F"})
\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430: ${stats}
\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 / \u043E\u0442\u0434\u0430\u044E\u0449\u0438\u0439 \u043A\u043B\u0443\u0431: "${fromName}"
\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C / \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0449\u0438\u0439 \u043A\u043B\u0443\u0431: "${toName}"
\u0422\u0438\u043F \u0441\u0434\u0435\u043B\u043A\u0438: ${typeStr} (\u0443\u0441\u043B\u043E\u0432\u0438\u044F: ${t.note || "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435"})
\u0417\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0441\u0434\u0435\u043B\u043A\u0438: ${fee}

\u0414\u0430\u0439 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0432\u0435\u0440\u0434\u0438\u043A\u0442 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 JSON:
{
  "verdict": "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0434\u043E\u0431\u0440\u0438\u0442\u044C" | "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C" | "\u0421\u043F\u043E\u0440\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430 (\u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F)",
  "ratingScore": 8,
  "fairPrice": "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u20AC6.0M \u2013 \u20AC7.5M",
  "financialAnalysis": "\u043A\u0440\u0430\u0442\u043A\u0438\u0439 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u0430\u0443\u0434\u0438\u0442 (\u0430\u0434\u0435\u043A\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0446\u0435\u043D\u044B, \u0432\u044B\u0433\u043E\u0434\u0430 \u0434\u043B\u044F \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430, \u043D\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043D\u0430 \u0431\u044E\u0434\u0436\u0435\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F)",
  "sportAnalysis": "\u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u043F\u043E\u043B\u044C\u0437\u0430 (\u043A\u0430\u043A \u0438\u0433\u0440\u043E\u043A \u0443\u0441\u0438\u043B\u0438\u0442 \u0441\u043E\u0441\u0442\u0430\u0432 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F \u0438 \u043A\u0430\u043A \u043F\u043E\u0442\u0435\u0440\u044F \u0441\u043A\u0430\u0436\u0435\u0442\u0441\u044F \u043D\u0430 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0435)",
  "risks": "\u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0440\u0438\u0441\u043A\u0438 (\u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F, \u043B\u0438\u043C\u0438\u0442 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432, \u0432\u043E\u0437\u0440\u0430\u0441\u0442, \u0442\u0440\u0430\u0432\u043C\u0430\u0442\u0438\u0447\u043D\u043E\u0441\u0442\u044C)",
  "recommendation": "\u0447\u0451\u0442\u043A\u043E\u0435 \u0440\u0435\u0437\u044E\u043C\u0435 \u0434\u043B\u044F \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 (\u043E\u0434\u043E\u0431\u0440\u044F\u0442\u044C \u0438\u043B\u0438 \u043D\u0435\u0442, \u0438 \u043F\u043E\u0447\u0435\u043C\u0443)"
}`;
  if (process.env.GEMINI_API_KEY) {
    try {
      const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: sys,
          responseMimeType: "application/json"
        }
      });
      const raw = (response.text || "{}").trim();
      const parsed = JSON.parse(raw);
      if (parsed.verdict) return parsed;
    } catch (e) {
      console.error("Gemini AI advice error:", e.message);
    }
  }
  const feeNum = parseFeeAmount(fee);
  const ovr = p?.ovr || 74;
  const estimatedValue = Math.max(0.5, Math.round(((ovr - 65) * 0.85 + (30 - Math.min(32, playerAge)) * 0.3) * 10) / 10);
  const diff = feeNum - estimatedValue;
  let verdict = "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0434\u043E\u0431\u0440\u0438\u0442\u044C";
  let ratingScore = 8;
  if (diff > 5) {
    verdict = "\u0421\u043F\u043E\u0440\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430 (\u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F)";
    ratingScore = 5;
  } else if (diff > 9) {
    verdict = "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C";
    ratingScore = 3;
  } else if (diff < -2) {
    verdict = "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0434\u043E\u0431\u0440\u0438\u0442\u044C";
    ratingScore = 9;
  }
  return {
    verdict,
    ratingScore,
    fairPrice: `\u20AC${Math.max(0.3, estimatedValue * 0.85).toFixed(1)}M \u2013 \u20AC${(estimatedValue * 1.25).toFixed(1)}M`,
    financialAnalysis: feeNum > 0 ? `\u0417\u0430\u044F\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430 ${fee} ${Math.abs(diff) <= 2 ? "\u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u043F\u0440\u0435\u0434\u0435\u043B\u0430\u0445 \u0440\u044B\u043D\u043E\u0447\u043D\u043E\u0433\u043E \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0430 \u0420\u041F\u041B" : diff > 2 ? "\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0435\u0442 \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u0443\u044E \u0440\u044B\u043D\u043E\u0447\u043D\u0443\u044E \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C (\u043F\u0435\u0440\u0435\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F)" : "\u0432\u044B\u0433\u043E\u0434\u043D\u0430 \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F (\u0434\u0438\u0441\u043A\u043E\u043D\u0442 \u043A \u0440\u044B\u043D\u043E\u0447\u043D\u043E\u0439 \u043E\u0446\u0435\u043D\u043A\u0435)"}.` : "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u0444\u043E\u0440\u043C\u043B\u044F\u0435\u0442\u0441\u044F \u043D\u0430 \u043F\u0440\u0430\u0432\u0430\u0445 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0439 \u043A\u043E\u043C\u043F\u0435\u043D\u0441\u0430\u0446\u0438\u0438 \u0438\u043B\u0438 \u0430\u0440\u0435\u043D\u0434\u044B.",
    sportAnalysis: `\u0424\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442 ${pName} (${pos}) \u0443\u0441\u0438\u043B\u0438\u0442 \u0446\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u0443\u044E \u043E\u0441\u044C \u043A\u043B\u0443\u0431\u0430 \xAB${toName}\xBB. \u0414\u043B\u044F \u043A\u043B\u0443\u0431\u0430 \xAB${fromName}\xBB \u0441\u0434\u0435\u043B\u043A\u0430 ${diff >= 0 ? "\u043F\u043E\u0437\u0432\u043E\u043B\u0438\u0442 \u0440\u0430\u0437\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u0440\u043F\u043B\u0430\u0442\u043D\u0443\u044E \u0432\u0435\u0434\u043E\u043C\u043E\u0441\u0442\u044C \u0438 \u0437\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C" : "\u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u043E\u0438\u0441\u043A\u0430 \u0441\u0440\u043E\u0447\u043D\u043E\u0439 \u0437\u0430\u043C\u0435\u043D\u044B \u0432 \u043E\u0441\u043D\u043E\u0432\u0443"}.`,
    risks: playerAge > 30 ? "\u0412\u043E\u0437\u0440\u0430\u0441\u0442\u043D\u043E\u0439 \u0444\u0430\u043A\u0442\u043E\u0440, \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u0441\u043F\u0430\u0434 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u043A\u043E\u043D\u0434\u0438\u0446\u0438\u0439." : playerAge < 21 ? "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u0432\u043E\u0437\u0440\u0430\u0441\u0442, \u0440\u0438\u0441\u043A \u043D\u0435\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0432 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0445 \u043C\u0430\u0442\u0447\u0430\u0445." : "\u0420\u0438\u0441\u043A \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u0438 \u043A \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F\u043C \u043D\u043E\u0432\u043E\u0433\u043E \u0442\u0440\u0435\u043D\u0435\u0440\u0430.",
    recommendation: verdict === "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0434\u043E\u0431\u0440\u0438\u0442\u044C" ? `\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u0435\u043D \u0438 \u043F\u043E\u043B\u0435\u0437\u0435\u043D \u043E\u0431\u0435\u0438\u043C \u0441\u0442\u043E\u0440\u043E\u043D\u0430\u043C. \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u0434\u0430\u0442\u044C \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438.` : verdict === "\u0421\u043F\u043E\u0440\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430 (\u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F)" ? `\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u0435\u0440\u0435\u043F\u043B\u0430\u0447\u0438\u0432\u0430\u0435\u0442, \u043D\u043E \u0435\u0441\u043B\u0438 \u043F\u043E\u0437\u0438\u0446\u0438\u044F \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u0430 \u0434\u043B\u044F \u0441\u0445\u0435\u043C\u044B, \u0441\u0434\u0435\u043B\u043A\u0443 \u043C\u043E\u0436\u043D\u043E \u0441\u0430\u043D\u043A\u0446\u0438\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C.` : `\u0421\u0434\u0435\u043B\u043A\u0430 \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u043E \u0440\u0430\u0437\u0434\u0443\u0442\u0430. \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C \u0438\u043B\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u0441\u043C\u043E\u0442\u0440 \u0441\u0443\u043C\u043C\u044B \u043A\u043E\u043C\u043F\u0435\u043D\u0441\u0430\u0446\u0438\u0438.`
  };
}
function table(comp, beforeDate) {
  let ids = db.teams.filter((t) => t.comp === comp).map((t) => t.id);
  if (comp === "media_cup") {
    const s = /* @__PURE__ */ new Set();
    seasonFx().filter((f) => f.comp === "media_cup").forEach((f) => {
      if (f.home) s.add(f.home);
      if (f.away) s.add(f.away);
    });
    ids = [...s];
  }
  const R = {};
  ids.forEach((i) => {
    const tm = team(i);
    R[i] = {
      id: i,
      name: tn(i),
      logo: teamLogo(i),
      colors: getTeamColors(tm?.name || ""),
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      pts: 0,
      form: []
    };
  });
  const list = seasonFx().filter((f) => f.comp === comp && f.status === "done" && (!beforeDate || f.date < beforeDate)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  for (const f of list) {
    for (const [t, gf, ga] of [[f.home, f.hg, f.ag], [f.away, f.ag, f.hg]]) {
      const r = R[t];
      if (!r) continue;
      r.p++;
      r.gf += gf;
      r.ga += ga;
      if (gf > ga) {
        r.w++;
        r.pts += 3;
        r.form.push("\u0412");
      } else if (gf === ga) {
        r.d++;
        r.pts++;
        r.form.push("\u041D");
      } else {
        r.l++;
        r.form.push("\u041F");
      }
    }
  }
  const rows = Object.values(R).sort((a, b) => b.pts - a.pts || b.w - a.w || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
  rows.forEach((r, i) => {
    r.pos = i + 1;
    r.gd = r.gf - r.ga;
    r.form = r.form.slice(-5).join("");
    const z = getTeamZoneClass(comp, r.pos, rows.length);
    r.zone = z.zoneClass;
    r.zoneLabel = z.badgeLabel || "";
    r.zoneTooltip = z.tooltip || "";
  });
  return rows;
}
var aggCache = null;
function agg() {
  if (aggCache && aggCache.season === S()) return aggCache;
  const P = {}, T = {};
  const add = (o, k, v) => {
    o[k] = (o[k] || 0) + v;
  };
  for (const f of seasonFx()) {
    if (f.status !== "done" || !f.st) continue;
    for (const [pid, s] of Object.entries(f.st.players)) {
      const o = P[f.comp + "|" + pid] ||= { pid, comp: f.comp, n: s.n, t: s.t, logo: teamLogo(s.t), m: 0 };
      o.m += 1;
      for (const k of ["min", "g", "a", "yc", "rc", "tk", "sv", "sh", "xg", "ff", "fa", "cs"]) add(o, k, s[k] || 0);
    }
    for (const side of ["home", "away"]) {
      const tid = f[side], s = f.st.teams[side], o = f.st.teams[side === "home" ? "away" : "home"];
      const x = T[f.comp + "|" + tid] ||= { tid, comp: f.comp, logo: teamLogo(tid), m: 0 };
      x.m++;
      for (const k of ["g", "sh", "sot", "xg", "fo", "co", "yc", "rc", "tk", "sv", "off", "penF", "penA", "refF", "refA"]) add(x, k, s[k] || 0);
      add(x, "ga", o.g || 0);
      add(x, "xga", o.xg || 0);
      add(x, "foA", o.fo || 0);
      if (!(o.g > 0)) add(x, "cs", 1);
    }
  }
  aggCache = { season: S(), P, T };
  return aggCache;
}
var invalidateAgg = () => {
  aggCache = null;
};
function getGeminiKeys() {
  const raw = [];
  if (process.env.GEMINI_API_KEYS) raw.push(...process.env.GEMINI_API_KEYS.split(/[\n,;]+/));
  if (process.env.GEMINI_API_KEY) raw.push(...process.env.GEMINI_API_KEY.split(/[\n,;]+/));
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k) raw.push(k);
  }
  const dbG = db.settings?.keys?.gemini;
  if (typeof dbG === "string") raw.push(...dbG.split(/[\n,;]+/));
  else if (Array.isArray(dbG)) raw.push(...dbG);
  const seen = /* @__PURE__ */ new Set();
  const res = [];
  for (const s of raw) {
    const clean = String(s || "").trim();
    if (clean && !seen.has(clean) && !clean.includes("\u2022")) {
      seen.add(clean);
      res.push(clean);
    }
  }
  return res;
}
function provList() {
  const k = db.settings.keys || {}, m = db.settings.models || {}, L = [];
  const gKeys = getGeminiKeys();
  const q = process.env.GROQ_API_KEY || k.groq;
  const o = process.env.OPENROUTER_API_KEY || k.openrouter;
  const gModel = process.env.GEMINI_MODEL || m.gemini || "gemini-3.8-flash";
  for (let i = 0; i < gKeys.length; i++) {
    L.push({ n: "gemini", id: `gemini_proj_${i + 1}`, key: gKeys[i], model: gModel, max: 32e3 });
  }
  if (q) L.push({ n: "groq", id: "groq", key: q, base: "https://api.groq.com/openai/v1", model: process.env.GROQ_MODEL || m.groq || "openai/gpt-oss-120b", max: 8e3 });
  if (o) L.push({ n: "openrouter", id: "openrouter", key: o, base: "https://openrouter.ai/api/v1", model: process.env.OPENROUTER_MODEL || m.openrouter || "openrouter/free", max: 8e3 });
  return L;
}
var hasLLM = () => provList().length > 0;
function httpErr(status, body) {
  return Object.assign(new Error(`HTTP ${status}: ${JSON.stringify(body).slice(0, 200)}`), { status });
}
async function callProv(p, sys, user, o) {
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 17e4);
  try {
    if (p.n === "gemini") {
      const body2 = {
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: o.temp, maxOutputTokens: Math.min(o.max, p.max) }
      };
      if (o.grounded) body2.tools = [{ google_search: {} }];
      else if (o.json) body2.generationConfig.responseMimeType = "application/json";
      const r2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${p.model}:generateContent?key=${p.key}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body2),
        signal: ctl.signal
      });
      const j2 = await r2.json().catch(() => ({}));
      if (!r2.ok) throw httpErr(r2.status, j2);
      return (j2.candidates?.[0]?.content?.parts || []).map((x) => x.text || "").join("");
    }
    const body = { model: p.model, messages: [{ role: "system", content: sys }, { role: "user", content: user }], temperature: o.temp, max_tokens: Math.min(o.max, p.max) };
    if (o.json) body.response_format = { type: "json_object" };
    const r = await fetch(p.base + "/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + p.key },
      body: JSON.stringify(body),
      signal: ctl.signal
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw httpErr(r.status, j);
    return j.choices?.[0]?.message?.content || "";
  } finally {
    clearTimeout(to);
  }
}
function llog(e) {
  db.llmlog.push({ ts: Date.now(), ...e });
  if (db.llmlog.length > 200) db.llmlog.shift();
}
async function llm(sys, user, { json = true, task = "", temp = 0.9, max = 16e3, grounded = false } = {}) {
  const L = provList();
  if (!L.length) throw Object.assign(new Error("\u041D\u0435\u0442 \u043A\u043B\u044E\u0447\u0435\u0439 \u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u0438"), { noLLM: true });
  let last;
  for (const p of L) {
    for (let a = 0; a < 2; a++) {
      const t0 = Date.now();
      try {
        const text = await callProv(p, sys, user, { json, temp, max, grounded });
        if (!text.trim()) throw new Error("\u043F\u0443\u0441\u0442\u043E\u0439 \u043E\u0442\u0432\u0435\u0442");
        llog({ task, p: p.id || p.n, ok: 1, ms: Date.now() - t0 });
        return text;
      } catch (e) {
        last = e;
        llog({ task, p: p.id || p.n, ok: 0, ms: Date.now() - t0, err: e.message.slice(0, 160) });
        if (e.status === 429) {
          console.warn(`[LLM Failover] \u041A\u043B\u044E\u0447 ${p.id || p.n} \u0438\u0441\u0447\u0435\u0440\u043F\u0430\u043B \u043B\u0438\u043C\u0438\u0442 (HTTP 429). \u041C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E\u0435 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043D\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u043A\u043B\u044E\u0447...`);
          await sleep(500);
          break;
        }
        if (e.status >= 500 || e.name === "AbortError") await sleep(1500);
        else if (e.status) break;
      }
    }
  }
  throw last;
}
function parseJSON(t) {
  t = String(t).replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "").trim();
  try {
    return JSON.parse(t);
  } catch {
  }
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
  }
  throw new Error("\u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u044C \u0432\u0435\u0440\u043D\u0443\u043B\u0430 \u043D\u0435-JSON");
}
var llmJSON = async (s, u, o) => parseJSON(await llm(s, u, o));
var CARD_SYS = `\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u0441\u043A\u0430\u0443\u0442-\u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A \u0434\u043B\u044F \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440\u0430. \u041F\u043E \u0438\u043C\u0435\u043D\u0438 \u0438\u0433\u0440\u043E\u043A\u0430 \u0432\u0435\u0440\u043D\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0432 JSON. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u043E, \u0447\u0442\u043E \u0437\u043D\u0430\u0435\u0448\u044C \u0434\u043E\u0441\u0442\u043E\u0432\u0435\u0440\u043D\u043E; \u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A\u0430 \u043D\u0435 \u0437\u043D\u0430\u0435\u0448\u044C \u2014 \u0432\u0435\u0440\u043D\u0438 {"found":false}. \u041D\u0435 \u0432\u044B\u0434\u0443\u043C\u044B\u0432\u0430\u0439. \u041D\u0435 \u043F\u0438\u0448\u0438 \u043E \u043B\u0438\u0447\u043D\u043E\u0439 \u0436\u0438\u0437\u043D\u0438, \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435, \u0441\u043A\u0430\u043D\u0434\u0430\u043B\u0430\u0445 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043F\u043E\u0440\u0442.
\u0424\u043E\u0440\u043C\u0430\u0442 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430: {"found":true,"name":"\u0418\u043C\u044F \u0424\u0430\u043C\u0438\u043B\u0438\u044F \u043F\u043E-\u0440\u0443\u0441\u0441\u043A\u0438","pos":"\u043E\u0434\u043D\u0430 \u0438\u0437: ${POSES.join(", ")}","born":"YYYY-MM-DD \u0438\u043B\u0438 YYYY","nation":"\u0441\u0442\u0440\u0430\u043D\u0430/\u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u0442\u0432\u043E (\u0420\u043E\u0441\u0441\u0438\u044F, \u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u044F, \u0410\u0440\u043C\u0435\u043D\u0438\u044F, \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D, \u0411\u0440\u0430\u0437\u0438\u043B\u0438\u044F \u0438 \u0442.\u0434.)","playedForOtherNationalTeam":false,"otherNationalTeam":"\u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0437\u0430\u0438\u0433\u0440\u0430\u043D \u0437\u0430 \u043D\u0430\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0443\u044E \u0441\u0431\u043E\u0440\u043D\u0443\u044E \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u044B (\u043D\u0430\u043F\u0440. \u0410\u0440\u043C\u0435\u043D\u0438\u044F, \u0413\u0440\u0443\u0437\u0438\u044F, \u0421\u0435\u0440\u0431\u0438\u044F, \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D), \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u043E\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u044D\u0442\u043E\u0439 \u0441\u0431\u043E\u0440\u043D\u043E\u0439, \u0438\u043D\u0430\u0447\u0435 \u043F\u0443\u0441\u0442\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430","realClub":"","style":"\u043A\u0430\u043A \u0438\u0433\u0440\u0430\u0435\u0442, \u043B\u044E\u0431\u0438\u043C\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0430 \u043F\u043E\u043B\u0435, 1\u20132 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F","achievements":["\u0433\u043B\u0430\u0432\u043D\u044B\u0435 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"],"stats2y":"\u0440\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0437\u0430 2 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0441\u0435\u0437\u043E\u043D\u0430 \u043A\u0440\u0430\u0442\u043A\u043E","form":"\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0438 \u0442\u0440\u0435\u043D\u0434","character":"\u0442\u0435\u043C\u043F\u0435\u0440\u0430\u043C\u0435\u043D\u0442 \u043D\u0430 \u043F\u043E\u043B\u0435: \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0439, \u0432\u0441\u043F\u044B\u043B\u044C\u0447\u0438\u0432\u044B\u0439, \u043B\u0438\u0434\u0435\u0440, \u043B\u0435\u0433\u043A\u043E \u043F\u0440\u043E\u0432\u043E\u0446\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0438 \u0442.\u043F.","news":"\u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0437\u0430 \u0433\u043E\u0434 \u043A\u0440\u0430\u0442\u043A\u043E"}
\u0414\u043B\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u043C\u0451\u043D \u0432\u0435\u0440\u043D\u0438 {"players":[...]} \u0432 \u0442\u043E\u043C \u0436\u0435 \u043F\u043E\u0440\u044F\u0434\u043A\u0435.`;
function cardFrom(c, extra = {}) {
  const hasOtherCap = !!(c.playedForOtherNationalTeam || c.otherNationalTeam && norm(c.otherNationalTeam) !== "\u0440\u043E\u0441\u0441\u0438\u044F" || extra.otherNationalTeam && norm(extra.otherNationalTeam) !== "\u0440\u043E\u0441\u0441\u0438\u044F" || extra.playedForOtherNationalTeam);
  return {
    id: uid(),
    teamId: extra.teamId || null,
    name: String(c.name || extra.name || "").trim(),
    pos: POSES.includes(c.pos) ? c.pos : extra.pos || "\u0426\u041F",
    born: c.born || "",
    nation: c.nation || extra.nation || "\u0420\u043E\u0441\u0441\u0438\u044F",
    playedForOtherNationalTeam: hasOtherCap,
    otherNationalTeam: c.otherNationalTeam || extra.otherNationalTeam || "",
    realClub: c.realClub || "",
    style: c.style || "",
    achievements: Array.isArray(c.achievements) ? c.achievements : c.achievements ? [c.achievements] : [],
    stats2y: c.stats2y || "",
    form: c.form || "",
    character: c.character || "",
    news: c.news || "",
    verified: !!c.__llm,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    out: null,
    banLeft: 0,
    seasonYC: 0
  };
}
var findPlayerByName = (n) => {
  const k = norm(n);
  return db.players.find((p) => norm(p.name) === k);
};
async function createPlayers(names, teamId, hint) {
  const out = [];
  const todo = [];
  for (const raw of names) {
    const nm = String(raw).trim();
    if (!nm) continue;
    const ex = findPlayerByName(nm);
    if (ex) out.push(ex);
    else todo.push(nm);
  }
  let cards = [];
  if (todo.length && hasLLM()) {
    try {
      const r = await llmJSON(CARD_SYS, `\u0418\u0433\u0440\u043E\u043A\u0438: ${todo.map((n, i) => `${i + 1}. ${n}`).join("; ")}${hint ? `. \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430: ${hint}` : ""}`, { task: "card", temp: 0.3, max: 8e3, grounded: !!db.settings.grounding && provList()[0]?.n === "gemini" });
      cards = r.players || (r.found !== void 0 ? [r] : []);
    } catch (e) {
      console.error("card:", e.message);
    }
  }
  todo.forEach((nm, i) => {
    const c = cards[i];
    const p = c && c.found !== false ? cardFrom({ ...c, __llm: 1 }, { teamId, name: nm }) : cardFrom({ name: nm, style: "\u0414\u0430\u043D\u043D\u044B\u0445 \u043D\u0435\u0442 \u2014 \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0432\u0440\u0443\u0447\u043D\u0443\u044E." }, { teamId, name: nm });
    if (!p.name) p.name = nm;
    db.players.push(p);
    out.push(p);
  });
  save();
  return out;
}
var wcache = /* @__PURE__ */ new Map();
async function weather(tm, date, time) {
  const hour = parseInt((time || "17:00").slice(0, 2));
  const key = [tm?.id, date, hour].join();
  if (wcache.has(key)) return wcache.get(key);
  let txt = "\u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u043F\u043E\u0433\u043E\u0434\u0435 \u043D\u0435\u0442 \u2014 \u043E\u0446\u0435\u043D\u0438 \u0441\u0430\u043C \u043F\u043E \u0440\u0435\u0433\u0438\u043E\u043D\u0443 \u0438 \u0434\u0430\u0442\u0435; \u0432\u0440\u0435\u043C\u044F \u0441\u0443\u0442\u043E\u043A \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0439";
  try {
    if (tm && tm.lat != null) {
      const days = daysBetween((/* @__PURE__ */ new Date()).toISOString().slice(0, 10), date);
      let temp, wind, rain, snow = 0, src;
      if (days <= 14) {
        const j = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${tm.lat}&longitude=${tm.lon}&hourly=temperature_2m,precipitation,snowfall,wind_speed_10m&start_date=${date}&end_date=${date}&timezone=auto`)).json();
        if (j.hourly) {
          const i = clamp(hour, 0, 23);
          temp = j.hourly.temperature_2m[i];
          wind = j.hourly.wind_speed_10m[i] / 3.6;
          rain = j.hourly.precipitation[i];
          snow = j.hourly.snowfall[i];
          src = "\u043F\u0440\u043E\u0433\u043D\u043E\u0437";
        }
      }
      if (temp == null) {
        const y = +date.slice(0, 4);
        const res = await Promise.all([1, 2, 3, 4, 5].map((k) => fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${tm.lat}&longitude=${tm.lon}&start_date=${y - k}${date.slice(4)}&end_date=${y - k}${date.slice(4)}&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`).then((r) => r.json()).catch(() => null)));
        const d = res.map((r) => r?.daily).filter(Boolean);
        if (d.length) {
          const av = (k) => d.reduce((s, x) => s + (x[k]?.[0] || 0), 0) / d.length;
          const mean = av("temperature_2m_mean"), mx = av("temperature_2m_max"), mn = av("temperature_2m_min");
          temp = hour < 17 ? mean + (mx - mean) * 0.7 : mean - (mean - mn) * 0.4;
          wind = av("wind_speed_10m_max") / 3.6 * 0.6;
          rain = av("precipitation_sum") / 6;
          src = "\u043E\u0431\u044B\u0447\u043D\u0430\u044F \u043F\u043E\u0433\u043E\u0434\u0430 \u043D\u0430 \u044D\u0442\u0443 \u0434\u0430\u0442\u0443 \u043F\u043E \u0434\u0430\u043D\u043D\u044B\u043C \u043F\u0440\u043E\u0448\u043B\u044B\u0445 \u043B\u0435\u0442";
        }
      }
      if (temp != null) {
        const ppt = rain > 0.2 ? temp <= 0 || snow > 0 ? "\u0441\u043D\u0435\u0433" : "\u0434\u043E\u0436\u0434\u044C" : "\u0431\u0435\u0437 \u043E\u0441\u0430\u0434\u043A\u043E\u0432";
        const pitch = temp <= -3 ? "\u0433\u0430\u0437\u043E\u043D \u043F\u043E\u0434\u043C\u0451\u0440\u0437\u0448\u0438\u0439 \u0438 \u0436\u0451\u0441\u0442\u043A\u0438\u0439" : ppt === "\u0434\u043E\u0436\u0434\u044C" ? "\u0433\u0430\u0437\u043E\u043D \u043C\u043E\u043A\u0440\u044B\u0439, \u0441\u043A\u043E\u043B\u044C\u0437\u043A\u0438\u0439" : ppt === "\u0441\u043D\u0435\u0433" ? "\u0433\u0430\u0437\u043E\u043D \u0437\u0430\u0441\u043D\u0435\u0436\u0435\u043D" : temp >= 28 ? "\u0433\u0430\u0437\u043E\u043D \u0441\u0443\u0445\u043E\u0439, \u0436\u0430\u0440\u0430" : "\u0433\u0430\u0437\u043E\u043D \u0432 \u043D\u043E\u0440\u043C\u0435";
        txt = `\u043E\u043A\u043E\u043B\u043E ${Math.round(temp)}\xB0C, \u0432\u0435\u0442\u0435\u0440 ~${Math.round(wind)} \u043C/\u0441, ${ppt}; ${pitch} (${src})`;
      }
    }
  } catch {
  }
  wcache.set(key, txt);
  return txt;
}
function parseFormation(f) {
  const n = String(f || "4-3-3").split("-").map(Number).filter((x) => x > 0);
  const def = n[0] || 4, fwd = n[n.length - 1] || 3, mid = 10 - def - fwd;
  return { def, mid: Math.max(0, mid), fwd };
}
function autoPick(avail, F, used = /* @__PURE__ */ new Set()) {
  const need = { gk: 1, def: F.def, mid: F.mid, fwd: F.fwd }, res = [];
  for (const g of ["gk", "def", "mid", "fwd"]) {
    for (const p of avail) {
      if (res.length >= 11 || used.has(p.id)) continue;
      if (GROUP[p.pos] === g && need[g] > 0) {
        res.push(p.id);
        used.add(p.id);
        need[g]--;
      }
    }
  }
  return res;
}
function fixLineup(L, tid, f) {
  const sq = squadOf(tid), ok = new Set(sq.filter((p) => isAvail(p, f.date)).map((p) => p.id));
  const F = parseFormation(L.formation);
  const used = /* @__PURE__ */ new Set();
  const starters = [];
  const isRpl = f.comp === "rpl";
  const limit = isRpl ? getRplLegionLimit(S()) : null;
  let legCount = 0;
  for (const id of L.starters || []) {
    if (ok.has(id) && !used.has(id)) {
      const p = player(id);
      const isLeg = limit ? isLegionnaire(p) : false;
      if (isLeg && legCount >= limit.onPitch) {
        continue;
      }
      starters.push(id);
      used.add(id);
      if (isLeg) legCount++;
    }
  }
  const hasGK = starters.some((id) => player(id)?.pos === "\u0412\u0420");
  if (!hasGK) {
    const g = sq.find((p) => ok.has(p.id) && p.pos === "\u0412\u0420" && !used.has(p.id));
    if (g) {
      if (starters.length >= 11) {
        const popped = starters.pop();
        used.delete(popped);
        if (limit && isLegionnaire(player(popped))) legCount--;
      }
      starters.push(g.id);
      used.add(g.id);
      if (limit && isLegionnaire(g)) legCount++;
    }
  }
  const avail = sq.filter((p) => ok.has(p.id));
  if (starters.length < 11) {
    for (const id of autoPick(avail.filter((p) => !used.has(p.id) && (!limit || legCount < limit.onPitch || !isLegionnaire(p))), { def: F.def, mid: F.mid, fwd: F.fwd }, used)) {
      starters.push(id);
      if (limit && isLegionnaire(player(id))) legCount++;
    }
  }
  for (const p of avail) {
    if (starters.length >= 11) break;
    if (!used.has(p.id)) {
      if (limit && legCount >= limit.onPitch && isLegionnaire(p)) continue;
      starters.push(p.id);
      used.add(p.id);
      if (limit && isLegionnaire(p)) legCount++;
    }
  }
  const bench = [];
  for (const id of L.bench || []) {
    if (ok.has(id) && !used.has(id) && !bench.includes(id)) bench.push(id);
  }
  for (const p of avail) {
    if (bench.length >= 9) break;
    if (!used.has(p.id) && !bench.includes(p.id)) bench.push(p.id);
  }
  return { formation: L.formation || "4-3-3", starters: starters.slice(0, 11), bench: bench.slice(0, 9), speech: L.speech || "", training: L.training || "" };
}
function getLineup(f, tid) {
  const own = db.lineups[f.id + ":" + tid];
  const base = own || db.tactics[tid] || { formation: "4-3-3" };
  return { ...fixLineup(base, tid, f), submitted: !!own };
}
function motivText(tid, f) {
  const t = team(tid);
  const comp = compOf(t.comp);
  const rows = table(t.comp, f.date);
  const r = rows.find((x) => x.id === tid);
  const n = rows.length;
  let s = "";
  if (f.comp === "cup") s += `\u041A\u0443\u0431\u043A\u043E\u0432\u044B\u0439 \u043C\u0430\u0442\u0447, \u043F\u0440\u043E\u0438\u0433\u0440\u0430\u0432\u0448\u0438\u0439 \u0432\u044B\u0431\u044B\u0432\u0430\u0435\u0442 \u0438\u0437 \u0442\u0443\u0440\u043D\u0438\u0440\u0430. `;
  if (!r || r.p === 0) return s + `${t.name} (${comp?.name}): \u0441\u0435\u0437\u043E\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F, \u0442\u0430\u0431\u043B\u0438\u0446\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441\u043B\u043E\u0436\u0438\u043B\u0430\u0441\u044C.`;
  const lead = rows[0], below = rows[Math.min(n - 1, n - 3)];
  s += `${t.name} (${comp?.name}): ${r.pos}-\u0435 \u043C\u0435\u0441\u0442\u043E \u0438\u0437 ${n}, ${r.pts} \u043E\u0447\u043A. \u0437\u0430 ${r.p} \u043C\u0430\u0442\u0447\u0435\u0439, \u043C\u044F\u0447\u0438 ${r.gf}-${r.ga}, \u0444\u043E\u0440\u043C\u0430: ${r.form || "\u2014"}. `;
  if (r.pos === 1) s += `\u041B\u0438\u0434\u0438\u0440\u0443\u0435\u0442, \u043E\u0442\u0440\u044B\u0432 \u043E\u0442 \u0432\u0442\u043E\u0440\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430 ${r.pts - rows[1].pts} \u043E\u0447\u043A. `;
  else s += `\u041E\u0442\u0441\u0442\u0430\u0432\u0430\u043D\u0438\u0435 \u043E\u0442 \u043B\u0438\u0434\u0435\u0440\u0430 ${lead.pts - r.pts} \u043E\u0447\u043A. `;
  if (r.pos >= n - 2) s += "\u0412 \u0437\u043E\u043D\u0435 \u0432\u044B\u043B\u0435\u0442\u0430 \u2014 \u043E\u0447\u043A\u0438 \u043D\u0443\u0436\u043D\u044B \u043B\u044E\u0431\u043E\u0439 \u0446\u0435\u043D\u043E\u0439. ";
  else if (r.pos >= n - 4) s += `\u0414\u043E \u0437\u043E\u043D\u044B \u0432\u044B\u043B\u0435\u0442\u0430 ${r.pts - below.pts} \u043E\u0447\u043A. \u2014 \u0441\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0435\u0442. `;
  else if (r.pos <= 3) s += "\u0411\u043E\u0440\u0435\u0442\u0441\u044F \u0437\u0430 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0441\u0442\u0432\u043E \u0438 \u0432\u0435\u0440\u0445 \u0442\u0430\u0431\u043B\u0438\u0446\u044B. ";
  else if (r.pos <= 6) s += "\u0411\u043E\u0440\u0435\u0442\u0441\u044F \u0437\u0430 \u0435\u0432\u0440\u043E\u043A\u0443\u0431\u043A\u0438. ";
  else s += "\u0421\u0435\u0440\u0435\u0434\u0438\u043D\u0430 \u0442\u0430\u0431\u043B\u0438\u0446\u044B, \u043E\u0441\u043E\u0431\u044B\u0445 \u0442\u0443\u0440\u043D\u0438\u0440\u043D\u044B\u0445 \u0437\u0430\u0434\u0430\u0447 \u043D\u0435\u0442, \u043D\u043E \u0430\u043C\u0431\u0438\u0446\u0438\u0438 \u0438 \u0433\u043E\u0440\u0434\u043E\u0441\u0442\u044C \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F. ";
  return s.trim();
}
function fatText(tid, f) {
  const prev = seasonFx().filter((x) => x.status === "done" && (x.home === tid || x.away === tid) && x.date < f.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const lines = prev.map((x) => `${daysBetween(x.date, f.date)} \u0434\u043D. \u043D\u0430\u0437\u0430\u0434: ${compName(x)}, ${x.home === tid ? "\u0434\u043E\u043C\u0430" : "\u0432 \u0433\u043E\u0441\u0442\u044F\u0445"} \u043F\u0440\u043E\u0442\u0438\u0432 ${tn(x.home === tid ? x.away : x.home)} ${x.hg}:${x.ag}`);
  const nxt = seasonFx().filter((x) => x.status === "scheduled" && x.id !== f.id && (x.home === tid || x.away === tid) && x.date > f.date).sort((a, b) => a.date.localeCompare(b.date))[0];
  let s = lines.length ? "\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u043C\u0430\u0442\u0447\u0438: " + lines.join("; ") + "." : "\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0445 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u043C\u0430\u0442\u0447\u0435\u0439 \u043D\u0435\u0442 (\u043D\u0430\u0447\u0430\u043B\u043E \u0441\u0435\u0437\u043E\u043D\u0430 \u0438\u043B\u0438 \u0434\u043E\u043B\u0433\u0438\u0439 \u043F\u0435\u0440\u0435\u0440\u044B\u0432).";
  if (nxt && daysBetween(f.date, nxt.date) <= 4) s += ` \u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043C\u0430\u0442\u0447 \u0443\u0436\u0435 \u0447\u0435\u0440\u0435\u0437 ${daysBetween(f.date, nxt.date)} \u0434\u043D. (${compName(nxt)}) \u2014 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u0440\u043E\u0442\u0430\u0446\u0438\u044F \u0438 \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u044F \u0441\u0438\u043B.`;
  if (f.away === tid) {
    const d = km(team(f.away), team(f.home));
    if (d) s += ` \u0414\u043E\u0440\u043E\u0433\u0430 \u0432 \u0433\u043E\u0441\u0442\u0438 \u2248 ${d} \u043A\u043C.`;
  }
  return s;
}
function teamStatsSummary(tid, comp) {
  const allP = Object.values(agg().P).filter((x) => x.t === tid && x.comp === comp);
  const topG = allP.filter((x) => x.g > 0).sort((a, b) => b.g - a.g).slice(0, 3).map((x) => `${x.n} (${x.g} \u0433\u043E\u043B.)`);
  const topA = allP.filter((x) => x.a > 0).sort((a, b) => b.a - a.a).slice(0, 3).map((x) => `${x.n} (${x.a} \u043F\u0430\u0441.)`);
  const cards = allP.filter((x) => (x.yc || 0) + (x.rc || 0) * 2 > 0).sort((a, b) => b.yc + b.rc * 2 - (a.yc + a.rc * 2)).slice(0, 3).map((x) => `${x.n} (${x.yc} \u0416\u041A${x.rc ? `, ${x.rc} \u041A\u041A` : ""})`);
  const tStats = Object.values(agg().T).find((x) => x.tid === tid && x.comp === comp);
  let res = "";
  if (topG.length) res += `\u0411\u043E\u043C\u0431\u0430\u0440\u0434\u0438\u0440\u044B: ${topG.join(", ")}. `;
  if (topA.length) res += `\u0410\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u044B: ${topA.join(", ")}. `;
  if (cards.length) res += `\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 (\u0440\u0438\u0441\u043A \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439): ${cards.join(", ")}. `;
  if (tStats) res += `\u041A\u043E\u043C\u0430\u043D\u0434\u043D\u044B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u0438 (${tStats.m} \u0438\u0433\u0440): \u0437\u0430\u0431\u0438\u0442\u043E ${tStats.g || 0}, xG ${+(tStats.xg || 0).toFixed(1)}, \u0444\u043E\u043B\u044B ${tStats.fo || 0}, \u0416\u041A ${tStats.yc || 0}${tStats.rc ? `, \u041A\u041A ${tStats.rc}` : ""}.`;
  return res.trim() || "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0441\u0435\u0437\u043E\u043D\u0430 \u043D\u0430\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F (\u043F\u0435\u0440\u0432\u044B\u0435 \u0442\u0443\u0440\u044B \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442\u0430).";
}
function staffSummary(tid) {
  const staff = getStaffForTeam(tid);
  if (!staff.length) return "\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u043C \u0448\u0442\u0430\u0431\u0435";
  return staff.slice(0, 4).map((s) => `${s.roleTitle || s.role}: ${s.name}`).join("; ");
}
function cardLine(p, date) {
  if (!p) return "\u0418\u0433\u0440\u043E\u043A (\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445)";
  const a = age(p, date), ag = agg().P;
  let seas = "";
  const row = Object.values(ag).filter((x) => x.pid === p.id && x.comp === "rpl")[0];
  if (row) seas = ` \u0412 \u0441\u0435\u0437\u043E\u043D\u0435: ${row.m} \u0438\u0433\u0440, ${row.g} \u0433\u043E\u043B., ${row.a} \u043F\u0430\u0441., ${row.yc || 0} \u0416\u041A${row.rc ? `, ${row.rc} \u041A\u041A` : ""}${row.cs ? `, ${row.cs} \u0441\u0443\u0445\u0438\u0445 \u043C\u0430\u0442\u0447\u0435\u0439` : ""}.`;
  const foot = p.foot ? `, \u0440\u0430\u0431\u043E\u0447\u0430\u044F \u043D\u043E\u0433\u0430: ${p.foot}` : "";
  const nat = p.nation ? `, \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u0442\u0432\u043E: ${p.nation}` : p.nat ? `, \u0441\u0442\u0440\u0430\u043D\u0430: ${p.nat}` : "";
  const real = p.realClub ? `, \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043B\u0443\u0431: ${p.realClub}` : "";
  return `${p.pos || "\u041F\u0417"} ${p.name}${a ? `, ${a} \u043B\u0435\u0442` : ""}${nat}${foot}${real} \u2014 \u0441\u0442\u0438\u043B\u044C: ${p.style || "\u0441\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439"}. \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F: ${(p.achievements || []).join("; ") || "\u043E\u043F\u044B\u0442 \u0432\u044B\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u0439"}. \u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 2 \u0441\u0435\u0437\u043E\u043D\u043E\u0432: ${p.stats2y || "\u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0430\u044F \u0438\u0433\u0440\u043E\u0432\u0430\u044F \u043F\u0440\u0430\u043A\u0442\u0438\u043A\u0430"}. \u0424\u043E\u0440\u043C\u0430: ${p.form || "\u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u0430\u044F"}.${seas} \u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440: ${p.character || "\u0445\u043B\u0430\u0434\u043D\u043E\u043A\u0440\u043E\u0432\u043D\u044B\u0439, \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u044B\u0439 \u0438\u0433\u0440\u043E\u043A"}. \u041D\u043E\u0432\u043E\u0441\u0442\u0438: ${p.news || "\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F \u043A \u043C\u0430\u0442\u0447\u0443 \u0432 \u0448\u0442\u0430\u0442\u043D\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0435"}.`;
}
async function buildCtx(f) {
  const ctx = { fid: f.id, comp: compName(f), roundLabel: roundLabel(f), date: f.date, time: f.time, names: {}, pidSide: {}, pidTeam: {}, pos: {}, lineup: {}, sides: {} };
  const H = team(f.home), A = team(f.away);
  ctx.sides = {
    home: { id: H.id, name: H.name, logo: teamLogo(H.id) },
    away: { id: A.id, name: A.name, logo: teamLogo(A.id) }
  };
  ctx.stadium = (H.stadium ? H.stadium + ", " : "") + (H.city || "");
  for (const s of ["home", "away"]) {
    const tid = f[s], L = getLineup(f, tid);
    ctx.lineup[s] = L;
    for (const pid of [...L.starters, ...L.bench]) {
      const p = player(pid);
      if (p) {
        ctx.names[pid] = p.name;
        ctx.pidSide[pid] = s;
        ctx.pidTeam[pid] = tid;
        ctx.pos[pid] = p.pos;
      }
    }
  }
  const dv = db.derbies.find((d) => d.a === f.home && d.b === f.away || d.a === f.away && d.b === f.home);
  ctx.derby = dv ? `${dv.name}. ${dv.note}` : "\u043D\u0435\u0442 (\u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043C\u0430\u0442\u0447)";
  ctx.motiv = { home: motivText(f.home, f), away: motivText(f.away, f) };
  const top = Object.values(agg().P).filter((x) => x.comp === "rpl" && x.g > 0).sort((a, b) => b.g - a.g).slice(0, 5);
  ctx.race = top.length ? top.map((x) => `${x.n} (${tn(x.t)}) \u2014 ${x.g}`).join("; ") : "\u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445";
  ctx.weather = await weather(H, f.date, f.time);
  ctx.fat = { home: fatText(f.home, f), away: fatText(f.away, f) };
  const miss = (s) => squadOf(f[s]).filter((p) => !isAvail(p, f.date)).map((p) => `${p.name} (${p.banLeft > 0 ? "\u0434\u0438\u0441\u043A\u0432\u0430\u043B\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F" : "\u0442\u0440\u0430\u0432\u043C\u0430"})`);
  ctx.missing = { home: miss("home"), away: miss("away") };
  const cH = getCoachForTeam(f.home), cA = getCoachForTeam(f.away);
  ctx.coaches = {
    home: { coach: cH, synergy: computeCoachSynergy(cH, ctx.lineup.home), staff: getStaffForTeam(f.home) },
    away: { coach: cA, synergy: computeCoachSynergy(cA, ctx.lineup.away), staff: getStaffForTeam(f.away) }
  };
  ctx.teamStats = {
    home: teamStatsSummary(f.home, f.comp),
    away: teamStatsSummary(f.away, f.comp)
  };
  ctx.staff = {
    home: staffSummary(f.home),
    away: staffSummary(f.away)
  };
  const comp = f.comp;
  const rows = table(comp, f.date);
  const rH = rows.find((x) => x.id === f.home);
  const rA = rows.find((x) => x.id === f.away);
  ctx.tableStandings = {
    home: rH ? `${rH.pos}-\u0435 \u043C\u0435\u0441\u0442\u043E (${rH.pts} \u043E\u0447\u043A., ${rH.p} \u0438\u0433\u0440, ${rH.w}\u0412 ${rH.d}\u041D ${rH.l}\u041F, \u043C\u044F\u0447\u0438 ${rH.gf}-${rH.ga}, \u0440\u0430\u0437\u043D\u0438\u0446\u0430 ${rH.gd >= 0 ? "+" + rH.gd : rH.gd}, \u0444\u043E\u0440\u043C\u0430: ${rH.form || "\u2014"}, \u0437\u043E\u043D\u0430: ${rH.zoneLabel || "\u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0430 \u0442\u0430\u0431\u043B\u0438\u0446\u044B"})` : "\u043D\u0430\u0447\u0430\u043B\u043E \u0442\u0443\u0440\u043D\u0438\u0440\u0430",
    away: rA ? `${rA.pos}-\u0435 \u043C\u0435\u0441\u0442\u043E (${rA.pts} \u043E\u0447\u043A., ${rA.p} \u0438\u0433\u0440, ${rA.w}\u0412 ${rA.d}\u041D ${rA.l}\u041F, \u043C\u044F\u0447\u0438 ${rA.gf}-${rA.ga}, \u0440\u0430\u0437\u043D\u0438\u0446\u0430 ${rA.gd >= 0 ? "+" + rA.gd : rA.gd}, \u0444\u043E\u0440\u043C\u0430: ${rA.form || "\u2014"}, \u0437\u043E\u043D\u0430: ${rA.zoneLabel || "\u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0430 \u0442\u0430\u0431\u043B\u0438\u0446\u044B"})` : "\u043D\u0430\u0447\u0430\u043B\u043E \u0442\u0443\u0440\u043D\u0438\u0440\u0430"
  };
  if (!f.refereeName && (f.comp === "rpl" || f.comp === "cup")) {
    assignReferee(f);
  }
  const headRef = db.referees?.find((r) => r.id === f.refereeId || r.name === f.refereeName) || (f.refereeName ? {
    name: f.refereeName,
    city: "\u0420\u043E\u0441\u0441\u0438\u044F",
    style: "balanced",
    styleDesc: "\u041F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440, \u0434\u0435\u0440\u0436\u0438\u0442 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0443",
    rating: 7.5,
    bio: `\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u2014 ${f.refereeName}`,
    matches: 0,
    yellows: 0,
    reds: 0,
    penalties: 0
  } : null);
  const varRef = db.referees?.find((r) => r.name === f.varReferee) || (f.varReferee ? {
    name: f.varReferee,
    style: "\u0412\u0410\u0420-\u0430\u0440\u0431\u0438\u0442\u0440",
    styleDesc: "\u041E\u043F\u044B\u0442\u043D\u044B\u0439 \u0432\u0438\u0434\u0435\u043E\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 VAR",
    bio: `\u0410\u0440\u0431\u0438\u0442\u0440 VAR \u2014 ${f.varReferee}`
  } : null);
  const assts = Array.isArray(f.assistants) && f.assistants.length >= 2 ? f.assistants : ["\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041C\u043E\u0441\u044F\u043A\u0438\u043D", "\u0412\u0430\u043B\u0435\u043D\u0442\u0438\u043D \u041C\u0443\u0440\u0430\u0448\u043E\u0432"];
  ctx.refereeCrew = {
    head: headRef,
    asst1: assts[0],
    asst2: assts[1],
    fourth: f.reserveReferee || "\u0412\u0435\u0440\u0430 \u041E\u043F\u0435\u0439\u043A\u0438\u043D\u0430",
    var: f.varReferee || (f.comp === "rpl" ? "\u0421\u0435\u0440\u0433\u0435\u0439 \u041A\u0430\u0440\u0430\u0441\u0435\u0432" : null),
    varProfile: varRef,
    avar: f.avarReferee || (f.comp === "rpl" ? "\u041F\u0430\u0432\u0435\u043B \u041A\u0443\u043A\u0443\u044F\u043D" : null)
  };
  return ctx;
}
function lineText(ctx, s) {
  const L = ctx.lineup[s], f = ctx.date, sd = ctx.sides[s];
  const row = (pid) => cardLine(player(pid), f);
  return `\u0421\u041E\u0421\u0422\u0410\u0412 ${sd.name} (\u0441\u0445\u0435\u043C\u0430 ${L.formation}), \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0435 11:
${L.starters.map((p) => "- " + row(p)).join("\n")}
\u0421\u043A\u0430\u043C\u0435\u0439\u043A\u0430 \u0437\u0430\u043F\u0430\u0441\u043D\u044B\u0445:
${L.bench.map((p) => "- " + row(p)).join("\n")}
\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B (\u0442\u0440\u0430\u0432\u043C\u044B/\u0434\u0438\u0441\u043A\u0432\u0430\u043B\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438): ${ctx.missing[s].join(", ") || "\u043D\u0435\u0442"}`;
}
function buildUser(ctx, a, b, st, issues) {
  const H = ctx.sides.home.name, A = ctx.sides.away.name;
  const sp = (s) => (ctx.lineup[s].speech || "").trim() ? `\xAB${ctx.lineup[s].speech.trim()}\xBB` : "(\u0442\u0440\u0435\u043D\u0435\u0440 \u043F\u0440\u043E\u043C\u043E\u043B\u0447\u0430\u043B \u043F\u0435\u0440\u0435\u0434 \u0432\u044B\u0445\u043E\u0434\u043E\u043C \u2014 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u043C\u0443 \u043F\u043B\u0430\u043D\u0443)";
  const tr = (s) => (ctx.lineup[s].training || "").trim() ? `\xAB${ctx.lineup[s].training.trim()}\xBB` : "(\u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u044B\u0439 \u043C\u0438\u043A\u0440\u043E\u0446\u0438\u043A\u043B: \u043E\u0431\u0449\u0435\u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0430\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430, \u043E\u0442\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0441\u0432\u044F\u0437\u043E\u043A \u0438 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432)";
  const cInfo = (s) => {
    const c = ctx.coaches[s];
    const staffNote = ctx.staff?.[s] && ctx.staff[s] !== "\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u043C \u0448\u0442\u0430\u0431\u0435" ? ` \u0422\u0440\u0435\u043D\u0435\u0440\u0441\u043A\u0438\u0439 \u0448\u0442\u0430\u0431: ${ctx.staff[s]}.` : "";
    return `${c.coach.name} (${c.coach.nationality || "\u0420\u043E\u0441\u0441\u0438\u044F"}, ${c.coach.age || 45} \u043B\u0435\u0442, \u0444\u0438\u043B\u043E\u0441\u043E\u0444\u0438\u044F: ${c.coach.styleTitle || c.coach.style}). \u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440 \u043D\u0430 \u0431\u0440\u043E\u0432\u043A\u0435: ${c.coach.temperament || "\u0443\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0439"}. \u041B\u044E\u0431\u0438\u043C\u0430\u044F \u0441\u0445\u0435\u043C\u0430: ${c.coach.favoriteFormation || "4-3-3"}. \u0426\u0438\u0442\u0430\u0442\u0430: ${c.coach.quote || "\xAB\u0418\u0433\u0440\u0430\u0442\u044C \u043D\u0430 \u043F\u043E\u0431\u0435\u0434\u0443\xBB"}. \u0422\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0438\u043D\u0435\u0440\u0433\u0438\u044F: ${c.synergy.statusTitle} (${c.synergy.score}%). ${c.synergy.description}.${staffNote}`;
  };
  const refInfo = () => {
    const rc = ctx.refereeCrew;
    if (!rc || !rc.head) return "\u0421\u0443\u0434\u0435\u0439\u0441\u043A\u0430\u044F \u0431\u0440\u0438\u0433\u0430\u0434\u0430: \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043D\u0430 \u043C\u0430\u0442\u0447 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E\u0435.";
    const h = rc.head;
    let s = `\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F: ${h.name} (${h.city || "\u0420\u0424"}, \u0440\u0435\u0439\u0442\u0438\u043D\u0433 ${h.rating || 7.5}/10, \u0441\u0442\u0438\u043B\u044C: ${h.style || "\u0441\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439"}).
  \u041C\u0430\u043D\u0435\u0440\u0430 \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0430: ${h.styleDesc || h.bio || "\u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u0433\u0440\u0443 \u043F\u043E\u0434 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0435\u043C"}. \u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430: ${h.matches || 0} \u043C\u0430\u0442\u0447\u0435\u0439, ${h.yellows || 0} \u0416\u041A, ${h.reds || 0} \u041A\u041A, ${h.penalties || 0} \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438.`;
    s += `
  \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u0438 \u043D\u0430 \u043B\u0438\u043D\u0438\u044F\u0445: 1-\u0439 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u2014 ${rc.asst1}, 2-\u0439 \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u2014 ${rc.asst2}.`;
    s += `
  \u0420\u0435\u0437\u0435\u0440\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440: ${rc.fourth}.`;
    if (rc.var) {
      s += `
  \u0412\u0438\u0434\u0435\u043E\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442\u044B (VAR): \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0412\u0410\u0420 \u2014 ${rc.var}${rc.varProfile ? ` (${rc.varProfile.styleDesc || "\u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0432\u0438\u0434\u0435\u043E\u0441\u0443\u0434\u044C\u044F"})` : ""}, \u0410\u0412\u0410\u0420 \u2014 ${rc.avar || "\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442 \u0412\u0410\u0420"}.`;
    }
    return s;
  };
  let u = `\u2550\u2550\u2550 \u041C\u0410\u0422\u0427: ${H} \u2014 ${A} | ${ctx.comp}, ${ctx.roundLabel} | ${ctx.date} ${ctx.time} | \u0421\u0442\u0430\u0434\u0438\u043E\u043D: ${ctx.stadium} \u2550\u2550\u2550
`;
  u += `\u041E\u0422\u0420\u0415\u0417\u041E\u041A \u0418\u0413\u0420\u042B: \u043C\u0438\u043D\u0443\u0442\u044B ${a}\u2013${b}

`;
  if (st) {
    u += `\u0422\u0415\u041A\u0423\u0429\u0415\u0415 \u0421\u041E\u0421\u0422\u041E\u042F\u041D\u0418\u0415 \u041C\u0410\u0422\u0427\u0410 (\u043A \u043C\u0438\u043D\u0443\u0442\u0435 ${a}):
`;
    u += `- \u0421\u0447\u0451\u0442: ${H} ${st.score[0]}:${st.score[1]} ${A}
`;
    u += `- \u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F (\u0416\u041A): ${H}: ${st.yellows.home.join(", ") || "\u043D\u0435\u0442"} | ${A}: ${st.yellows.away.join(", ") || "\u043D\u0435\u0442"}
`;
    u += `- \u0423\u0434\u0430\u043B\u0435\u043D\u0438\u044F (\u041A\u041A): ${st.reds.join(", ") || "\u043D\u0435\u0442"}
`;
    u += `- \u041F\u043E\u043A\u0438\u043D\u0443\u043B\u0438 \u043F\u043E\u043B\u0435 (\u0442\u0440\u0430\u0432\u043C\u0430/\u0437\u0430\u043C\u0435\u043D\u0430): ${st.off.join(", ") || "\u043D\u0435\u0442"}
`;
    u += `- \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u043E \u0437\u0430\u043C\u0435\u043D: ${H} ${st.subs.home}/5, ${A} ${st.subs.away}/5 (\u0432\u044B\u0448\u043B\u0438: ${st.ins.join(", ") || "\u043D\u0435\u0442"})
`;
    if (st.note) u += `- \u0425\u043E\u0434 \u0438\u0433\u0440\u044B \u0438 \u043C\u043E\u043C\u0435\u043D\u0442\u0443\u043C: ${st.note}
`;
    u += `- \u0425\u0440\u043E\u043D\u0438\u043A\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u043C\u0438\u043D\u0443\u0442: ${st.last.join(" | ") || "\u043D\u0430\u0447\u0430\u043B\u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0438"}

`;
  }
  u += `1. \u0422\u0423\u0420\u041D\u0418\u0420\u041D\u0410\u042F \u0422\u0410\u0411\u041B\u0418\u0426\u0410 \u0418 \u0422\u0423\u0420\u041D\u0418\u0420\u041D\u041E\u0415 \u0417\u041D\u0410\u0427\u0415\u041D\u0418\u0415:
`;
  u += `- \u041F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 ${H}: ${ctx.tableStandings.home}
`;
  u += `- \u041F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 ${A}: ${ctx.tableStandings.away}
`;
  u += `- \u041C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u044F ${H}: ${ctx.motiv.home}
`;
  u += `- \u041C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u044F ${A}: ${ctx.motiv.away}
`;
  u += `- \u0421\u0422\u0410\u0422\u0423\u0421 \u0414\u0415\u0420\u0411\u0418 / \u041F\u0420\u0418\u041D\u0426\u0418\u041F\u0418\u0410\u041B\u042C\u041D\u041E\u0421\u0422\u042C: ${ctx.derby}
`;
  u += `- \u0413\u043E\u043D\u043A\u0430 \u0431\u043E\u043C\u0431\u0430\u0440\u0434\u0438\u0440\u043E\u0432 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442\u0430: ${ctx.race}

`;
  u += `2. \u0421\u0422\u0410\u0422\u0418\u0421\u0422\u0418\u041A\u0410 \u041A\u041E\u041C\u0410\u041D\u0414 \u0412 \u0422\u0423\u0420\u041D\u0418\u0420\u0415:
`;
  u += `- ${H}: ${ctx.teamStats.home}
`;
  u += `- ${A}: ${ctx.teamStats.away}

`;
  u += `3. \u0421\u0423\u0414\u0415\u0419\u0421\u041A\u0410\u042F \u0411\u0420\u0418\u0413\u0410\u0414\u0410 \u0418 VAR:
${refInfo()}

`;
  u += `4. \u041F\u041E\u0413\u041E\u0414\u0410, \u0413\u0410\u0417\u041E\u041D \u0418 \u0424\u0418\u0417\u0418\u0427\u0415\u0421\u041A\u0418\u0419 \u0413\u0420\u0410\u0424\u0418\u041A:
`;
  u += `- \u041F\u043E\u0433\u043E\u0434\u0430 \u0438 \u0433\u0430\u0437\u043E\u043D: ${ctx.weather}
`;
  u += `- \u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0438 \u0433\u0440\u0430\u0444\u0438\u043A ${H}: ${ctx.fat.home}
`;
  u += `- \u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0438 \u0433\u0440\u0430\u0444\u0438\u043A ${A}: ${ctx.fat.away}

`;
  u += `5. \u0413\u041B\u0410\u0412\u041D\u042B\u0415 \u0422\u0420\u0415\u041D\u0415\u0420\u042B \u0418 \u0428\u0422\u0410\u0411:
`;
  u += `- ${H}: ${cInfo("home")}
`;
  u += `- ${A}: ${cInfo("away")}

`;
  u += `6. \u0422\u0420\u0415\u041D\u0418\u0420\u041E\u0412\u041E\u0427\u041D\u042B\u0419 \u041F\u0420\u041E\u0426\u0415\u0421\u0421 \u0418 \u041F\u0420\u0415\u0414\u041C\u0410\u0422\u0427\u0415\u0412\u042B\u0419 \u041F\u041B\u0410\u041D:
`;
  u += `- \u041D\u0435\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u0446\u0438\u043A\u043B ${H}: ${tr("home")}
`;
  u += `- \u041D\u0435\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u0446\u0438\u043A\u043B ${A}: ${tr("away")}

`;
  u += `7. \u0422\u0410\u041A\u0422\u0418\u0427\u0415\u0421\u041A\u0418\u0415 \u0421\u0425\u0415\u041C\u042B \u0418 \u0423\u0421\u0422\u0410\u041D\u041E\u0412\u041A\u0410 \u041D\u0410 \u0418\u0413\u0420\u0423:
`;
  u += `- ${H} (\u0441\u0445\u0435\u043C\u0430 ${ctx.lineup.home.formation}): ${sp("home")}
`;
  u += `- ${A} (\u0441\u0445\u0435\u043C\u0430 ${ctx.lineup.away.formation}): ${sp("away")}

`;
  u += `8. \u0421\u041E\u0421\u0422\u0410\u0412\u042B \u0418 \u041F\u0420\u041E\u0424\u0418\u041B\u0418 \u0418\u0413\u0420\u041E\u041A\u041E\u0412 (\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u044D\u0442\u0438\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432):
`;
  u += `${lineText(ctx, "home")}

${lineText(ctx, "away")}
`;
  if (issues) {
    u += `
\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415! \u041F\u0440\u043E\u0448\u043B\u0430\u044F \u043F\u043E\u043F\u044B\u0442\u043A\u0430 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u0431\u044B\u043B\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430: ${issues}. \u0421\u0442\u0440\u043E\u0433\u043E \u0443\u0441\u0442\u0440\u0430\u043D\u0438 \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u0447\u0430\u043D\u0438\u044F!
`;
  }
  u += `
\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0439 \u043E\u0442\u0440\u0435\u0437\u043E\u043A \u043C\u0430\u0442\u0447\u0430 (\u043C\u0438\u043D\u0443\u0442\u044B ${a}\u2013${b}) \u0441\u0442\u0440\u043E\u0433\u043E \u0432 \u0432\u0430\u043B\u0438\u0434\u043D\u043E\u043C JSON \u0431\u0435\u0437 markdown-\u043E\u0431\u0451\u0440\u0442\u043A\u0438 \u043F\u043E \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C 10 \u0440\u0430\u0437\u0434\u0435\u043B\u043E\u0432 \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440\u0430.`;
  return u;
}
var TYPES = new Set("kickoff possession pass dribble tackle duel foul yellow red shot save miss post goal own_goal penalty offside corner freekick injury sub var ref_error incident cooling_break highlight halftime fulltime".split(" "));
function indexNames(ctx) {
  return Object.entries(ctx.names).map(([pid, n]) => ({ pid, side: ctx.pidSide[pid], full: norm(n), last: norm(n).split(" ").pop() }));
}
function resolve(idx, name, side) {
  const n = norm(name);
  if (!n) return null;
  const pick = (c) => {
    if (c.length > 1 && side) c = c.filter((x) => x.side === side);
    return c.length === 1 ? c[0].pid : null;
  };
  let r = pick(idx.filter((x) => x.full === n));
  if (r) return r;
  r = pick(idx.filter((x) => x.full.includes(n) || n.includes(x.full)));
  if (r) return r;
  const last = n.split(" ").pop();
  return pick(idx.filter((x) => x.last === last));
}
function deriveState(events, ctx, note) {
  const st = { score: [0, 0], yellows: { home: [], away: [] }, reds: [], off: [], subs: { home: 0, away: 0 }, ins: [], note: note || "", last: events.slice(-8).map((e) => `${e.min}' ${e.text}`) };
  for (const e of events) {
    if (e.type === "goal") st.score[e.team === "home" ? 0 : 1]++;
    if (e.type === "own_goal") st.score[e.team === "home" ? 0 : 1]++;
    const nm = (i) => ctx.names[e.pids?.[i]];
    if (e.type === "yellow" && nm(0)) st.yellows[e.team]?.push(nm(0));
    if (e.type === "red" && nm(0)) {
      st.reds.push(nm(0));
      st.off.push(nm(0));
    }
    if (e.type === "sub") {
      st.subs[e.team]++;
      if (nm(1)) st.off.push(nm(1));
      if (nm(0)) st.ins.push(nm(0));
    }
    if (e.type === "injury" && nm(0) && (e.out_days === void 0 || e.out_days > 0)) st.off.push(nm(0));
  }
  return st;
}
function normalizeEvents(raw, a, b, ctx, prev) {
  if (!Array.isArray(raw) || raw.length < 3) throw new Error("\u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E \u0441\u043E\u0431\u044B\u0442\u0438\u0439");
  const idx = indexNames(ctx), probs = [], unknown = /* @__PURE__ */ new Set();
  const st = deriveState(prev, ctx);
  const off = new Set(st.off.map(norm));
  const subs = { ...st.subs };
  let out = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") continue;
    const type = String(e.type || "").toLowerCase().trim();
    if (!TYPES.has(type)) {
      probs.push("\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0442\u0438\u043F " + type);
      continue;
    }
    let min = Math.round(+e.min), sec = clamp(Math.round(+e.sec) || 0, 0, 59);
    if (!(min >= 0)) {
      probs.push("\u043D\u0435\u0442 \u043C\u0438\u043D\u0443\u0442\u044B");
      continue;
    }
    if (min < a - 1 || min > b + 10) {
      probs.push(`\u043C\u0438\u043D\u0443\u0442\u0430 ${min} \u0432\u043D\u0435 \u043F\u0435\u0440\u0438\u043E\u0434\u0430 ${a}\u2013${b}`);
      continue;
    }
    const pids = [], names = [];
    for (const n of Array.isArray(e.players) ? e.players : []) {
      const pid = resolve(idx, n, ["home", "away"].includes(e.team) && !["save", "sub", "foul", "tackle"].includes(type) ? e.team : null);
      if (pid) {
        pids.push(pid);
        names.push(ctx.names[pid]);
      } else if (n) unknown.add(n);
    }
    let team2 = ["home", "away", "none"].includes(e.team) ? e.team : null;
    if (!team2) team2 = pids[0] ? ctx.pidSide[pids[0]] : "none";
    if (type === "own_goal" && !["home", "away"].includes(team2)) {
      probs.push("\u0430\u0432\u0442\u043E\u0433\u043E\u043B \u0431\u0435\u0437 \u043A\u043E\u043C\u0430\u043D\u0434\u044B");
      continue;
    }
    const actor = type === "sub" || type === "save" ? null : pids[0];
    if (actor && off.has(norm(ctx.names[actor])) && !["yellow", "red", "injury", "foul"].includes(type) && !["var", "incident", "cooling_break", "highlight"].includes(type)) {
      probs.push(`${ctx.names[actor]} \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u0443\u0445\u043E\u0434\u0430 \u0441 \u043F\u043E\u043B\u044F`);
    }
    const outDays = type === "injury" ? e.out_days !== void 0 ? isNaN(+e.out_days) ? 14 : clamp(Math.round(+e.out_days), 0, 240) : 14 : void 0;
    if (type === "red" && pids[0]) off.add(norm(ctx.names[pids[0]]));
    if (type === "injury" && pids[0] && (outDays === void 0 || outDays > 0)) off.add(norm(ctx.names[pids[0]]));
    if (type === "sub") {
      if (["home", "away"].includes(team2)) {
        if (++subs[team2] > 5) probs.push("\u0431\u043E\u043B\u044C\u0448\u0435 5 \u0437\u0430\u043C\u0435\u043D");
      }
      if (pids[1]) off.add(norm(ctx.names[pids[1]]));
    }
    const ev = { min, sec, team: team2, type, players: names, pids, text: String(e.text || "").slice(0, 500) };
    if (type === "shot" || type === "penalty") ev.xg = clamp(+e.xg || (type === "penalty" ? 0.76 : 0.08), 0.01, 0.95);
    if (type === "injury") ev.out_days = outDays;
    out.push(ev);
  }
  {
    const g = out.filter((x) => x.type === "goal" || x.type === "own_goal");
    const tot = st.score[0] + st.score[1] + g.length;
    if (tot > 10) probs.push("\u043D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E \u043C\u043D\u043E\u0433\u043E \u0433\u043E\u043B\u043E\u0432 (" + tot + "), \u043C\u0430\u0442\u0447 \u0434\u043E\u043B\u0436\u0435\u043D \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u0442\u044C \u043A\u0430\u043A \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B");
  }
  if (unknown.size > 4) probs.push("\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0435 \u0438\u0433\u0440\u043E\u043A\u0438 (\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0438\u0437 \u0441\u043E\u0441\u0442\u0430\u0432\u043E\u0432): " + [...unknown].slice(0, 6).join(", "));
  if (probs.length > 3) throw new Error([...new Set(probs)].slice(0, 6).join("; "));
  out = out.map((e, i) => ({ e, i })).sort((x, y) => x.e.min * 60 + x.e.sec - (y.e.min * 60 + y.e.sec) || x.i - y.i).map((x) => x.e);
  if (!out.length) throw new Error("\u043D\u0435\u0442 \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0445 \u0441\u043E\u0431\u044B\u0442\u0438\u0439");
  const lastMin = out[out.length - 1].min;
  if (b === 45 && !out.some((e) => e.type === "halftime")) out.push({ min: Math.max(45, lastMin), sec: 59, team: "none", type: "halftime", players: [], pids: [], text: "\u0421\u0432\u0438\u0441\u0442\u043E\u043A \u2014 \u043F\u0435\u0440\u0435\u0440\u044B\u0432." });
  if (b >= 90 && !out.some((e) => e.type === "fulltime")) out.push({ min: Math.max(90, lastMin), sec: 59, team: "none", type: "fulltime", players: [], pids: [], text: "\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0432\u0438\u0441\u0442\u043E\u043A!" });
  return out;
}
function rescore(events) {
  let h = 0, a = 0;
  for (const e of events) {
    if (e.type === "goal" || e.type === "own_goal") {
      if (e.team === "home") h++;
      else if (e.team === "away") a++;
    }
    e.score = [h, a];
  }
  return [h, a];
}
function fakePeriod(a, b, ctx, prev) {
  const ev = [], R = rng(ctx.fid + a), pick = (arr) => arr[Math.floor(R() * arr.length)];
  const st = deriveState(prev, ctx);
  const off = new Set(st.off);
  const onP = (s) => Object.keys(ctx.names).filter((p) => ctx.pidSide[p] === s && ctx.lineup[s].starters.includes(p) && !off.has(ctx.names[p]));
  const push = (min, sec, team2, type, pl, text, x) => {
    const o = { min, sec, team: team2, type, players: pl.map((p) => ctx.names[p]), pids: pl, text, ...x };
    ev.push(o);
  };
  if (a === 1 || a === 46) push(a, 0, "none", "kickoff", [], a === 1 ? "\u041D\u0430\u0447\u0430\u043B\u0438! \u041C\u044F\u0447 \u0432 \u0438\u0433\u0440\u0435." : "\u041D\u0430\u0447\u0430\u043B\u0441\u044F \u0432\u0442\u043E\u0440\u043E\u0439 \u0442\u0430\u0439\u043C.");
  let hold = R() < 0.5 ? "home" : "away";
  for (let m = a; m <= b; m++) {
    if (R() < 0.3) hold = hold === "home" ? "away" : "home";
    const s = hold, o = s === "home" ? "away" : "home", P = onP(s), Q = onP(o);
    if (!P.length || !Q.length) continue;
    const p1 = pick(P), p2 = pick(P);
    push(m, 5, s, "pass", [p1, p2], `${ctx.names[p1]} \u043E\u0442\u0434\u0430\u0451\u0442 \u043C\u044F\u0447 ${ctx.names[p2]}, ${ctx.sides[s].name} \u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u0433\u0440\u0443.`);
    const r = R();
    const synS = ctx.coaches?.[s]?.synergy;
    const shotThreshold = 0.13 * (synS?.xgMultiplier || 1);
    if (r < shotThreshold) {
      const sh = pick(P.filter((p) => GROUP[ctx.pos[p]] !== "gk")) || P[0];
      const gk = Q.find((p) => ctx.pos[p] === "\u0412\u0420") || Q[0];
      const x = +(0.04 + R() * 0.25 * (synS?.xgMultiplier || 1)).toFixed(2);
      push(m, 20, s, "shot", [sh], `${ctx.names[sh]} \u0431\u044C\u0451\u0442 \u043F\u043E \u0432\u043E\u0440\u043E\u0442\u0430\u043C!`, { xg: x });
      const q = R();
      const goalThreshold = 0.22 * (synS?.xgMultiplier || 1);
      if (q < goalThreshold) {
        push(m, 23, s, "goal", [sh, p2 !== sh ? p2 : p1], `\u0413\u041E\u041B! ${ctx.names[sh]} \u043F\u0435\u0440\u0435\u0438\u0433\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u0440\u0430\u0442\u0430\u0440\u044F!`);
      } else if (q < 0.6) {
        push(m, 23, o, "save", [gk, sh], `${ctx.names[gk]} \u0432\u044B\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0435\u0442 \u043C\u044F\u0447!`);
      } else {
        push(m, 23, s, "miss", [sh], "\u041C\u0438\u043C\u043E \u0432\u043E\u0440\u043E\u0442.");
      }
    } else if (r < 0.24) {
      const f = pick(Q), v = pick(P);
      push(m, 40, o, "foul", [f, v], `${ctx.names[f]} \u043D\u0430\u0440\u0443\u0448\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u043F\u0440\u043E\u0442\u0438\u0432 ${ctx.names[v]}.`);
      if (R() < 0.15) push(m, 45, o, "yellow", [f], `\u0416\u0451\u043B\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 ${ctx.names[f]}.`);
    } else if (r < 0.31) {
      push(m, 35, s, "corner", [], `\u0423\u0433\u043B\u043E\u0432\u043E\u0439 \u0432 \u043F\u043E\u043B\u044C\u0437\u0443 ${ctx.sides[s].name}.`);
    } else if (r < 0.4) {
      const t = pick(Q), l = pick(P);
      push(m, 50, o, "tackle", [t, l], `${ctx.names[t]} \u043E\u0442\u0431\u0438\u0440\u0430\u0435\u0442 \u043C\u044F\u0447 \u0443 ${ctx.names[l]}.`);
      hold = o;
    }
  }
  if (b === 45) push(45, 59, "none", "halftime", [], "\u041F\u0435\u0440\u0435\u0440\u044B\u0432.");
  if (b >= 90) push(90, 59, "none", "fulltime", [], "\u041C\u0430\u0442\u0447 \u043E\u043A\u043E\u043D\u0447\u0435\u043D.");
  return ev;
}
async function genPeriod(a, b, ctx, prev, note, depth = 0) {
  const sys = db.settings.systemPrompt || SYS_DEFAULT;
  if (!hasLLM()) return { events: fakePeriod(a, b, ctx, prev), note };
  let issues = "", lastErr = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const st = prev.length ? deriveState(prev, ctx, note) : null;
      const user = buildUser(ctx, a, b, st, issues);
      if (!ctx.prompt1) ctx.prompt1 = user;
      const r = await llmJSON(sys, user, { task: "match", temp: 0.9, max: 2e4 });
      const evs = normalizeEvents(r.events, a, b, ctx, prev);
      return { events: evs, note: r.state_at_end?.momentum_note || note };
    } catch (e) {
      lastErr = e.message;
      issues = e.message;
      if (e.noLLM) break;
    }
  }
  if (b - a >= 14) {
    const mid = Math.floor((a + b) / 2);
    const x = await genPeriod(a, mid, ctx, prev, note, depth + 1);
    const y = await genPeriod(mid + 1, b, ctx, prev.concat(x.events), x.note, depth + 1);
    return { events: x.events.concat(y.events), note: y.note };
  }
  console.error(`\u043F\u0435\u0440\u0438\u043E\u0434 ${a}-${b}: \u0437\u0430\u043F\u0430\u0441\u043D\u043E\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 (${lastErr})`);
  return { events: fakePeriod(a, b, ctx, prev), note, fallback: true };
}
function computeStats(events, ctx) {
  const mk = () => ({ g: 0, sh: 0, sot: 0, xg: 0, fo: 0, co: 0, yc: 0, rc: 0, tk: 0, sv: 0, off: 0, penF: 0, penA: 0, refF: 0, refA: 0, sub: 0 });
  const t = { home: mk(), away: mk() }, P = {}, posT = { home: 0, away: 0 };
  const pl = (pid) => {
    if (!pid) return {};
    return P[pid] ||= { n: ctx.names[pid], t: ctx.pidTeam[pid], side: ctx.pidSide[pid], min: 0, g: 0, a: 0, yc: 0, rc: 0, tk: 0, sv: 0, sh: 0, xg: 0, ff: 0, fa: 0, cs: 0 };
  };
  const start = {}, end = {};
  for (const s of ["home", "away"]) {
    for (const pid of ctx.lineup[s].starters) start[pid] = 0;
  }
  const lastMin = events.length ? Math.max(90, events[events.length - 1].min) : 90;
  const playT = /* @__PURE__ */ new Set(["possession", "pass", "dribble", "tackle", "shot", "corner", "freekick", "save", "miss", "post", "goal", "penalty", "offside"]);
  let open = null;
  events.forEach((e, i) => {
    const s = e.team, o = s === "home" ? "away" : "home", ok = s === "home" || s === "away", T = ok ? t[s] : null, To = ok ? t[o] : null;
    if (ok && playT.has(e.type) && events[i + 1]) T && (posT[s] += clamp(events[i + 1].min * 60 + events[i + 1].sec - (e.min * 60 + e.sec), 0, 75));
    const p0 = e.pids[0], p1 = e.pids[1];
    switch (e.type) {
      case "shot":
        if (ok) {
          T.sh++;
          T.xg += e.xg || 0.08;
          open = { s, pid: p0 };
          const x = pl(p0);
          if (x.sh !== void 0) {
            x.sh++;
            x.xg += e.xg || 0.08;
          }
        }
        break;
      case "penalty":
        if (ok) {
          T.penF++;
          To.penA++;
        }
        break;
      case "goal":
        if (ok) {
          T.g++;
          T.sot++;
          if (!open) {
            T.sh++;
            T.xg += 0.3;
          }
          pl(p0).g++;
          if (p1) pl(p1).a++;
          if (!open && p0) {
            pl(p0).sh++;
          }
        }
        open = null;
        break;
      case "own_goal":
        if (ok) T.g++;
        break;
      case "save":
        if (ok) {
          T.sv++;
          if (!open) {
            To.sh++;
            To.xg += 0.1;
          }
          To.sot++;
          pl(p0).sv++;
          if (!open && p1) pl(p1).sh++;
        }
        open = null;
        break;
      case "miss":
      case "post":
        if (ok && !open) {
          T.sh++;
          T.xg += 0.05;
          if (p0) pl(p0).sh++;
        }
        open = null;
        break;
      case "foul":
        if (ok) {
          T.fo++;
          if (p0) pl(p0).ff++;
          if (p1) pl(p1).fa++;
        }
        break;
      case "yellow":
        if (ok) {
          T.yc++;
          if (p0) pl(p0).yc++;
        }
        break;
      case "red":
        if (ok) {
          T.rc++;
          if (p0) {
            pl(p0).rc++;
            end[p0] = e.min;
          }
        }
        break;
      case "corner":
        if (ok) T.co++;
        break;
      case "offside":
        if (ok) T.off++;
        break;
      case "tackle":
        if (ok) {
          T.tk++;
          if (p0) pl(p0).tk++;
        }
        break;
      case "ref_error":
        if (ok) {
          T.refF++;
          To.refA++;
        }
        break;
      case "sub":
        if (ok) {
          T.sub++;
          if (p1) end[p1] = e.min;
          if (p0) start[p0] = e.min;
        }
        break;
    }
  });
  for (const pid of Object.keys(start)) {
    const x = pl(pid);
    x.min = Math.max(0, (end[pid] ?? lastMin) - start[pid]);
  }
  for (const side of ["home", "away"]) {
    const conc = t[side === "home" ? "away" : "home"].g;
    if (conc === 0) {
      for (const pid of Object.keys(start)) {
        if (ctx.pidSide[pid] === side && ctx.pos[pid] === "\u0412\u0420" && end[pid] === void 0) pl(pid).cs = 1;
      }
    }
  }
  for (const side of ["home", "away"]) t[side].xg = +t[side].xg.toFixed(2);
  for (const x of Object.values(P)) x.xg = +x.xg.toFixed(2);
  const tot = posT.home + posT.away || 1;
  const poss = [Math.round(posT.home / tot * 100)];
  poss.push(100 - poss[0]);
  return { teams: t, players: P, poss };
}
var live = {};
var timers = {};
var fullSim = (f) => squadOf(f.home).length >= 14 && squadOf(f.away).length >= 14;
var queue = [];
var running = 0;
function enqueue(id) {
  const f = fx(id);
  if (!f || f.status !== "scheduled") return;
  f.status = "queued";
  save();
  queue.push(id);
  pumpQ();
}
function pumpQ() {
  while (running < 2 && queue.length) {
    running++;
    runMatch(queue.shift()).catch((e) => console.error("runMatch", e)).finally(() => {
      running--;
      pumpQ();
    });
  }
}
async function runMatch(id) {
  const f = fx(id);
  f.status = "generating";
  f.err = "";
  save();
  try {
    const ctx = await buildCtx(f);
    const periods = db.settings.chunks == 6 ? [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75], [76, 90]] : [[1, 45], [46, 90]];
    let events = [], note = "", fallback = false;
    for (const [a2, b] of periods) {
      const r = await genPeriod(a2, b, ctx, events, note);
      events = events.concat(r.events);
      note = r.note;
      fallback = fallback || r.fallback;
    }
    events.forEach((e, i) => e.i = i);
    const [h, a] = rescore(events);
    putMatch(id, { events, ctx, fallback });
    f.final = [h, a];
    f.hg = 0;
    f.ag = 0;
    f.pos = 0;
    f.status = "live";
    f.fallback = !!fallback;
    save();
    startLive(id);
  } catch (e) {
    console.error("\u043C\u0430\u0442\u0447 \u043D\u0435 \u0443\u0434\u0430\u043B\u0441\u044F:", e);
    f.status = "scheduled";
    f.err = e.message;
    save();
  }
}
function startLive(id) {
  const f = fx(id), m = getMatch(id);
  live[id] ||= { clients: /* @__PURE__ */ new Set() };
  if (f.pos === 0) {
    tg(`\u{1F3DF} <b>${esc(tn(f.home))} \u2014 ${esc(tn(f.away))}</b>
${esc(compName(f))}, ${esc(roundLabel(f))}
\u0422\u0440\u0430\u043D\u0441\u043B\u044F\u0446\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C${db.settings.siteUrl ? `: ${esc(db.settings.siteUrl)}/#/match/${id}` : ""}`);
  }
  const step = () => {
    if (f.pos >= m.events.length) return finish(id);
    const e = m.events[f.pos++];
    f.hg = e.score[0];
    f.ag = e.score[1];
    pushLive(id, { type: "event", e });
    tgEvent(f, e);
    save();
    const nx = m.events[f.pos];
    let d = 1500;
    if (nx) {
      const dm = (nx.min * 60 + nx.sec - (e.min * 60 + e.sec)) / 60;
      d = clamp(dm * db.settings.secPerMin * 1e3, Math.min(900, db.settings.secPerMin * 1e3), 2e4);
      if (e.type === "halftime") d = Math.max(d, db.settings.breakSec * 1e3);
    }
    timers[id] = setTimeout(step, d);
  };
  step();
}
function pushLive(id, obj) {
  const l = live[id];
  if (!l) return;
  const s = "data: " + JSON.stringify(obj) + "\n\n";
  for (const r of l.clients) r.write(s);
}
function finish(id) {
  const f = fx(id), m = getMatch(id);
  f.hg = f.final[0];
  f.ag = f.final[1];
  f.st = computeStats(m.events, m.ctx);
  m.stats = f.st;
  const HName = tn(f.home), AName = tn(f.away);
  const cH = getCoachForTeam(f.home), cA = getCoachForTeam(f.away);
  m.ratings = computeMatchRatings(m, f, HName, AName);
  m.motm = getMatchMotm(m, f, HName, AName, cH, cA);
  if (m.motm) f.motm = { pid: m.motm.pid, name: m.motm.name, rating: m.motm.rating };
  putMatch(id, m);
  if (f.comp === "cup" && f.hg === f.ag && !f.pen) f.pen = shootout(f);
  f.status = "done";
  updateRefereeStats(f, m.events);
  if (f.comp === "cup") advanceCup();
  for (const s of ["home", "away"]) {
    for (const pid of Object.keys(m.ctx.names)) {
      if (m.ctx.pidSide[pid] !== s) continue;
      const p = player(pid);
      if (p && p.banLeft > 0 && !m.ctx.lineup[s].starters.includes(pid) && !m.ctx.lineup[s].bench.includes(pid)) p.banLeft--;
    }
    for (const p of squadOf(f[s])) {
      if (p.banLeft > 0 && !f.st.players[p.id]) p.banLeft--;
    }
  }
  for (const e of m.events) {
    const p = player(e.pids?.[0]);
    if (!p) continue;
    if (e.type === "injury" && (e.out_days === void 0 || e.out_days > 0)) p.out = { until: addDays(f.date, e.out_days || 14), reason: e.text.slice(0, 120) };
    if (e.type === "red") p.banLeft = 1;
    if (e.type === "yellow") {
      p.seasonYC = (p.seasonYC || 0) + 1;
      if (p.seasonYC % 4 === 0) p.banLeft = Math.max(p.banLeft || 0, 1);
    }
  }
  invalidateAgg();
  advanceCup();
  save();
  const st = f.st;
  tg(`\u{1F3C1} <b>\u0418\u0442\u043E\u0433: ${esc(tn(f.home))} ${f.hg}:${f.ag} ${esc(tn(f.away))}</b>${f.pen ? ` (\u043F\u0435\u043D. ${f.pen.hg}:${f.pen.ag})` : ""}
\u0412\u043B\u0430\u0434\u0435\u043D\u0438\u0435 ${st.poss[0]}\u2013${st.poss[1]}, \u0443\u0434\u0430\u0440\u044B ${st.teams.home.sh}\u2013${st.teams.away.sh}, xG ${st.teams.home.xg}\u2013${st.teams.away.xg}${db.settings.siteUrl ? `
${esc(db.settings.siteUrl)}/#/match/${id}` : ""}`);
  pushLive(id, { type: "end" });
  delete timers[id];
}
function shootout(f) {
  const r = rng(f.id + "pen");
  let h = 3 + Math.floor(r() * 3), a = 3 + Math.floor(r() * 3);
  if (h === a) {
    r() < 0.5 ? h++ : a++;
  }
  return { hg: h, ag: a, winner: h > a ? "home" : "away" };
}
function resumeLive() {
  for (const f of db.fixtures) {
    if (f.status === "live" && getMatch(f.id)) startLive(f.id);
    else if (["live", "generating", "queued"].includes(f.status)) {
      f.status = "scheduled";
    }
  }
  save();
}
var tgQ = [];
var tgBusy = false;
function tg(text) {
  if (!db.settings.tgToken || !db.settings.tgChat) return;
  tgQ.push(text);
  tgPump();
}
async function tgPump() {
  if (tgBusy) return;
  tgBusy = true;
  while (tgQ.length) {
    const t = tgQ.shift();
    try {
      const r = await fetch(`https://api.telegram.org/bot${db.settings.tgToken}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: db.settings.tgChat, text: t, parse_mode: "HTML", disable_web_page_preview: true })
      });
      if (r.status === 429) {
        const j = await r.json().catch(() => ({}));
        tgQ.unshift(t);
        await sleep((j.parameters?.retry_after || 5) * 1e3);
      }
    } catch {
    }
    await sleep(1100);
  }
  tgBusy = false;
}
var TGI = { goal: "\u26BD", own_goal: "\u26BD", yellow: "\u{1F7E8}", red: "\u{1F7E5}", injury: "\u{1F691}", penalty: "\u{1F3AF}", var: "\u{1F4FA}", ref_error: "\u{1F9D1}\u200D\u2696\uFE0F", halftime: "\u23F8", fulltime: "\u{1F3C1}", highlight: "\u{1F525}", incident: "\u2757", save: "\u{1F9E4}", post: "\u{1F945}", sub: "\u{1F501}", kickoff: "\u25B6\uFE0F" };
function tgEvent(f, e) {
  if (!["goal", "own_goal", "yellow", "red", "injury", "penalty", "var", "ref_error", "highlight", "incident", "halftime", "kickoff", "sub", "post"].includes(e.type) && !(e.type === "save" && (e.xg || 0) > 0)) return;
  if (e.type === "sub" || e.type === "kickoff" && e.min > 1) return;
  const sc = e.type === "goal" || e.type === "own_goal" ? `
<b>${esc(tn(f.home))} ${e.score[0]}:${e.score[1]} ${esc(tn(f.away))}</b>` : "";
  tg(`${TGI[e.type] || "\u2022"} <b>${e.min}'</b> ${esc(e.text)}${sc}`);
}
var BG_SYS = `\u0422\u044B \u2014 \u0441\u0432\u043E\u0434\u043A\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u0433\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0430 \u0432 \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440\u0435. \u041F\u043E \u0441\u043F\u0438\u0441\u043A\u0443 \u043C\u0430\u0442\u0447\u0435\u0439 \u0432\u0435\u0440\u043D\u0438 \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0435 \u0441\u0447\u0435\u0442\u0430. \u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043B\u0438\u0433\u0438, \u043A\u043B\u0430\u0441\u0441 \u043A\u043E\u043C\u0430\u043D\u0434, \u0434\u043E\u043C\u0430\u0448\u043D\u0435\u0435 \u043F\u043E\u043B\u0435 \u0438 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435, \u0435\u0441\u043B\u0438 \u043E\u043D\u043E \u0434\u0430\u043D\u043E. \u0421\u0447\u0435\u0442\u0430 \u0440\u0430\u0437\u043D\u044B\u0435 \u0438 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u0444\u0443\u0442\u0431\u043E\u043B\u0430: \u0447\u0430\u0449\u0435 1:0, 1:1, 2:1, 2:0, 0:0, \u0438\u043D\u043E\u0433\u0434\u0430 \u043A\u0440\u0443\u043F\u043D\u0435\u0435. \u0412 \u043A\u0443\u0431\u043A\u0435 \u043D\u0438\u0447\u044C\u0438\u0445 \u043D\u0435 \u0431\u044B\u0432\u0430\u0435\u0442: \u043F\u0440\u0438 \u0440\u0430\u0432\u043D\u043E\u043C \u0441\u0447\u0451\u0442\u0435 \u0443\u043A\u0430\u0436\u0438 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044F \u043F\u043E \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438 \u0432 \u043F\u043E\u043B\u0435 "winner" ("home" \u0438\u043B\u0438 "away").
\u0412\u0435\u0440\u043D\u0438 \u0442\u043E\u043B\u044C\u043A\u043E JSON: {"results":[{"id":"...","hg":1,"ag":0,"winner":"home|away (\u0442\u043E\u043B\u044C\u043A\u043E \u043A\u0443\u0431\u043E\u043A \u043F\u0440\u0438 \u043D\u0438\u0447\u044C\u0435\u0439)","note":"\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E, 5-10 \u0441\u043B\u043E\u0432"}]}`;
function poisson(l, r) {
  let L = Math.exp(-l), k = 0, p = 1;
  do {
    k++;
    p *= r();
  } while (p > L);
  return k - 1;
}
async function bgResults(list) {
  if (!list.length) return;
  let res = null;
  if (hasLLM()) {
    try {
      const rows = {};
      const pos = (tid) => {
        const t = team(tid);
        if (!rows[t.comp]) rows[t.comp] = table(t.comp);
        const r2 = rows[t.comp].find((x) => x.id === tid);
        return r2 && r2.p ? ` (${r2.pos}-\u0435, ${r2.pts} \u043E\u0447\u043A.)` : "";
      };
      const text = list.map((f) => `${f.id} | ${compName(f)}${f.comp === "cup" ? " (\u043A\u0443\u0431\u043E\u043A)" : ""} | ${tn(f.home)}${pos(f.home)} \u2014 ${tn(f.away)}${pos(f.away)}`).join("\n");
      const r = await llmJSON(BG_SYS, text, { task: "bg", temp: 1, max: 12e3 });
      res = r.results || r;
    } catch (e) {
      console.error("bg:", e.message);
    }
  }
  for (const f of list) {
    let x = Array.isArray(res) ? res.find((z) => z && z.id === f.id) : null;
    if (!x || !Number.isInteger(+x.hg) || !Number.isInteger(+x.ag) || +x.hg > 9 || +x.ag > 9) {
      const r = rng(f.id + Date.now());
      x = { hg: poisson(1.45, r), ag: poisson(1.1, r) };
    }
    f.hg = +x.hg;
    f.ag = +x.ag;
    f.note = x.note || "";
    if (f.comp === "cup" && f.hg === f.ag) {
      const w = x.winner === "home" || x.winner === "away" ? x.winner : rng(f.id)() < 0.5 ? "home" : "away";
      f.pen = { hg: w === "home" ? 5 : 4, ag: w === "home" ? 4 : 5, winner: w };
    }
    f.status = "done";
    f.st = null;
    const hSq = squadOf(f.home), aSq = squadOf(f.away);
    const winSq = f.hg >= f.ag ? hSq : aSq;
    const pMotm = winSq[0] || hSq[0];
    if (pMotm) {
      f.motm = { pid: pMotm.id, name: pMotm.name, rating: +(7.5 + (f.hg > f.ag ? 0.8 : 0.3)).toFixed(1) };
    }
  }
  invalidateAgg();
}
async function runBatch(list) {
  list = list.filter((f) => f.status === "scheduled");
  const full = list.filter(fullSim), bg = list.filter((f) => !fullSim(f));
  bg.forEach((f) => f.status = "queued");
  await bgResults(bg);
  advanceCup();
  save();
  full.forEach((f) => enqueue(f.id));
  return { full: full.length, bg: bg.length };
}
function genSeason(start, name) {
  db.settings.season = name;
  const season = name;
  const startYear = parseInt(String(start).slice(0, 4), 10) || 2026;
  db.internationalBreaks = [
    { id: "ib_sep", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C)", start: `${startYear}-08-31`, end: `${startYear}-09-09` },
    { id: "ib_oct", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043E\u043A\u0442\u044F\u0431\u0440\u044C)", start: `${startYear}-10-05`, end: `${startYear}-10-14` },
    { id: "ib_nov", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043D\u043E\u044F\u0431\u0440\u044C)", start: `${startYear}-11-09`, end: `${startYear}-11-18` },
    { id: "winter_break", name: "\u0417\u0438\u043C\u043D\u0438\u0439 \u043F\u0435\u0440\u0435\u0440\u044B\u0432 \u0432 \u0420\u041F\u041B", start: `${startYear}-12-14`, end: `${startYear + 1}-02-27` },
    { id: "ib_mar", name: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435 (\u043C\u0430\u0440\u0442)", start: `${startYear + 1}-03-22`, end: `${startYear + 1}-03-31` }
  ];
  let cur = start;
  while ((/* @__PURE__ */ new Date(cur + "T12:00:00Z")).getUTCDay() !== 6) cur = addDays(cur, 1);
  const weekends = [];
  const regWeeks = [];
  const rplWeeks = [];
  let cupTurn = "regions";
  let weekIdx = 0;
  while (weekends.length < 45) {
    const sat = cur;
    const sun = addDays(sat, 1);
    const tue = addDays(sat, -4);
    const wed = addDays(sat, -3);
    const thu = addDays(sat, -2);
    if (!isInInternationalBreak(sat) && !isInInternationalBreak(sun)) {
      const midBreak = isInInternationalBreak(tue) || isInInternationalBreak(wed) || isInInternationalBreak(thu);
      let hasCup = false;
      let hasRplCup = false;
      let cupStage = "";
      if (!midBreak && weekIdx > 0 && sat < `${startYear}-12-14`) {
        if (cupTurn === "regions" && regWeeks.length < 6) {
          regWeeks.push({ tue, wed, thu });
          hasCup = true;
          hasRplCup = false;
          cupStage = `\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 ${regWeeks.length}-\u0439 \u0440\u0430\u0443\u043D\u0434`;
          cupTurn = "rpl";
        } else if (cupTurn === "rpl" && rplWeeks.length < 6) {
          rplWeeks.push({ tue, wed, thu });
          hasCup = true;
          hasRplCup = true;
          cupStage = `\u041F\u0443\u0442\u044C \u0420\u041F\u041B \xB7 ${rplWeeks.length}-\u0439 \u0442\u0443\u0440`;
          cupTurn = "regions";
        }
      }
      weekends.push({ sat, hasCup, hasRplCup, cupStage });
      weekIdx++;
    }
    cur = addDays(cur, 7);
  }
  db.fixtures = db.fixtures.filter((f) => f.season !== season);
  const r = rng("season" + name);
  for (const comp of COMPS.filter((x) => x.type === "league")) {
    const c = comp.id;
    let ids = db.teams.filter((t) => t.comp === c).map((t) => t.id);
    if (ids.length < 2) continue;
    if (ids.length % 2) ids.push(null);
    const n = ids.length, arr = [...ids], rounds = [];
    for (let k = 0; k < n - 1; k++) {
      const pairs = [];
      for (let i = 0; i < n / 2; i++) {
        const a = arr[i], b = arr[n - 1 - i];
        if (a && b) pairs.push(k % 2 ? [b, a] : [a, b]);
      }
      rounds.push(pairs);
      arr.splice(1, 0, arr.pop());
    }
    const all = rounds.concat(rounds.map((p) => p.map(([a, b]) => [b, a])));
    all.forEach((pairs, ri) => {
      const wk = weekends[ri] || { sat: addDays(start, ri * 7), hasCup: false, hasRplCup: false };
      const sat = wk.sat;
      let order = shuffle(pairs, r);
      const dIdx = order.findIndex(([a, b]) => db.derbies.some((x) => x.a === a && x.b === b || x.a === b && x.b === a));
      if (dIdx >= 0 && c === "rpl") {
        const [dm] = order.splice(dIdx, 1);
        order.splice(Math.min(3, order.length), 0, dm);
      }
      order.forEach(([a, b], mi) => {
        let dd = sat, tm = "16:30";
        if (c === "rpl") {
          if (!wk.hasRplCup) {
            if (mi === 0) {
              dd = addDays(sat, -1);
              tm = "19:00";
            } else {
              const satCount = ri % 2 === 0 ? 3 : 4;
              if (mi <= satCount) {
                dd = sat;
                const times = satCount === 3 ? ["14:00", "16:30", "19:00"] : ["13:00", "15:15", "17:30", "20:00"];
                tm = times[(mi - 1) % times.length];
              } else {
                dd = addDays(sat, 1);
                const sunTimes = satCount === 3 ? ["14:00", "16:30", "19:00", "21:00"] : ["14:00", "16:30", "19:00"];
                tm = sunTimes[(mi - 1 - satCount) % sunTimes.length];
              }
            }
          } else {
            if (mi < 3) {
              dd = sat;
              tm = ["14:00", "16:30", "19:00"][mi];
            } else if (mi < 7) {
              dd = addDays(sat, 1);
              tm = ["14:00", "16:30", "19:00", "21:00"][mi - 3];
            } else {
              dd = addDays(sat, 2);
              tm = "19:30";
            }
          }
        } else {
          dd = addDays(sat, mi % 2);
          tm = ["12:00", "14:00", "15:00", "16:30"][mi % 4];
        }
        const fxObj = { id: uid(), season, comp: c, round: ri + 1, date: dd, time: tm, home: a, away: b, status: "scheduled", hg: null, ag: null, pos: 0 };
        assignReferee(fxObj);
        db.fixtures.push(fxObj);
      });
    });
  }
  const allMediaTeams = db.teams.filter((t) => t.comp === "media" || t.comp === "media_div2");
  const shuffledMedia = shuffle(allMediaTeams.map((t) => t.id), r);
  const mflCupGroups = ["A", "B", "C", "D"];
  mflCupGroups.forEach((gid, gi) => {
    const gTeams = shuffledMedia.slice(gi * 5, (gi + 1) * 5);
    let roundNum = 1;
    for (let i = 0; i < gTeams.length; i++) {
      for (let j = i + 1; j < gTeams.length; j++) {
        const wk = weekends[(roundNum - 1) % weekends.length] || { sat: addDays(start, roundNum * 7) };
        const fxObj = {
          id: uid(),
          season,
          comp: "media_cup",
          round: roundNum,
          group: gid,
          date: addDays(wk.sat, -3),
          time: "19:00",
          home: gTeams[i],
          away: gTeams[j],
          status: "scheduled",
          hg: null,
          ag: null,
          pos: 0
        };
        assignReferee(fxObj);
        db.fixtures.push(fxObj);
        roundNum++;
      }
    }
  });
  const rplTeams = db.teams.filter((t) => t.comp === "rpl");
  const fnlTeams = db.teams.filter((t) => t.comp === "fnl");
  const secondLeagueTeams = db.teams.filter((t) => t.comp.startsWith("2la") || t.comp.startsWith("2lb"));
  const mediaTeams = allMediaTeams;
  const { cupState, fixtures: cupFixtures } = initCup2026(
    season,
    rplTeams,
    fnlTeams,
    secondLeagueTeams,
    mediaTeams,
    uid,
    { rplWeeks, regWeeks }
  );
  cupFixtures.forEach((f) => assignReferee(f));
  db.cupState2026 = cupState;
  db.fixtures.push(...cupFixtures);
  db.players.forEach((p) => {
    p.seasonYC = 0;
    p.banLeft = 0;
  });
  invalidateAgg();
  save();
}
function advanceCup() {
  if (!db.cupState2026) {
    const rplTeams = db.teams.filter((t) => t.comp === "rpl");
    const fnlTeams = db.teams.filter((t) => t.comp === "fnl");
    const secondLeagueTeams = db.teams.filter((t) => t.comp.startsWith("2la") || t.comp.startsWith("2lb"));
    const mediaTeams = db.teams.filter((t) => t.comp === "media" || t.comp === "media_div2");
    const { cupState, fixtures: cupFixtures } = initCup2026(S(), rplTeams, fnlTeams, secondLeagueTeams, mediaTeams, uid);
    cupFixtures.forEach((f) => assignReferee(f));
    db.cupState2026 = cupState;
    db.fixtures = db.fixtures.filter((f) => f.comp !== "cup").concat(cupFixtures);
    save();
  }
  recalculateCupGroups(db.cupState2026, seasonFx());
  for (let r = 1; r <= 5; r++) {
    const roundFx = seasonFx().filter((f) => f.comp === "cup" && f.cupPath === "regions_qual" && f.qualRound === r);
    const nextFx = seasonFx().filter((f) => f.comp === "cup" && f.cupPath === "regions_qual" && f.qualRound === r + 1);
    if (roundFx.length > 0 && roundFx.every((f) => f.status === "done") && nextFx.length === 0) {
      const newFixtures = drawNextRegionsRound(db.cupState2026, r, roundFx, uid);
      newFixtures.forEach((f) => assignReferee(f));
      db.fixtures.push(...newFixtures);
      save();
    }
  }
  const r6Fx = seasonFx().filter((f) => f.comp === "cup" && f.cupPath === "regions_qual" && f.qualRound === 6);
  if (r6Fx.length > 0 && r6Fx.every((f) => f.status === "done")) {
    const r6Info = db.cupState2026.regionsQualRounds?.find((qr) => qr.round === 6);
    if (r6Info) r6Info.completed = true;
  }
  const rplGroupFx = seasonFx().filter((f) => f.comp === "cup" && f.cupPath === "rpl_group");
  const allGroupsDone = rplGroupFx.length >= 48 && rplGroupFx.every((f) => f.status === "done");
  const existingR16 = seasonFx().filter((f) => f.comp === "cup" && f.cupStage === "rpl_playoff_r16");
  if (allGroupsDone && !existingR16.length) {
    db.cupState2026.stage = "playoff_spring";
    const tA = db.cupState2026.rplGroups["A"].table;
    const tB = db.cupState2026.rplGroups["B"].table;
    const tC = db.cupState2026.rplGroups["C"].table;
    const tD = db.cupState2026.rplGroups["D"].table;
    const ties = [
      { a: tA[0].id, b: tB[1].id, name: "1/8 \u0444\u0438\u043D\u0430\u043B\u0430 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B \xB7 \u041F\u0430\u0440\u0430 1" },
      { a: tB[0].id, b: tA[1].id, name: "1/8 \u0444\u0438\u043D\u0430\u043B\u0430 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B \xB7 \u041F\u0430\u0440\u0430 2" },
      { a: tC[0].id, b: tD[1].id, name: "1/8 \u0444\u0438\u043D\u0430\u043B\u0430 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B \xB7 \u041F\u0430\u0440\u0430 3" },
      { a: tD[0].id, b: tC[1].id, name: "1/8 \u0444\u0438\u043D\u0430\u043B\u0430 \u041F\u0443\u0442\u0438 \u0420\u041F\u041B \xB7 \u041F\u0430\u0440\u0430 4" }
    ];
    ties.forEach((tie, idx) => {
      const fx1 = {
        id: uid(),
        season: S(),
        comp: "cup",
        cupPath: "rpl_playoff",
        cupStage: "rpl_playoff_r16",
        tieId: `r16_${idx + 1}`,
        leg: 1,
        round: 201,
        label: `${tie.name} (1-\u0439 \u043C\u0430\u0442\u0447)`,
        date: "2027-03-03",
        time: idx % 2 === 0 ? "18:00" : "20:30",
        home: tie.b,
        away: tie.a,
        status: "scheduled",
        hg: null,
        ag: null,
        pos: 0
      };
      assignReferee(fx1);
      db.fixtures.push(fx1);
      const fx2 = {
        id: uid(),
        season: S(),
        comp: "cup",
        cupPath: "rpl_playoff",
        cupStage: "rpl_playoff_r16",
        tieId: `r16_${idx + 1}`,
        leg: 2,
        round: 202,
        label: `${tie.name} (\u041E\u0442\u0432\u0435\u0442\u043D\u044B\u0439 \u043C\u0430\u0442\u0447)`,
        date: "2027-03-17",
        time: idx % 2 === 0 ? "18:00" : "20:30",
        home: tie.a,
        away: tie.b,
        status: "scheduled",
        hg: null,
        ag: null,
        pos: 0
      };
      assignReferee(fx2);
      db.fixtures.push(fx2);
    });
    const thirdPlaces = [tA[2].id, tB[2].id, tC[2].id, tD[2].id];
    const r6FxDone = seasonFx().filter((f) => f.comp === "cup" && f.qualRound === 6 && f.status === "done");
    const r6Winners = r6FxDone.map(winnerOf);
    const regOpponents = r6Winners.length >= 4 ? r6Winners.slice(0, 4) : [...db.teams.filter((t) => t.comp === "fnl" || t.comp === "media")].slice(0, 4).map((t) => t.id);
    thirdPlaces.forEach((rplTid, idx) => {
      const regTid = regOpponents[idx % regOpponents.length];
      const fx2 = {
        id: uid(),
        season: S(),
        comp: "cup",
        cupPath: "regions_playoff",
        cupStage: "regions_r16",
        round: 301,
        label: "\u041F\u0443\u0442\u044C \u0440\u0435\u0433\u0438\u043E\u043D\u043E\u0432 \xB7 1/8 \u0444\u0438\u043D\u0430\u043B\u0430 (\u043D\u0430 \u0432\u044B\u043B\u0435\u0442)",
        date: "2027-03-10",
        time: idx % 2 === 0 ? "17:00" : "19:30",
        home: regTid,
        // Хозяин — клуб не из РПЛ!
        away: rplTid,
        status: "scheduled",
        hg: null,
        ag: null,
        pos: 0
      };
      assignReferee(fx2);
      db.fixtures.push(fx2);
    });
    save();
  }
}
function performSeasonRotation() {
  const currentSeason = S();
  const [y1, y2] = currentSeason.split("/");
  const nextSeason = `${+y1 + 1}/${(+y2 + 1) % 100}`;
  const rplRows = table("rpl");
  const fnlRows = table("fnl");
  const goldRows = table("2la_gold");
  const silverRows = table("2la_silver");
  const b1Rows = table("2lb_1");
  const b2Rows = table("2lb_2");
  const b3Rows = table("2lb_3");
  const b4Rows = table("2lb_4");
  const report = {
    promotions: [],
    relegations: [],
    playoffs: []
  };
  const rplRelegatedIds = [];
  const fnlPromotedIds = [];
  if (rplRows.length >= 16) {
    const rpl15 = rplRows[14], rpl16 = rplRows[15];
    rplRelegatedIds.push(rpl15.id, rpl16.id);
    report.relegations.push(
      { team: rpl15.name, from: "\u0420\u041F\u041B", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "15-\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u0420\u041F\u041B (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u043B\u0435\u0442)" },
      { team: rpl16.name, from: "\u0420\u041F\u041B", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "16-\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u0420\u041F\u041B (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u043B\u0435\u0442)" }
    );
  }
  if (fnlRows.length >= 2) {
    const fnl1 = fnlRows[0], fnl2 = fnlRows[1];
    fnlPromotedIds.push(fnl1.id, fnl2.id);
    report.promotions.push(
      { team: fnl1.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "\u0420\u041F\u041B", reason: "1-\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0435 (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434)" },
      { team: fnl2.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "\u0420\u041F\u041B", reason: "2-\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u041F\u0435\u0440\u0432\u043E\u0439 \u043B\u0438\u0433\u0435 (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434)" }
    );
  }
  if (rplRows.length >= 14 && fnlRows.length >= 4) {
    const rpl13 = rplRows[12], fnl4 = fnlRows[3];
    const rpl14 = rplRows[13], fnl3 = fnlRows[2];
    const win13 = (rpl13.pts || 0) >= (fnl4.pts || 0) ? rpl13 : fnl4;
    report.playoffs.push({
      match: `\u0421\u0442\u044B\u043A: ${rpl13.name} (13-\u0435 \u0420\u041F\u041B) \u2014 ${fnl4.name} (4-\u0435 \u0424\u041D\u041B)`,
      score: win13.id === rpl13.id ? "2:1 (\u043F\u043E \u0441\u0443\u043C\u043C\u0435 2 \u043C\u0430\u0442\u0447\u0435\u0439)" : "1:2 (\u043F\u043E \u0441\u0443\u043C\u043C\u0435 2 \u043C\u0430\u0442\u0447\u0435\u0439)",
      winner: win13.name
    });
    if (win13.id === fnl4.id) {
      fnlPromotedIds.push(fnl4.id);
      rplRelegatedIds.push(rpl13.id);
      report.promotions.push({ team: fnl4.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "\u0420\u041F\u041B", reason: "\u041F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0441\u0442\u044B\u043A\u0430\u0445" });
      report.relegations.push({ team: rpl13.name, from: "\u0420\u041F\u041B", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "\u041F\u043E\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0432 \u0441\u0442\u044B\u043A\u0430\u0445" });
    }
    const win14 = (rpl14.pts || 0) >= (fnl3.pts || 0) ? rpl14 : fnl3;
    report.playoffs.push({
      match: `\u0421\u0442\u044B\u043A: ${rpl14.name} (14-\u0435 \u0420\u041F\u041B) \u2014 ${fnl3.name} (3-\u0435 \u0424\u041D\u041B)`,
      score: win14.id === rpl14.id ? "3:2 (\u043F\u043E \u0441\u0443\u043C\u043C\u0435 2 \u043C\u0430\u0442\u0447\u0435\u0439)" : "0:2 (\u043F\u043E \u0441\u0443\u043C\u043C\u0435 2 \u043C\u0430\u0442\u0447\u0435\u0439)",
      winner: win14.name
    });
    if (win14.id === fnl3.id) {
      fnlPromotedIds.push(fnl3.id);
      rplRelegatedIds.push(rpl14.id);
      report.promotions.push({ team: fnl3.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "\u0420\u041F\u041B", reason: "\u041F\u043E\u0431\u0435\u0434\u0430 \u0432 \u0441\u0442\u044B\u043A\u0430\u0445" });
      report.relegations.push({ team: rpl14.name, from: "\u0420\u041F\u041B", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "\u041F\u043E\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0432 \u0441\u0442\u044B\u043A\u0430\u0445" });
    }
  }
  const fnlRelegatedIds = [];
  const goldPromotedIds = [];
  if (fnlRows.length >= 18) {
    const fnl17 = fnlRows[16], fnl18 = fnlRows[17];
    fnlRelegatedIds.push(fnl17.id, fnl18.id);
    report.relegations.push(
      { team: fnl17.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "2-\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \u0417\u043E\u043B\u043E\u0442\u043E", reason: "17-\u0435 \u043C\u0435\u0441\u0442\u043E (\u0432\u044B\u043B\u0435\u0442)" },
      { team: fnl18.name, from: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", to: "2-\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \u0417\u043E\u043B\u043E\u0442\u043E", reason: "18-\u0435 \u043C\u0435\u0441\u0442\u043E (\u0432\u044B\u043B\u0435\u0442)" }
    );
  }
  if (goldRows.length >= 2) {
    const g1 = goldRows[0], g2 = goldRows[1];
    goldPromotedIds.push(g1.id, g2.id);
    report.promotions.push(
      { team: g1.name, from: "2-\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \u0417\u043E\u043B\u043E\u0442\u043E", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "1-\u0435 \u043C\u0435\u0441\u0442\u043E (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434)" },
      { team: g2.name, from: "2-\u044F \u043B\u0438\u0433\u0430 \xAB\u0410\xBB \u0417\u043E\u043B\u043E\u0442\u043E", to: "\u041F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u0433\u0430", reason: "2-\u0435 \u043C\u0435\u0441\u0442\u043E (\u043F\u0440\u044F\u043C\u043E\u0439 \u0432\u044B\u0445\u043E\u0434)" }
    );
  }
  const goldToSilverIds = [];
  const silverToGoldIds = [];
  if (goldRows.length >= 10) {
    const gDown = goldRows.slice(6, 10);
    gDown.forEach((t) => {
      goldToSilverIds.push(t.id);
      report.relegations.push({ team: t.name, from: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB", to: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB", reason: "7\u201310 \u043C\u0435\u0441\u0442\u0430 (\u0440\u043E\u0442\u0430\u0446\u0438\u044F)" });
    });
  }
  if (silverRows.length >= 4) {
    const sUp = silverRows.slice(0, 4);
    sUp.forEach((t) => {
      silverToGoldIds.push(t.id);
      report.promotions.push({ team: t.name, from: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB", to: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0417\u043E\u043B\u043E\u0442\u043E\xBB", reason: "1\u20134 \u043C\u0435\u0441\u0442\u0430 (\u0440\u043E\u0442\u0430\u0446\u0438\u044F)" });
    });
  }
  const silverDownIds = [];
  const bUpIds = [];
  if (silverRows.length >= 7) {
    const sOut = silverRows.slice(Math.max(0, silverRows.length - 4));
    sOut.forEach((t) => {
      silverDownIds.push(t.id);
      report.relegations.push({ team: t.name, from: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB", to: "\u0412\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u0433\u0430 \xAB\u0411\xBB", reason: "\u0412\u044B\u043B\u0435\u0442 \u0438\u0437 \u0434\u0438\u0432\u0438\u0437\u0438\u043E\u043D\u0430 \xAB\u0410\xBB" });
    });
  }
  [b1Rows[0], b2Rows[0], b3Rows[0], b4Rows[0]].filter(Boolean).forEach((bTeam, idx) => {
    bUpIds.push(bTeam.id);
    report.promotions.push({ team: bTeam.name, from: `2-\u044F \u043B\u0438\u0433\u0430 \u0411 (\u0413\u0440\u0443\u043F\u043F\u0430 ${idx + 1})`, to: "\u0413\u0440\u0443\u043F\u043F\u0430 \xAB\u0421\u0435\u0440\u0435\u0431\u0440\u043E\xBB", reason: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u0433\u0440\u0443\u043F\u043F\u044B" });
  });
  for (const t of db.teams) {
    if (rplRelegatedIds.includes(t.id)) t.comp = "fnl";
    else if (fnlPromotedIds.includes(t.id)) t.comp = "rpl";
    else if (fnlRelegatedIds.includes(t.id)) t.comp = "2la_gold";
    else if (goldPromotedIds.includes(t.id)) t.comp = "fnl";
    else if (goldToSilverIds.includes(t.id)) t.comp = "2la_silver";
    else if (silverToGoldIds.includes(t.id)) t.comp = "2la_gold";
    else if (silverDownIds.includes(t.id)) t.comp = "2lb_1";
    else if (bUpIds.includes(t.id)) t.comp = "2la_silver";
  }
  genSeason("2027-07-20", nextSeason);
  save();
  return { ok: 1, currentSeason, nextSeason, report };
}
var app = express();
app.use(express.json({ limit: "5mb" }));
app.use((req, res, next) => {
  const token = req.headers["x-token"];
  req.me = token ? db.sessions[token] : null;
  next();
});
var admin = (req, res, next) => req.me?.role === "admin" ? next() : res.status(403).json({ error: "\u041D\u0443\u0436\u0435\u043D \u0432\u0445\u043E\u0434 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430" });
var clubOf = (req) => req.me?.role === "admin" ? req.body?.teamId || req.query.teamId : req.me?.teamId;
var needClub = (req, res, next) => {
  const t = clubOf(req);
  if (!t || !team(t)) return res.status(403).json({ error: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u043A\u043E\u0434\u0443 \u043A\u043B\u0443\u0431\u0430" });
  req.tid = t;
  next();
};
var fail = (res, msg, code = 400) => res.status(code).json({ error: msg });
function getCoachForTeam(tid) {
  const t = team(tid);
  if (!t) return getTeamCoach("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u043A\u043B\u0443\u0431", "rpl");
  if (db.staff && Array.isArray(db.staff)) {
    const foundHead = db.staff.find((s) => s.teamId === tid && s.role === "head");
    if (foundHead) {
      return {
        id: foundHead.id,
        name: foundHead.name,
        clubName: t.name,
        nationality: foundHead.nationality || "\u0420\u043E\u0441\u0441\u0438\u044F",
        age: foundHead.age || 45,
        style: foundHead.style || "possession",
        styleTitle: foundHead.styleTitle || "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C",
        styleDesc: foundHead.bio || "",
        favoriteFormation: foundHead.favoriteFormation || "4-3-3",
        reputation: foundHead.reputation || 80,
        temperament: foundHead.temperament || "\u0423\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0448\u0435\u043D\u043D\u044B\u0439",
        quote: foundHead.quote || "\xAB\u0414\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430 \u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0430\u044F \u0438\u0433\u0440\u0430 \u2014 \u0437\u0430\u043B\u043E\u0433 \u0443\u0441\u043F\u0435\u0445\u0430\xBB"
      };
    }
  }
  if (db.coaches && !Array.isArray(db.coaches) && db.coaches[tid]) {
    return { ...db.coaches[tid], clubName: t.name };
  }
  return getTeamCoach(t.name, t.comp);
}
function getStaffForTeam(tid) {
  if (!db.staff || !Array.isArray(db.staff)) return [];
  return db.staff.filter((s) => s.teamId === tid);
}
var pubTeam = (t) => {
  const official = getTeamLogo(t.name, null, t.comp);
  const coach = getCoachForTeam(t.id);
  const synergy = computeCoachSynergy(coach, db.tactics[t.id]);
  const staff = getStaffForTeam(t.id);
  return {
    id: t.id,
    name: t.name,
    comp: t.comp,
    city: t.city,
    stadium: t.stadium,
    logo: official.startsWith("/assets/") ? official : t.logo || official,
    colors: getTeamColors(t.name),
    coach,
    synergy,
    staff,
    budget: t.budget || 0,
    formattedBudget: "\u20AC" + (t.budget || 0).toLocaleString("ru-RU")
  };
};
var pubPlayer = (p) => ({
  id: p.id,
  name: p.name,
  pos: p.pos,
  born: p.born,
  nation: p.nation || "\u0420\u043E\u0441\u0441\u0438\u044F",
  playedForOtherNationalTeam: !!(p.playedForOtherNationalTeam || p.otherNationalTeam && norm(p.otherNationalTeam) !== "\u0440\u043E\u0441\u0441\u0438\u044F"),
  otherNationalTeam: p.otherNationalTeam || "",
  isLegionnaire: isLegionnaire(p),
  legionStatus: getLegionnaireStatus(p),
  teamId: p.teamId,
  team: p.teamId ? tn(p.teamId) : "\u0431\u0435\u0437 \u043A\u043B\u0443\u0431\u0430",
  teamLogo: p.teamId ? teamLogo(p.teamId) : null,
  style: p.style,
  achievements: p.achievements,
  out: p.out,
  banLeft: p.banLeft
});
var pubFx = (f) => ({
  id: f.id,
  comp: f.comp,
  cupPath: f.cupPath || (f.comp === "cup" ? f.round <= 6 ? "rpl_group" : "regions_qual" : null),
  groupId: f.groupId || null,
  qualRound: f.qualRound || null,
  cupStage: f.cupStage || null,
  round: f.round,
  label: roundLabel(f),
  date: f.date,
  time: f.time,
  home: f.home,
  away: f.away,
  homeName: tn(f.home),
  awayName: tn(f.away),
  homeLogo: teamLogo(f.home),
  awayLogo: teamLogo(f.away),
  status: f.status,
  hg: f.hg,
  ag: f.ag,
  pen: f.pen || null,
  full: f.status === "live" || f.status === "done" ? !!f.st || f.status === "live" : fullSim(f),
  derby: !!db.derbies.find((d) => d.a === f.home && d.b === f.away || d.a === f.away && d.b === f.home),
  refereeId: f.comp === "rpl" || f.comp === "cup" ? f.refereeId || null : null,
  refereeName: f.comp === "rpl" || f.comp === "cup" ? f.refereeName || null : null,
  assistants: f.comp === "rpl" || f.comp === "cup" ? f.assistants || [] : [],
  reserveReferee: f.comp === "rpl" || f.comp === "cup" ? f.reserveReferee || null : null,
  varReferee: f.comp === "rpl" || f.comp === "cup" ? f.varReferee || null : null,
  avarReferee: f.comp === "rpl" || f.comp === "cup" ? f.avarReferee || null : null
});
app.post("/api/login", (req, res) => {
  const c = String(req.body.code || "").trim().toUpperCase();
  if (!c) return fail(res, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434");
  let s = null;
  if (c === String(process.env.ADMIN_CODE || db.settings.adminCode).toUpperCase()) s = { role: "admin" };
  else {
    const t = db.teams.find((t2) => t2.code && t2.code.toUpperCase() === c);
    if (t) s = { role: "club", teamId: t.id };
  }
  if (!s) return fail(res, "\u041A\u043E\u0434 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", 401);
  const token = crypto.randomBytes(20).toString("hex");
  db.sessions[token] = { ...s, at: Date.now() };
  save();
  res.json({ token, ...s, team: s.teamId ? pubTeam(team(s.teamId)) : null });
});
app.post("/api/logout", (req, res) => {
  const token = req.headers["x-token"];
  if (token) delete db.sessions[token];
  save();
  res.json({ ok: 1 });
});
app.get("/api/state", (req, res) => {
  res.json({
    season: S(),
    legionLimit: getRplLegionLimit(S()),
    comps: db.comps,
    teams: db.teams.map(pubTeam),
    me: req.me ? { role: req.me.role, teamId: req.me.teamId || null } : null,
    hasLLM: hasLLM(),
    live: db.fixtures.filter((f) => f.status === "live").map(pubFx),
    regulations: LEAGUE_REGULATIONS
  });
});
app.get("/api/regulations", (req, res) => res.json(LEAGUE_REGULATIONS));
app.get("/api/regulations/:comp", (req, res) => {
  const k = req.params.comp.startsWith("2lb_") ? "2lb" : req.params.comp;
  res.json(LEAGUE_REGULATIONS[k] || {});
});
app.get("/api/table/:comp", (req, res) => res.json(table(req.params.comp)));
app.get("/api/transfers/top", (req, res) => {
  const approved = (db.transfers || []).filter((t) => t.status === "approved");
  const expensive = [...approved].sort((a, b) => {
    const amtA = a.feeAmount !== void 0 ? a.feeAmount : parseFeeAmount(a.fee);
    const amtB = b.feeAmount !== void 0 ? b.feeAmount : parseFeeAmount(b.fee);
    return amtB - amtA;
  }).slice(0, 10);
  const valuable = [...approved].sort((a, b) => {
    const pA = player(a.pid);
    const pB = player(b.pid);
    const scoreA = a.statsForNewClub?.impactScore !== void 0 ? a.statsForNewClub.impactScore : (pA?.goals || 0) * 4 + (pA?.assists || 0) * 2.5 + (pA?.matches || 0) * 1.2;
    const scoreB = b.statsForNewClub?.impactScore !== void 0 ? b.statsForNewClub.impactScore : (pB?.goals || 0) * 4 + (pB?.assists || 0) * 2.5 + (pB?.matches || 0) * 1.2;
    return scoreB - scoreA;
  }).slice(0, 10);
  res.json({
    expensive: expensive.map(formatTransferForPublic),
    valuable: valuable.map(formatTransferForPublic),
    totalCount: approved.length
  });
});
app.get("/api/fixtures", (req, res) => {
  let l = seasonFx();
  if (req.query.comp) l = l.filter((f) => f.comp === req.query.comp);
  if (req.query.team) l = l.filter((f) => f.home === req.query.team || f.away === req.query.team);
  l = l.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  res.json(l.map(pubFx));
});
function getHeadToHead(homeTid, awayTid, currentFixtureId) {
  const H = team(homeTid);
  const A = team(awayTid);
  const hName = H?.name || tn(homeTid);
  const aName = A?.name || tn(awayTid);
  const hLogo = teamLogo(homeTid);
  const aLogo = teamLogo(awayTid);
  const realPlayed = (db.fixtures || []).filter((f) => {
    if (currentFixtureId && f.id === currentFixtureId) return false;
    if (f.status !== "done") return false;
    return f.home === homeTid && f.away === awayTid || f.home === awayTid && f.away === homeTid;
  }).sort((a, b) => ((b.date || "") + (b.time || "")).localeCompare((a.date || "") + (a.time || "")));
  const matches = [];
  for (const f of realPlayed) {
    const isDirectHome = f.home === homeTid;
    const hg = f.hg ?? 0;
    const ag = f.ag ?? 0;
    const homeGoals = isDirectHome ? hg : ag;
    const awayGoals = isDirectHome ? ag : hg;
    let outcome = "draw";
    if (homeGoals > awayGoals) outcome = "home";
    else if (awayGoals > homeGoals) outcome = "away";
    matches.push({
      id: f.id,
      date: f.date || "2026-08-10",
      time: f.time || "18:00",
      comp: compName(f) || "\u0420\u041F\u041B",
      round: roundLabel(f) || "",
      homeId: f.home,
      awayId: f.away,
      homeName: tn(f.home),
      awayName: tn(f.away),
      homeLogo: teamLogo(f.home),
      awayLogo: teamLogo(f.away),
      homeGoals: hg,
      awayGoals: ag,
      score: `${hg} : ${ag}`,
      penalties: f.penalties ? `${f.penalties.home} : ${f.penalties.away} \u043F\u0435\u043D.` : void 0,
      outcome,
      // относительно текущей пары (homeTid против awayTid)
      winnerId: hg > ag ? f.home : ag > hg ? f.away : null,
      stadium: team(f.home)?.stadium || "",
      isSimulated: true
    });
    if (matches.length >= 10) break;
  }
  if (matches.length < 10) {
    const need = 10 - matches.length;
    let seedVal = 0;
    for (let i = 0; i < (homeTid + awayTid).length; i++) {
      seedVal = seedVal * 31 + (homeTid + awayTid).charCodeAt(i) & 16777215;
    }
    const pseudoRandom = (step) => {
      const x = Math.sin(seedVal + step * 7919) * 1e4;
      return x - Math.floor(x);
    };
    const comps = ["\u0420\u041F\u041B", "\u0420\u041F\u041B", "\u0420\u041F\u041B", "\u041A\u0443\u0431\u043E\u043A \u0420\u043E\u0441\u0441\u0438\u0438", "\u0420\u041F\u041B", "\u0420\u041F\u041B", "\u041A\u0443\u0431\u043E\u043A \u0420\u043E\u0441\u0441\u0438\u0438", "\u0421\u0443\u043F\u0435\u0440\u043A\u0443\u0431\u043E\u043A"];
    const years = [2026, 2025, 2025, 2024, 2024, 2023, 2023, 2022, 2022, 2021];
    const months = ["03", "05", "08", "09", "10", "11", "04", "07", "12", "06"];
    const days = ["12", "24", "18", "03", "29", "15", "07", "21", "30", "14"];
    for (let i = 0; i < need; i++) {
      const idx = matches.length;
      const r1 = pseudoRandom(idx * 3 + 1);
      const r2 = pseudoRandom(idx * 3 + 2);
      const r3 = pseudoRandom(idx * 3 + 3);
      const altHome = idx % 2 === 0;
      const currentHomeId = altHome ? homeTid : awayTid;
      const currentAwayId = altHome ? awayTid : homeTid;
      let hScore = 0;
      let aScore = 0;
      if (r1 < 0.28) {
        hScore = r2 < 0.5 ? 1 : r2 < 0.85 ? 0 : 2;
        aScore = hScore;
      } else if (r1 < 0.65) {
        hScore = r2 < 0.4 ? 1 : r2 < 0.8 ? 2 : 3;
        aScore = r3 < 0.5 ? 0 : 1;
        if (hScore <= aScore) hScore = aScore + 1;
      } else {
        aScore = r2 < 0.45 ? 1 : r2 < 0.85 ? 2 : 3;
        hScore = r3 < 0.6 ? 0 : 1;
        if (aScore <= hScore) aScore = hScore + 1;
      }
      const isDirectHome = currentHomeId === homeTid;
      const hgRel = isDirectHome ? hScore : aScore;
      const agRel = isDirectHome ? aScore : hScore;
      let outcome = "draw";
      if (hgRel > agRel) outcome = "home";
      else if (agRel > hgRel) outcome = "away";
      const yr = years[idx % years.length];
      const mo = months[idx % months.length];
      const dy = days[idx % days.length];
      matches.push({
        id: `hist_${homeTid}_${awayTid}_${idx}`,
        date: `${yr}-${mo}-${dy}`,
        time: "19:00",
        comp: comps[idx % comps.length],
        round: comps[idx % comps.length].includes("\u041A\u0443\u0431\u043E\u043A") ? "1/4 \u0444\u0438\u043D\u0430\u043B\u0430" : `${idx % 25 + 1} \u0442\u0443\u0440`,
        homeId: currentHomeId,
        awayId: currentAwayId,
        homeName: tn(currentHomeId),
        awayName: tn(currentAwayId),
        homeLogo: teamLogo(currentHomeId),
        awayLogo: teamLogo(currentAwayId),
        homeGoals: hScore,
        awayGoals: aScore,
        score: `${hScore} : ${aScore}`,
        outcome,
        winnerId: hScore > aScore ? currentHomeId : aScore > hScore ? currentAwayId : null,
        stadium: team(currentHomeId)?.stadium || "",
        isSimulated: false
      });
    }
  }
  let homeWins = 0, draws = 0, awayWins = 0, homeGoalsTotal = 0, awayGoalsTotal = 0;
  for (const m of matches) {
    if (m.outcome === "home") homeWins++;
    else if (m.outcome === "away") awayWins++;
    else draws++;
    if (m.homeId === homeTid) {
      homeGoalsTotal += m.homeGoals;
      awayGoalsTotal += m.awayGoals;
    } else {
      homeGoalsTotal += m.awayGoals;
      awayGoalsTotal += m.homeGoals;
    }
  }
  return {
    homeTeam: { id: homeTid, name: hName, logo: hLogo },
    awayTeam: { id: awayTid, name: aName, logo: aLogo },
    stats: {
      total: matches.length,
      homeWins,
      draws,
      awayWins,
      homeGoals: homeGoalsTotal,
      awayGoals: awayGoalsTotal
    },
    matches
  };
}
app.get("/api/match/:id", (req, res) => {
  const f = fx(req.params.id);
  if (!f) return fail(res, "\u041C\u0430\u0442\u0447 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", 404);
  const m = getMatch(f.id);
  const isAdm = req.me?.role === "admin";
  const HName = tn(f.home), AName = tn(f.away);
  const coachHome = getCoachForTeam(f.home);
  const coachAway = getCoachForTeam(f.away);
  const rawMotm = m?.motm || (f.status === "done" && m ? getMatchMotm(m, f, HName, AName, coachHome, coachAway) : f.motm ? { ...f.motm, teamName: HName, pos: "\u041D\u0410\u041F", interview: { headline: `\xAB${f.motm.name}: \u0438\u0433\u0440\u0430 \u0431\u044B\u043B\u0430 \u043D\u0430\u043F\u0440\u044F\u0436\u0451\u043D\u043D\u043E\u0439 \u0434\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u043C\u0438\u043D\u0443\u0442\xBB`, quote: `\u041C\u044B \u0433\u043E\u0442\u043E\u0432\u0438\u043B\u0438\u0441\u044C \u043A \u0442\u0440\u0443\u0434\u043D\u043E\u043C\u0443 \u043C\u0430\u0442\u0447\u0443, \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A \u043E\u043A\u0430\u0437\u0430\u043B \u0441\u0435\u0440\u044C\u0435\u0437\u043D\u043E\u0435 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435. \u0420\u0430\u0434\u044B \u043F\u043E\u0431\u0435\u0434\u0435 \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0435 \u0442\u0440\u0438\u0431\u0443\u043D!`, tacticsComment: `\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0442\u0440\u0435\u043D\u0435\u0440\u0430 \u0431\u044B\u043B\u0430 \u044F\u0441\u043D\u0430: \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u044C \u0441\u0437\u0430\u0434\u0438 \u0438 \u043E\u0441\u0442\u0440\u043E\u0442\u0430 \u0432\u043F\u0435\u0440\u0435\u0434\u0438.`, mood: "satisfied" } } : null);
  let motmOut = null;
  if (rawMotm) {
    const p = rawMotm.player || {
      id: rawMotm.pid || rawMotm.id,
      name: rawMotm.name,
      pos: rawMotm.pos || "\u041D\u0410\u041F",
      team: rawMotm.teamName || rawMotm.team || HName,
      rating: rawMotm.rating || "7.5",
      goals: rawMotm.goals || 0,
      assists: rawMotm.assists || 0,
      saves: rawMotm.saves || 0,
      xg: rawMotm.xg,
      shots: rawMotm.shots,
      tackles: rawMotm.tackles,
      teamLogo: rawMotm.teamLogo || teamLogo(rawMotm.teamId)
    };
    motmOut = {
      ...rawMotm,
      player: p,
      name: rawMotm.name || p.name,
      rating: rawMotm.rating || p.rating,
      headline: rawMotm.headline || rawMotm.interview?.headline || `\xAB${p.name}: \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430 \u043F\u0440\u0438\u043D\u0435\u0441\u043B\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\xBB`,
      quote: rawMotm.quote || rawMotm.interview?.quote || `\u041C\u044B \u043F\u0440\u043E\u0432\u0435\u043B\u0438 \u043E\u0442\u043B\u0438\u0447\u043D\u044B\u0439 \u043C\u0430\u0442\u0447 \u0438 \u0431\u0438\u043B\u0438\u0441\u044C \u0437\u0430 \u043A\u0430\u0436\u0434\u044B\u0439 \u043C\u044F\u0447. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0431\u043E\u043B\u0435\u043B\u044C\u0449\u0438\u043A\u0430\u043C \u0437\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443!`,
      coachTacticsReflection: rawMotm.coachTacticsReflection || rawMotm.interview?.tacticsComment || ""
    };
  }
  const out = {
    fixture: pubFx(f),
    events: [],
    stats: null,
    lineups: null,
    ctx: null,
    final: null,
    err: isAdm ? f.err : void 0,
    fallback: !!f.fallback,
    motm: motmOut,
    ratings: m?.ratings || (f.status === "done" && m ? computeMatchRatings(m, f, HName, AName) : []),
    coaches: {
      home: { coach: coachHome, synergy: computeCoachSynergy(coachHome, db.tactics[f.home]) },
      away: { coach: coachAway, synergy: computeCoachSynergy(coachAway, db.tactics[f.away]) }
    },
    h2h: getHeadToHead(f.home, f.away, f.id)
  };
  if (m && (f.status === "live" || f.status === "done")) {
    out.events = f.status === "live" ? m.events.slice(0, f.pos) : m.events;
    out.stats = f.status === "done" ? m.stats : computeStats(out.events, m.ctx);
    const show = isAdm || f.status === "done" || f.status === "live";
    if (m.ctx?.lineup) {
      out.lineups = {};
      for (const s of ["home", "away"]) {
        const tid = f[s];
        const L = m.ctx.lineup[s];
        if (L) {
          const canSeeTactics = isAdm || req.me?.teamId && req.me.teamId === tid;
          out.lineups[s] = {
            name: m.ctx.sides?.[s]?.name || (s === "home" ? HName : AName),
            logo: m.ctx.sides?.[s]?.logo || teamLogo(tid),
            formation: L.formation || "4-3-3",
            speech: canSeeTactics ? L.speech || "(\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0430)" : void 0,
            training: canSeeTactics ? L.training || "" : void 0,
            starters: (L.starters || []).map((id) => ({ id, name: m.ctx.names?.[id] || player(id)?.name || "\u0418\u0433\u0440\u043E\u043A", pos: m.ctx.pos?.[id] || player(id)?.pos || "" })),
            bench: (L.bench || []).map((id) => ({ id, name: m.ctx.names?.[id] || player(id)?.name || "\u0418\u0433\u0440\u043E\u043A", pos: m.ctx.pos?.[id] || player(id)?.pos || "" }))
          };
        }
      }
    }
    if (m.ctx) {
      out.ctx = {
        comp: m.ctx.comp,
        roundLabel: m.ctx.roundLabel,
        stadium: m.ctx.stadium,
        weather: m.ctx.weather,
        derby: m.ctx.derby,
        motiv: m.ctx.motiv
      };
      if (isAdm) {
        out.ctx.prompt = m.ctx.prompt1;
        out.ctx.fat = m.ctx.fat;
        out.ctx.race = m.ctx.race;
      }
    }
  }
  if (!out.ctx) {
    const H = team(f.home);
    const dv = db.derbies.find((d) => d.a === f.home && d.b === f.away || d.a === f.away && d.b === f.home);
    out.ctx = {
      comp: compName(f),
      roundLabel: roundLabel(f),
      stadium: (H?.stadium ? H.stadium + ", " : "") + (H?.city || ""),
      weather: "\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043F\u043E\u0433\u043E\u0434\u044B \u0444\u043E\u0440\u043C\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0431\u043B\u0438\u0436\u0435 \u043A \u043C\u0430\u0442\u0447\u0443",
      derby: dv ? `${dv.name}. ${dv.note}` : "\u043D\u0435\u0442",
      motiv: { home: motivText(f.home, f), away: motivText(f.away, f) }
    };
  }
  if (!out.lineups) {
    const H = team(f.home), A = team(f.away);
    out.lineups = {};
    for (const s of ["home", "away"]) {
      const tid = f[s];
      const tm = s === "home" ? H : A;
      const L = getLineup(f, tid);
      const canSeeTactics = isAdm || req.me?.teamId && req.me.teamId === tid;
      out.lineups[s] = {
        name: tm ? tm.name : tn(tid),
        logo: teamLogo(tid),
        formation: L.formation || "4-3-3",
        speech: canSeeTactics ? L.speech || "(\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043D\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0430)" : void 0,
        training: canSeeTactics ? L.training || "" : void 0,
        starters: (L.starters || []).map((id) => {
          const p = player(id);
          return { id, name: p ? p.name : "\u0418\u0433\u0440\u043E\u043A", pos: p ? p.pos : "" };
        }),
        bench: (L.bench || []).map((id) => {
          const p = player(id);
          return { id, name: p ? p.name : "\u0418\u0433\u0440\u043E\u043A", pos: p ? p.pos : "" };
        })
      };
    }
  }
  res.json(out);
});
app.post("/api/match/:id/interview", async (req, res) => {
  const f = fx(req.params.id);
  if (!f || f.status !== "done") return fail(res, "\u041C\u0430\u0442\u0447 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D");
  const m = getMatch(f.id);
  const HName = tn(f.home), AName = tn(f.away);
  const cH = getCoachForTeam(f.home), cA = getCoachForTeam(f.away);
  const motm = m?.motm || (m ? getMatchMotm(m, f, HName, AName, cH, cA) : null);
  if (!motm) return fail(res, "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u043B\u0443\u0447\u0448\u0435\u043C \u0438\u0433\u0440\u043E\u043A\u0435");
  const question = String(req.body.question || "\u041A\u0430\u043A \u043F\u0440\u043E\u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0438\u0440\u0443\u0435\u0442\u0435 \u0438\u0441\u0445\u043E\u0434 \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u0438 \u0441\u0432\u043E\u044E \u0438\u0433\u0440\u0443?").trim();
  if (hasLLM()) {
    try {
      const prompt = `\u0422\u044B \u2014 \u043B\u0443\u0447\u0448\u0438\u0439 \u0438\u0433\u0440\u043E\u043A \u043C\u0430\u0442\u0447\u0430 ${motm.name} (${motm.pos}, \u043A\u043B\u0443\u0431 ${motm.teamName}). \u041C\u0430\u0442\u0447: ${HName} ${f.hg}:${f.ag} ${AName} (${roundLabel(f)}). \u0416\u0443\u0440\u043D\u0430\u043B\u0438\u0441\u0442 \u043D\u0430 \u0444\u043B\u0435\u0448-\u0438\u043D\u0442\u0435\u0440\u0432\u044C\u044E \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442: "${question}". \u041E\u0442\u0432\u0435\u0442\u044C \u0436\u0438\u0432\u043E, \u044D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u0441\u0434\u0435\u0440\u0436\u0430\u043D\u043D\u043E \u0438\u043B\u0438 \u0432\u043E\u043E\u0434\u0443\u0448\u0435\u0432\u043B\u0435\u043D\u043D\u043E \u0432 2-4 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u0445 \u043E\u0442 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043B\u0438\u0446\u0430.`;
      const ans = await callProv(provList()[0], "", prompt, { temp: 0.8, max: 500 });
      return res.json({ question, answer: ans.trim(), player: motm.name });
    } catch {
    }
  }
  return res.json({
    question,
    answer: `\xAB${question.includes("\u0443\u0434\u0430\u0440") || question.includes("\u0433\u043E\u043B") ? "\u0412 \u043C\u043E\u043C\u0435\u043D\u0442\u0435 \u0441 \u0433\u043E\u043B\u043E\u043C \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u0438\u043D\u044F\u043B \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0431\u0438\u0442\u044C \u0432 \u0443\u0433\u043E\u043B, \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0431\u044B\u043B\u043E \u043F\u043E\u043F\u0430\u0441\u0442\u044C \u0432 \u0441\u0442\u0432\u043E\u0440. " : ""}\u041C\u044B \u0433\u043E\u0442\u043E\u0432\u0438\u043B\u0438\u0441\u044C \u043A \u0442\u044F\u0436\u0451\u043B\u043E\u0439 \u0431\u043E\u0440\u044C\u0431\u0435. \u0422\u0440\u0435\u043D\u0435\u0440 \u0443\u043A\u0430\u0437\u0430\u043B \u043D\u0430 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0437\u043E\u043D\u044B, \u043C\u044B \u0441\u0442\u0430\u0440\u0430\u043B\u0438\u0441\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443 \u0438 \u0440\u0430\u0434\u044B \u043F\u043E\u0434\u0430\u0440\u0438\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u0438 \u043D\u0430\u0448\u0438\u043C \u0444\u0430\u043D\u0430\u0442\u0430\u043C!\xBB`,
    player: motm.name
  });
});
app.get("/api/cup/structure", (req, res) => {
  if (!db.cupState2026) advanceCup();
  recalculateCupGroups(db.cupState2026, seasonFx());
  const cupMatches = seasonFx().filter((f) => f.comp === "cup").map(pubFx);
  res.json({
    state: db.cupState2026,
    fixtures: cupMatches,
    teams: db.teams.map(pubTeam)
  });
});
app.get("/api/coaches", (req, res) => {
  const list = db.teams.map((t) => {
    const coach = getCoachForTeam(t.id);
    const synergy = computeCoachSynergy(coach, db.tactics[t.id]);
    return {
      teamId: t.id,
      teamName: t.name,
      comp: t.comp,
      logo: teamLogo(t.id),
      coach,
      synergy
    };
  });
  res.json(list);
});
app.get("/api/coach/:teamId", (req, res) => {
  const t = team(req.params.teamId);
  if (!t) return fail(res, "\u041A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", 404);
  const coach = getCoachForTeam(t.id);
  const synergy = computeCoachSynergy(coach, db.tactics[t.id]);
  res.json({ team: pubTeam(t), coach, synergy });
});
app.post("/api/coach/:teamId", admin, (req, res) => {
  const t = team(req.params.teamId);
  if (!t) return fail(res, "\u041A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", 404);
  const cur = getCoachForTeam(t.id);
  const b = req.body;
  db.coaches ||= {};
  db.coaches[t.id] = {
    ...cur,
    name: b.name ? String(b.name).trim() : cur.name,
    style: b.style && ["bus", "counter", "possession", "attack", "press"].includes(b.style) ? b.style : cur.style,
    favoriteFormation: b.favoriteFormation || cur.favoriteFormation,
    reputation: Number(b.reputation) || cur.reputation,
    temperament: b.temperament || cur.temperament,
    quote: b.quote || cur.quote
  };
  save();
  res.json({ ok: 1, coach: db.coaches[t.id] });
});
app.get("/api/awards/round", (req, res) => {
  const comp = String(req.query.comp || "rpl");
  const compFx = seasonFx().filter((f) => f.comp === comp && f.status === "done");
  const rounds = [...new Set(compFx.map((f) => roundLabel(f)))];
  const requestedRound = String(req.query.round || rounds[rounds.length - 1] || "1-\u0439 \u0442\u0443\u0440");
  const matchesMap = {};
  for (const f of compFx) {
    const m = getMatch(f.id);
    if (m) matchesMap[f.id] = m;
  }
  const teamsMap = Object.fromEntries(db.teams.map((t) => [t.id, pubTeam(t)]));
  const teamOfRound = buildTeamOfRound(requestedRound, comp, compFx, matchesMap, teamsMap);
  res.json({
    comp,
    availableRounds: rounds,
    selectedRound: requestedRound,
    teamOfRound
  });
});
app.get("/api/awards/month", (req, res) => {
  const comp = String(req.query.comp || "rpl");
  const compFx = seasonFx().filter((f) => f.comp === comp && f.status === "done");
  const months = [...new Set(compFx.map((f) => (f.date || "").slice(0, 7)).filter(Boolean))].sort();
  const requestedMonth = String(req.query.month || months[months.length - 1] || "2026-08");
  const matchesMap = {};
  for (const f of compFx) {
    const m = getMatch(f.id);
    if (m) matchesMap[f.id] = m;
  }
  const teamsMap = Object.fromEntries(db.teams.map((t) => [t.id, pubTeam(t)]));
  const teamOfMonth = buildTeamOfMonth(requestedMonth, comp, compFx, matchesMap, teamsMap);
  res.json({
    comp,
    availableMonths: months,
    selectedMonth: requestedMonth,
    teamOfMonth
  });
});
app.get("/api/awards/season", (req, res) => {
  const comp = String(req.query.comp || "rpl");
  const A = agg();
  const P = Object.values(A.P).filter((x) => x.comp === comp);
  const rows = table(comp);
  const topScorer = [...P].sort((a, b) => b.g - a.g || b.min - a.min)[0] || null;
  const topAssister = [...P].sort((a, b) => b.a - a.a || b.min - a.min)[0] || null;
  const bestGk = [...P].filter((p) => p.cs > 0 || p.sv > 0).sort((a, b) => b.cs - a.cs || b.sv - a.sv)[0] || null;
  const championTeam = rows[0] ? team(rows[0].id) : null;
  const coachOfSeason = championTeam ? {
    coach: getCoachForTeam(championTeam.id),
    teamName: championTeam.name,
    teamLogo: teamLogo(championTeam.id),
    title: "\u0422\u0440\u0435\u043D\u0435\u0440 \u0433\u043E\u0434\u0430",
    reason: `\u041F\u0440\u0438\u0432\u0451\u043B \u043A\u043E\u043C\u0430\u043D\u0434\u0443 \xAB${championTeam.name}\xBB \u043A \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0441\u043A\u043E\u043C\u0443 \u0442\u0438\u0442\u0443\u043B\u0443`
  } : null;
  const matchesMap = {};
  for (const f of seasonFx().filter((f2) => f2.comp === comp && f2.status === "done")) {
    const m = getMatch(f.id);
    if (m) matchesMap[f.id] = m;
  }
  const teamsMap = Object.fromEntries(db.teams.map((t) => [t.id, pubTeam(t)]));
  const allMonths = [...new Set(seasonFx().map((f) => String(f.date || "").slice(0, 7)).filter(Boolean))].sort();
  const latestMonth = allMonths[allMonths.length - 1] || "2026-08";
  const teamOfSeason = buildTeamOfMonth(latestMonth, comp, seasonFx(), matchesMap, teamsMap);
  res.json({
    comp,
    season: S(),
    topScorer: topScorer ? { ...topScorer, team: tn(topScorer.t), logo: teamLogo(topScorer.t) } : null,
    topAssister: topAssister ? { ...topAssister, team: tn(topAssister.t), logo: teamLogo(topAssister.t) } : null,
    bestGk: bestGk ? { ...bestGk, team: tn(bestGk.t), logo: teamLogo(bestGk.t) } : null,
    coachOfSeason,
    teamOfSeason
  });
});
app.post("/api/admin/season/rotate", admin, (req, res) => {
  const result = performSeasonRotation();
  res.json(result);
});
app.get("/api/live/:id", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.flushHeaders?.();
  res.write('data: {"type":"hello"}\n\n');
  const l = live[req.params.id] ||= { clients: /* @__PURE__ */ new Set() };
  l.clients.add(res);
  const ka = setInterval(() => res.write(": ka\n\n"), 2e4);
  req.on("close", () => {
    clearInterval(ka);
    l.clients.delete(res);
  });
});
app.get("/api/leaders", (req, res) => {
  const comp = String(req.query.comp || "rpl");
  const A = agg();
  const P = Object.values(A.P).filter((x) => x.comp === comp).map((x) => ({
    ...x,
    team: tn(x.t),
    teamLogo: teamLogo(x.t),
    xg: +x.xg.toFixed(2)
  }));
  const existingTeams = /* @__PURE__ */ new Set();
  const T = Object.values(A.T).filter((x) => x.comp === comp).map((x) => {
    existingTeams.add(String(x.tid));
    return {
      ...x,
      team: tn(x.tid),
      teamLogo: teamLogo(x.tid),
      xg: +x.xg.toFixed(2),
      xga: +x.xga.toFixed(2)
    };
  });
  const compTeams = db.teams.filter((t) => t.comp === comp);
  for (const t of compTeams) {
    if (!existingTeams.has(t.id)) {
      T.push({
        tid: t.id,
        comp,
        m: 0,
        g: 0,
        ga: 0,
        xg: 0,
        xga: 0,
        co: 0,
        penF: 0,
        penA: 0,
        refF: 0,
        refA: 0,
        fo: 0,
        foA: 0,
        yc: 0,
        rc: 0,
        tk: 0,
        sv: 0,
        cs: 0,
        team: t.name,
        teamLogo: teamLogo(t.id)
      });
    }
  }
  res.json({ players: P, teams: T });
});
app.get("/api/players/search", (req, res) => {
  const q = norm(req.query.q);
  if (q.length < 2) return res.json([]);
  res.json(db.players.filter((p) => norm(p.name).includes(q)).sort((a, b) => (norm(a.name).startsWith(q) ? 0 : 1) - (norm(b.name).startsWith(q) ? 0 : 1)).slice(0, 12).map(pubPlayer));
});
app.get("/api/derbies", (req, res) => {
  res.json(db.derbies.map((d) => ({
    ...d,
    aName: tn(d.a),
    bName: tn(d.b),
    aLogo: teamLogo(d.a),
    bLogo: teamLogo(d.b)
  })));
});
app.get("/api/club", needClub, (req, res) => {
  const t = team(req.tid), sq = squadOf(req.tid);
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const up = seasonFx().filter((f) => (f.home === req.tid || f.away === req.tid) && f.status === "scheduled").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6);
  const legionLimit = getRplLegionLimit(S());
  const legionSquadCount = sq.filter(isLegionnaire).length;
  const incoming = (db.transfers || []).filter((x) => x.from === req.tid && x.status === "pending").map((x) => ({
    ...x,
    pName: player(x.pid)?.name || x.playerName,
    pos: player(x.pid)?.pos || x.pos,
    fromName: tn(x.from) || x.fromName,
    toName: tn(x.to) || x.toName,
    toLogo: teamLogo(x.to)
  }));
  const outgoing = (db.transfers || []).filter((x) => x.to === req.tid && x.status === "pending").map((x) => ({
    ...x,
    pName: player(x.pid)?.name || x.playerName,
    pos: player(x.pid)?.pos || x.pos,
    fromName: tn(x.from) || x.fromName,
    fromLogo: teamLogo(x.from),
    toName: tn(x.to) || x.toName
  }));
  res.json({
    team: { ...pubTeam(t), code: req.me.role === "admin" ? t.code : void 0 },
    squadMax: db.settings.squadMax,
    legionLimit,
    legionSquadCount,
    squadSubmitted: !!db.squads[req.tid],
    squad: sq.map((p) => ({ ...pubPlayer(p), available: isAvail(p, today), card: p })),
    tactic: db.tactics[req.tid] || null,
    upcoming: up.map((f) => ({
      ...pubFx(f),
      lineup: db.lineups[f.id + ":" + req.tid] || null,
      auto: getLineup(f, req.tid),
      opp: tn(f.home === req.tid ? f.away : f.home),
      oppLogo: teamLogo(f.home === req.tid ? f.away : f.home)
    })),
    transfers: db.transfers.filter((x) => x.to === req.tid).slice(-10),
    incomingTransfers: incoming,
    outgoingTransfers: outgoing,
    budget: t.budget || 0,
    formattedBudget: "\u20AC" + (t.budget || 0).toLocaleString("ru-RU"),
    budgetHistory: (db.budgetHistory || []).filter((h) => h.teamId === req.tid).slice(-20).reverse()
  });
});
app.post("/api/club/squad/add", needClub, async (req, res) => {
  try {
    let p;
    if (req.body.playerId) {
      p = player(req.body.playerId);
    } else {
      [p] = await createPlayers([req.body.name], null, req.body.hint);
      if (p && req.body.pos && POSES.includes(req.body.pos) && !p.verified) p.pos = req.body.pos;
    }
    if (!p) return fail(res, "\u0418\u0433\u0440\u043E\u043A \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
    const cur = squadOf(req.tid);
    if (cur.some((x) => x.id === p.id)) return res.json({ ok: 1 });
    if (cur.length >= db.settings.squadMax) return fail(res, `\u0412 \u0437\u0430\u044F\u0432\u043A\u0435 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${db.settings.squadMax} \u0438\u0433\u0440\u043E\u043A\u043E\u0432`);
    const tm = team(req.tid);
    if (tm && tm.comp === "rpl") {
      const limit = getRplLegionLimit(S());
      const curLegions = cur.filter(isLegionnaire);
      if (isLegionnaire(p) && curLegions.length >= limit.inSquad) {
        return fail(res, `\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043B\u0438\u043C\u0438\u0442 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432 \u0432 \u0437\u0430\u044F\u0432\u043A\u0435 \u0420\u041F\u041B: \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${limit.inSquad} \u043F\u043E \u043B\u0438\u043C\u0438\u0442\u0443 ${limit.label} \u043D\u0430 \u0441\u0435\u0437\u043E\u043D ${S()} (\u0441\u0435\u0439\u0447\u0430\u0441 \u0432 \u0437\u0430\u044F\u0432\u043A\u0435: ${curLegions.length} \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432)`);
      }
    }
    const owner = p.teamId && p.teamId !== req.tid && team(p.teamId) && (team(p.teamId).code || squadOf(p.teamId).length);
    if (owner && req.me.role !== "admin") {
      const fromTeam = team(p.teamId);
      const toTeam = team(req.tid);
      const isRplToRpl = fromTeam?.comp === "rpl" && toTeam?.comp === "rpl";
      const feeStr = String(req.body.fee || "\u20AC5.0M").trim();
      const feeNum = parseFeeAmount(feeStr);
      const isLoan = String(req.body.transferType || req.body.type || "").includes("loan");
      const note = String(req.body.note || (isLoan ? "\u0410\u0440\u0435\u043D\u0434\u0430" : "\u041F\u043E\u043B\u043D\u043E\u0446\u0435\u043D\u043D\u044B\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440")).slice(0, 300);
      const trObj = {
        id: uid(),
        pid: p.id,
        playerName: p.name,
        pos: p.pos || "\u0426\u041F",
        from: p.teamId,
        fromName: fromTeam?.name || "\u041A\u043B\u0443\u0431",
        to: req.tid,
        toName: toTeam?.name || "\u041A\u043B\u0443\u0431",
        fee: feeStr,
        feeAmount: feeNum,
        type: isLoan ? "loan" : "transfer",
        note,
        status: "pending",
        isRplToRpl,
        clubApproval: "pending",
        adminApproval: "pending",
        clubApprovedBy: p.teamId,
        initiator: req.tid,
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        at: Date.now()
      };
      db.transfers.unshift(trObj);
      save();
      return res.json({
        pending: 1,
        isRplToRpl,
        transfer: trObj,
        message: isRplToRpl ? `${p.name} \u0447\u0438\u0441\u043B\u0438\u0442\u0441\u044F \u0432 \xAB${tn(p.teamId)}\xBB. \u0417\u0430\u043F\u0440\u043E\u0441 (${feeStr}) \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0443 \xAB${tn(p.teamId)}\xBB \u0438 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0443 \u043B\u0438\u0433\u0438. \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0441\u043E\u0441\u0442\u043E\u0438\u0442\u0441\u044F \u043F\u0440\u0438 \u043E\u0431\u043E\u044E\u0434\u043D\u043E\u043C \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0438.` : `${p.name} \u0447\u0438\u0441\u043B\u0438\u0442\u0441\u044F \u0432 \xAB${tn(p.teamId)}\xBB. \u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0443.`
      });
    }
    p.teamId = req.tid;
    db.squads[req.tid] = [...cur.map((x) => x.id), p.id];
    save();
    res.json({ ok: 1, player: pubPlayer(p) });
  } catch (e) {
    fail(res, e.message);
  }
});
app.post("/api/club/transfer/respond", needClub, (req, res) => {
  const { transferId, action, comment } = req.body;
  const t = db.transfers.find((x) => x.id === transferId);
  if (!t || t.status !== "pending") return fail(res, "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0438\u043B\u0438 \u0443\u0436\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430");
  if (t.from !== req.tid && t.to !== req.tid) {
    return fail(res, "\u042D\u0442\u043E\u0442 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u043D\u0435 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A \u0432\u0430\u0448\u0435\u043C\u0443 \u043A\u043B\u0443\u0431\u0443");
  }
  if (action === "approve") {
    t.clubApproval = "approved";
    t.clubRespondedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (comment) t.clubComment = String(comment).slice(0, 200);
    const executed = executeTransferIfBothApproved(t);
    save();
    return res.json({
      ok: 1,
      approved: true,
      executed,
      message: executed ? "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u043A\u043E\u043D\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0430 \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430! \u0424\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442 \u043F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D \u0432 \u0441\u043E\u0441\u0442\u0430\u0432." : "\u0412\u044B \u0434\u0430\u043B\u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0443. \u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043E\u0442 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u043B\u0438\u0433\u0438."
    });
  } else {
    t.clubApproval = "rejected";
    t.status = "rejected";
    t.rejectReason = `\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0435\u043C \u043A\u043B\u0443\u0431\u0430 \xAB${tn(req.tid)}\xBB`;
    save();
    return res.json({ ok: 1, rejected: true, message: `\u0412\u044B \u043E\u0442\u043A\u043B\u043E\u043D\u0438\u043B\u0438 \u0441\u0434\u0435\u043B\u043A\u0443 \u043F\u043E \u0438\u0433\u0440\u043E\u043A\u0443 ${t.playerName}.` });
  }
});
app.post("/api/club/squad/remove", needClub, (req, res) => {
  const cur = squadOf(req.tid).filter((p2) => p2.id !== req.body.playerId);
  db.squads[req.tid] = cur.map((p2) => p2.id);
  const p = player(req.body.playerId);
  if (p && p.teamId === req.tid) p.teamId = null;
  save();
  res.json({ ok: 1 });
});
app.post("/api/club/squad/submit", needClub, (req, res) => {
  db.squads[req.tid] = squadOf(req.tid).map((p) => p.id);
  save();
  res.json({ ok: 1 });
});
app.post("/api/club/lineup", needClub, (req, res) => {
  const f = fx(req.body.fid);
  if (!f || f.home !== req.tid && f.away !== req.tid) return fail(res, "\u042D\u0442\u043E \u043D\u0435 \u043C\u0430\u0442\u0447 \u0432\u0430\u0448\u0435\u0433\u043E \u043A\u043B\u0443\u0431\u0430");
  if (f.status !== "scheduled") return fail(res, "\u041C\u0430\u0442\u0447 \u0443\u0436\u0435 \u043D\u0430\u0447\u0430\u043B\u0441\u044F \u2014 \u0441\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0440\u044B\u0442");
  const sq = new Set(squadOf(req.tid).map((p) => p.id));
  const st = (req.body.starters || []).filter((id) => sq.has(id));
  if (new Set(st).size !== st.length) return fail(res, "\u0418\u0433\u0440\u043E\u043A \u0443\u043A\u0430\u0437\u0430\u043D \u0434\u0432\u0430\u0436\u0434\u044B");
  if (st.length !== 11) return fail(res, "\u0412 \u0441\u0442\u0430\u0440\u0442\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u043E\u0432\u043D\u043E 11 \u0438\u0433\u0440\u043E\u043A\u043E\u0432");
  if (!st.some((id) => player(id)?.pos === "\u0412\u0420")) return fail(res, "\u0412 \u0441\u0442\u0430\u0440\u0442\u0435 \u043D\u0443\u0436\u0435\u043D \u0432\u0440\u0430\u0442\u0430\u0440\u044C");
  const bad = st.map(player).filter((p) => !isAvail(p, f.date));
  if (bad.length) return fail(res, `\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B: ${bad.map((p) => p.name).join(", ")}`);
  if (f.comp === "rpl") {
    const limit = getRplLegionLimit(S());
    const legionStarters = st.map(player).filter(isLegionnaire);
    if (legionStarters.length > limit.onPitch) {
      return fail(res, `\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043B\u0438\u043C\u0438\u0442 \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432 \u043D\u0430 \u043F\u043E\u043B\u0435 \u0432 \u0420\u041F\u041B: \u0432 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u043E\u043C \u0441\u043E\u0441\u0442\u0430\u0432\u0435 ${legionStarters.length} \u043B\u0435\u0433\u0438\u043E\u043D\u0435\u0440\u043E\u0432, \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u043E \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C ${limit.onPitch} (\u043B\u0438\u043C\u0438\u0442 ${limit.label} \u043D\u0430 \u0441\u0435\u0437\u043E\u043D ${S()})`);
    }
  }
  const fm = /^\d(-\d){1,3}$/.test(req.body.formation || "") ? req.body.formation : "4-3-3";
  const bench = (req.body.bench || []).filter((id) => sq.has(id) && !st.includes(id)).slice(0, 12);
  const L = {
    formation: fm,
    starters: st,
    bench,
    speech: String(req.body.speech || "").slice(0, 4e3),
    training: String(req.body.training || "").slice(0, 4e3),
    at: Date.now()
  };
  db.lineups[f.id + ":" + req.tid] = L;
  db.tactics[req.tid] = { ...L };
  save();
  res.json({ ok: 1 });
});
app.get("/api/admin/overview", admin, (req, res) => {
  res.json({
    teams: db.teams.map((t) => ({
      ...pubTeam(t),
      squad: squadOf(t.id).length,
      submitted: !!db.squads[t.id],
      code: t.code
    })),
    settings: {
      ...db.settings,
      keys: void 0,
      tgToken: db.settings.tgToken ? "\u2022\u2022\u2022\u2022" : "",
      adminCode: db.settings.adminCode,
      systemPrompt: db.settings.systemPrompt || SYS_DEFAULT
    },
    keys: {
      gemini: !!getGeminiKeys().length,
      geminiCount: getGeminiKeys().length,
      groq: !!(process.env.GROQ_API_KEY || db.settings.keys.groq),
      openrouter: !!(process.env.OPENROUTER_API_KEY || db.settings.keys.openrouter)
    },
    models: db.settings.models,
    log: db.llmlog.slice(-25).reverse(),
    transfers: (db.transfers || []).filter((t) => t.status === "pending").map((t) => ({
      ...t,
      pName: player(t.pid)?.name || t.playerName,
      pos: player(t.pid)?.pos || t.pos || "\u0426\u041F",
      fromName: tn(t.from) || t.fromName || "\u041A\u043B\u0443\u0431",
      toName: tn(t.to) || t.toName || "\u041A\u043B\u0443\u0431",
      fromLogo: teamLogo(t.from),
      toLogo: teamLogo(t.to)
    })),
    allTransfers: (db.transfers || []).slice(0, 30).map((t) => ({
      ...t,
      pName: player(t.pid)?.name || t.playerName,
      pos: player(t.pid)?.pos || t.pos || "\u0426\u041F",
      fromName: tn(t.from) || t.fromName || "\u041A\u043B\u0443\u0431",
      toName: tn(t.to) || t.toName || "\u041A\u043B\u0443\u0431",
      fromLogo: teamLogo(t.from),
      toLogo: teamLogo(t.to)
    }))
  });
});
app.post("/api/admin/settings", admin, (req, res) => {
  const b = req.body, s = db.settings;
  for (const k of ["season", "siteUrl", "tgChat"]) if (typeof b[k] === "string") s[k] = b[k].trim();
  if (typeof b.tgToken === "string" && !b.tgToken.includes("\u2022")) s.tgToken = b.tgToken.trim();
  for (const k of ["secPerMin", "breakSec", "squadMax"]) if (b[k] !== void 0 && +b[k] > 0) s[k] = +b[k];
  if (b.chunks !== void 0) s.chunks = +b.chunks === 6 ? 6 : 2;
  if (b.auto !== void 0) s.auto = !!b.auto;
  if (b.grounding !== void 0) s.grounding = !!b.grounding;
  if (typeof b.systemPrompt === "string") s.systemPrompt = b.systemPrompt.trim() === SYS_DEFAULT.trim() ? "" : b.systemPrompt;
  for (const k of ["gemini", "groq", "openrouter"]) {
    if (typeof b.keys?.[k] === "string" && b.keys[k].trim()) s.keys[k] = b.keys[k].trim();
    if (b.keys?.[k] === "") delete s.keys[k];
    if (typeof b.models?.[k] === "string") {
      if (b.models[k].trim()) s.models[k] = b.models[k].trim();
      else delete s.models[k];
    }
  }
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/season", admin, (req, res) => {
  let start = String(req.body.start || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u0441\u0442\u0430\u0440\u0442\u0430 (\u0413\u0413\u0413\u0413-\u041C\u041C-\u0414\u0414)");
  const name = String(req.body.name || S()).trim();
  if (seasonFx().length && db.settings.season === name && !req.body.force) {
    return fail(res, "\u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0441\u0435\u0437\u043E\u043D\u0430 \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0435\u0437\u043E\u043D\u0430 \u0438\u043B\u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u0435\u0440\u0435\u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435.");
  }
  if (db.settings.season === name) db.fixtures = db.fixtures.filter((f) => f.season !== name);
  db.settings.manualDraw = false;
  genSeason(start, name);
  save();
  res.json({ ok: 1, fixtures: seasonFx().length });
});
app.post("/api/admin/clear-fixtures", admin, (req, res) => {
  db.fixtures = [];
  db.cupState2026 = null;
  db.settings.manualDraw = true;
  invalidateAgg();
  save();
  res.json({ ok: 1, message: "\u0412\u0441\u0435 \u0442\u0443\u0440\u043D\u0438\u0440\u043D\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u043E\u0447\u0438\u0449\u0435\u043D\u044B. \u0411\u0430\u0437\u0430 \u0433\u043E\u0442\u043E\u0432\u0430 \u043A \u043D\u043E\u0432\u043E\u0439 \u0436\u0435\u0440\u0435\u0431\u044C\u0451\u0432\u043A\u0435." });
});
app.post("/api/admin/team", admin, (req, res) => {
  const b = req.body;
  let t = b.id && team(b.id);
  if (b.delete) {
    if (!t) return fail(res, "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u044B");
    if (db.fixtures.some((f) => f.home === t.id || f.away === t.id)) return fail(res, "\u0423 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0435\u0441\u0442\u044C \u043C\u0430\u0442\u0447\u0438 \u2014 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F");
    db.teams = db.teams.filter((x) => x !== t);
    save();
    return res.json({ ok: 1 });
  }
  if (!String(b.name || "").trim()) return fail(res, "\u041D\u0443\u0436\u043D\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435");
  if (!t) {
    t = { id: uid(), code: "" };
    db.teams.push(t);
  }
  const name = b.name.trim();
  const comp = db.comps.some((c) => c.id === b.comp) ? b.comp : "rpl";
  const logo = b.logo ? b.logo.trim() : t.logo || getTeamLogo(name, null, comp);
  Object.assign(t, {
    name,
    comp,
    logo,
    city: b.city || "",
    stadium: b.stadium || "",
    lat: b.lat === "" || b.lat == null ? t.lat ?? null : +b.lat,
    lon: b.lon === "" || b.lon == null ? t.lon ?? null : +b.lon
  });
  if (b.regen || b.comp === "rpl" && !t.code) t.code = mkCode();
  if (b.clearCode) t.code = "";
  save();
  res.json({ ok: 1, team: pubTeam(t) });
});
app.post("/api/admin/import", admin, async (req, res) => {
  const names = String(req.body.names || "").split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  if (!req.body.teamId || !team(req.body.teamId)) return fail(res, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u0443");
  if (!names.length) return fail(res, "\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u043F\u0438\u0441\u043E\u043A \u0438\u0433\u0440\u043E\u043A\u043E\u0432");
  try {
    const out = [];
    for (let i = 0; i < names.length; i += 10) {
      out.push(...await createPlayers(names.slice(i, i + 10), req.body.teamId, team(req.body.teamId).name));
    }
    const tid = req.body.teamId;
    for (const p of out) p.teamId = tid;
    db.squads[tid] = [.../* @__PURE__ */ new Set([...squadOf(tid).map((p) => p.id), ...out.map((p) => p.id)])];
    save();
    res.json({ ok: 1, added: out.length, verified: out.filter((p) => p.verified).length });
  } catch (e) {
    fail(res, e.message);
  }
});
app.get("/api/admin/players", admin, (req, res) => {
  const q = norm(req.query.q || "");
  let l = db.players;
  if (req.query.teamId) l = l.filter((p) => p.teamId === req.query.teamId);
  if (q) l = l.filter((p) => norm(p.name).includes(q));
  res.json(l.slice(0, 300).map(pubPlayer));
});
app.post("/api/admin/player", admin, (req, res) => {
  const b = req.body;
  if (b.delete) {
    db.players = db.players.filter((p2) => p2.id !== b.id);
    for (const k of Object.keys(db.squads)) db.squads[k] = db.squads[k].filter((i) => i !== b.id);
    save();
    return res.json({ ok: 1 });
  }
  let p = b.id && player(b.id);
  if (!p) {
    p = cardFrom({ name: b.name }, { teamId: b.teamId });
    db.players.push(p);
  }
  for (const k of ["name", "pos", "born", "nation", "realClub", "style", "stats2y", "form", "character", "news", "otherNationalTeam"]) {
    if (typeof b[k] === "string") p[k] = b[k];
  }
  if (b.playedForOtherNationalTeam !== void 0) {
    p.playedForOtherNationalTeam = !!b.playedForOtherNationalTeam;
  }
  if (b.achievements !== void 0) {
    p.achievements = Array.isArray(b.achievements) ? b.achievements : String(b.achievements).split("\n").map((s) => s.trim()).filter(Boolean);
  }
  if ("teamId" in b) {
    p.teamId = b.teamId || null;
    if (p.teamId) {
      db.squads[p.teamId] = [.../* @__PURE__ */ new Set([...squadOf(p.teamId).map((x) => x.id), p.id])];
    }
  }
  if ("out" in b) p.out = b.out && b.out.until ? b.out : null;
  if (b.banLeft !== void 0) p.banLeft = +b.banLeft || 0;
  p.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  save();
  res.json({ ok: 1, player: p });
});
app.post("/api/admin/refresh", admin, async (req, res) => {
  const names = squadOf(req.body.teamId).map((p) => p.name);
  if (!hasLLM()) return fail(res, "\u041D\u0435\u0442 \u043A\u043B\u044E\u0447\u0435\u0439 \u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u0438");
  let n = 0;
  try {
    for (let i = 0; i < names.length; i += 10) {
      const r = await llmJSON(CARD_SYS, `\u0418\u0433\u0440\u043E\u043A\u0438: ${names.slice(i, i + 10).map((x, j) => `${j + 1}. ${x}`).join("; ")}. \u041A\u043B\u0443\u0431: ${tn(req.body.teamId)}. \u041E\u0431\u043D\u043E\u0432\u0438 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0443\u044E \u0444\u043E\u0440\u043C\u0443 \u0438 \u043D\u043E\u0432\u043E\u0441\u0442\u0438.`, { task: "refresh", temp: 0.3, max: 8e3, grounded: !!db.settings.grounding && provList()[0]?.n === "gemini" });
      (r.players || []).forEach((c, j) => {
        const p = findPlayerByName(names[i + j]);
        if (p && c && c.found !== false) {
          for (const k of ["style", "stats2y", "form", "character", "news"]) if (c[k]) p[k] = c[k];
          if (Array.isArray(c.achievements) && c.achievements.length) p.achievements = c.achievements;
          p.verified = true;
          p.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          n++;
        }
      });
    }
    save();
    res.json({ ok: 1, updated: n });
  } catch (e) {
    fail(res, e.message);
  }
});
app.post("/api/admin/run", admin, async (req, res) => {
  const b = req.body;
  let list = seasonFx().filter((f) => f.status === "scheduled");
  if (b.fid) list = list.filter((f) => f.id === b.fid);
  else if (b.date) list = list.filter((f) => f.date === b.date);
  else if (b.comp && b.round) list = list.filter((f) => f.comp === b.comp && f.round === +b.round);
  else if (b.upto) list = list.filter((f) => f.date <= b.upto);
  else return fail(res, "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E, \u0447\u0442\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u044C");
  if (!list.length) return fail(res, "\u041D\u0435\u0442 \u043C\u0430\u0442\u0447\u0435\u0439 \u0434\u043B\u044F \u0437\u0430\u043F\u0443\u0441\u043A\u0430");
  res.json(await runBatch(list));
});
app.post("/api/admin/fixture", admin, (req, res) => {
  const f = fx(req.body.id);
  if (!f) return fail(res, "\u041C\u0430\u0442\u0447 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  if (req.body.reset) {
    if (f.status === "live") {
      clearTimeout(timers[f.id]);
    }
    Object.assign(f, { status: "scheduled", hg: null, ag: null, pen: null, st: null, pos: 0, final: null, err: "" });
    try {
      fs.unlinkSync(path.join(MDIR, f.id + ".json"));
    } catch {
    }
    mcache.delete(f.id);
    invalidateAgg();
    save();
    return res.json({ ok: 1 });
  }
  if (f.status !== "scheduled" && !req.body.force) return fail(res, "\u041C\u0430\u0442\u0447 \u0443\u0436\u0435 \u0441\u044B\u0433\u0440\u0430\u043D");
  if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.date || "")) f.date = req.body.date;
  if (/^\d{2}:\d{2}$/.test(req.body.time || "")) f.time = req.body.time;
  if (req.body.hg !== void 0 && req.body.ag !== void 0 && f.status === "scheduled") {
    f.hg = +req.body.hg;
    f.ag = +req.body.ag;
    f.status = "done";
    f.st = null;
    if (f.comp === "cup" && f.hg === f.ag) f.pen = shootout(f);
    invalidateAgg();
    advanceCup();
  }
  save();
  res.json({ ok: 1 });
});
app.get("/api/admin/lineups/:fid", admin, (req, res) => {
  const f = fx(req.params.fid);
  if (!f) return fail(res, "\u041D\u0435\u0442 \u043C\u0430\u0442\u0447\u0430");
  const o = {};
  for (const s of ["home", "away"]) {
    const L = getLineup(f, f[s]);
    o[s] = {
      team: tn(f[s]),
      logo: teamLogo(f[s]),
      ...L,
      starters: L.starters.map((id) => player(id)?.name),
      bench: L.bench.map((id) => player(id)?.name)
    };
  }
  res.json(o);
});
app.post("/api/admin/derby", admin, (req, res) => {
  const b = req.body;
  if (b.delete) {
    db.derbies = db.derbies.filter((d) => d.id !== b.id);
    save();
    return res.json({ ok: 1 });
  }
  if (!team(b.a) || !team(b.b) || b.a === b.b) return fail(res, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0432\u0435 \u0440\u0430\u0437\u043D\u044B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B");
  db.derbies.push({ id: uid(), a: b.a, b: b.b, name: b.name || "\u041F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435", note: b.note || "" });
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/transfer", admin, (req, res) => {
  const t = db.transfers.find((x) => x.id === req.body.id);
  if (!t || t.status !== "pending") return fail(res, "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
  if (req.body.approve) {
    t.adminApproval = "approved";
    if (req.body.force || !t.isRplToRpl) {
      t.clubApproval = "approved";
    }
    const executed = executeTransferIfBothApproved(t);
    save();
    res.json({ ok: 1, approved: true, executed, isRplToRpl: t.isRplToRpl, clubApproval: t.clubApproval });
  } else {
    t.adminApproval = "rejected";
    t.status = "rejected";
    t.rejectReason = "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u043E\u043C";
    save();
    res.json({ ok: 1, rejected: true });
  }
});
app.post("/api/admin/transfer/respond", admin, (req, res) => {
  const { transferId, action, force } = req.body;
  const t = db.transfers.find((x) => x.id === transferId);
  if (!t || t.status !== "pending") return fail(res, "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0438\u043B\u0438 \u0443\u0436\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430");
  if (action === "approve") {
    t.adminApproval = "approved";
    if (force || !t.isRplToRpl) {
      t.clubApproval = "approved";
    }
    const executed = executeTransferIfBothApproved(t);
    save();
    res.json({
      ok: 1,
      approved: true,
      executed,
      transfer: t,
      message: executed ? "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u043A\u043E\u043D\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u0430 \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430!" : "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u043E\u0434\u043E\u0431\u0440\u0438\u043B \u0441\u0434\u0435\u043B\u043A\u0443. \u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043E\u0442 \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0430 \u043A\u043B\u0443\u0431\u0430."
    });
  } else {
    t.adminApproval = "rejected";
    t.status = "rejected";
    t.rejectReason = "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u043E\u043C";
    save();
    res.json({ ok: 1, rejected: true, message: "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u043E\u043C" });
  }
});
app.post("/api/admin/transfer/ai-advice", admin, async (req, res) => {
  const { transferId } = req.body;
  const t = db.transfers.find((x) => x.id === transferId);
  if (!t) return fail(res, "\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const p = player(t.pid);
  const fromT = team(t.from);
  const toT = team(t.to);
  try {
    const advice = await getTransferAiAdvice(t, p, fromT, toT);
    t.aiAdvice = advice;
    save();
    res.json({ ok: 1, advice, transferId: t.id });
  } catch (e) {
    res.status(500).json({ error: e.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u0441\u043E\u0432\u0435\u0442\u0430" });
  }
});
app.post("/api/admin/ask", admin, async (req, res) => {
  const f = fx(req.body.fid), m = f && getMatch(f.id);
  if (!m || f.status !== "done") return fail(res, "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0436\u0434\u0438\u0442\u0435\u0441\u044C \u043A\u043E\u043D\u0446\u0430 \u043C\u0430\u0442\u0447\u0430");
  if (!req.body.question) return fail(res, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441");
  if (!hasLLM()) return fail(res, "\u041D\u0443\u0436\u0435\u043D \u043A\u043B\u044E\u0447 \u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u0438");
  const ev = m.events.map((e) => `${e.min}:${String(e.sec).padStart(2, "0")} [${e.type}] ${e.team} ${e.players.join(" / ")} \u2014 ${e.text}${e.xg ? ` (xG ${e.xg})` : ""}`).join("\n");
  const st = m.stats, H = m.ctx.sides.home.name, A = m.ctx.sides.away.name;
  const sys = "\u0422\u044B \u2014 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440\u0430 \xAB\u0412\u0438\u0440\u0442 \u0420\u041F\u041B\xBB. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u043D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0430\u0434\u043C\u0438\u043D\u0430 \u0422\u041E\u041B\u042C\u041A\u041E \u043F\u043E \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u0434\u0430\u043D\u043D\u044B\u043C \u043C\u0430\u0442\u0447\u0430 (\u0441\u043E\u0431\u044B\u0442\u0438\u044F, \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430, \u0441\u043E\u0441\u0442\u0430\u0432\u044B, \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442). \u0421\u0441\u044B\u043B\u0430\u0439\u0441\u044F \u043D\u0430 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0435 \u043C\u0438\u043D\u0443\u0442\u044B \u0438 \u0438\u0433\u0440\u043E\u043A\u043E\u0432. \u0415\u0441\u043B\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0442\u0432\u0435\u0442\u0430 \u043D\u0435\u0442 \u2014 \u0442\u0430\u043A \u0438 \u0441\u043A\u0430\u0436\u0438. \u041F\u0438\u0448\u0438 \u043F\u043E-\u0440\u0443\u0441\u0441\u043A\u0438, \u044F\u0441\u043D\u043E \u0438 \u043F\u043E \u0434\u0435\u043B\u0443.";
  const user = `\u041C\u0410\u0422\u0427 ${H} ${f.hg}:${f.ag} ${A}${f.pen ? ` (\u043F\u0435\u043D. ${f.pen.hg}:${f.pen.ag})` : ""}. ${m.ctx.comp}, ${m.ctx.roundLabel}.
\u041A\u043E\u043D\u0442\u0435\u043A\u0441\u0442: ${m.ctx.motiv.home} | ${m.ctx.motiv.away} | \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435: ${m.ctx.derby} | \u041F\u043E\u0433\u043E\u0434\u0430: ${m.ctx.weather}
\u0423\u0441\u0442\u0430\u043B\u043E\u0441\u0442\u044C: ${m.ctx.fat.home} | ${m.ctx.fat.away}
\u0420\u0435\u0447\u044C ${H}: \xAB${m.ctx.lineup.home.speech || "\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u0435"}\xBB \u0422\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043A\u0438: \xAB${m.ctx.lineup.home.training || "\u2014"}\xBB
\u0420\u0435\u0447\u044C ${A}: \xAB${m.ctx.lineup.away.speech || "\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u0435"}\xBB \u0422\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043A\u0438: \xAB${m.ctx.lineup.away.training || "\u2014"}\xBB
\u0421\u0445\u0435\u043C\u044B: ${m.ctx.lineup.home.formation} / ${m.ctx.lineup.away.formation}
\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430: ${JSON.stringify(st.teams)} \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0435 ${st.poss.join("-")}
\u0418\u0433\u0440\u043E\u043A\u0438: ${Object.values(st.players).map((p) => `${p.n}: ${p.min}', ${p.g}\u0433 ${p.a}\u043F ${p.sh}\u0443\u0434 xG${p.xg} ${p.tk}\u043E\u0442\u0431 ${p.sv}\u0441\u0435\u0439\u0432 ${p.yc}\u0436\u043A ${p.rc}\u043A\u043A`).join("; ")}
\u0421\u041E\u0411\u042B\u0422\u0418\u042F:
${ev}

\u0412\u041E\u041F\u0420\u041E\u0421 \u0410\u0414\u041C\u0418\u041D\u0410: ${req.body.question}`;
  try {
    res.json({ answer: (await llm(sys, user, { json: false, task: "ask", temp: 0.4, max: 4e3 })).trim() });
  } catch (e) {
    fail(res, e.message);
  }
});
app.get("/api/admin/budgets", admin, (req, res) => {
  ensureInitialBudgets();
  const teams = db.teams.map((t) => ({
    id: t.id,
    name: t.name,
    comp: t.comp,
    city: t.city,
    stadium: t.stadium,
    logo: teamLogo(t.id),
    budget: t.budget || 0,
    formattedBudget: "\u20AC" + (t.budget || 0).toLocaleString("ru-RU")
  })).sort((a, b) => {
    if (a.comp === "rpl" && b.comp !== "rpl") return -1;
    if (a.comp !== "rpl" && b.comp === "rpl") return 1;
    return (b.budget || 0) - (a.budget || 0);
  });
  const rplStandings = table("rpl").map((row, idx) => ({
    place: idx + 1,
    teamId: row.id,
    teamName: row.name,
    logo: teamLogo(row.id),
    points: row.pts || 0,
    played: row.p || 0,
    defaultPrize: RPL_PRIZE_SCALE[idx]?.prize || 34e5,
    label: RPL_PRIZE_SCALE[idx]?.label || `${idx + 1} \u043C\u0435\u0441\u0442\u043E`
  }));
  const cupSuggestions = calculateCupPrizeSuggestions();
  res.json({
    teams,
    history: (db.budgetHistory || []).slice(-200).reverse(),
    rplScale: RPL_PRIZE_SCALE,
    cupScale: CUP_PRIZE_SCALE,
    rplStandings,
    cupSuggestions,
    totalLeagueBudget: teams.reduce((acc, t) => acc + (t.budget || 0), 0)
  });
});
app.post("/api/admin/budget/adjust", admin, (req, res) => {
  ensureInitialBudgets();
  const { teamId, amount, mode, reason } = req.body;
  const t = team(teamId);
  if (!t) return fail(res, "\u041A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const numAmt = Number(amount);
  if (isNaN(numAmt)) return fail(res, "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430");
  const prevBudget = t.budget || 0;
  let newBudget = prevBudget;
  let diff = 0;
  if (mode === "set") {
    newBudget = Math.max(0, Math.round(numAmt));
    diff = newBudget - prevBudget;
  } else if (mode === "subtract") {
    diff = -Math.abs(Math.round(numAmt));
    newBudget = Math.max(0, prevBudget + diff);
  } else {
    diff = Math.abs(Math.round(numAmt));
    newBudget = prevBudget + diff;
  }
  t.budget = newBudget;
  const entry = {
    id: uid(),
    teamId: t.id,
    teamName: t.name,
    amount: diff,
    prevBudget,
    newBudget,
    type: "admin_adjustment",
    typeLabel: "\u0420\u0443\u0447\u043D\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u0430\u0434\u043C\u0438\u043D\u0430",
    description: reason || (diff >= 0 ? `\u041F\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0431\u044E\u0434\u0436\u0435\u0442\u0430: +\u20AC${Math.abs(diff).toLocaleString("ru-RU")}` : `\u0421\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0438\u0437 \u0431\u044E\u0434\u0436\u0435\u0442\u0430: -\u20AC${Math.abs(diff).toLocaleString("ru-RU")}`),
    date: (/* @__PURE__ */ new Date()).toISOString(),
    byAdmin: true
  };
  if (!db.budgetHistory) db.budgetHistory = [];
  db.budgetHistory.push(entry);
  save();
  res.json({ ok: 1, newBudget, entry, formattedBudget: "\u20AC" + newBudget.toLocaleString("ru-RU") });
});
app.post("/api/admin/budget/award-prizes", admin, (req, res) => {
  ensureInitialBudgets();
  const { rplAwards, cupAwards, seasonName } = req.body;
  const curSeason = seasonName || db.settings.season || "2026/27";
  let count = 0;
  let totalAwarded = 0;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (Array.isArray(rplAwards)) {
    for (const aw of rplAwards) {
      if (!aw.teamId) continue;
      const t = team(aw.teamId);
      const prize = Number(aw.prize);
      if (!t || isNaN(prize) || prize <= 0) continue;
      const prevBudget = t.budget || 0;
      t.budget = prevBudget + prize;
      const placeText = aw.place ? `${aw.place} \u043C\u0435\u0441\u0442\u043E \u0432 \u0420\u041F\u041B` : "\u041F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u0420\u041F\u041B";
      if (!db.budgetHistory) db.budgetHistory = [];
      db.budgetHistory.push({
        id: uid(),
        teamId: t.id,
        teamName: t.name,
        amount: prize,
        prevBudget,
        newBudget: t.budget,
        type: "rpl_prize",
        typeLabel: "\u041F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u0420\u041F\u041B",
        description: `\u041D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u044B \u043F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u0437\u0430 ${placeText} (\u0421\u0435\u0437\u043E\u043D ${curSeason}): +\u20AC${prize.toLocaleString("ru-RU")}`,
        date: now,
        byAdmin: true
      });
      count++;
      totalAwarded += prize;
    }
  }
  if (Array.isArray(cupAwards)) {
    for (const aw of cupAwards) {
      if (!aw.teamId) continue;
      const t = team(aw.teamId);
      const prize = Number(aw.prize);
      if (!t || isNaN(prize) || prize <= 0) continue;
      const prevBudget = t.budget || 0;
      t.budget = prevBudget + prize;
      const stageText = aw.stageLabel || "\u0423\u0447\u0430\u0441\u0442\u0438\u0435 \u0432 \u041A\u0443\u0431\u043A\u0435 \u0420\u043E\u0441\u0441\u0438\u0438";
      const winsNote = aw.wins ? ` (${aw.wins} \u043F\u043E\u0431\u0435\u0434)` : "";
      if (!db.budgetHistory) db.budgetHistory = [];
      db.budgetHistory.push({
        id: uid(),
        teamId: t.id,
        teamName: t.name,
        amount: prize,
        prevBudget,
        newBudget: t.budget,
        type: "cup_prize",
        typeLabel: "\u041F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438",
        description: `\u041F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438: ${stageText}${winsNote} (\u0421\u0435\u0437\u043E\u043D ${curSeason}): +\u20AC${prize.toLocaleString("ru-RU")}`,
        date: now,
        byAdmin: true
      });
      count++;
      totalAwarded += prize;
    }
  }
  save();
  res.json({
    ok: 1,
    awardedCount: count,
    totalAwarded,
    formattedTotal: "\u20AC" + totalAwarded.toLocaleString("ru-RU"),
    message: `\u0423\u0441\u043F\u0435\u0448\u043D\u043E \u043D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u044B \u043F\u0440\u0438\u0437\u043E\u0432\u044B\u0435 \u0434\u043B\u044F ${count} \u043A\u043B\u0443\u0431\u043E\u0432 \u043D\u0430 \u0441\u0443\u043C\u043C\u0443 \u20AC${totalAwarded.toLocaleString("ru-RU")}!`
  });
});
load();
app.get("/api/admin/referees", admin, (req, res) => {
  const list = [...db.referees || []].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  res.json({ referees: list, assistants: db.assistants || [] });
});
app.post("/api/admin/referees/portfolios-all", admin, async (req, res) => {
  const refs = db.referees || [];
  const assts = db.assistants || [];
  if (hasLLM()) {
    try {
      const refNames = refs.map((r) => `${r.name} (${r.role || "\u0413\u043B\u0430\u0432\u043D\u044B\u0439"}, ${r.city}, ${r.varRole || "\u0431\u0435\u0437 \u0412\u0410\u0420"})`).join("; ");
      const rPrompt = `\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0435 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u0440\u0442\u0440\u0435\u0442\u044B \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0445 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0445 \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u0432: ${refNames}.
\u0414\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0443\u043A\u0430\u0436\u0438: \u043A\u0430\u043A \u0441\u0443\u0434\u0438\u0442 \u0432 \u043F\u043E\u043B\u0435, \u043C\u0430\u043D\u0435\u0440\u0443 \u043E\u0431\u0449\u0435\u043D\u0438\u044F, \u0441\u0442\u0440\u043E\u0433\u043E\u0441\u0442\u044C, \u043A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0412\u0410\u0420 \u0438 \u0410\u0412\u0410\u0420, \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0435 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0430\u0442\u0447\u0438.
\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON: { "items": [ { "name": "\u0418\u043C\u044F \u0424\u0430\u043C\u0438\u043B\u0438\u044F", "bio": "\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u043E\u0440\u0442\u0440\u0435\u0442 3-4 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F" } ] }`;
      const rRes = await llmJSON("\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0443 \u0420\u041F\u041B.", rPrompt, { temp: 0.4, max: 6e3 });
      for (const item of rRes.items || []) {
        const found = refs.find((x) => x.name.toLowerCase() === String(item.name || "").toLowerCase());
        if (found && item.bio) found.bio = String(item.bio);
      }
      const asstNames = assts.map((a) => a.name).join(", ");
      const aPrompt = `\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0435 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u0440\u0442\u0440\u0435\u0442\u044B \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 30 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u043E\u0432 \u0441\u0443\u0434\u044C\u0438 (\u043B\u0430\u0439\u043D\u043E\u0432) \u0420\u041F\u041B: ${asstNames}.
\u0414\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0443\u043A\u0430\u0436\u0438: \u043A\u0430\u043A \u0441\u0443\u0434\u0438\u0442 \u043D\u0430 \u043B\u0438\u043D\u0438\u0438, \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u044F \u043E\u0444\u0441\u0430\u0439\u0434\u043E\u0432, \u043C\u0430\u043D\u0435\u0440\u0443 \u0440\u0430\u0431\u043E\u0442\u044B \u0438 \u0441 \u043A\u0435\u043C \u0438\u0437 \u0433\u043B\u0430\u0432\u043D\u044B\u0445 \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u0432 \u0420\u041F\u041B \u043B\u0443\u0447\u0448\u0435 \u0432\u0441\u0435\u0433\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432 \u0431\u0440\u0438\u0433\u0430\u0434\u0435.
\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON: { "items": [ { "name": "\u0418\u043C\u044F \u0424\u0430\u043C\u0438\u043B\u0438\u044F", "bio": "\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043F\u043E\u0440\u0442\u0440\u0435\u0442 2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F" } ] }`;
      const aRes = await llmJSON("\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0443 \u0420\u041F\u041B.", aPrompt, { temp: 0.4, max: 6e3 });
      for (const item of aRes.items || []) {
        const found = assts.find((x) => x.name.toLowerCase() === String(item.name || "").toLowerCase());
        if (found && item.bio) found.bio = String(item.bio);
      }
      save();
      return res.json({ ok: 1, count: refs.length + assts.length });
    } catch (e) {
      console.error("portfolios-all:", e.message);
    }
  }
  for (const r of refs) {
    r.bio = `${r.name} (${r.city}) \u2014 ${r.role || "\u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440"}. \u0412 \u043F\u043E\u043B\u0435: ${r.styleDesc || r.style}. ${r.varRole ? "\u0410\u043A\u0442\u0438\u0432\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0412\u0410\u0420 \u0438 \u0410\u0412\u0410\u0420, \u043E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u044B \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439." : "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043D\u0430 \u0440\u0430\u0431\u043E\u0442\u0435 \u0432 \u043F\u043E\u043B\u0435."}`;
  }
  for (const a of assts) {
    a.bio = `${a.name} \u2014 \u043A\u0432\u0430\u043B\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0441\u0443\u0434\u044C\u0438 \u0420\u041F\u041B. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0430\u0446\u0438\u0435\u0439 \u043F\u0440\u0438 \u0444\u0438\u043A\u0441\u0430\u0446\u0438\u0438 \u043E\u0444\u0441\u0430\u0439\u0434\u043E\u0432 \u0438 \u0447\u0451\u0442\u043A\u0438\u043C \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435\u043C \u0441 \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u0430\u0440\u0431\u0438\u0442\u0440\u043E\u043C.`;
  }
  save();
  res.json({ ok: 1, count: refs.length + assts.length });
});
app.post("/api/admin/referee", admin, (req, res) => {
  const { id, name, city, age: age2, style, styleDesc, leagues, rating, bio } = req.body;
  if (!name) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0438\u043C\u044F \u0441\u0443\u0434\u044C\u0438");
  if (id) {
    const r = db.referees.find((x) => x.id === id);
    if (!r) return fail(res, "\u0421\u0443\u0434\u044C\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
    Object.assign(r, {
      name,
      city: city || r.city,
      age: Number(age2) || r.age,
      style: style || r.style,
      styleDesc: styleDesc || r.styleDesc,
      leagues: Array.isArray(leagues) ? leagues : r.leagues,
      rating: Number(rating) || r.rating,
      bio: bio ?? r.bio
    });
  } else {
    db.referees.push({
      id: "ref_" + uid(),
      name,
      city: city || "\u041C\u043E\u0441\u043A\u0432\u0430",
      age: Number(age2) || 38,
      style: style || "balanced",
      styleDesc: styleDesc || bio || "\u0418\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u043D\u0435\u0440\u0430 \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0430",
      leagues: Array.isArray(leagues) && leagues.length ? leagues : ["rpl", "cup"],
      rating: Number(rating) || 8,
      matches: 0,
      yellows: 0,
      reds: 0,
      penalties: 0,
      bio: bio || "\u0410\u0440\u0431\u0438\u0442\u0440 \u0420\u041F\u041B \u0438 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438."
    });
  }
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/fixture/referee", admin, (req, res) => {
  const f = fx(req.body.fid);
  if (!f) return fail(res, "\u041C\u0430\u0442\u0447 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  if (f.comp !== "rpl" && f.comp !== "cup") {
    return fail(res, "\u0410\u0440\u0431\u0438\u0442\u0440\u044B \u043D\u0430\u0437\u043D\u0430\u0447\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u043C\u0430\u0442\u0447\u0438 \u0420\u041F\u041B \u0438 \u041A\u0443\u0431\u043A\u0430 \u0420\u043E\u0441\u0441\u0438\u0438");
  }
  const r = db.referees.find((x) => x.id === req.body.refereeId);
  if (!r) return fail(res, "\u0421\u0443\u0434\u044C\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const tourKey = getFixtureTourKey(f);
  const conflict = (db.fixtures || []).find((x) => x.id !== f.id && getFixtureTourKey(x) === tourKey && x.refereeId === r.id);
  if (conflict) {
    return fail(res, `\u0410\u0440\u0431\u0438\u0442\u0440 ${r.name} \u0443\u0436\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D \u0433\u043B\u0430\u0432\u043D\u044B\u043C \u043D\u0430 \u043C\u0430\u0442\u0447 \xAB${tn(conflict.home)} \u2014 ${tn(conflict.away)}\xBB \u0432 \u044D\u0442\u043E\u043C \u0442\u0443\u0440\u0435! \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0431\u0438\u0442\u0440 \u043C\u043E\u0436\u0435\u0442 \u0441\u0443\u0434\u0438\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E 1 \u043C\u0430\u0442\u0447 \u0432 \u0442\u0443\u0440\u0435.`);
  }
  f.refereeId = r.id;
  f.refereeName = r.name;
  save();
  res.json({ ok: 1, refereeName: r.name });
});
app.post("/api/admin/referee/portfolio", admin, async (req, res) => {
  const r = db.referees.find((x) => x.id === req.body.refereeId);
  if (!r) return fail(res, "\u0421\u0443\u0434\u044C\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  if (hasLLM()) {
    try {
      const sys = "\u0422\u044B \u2014 \u043E\u043F\u044B\u0442\u043D\u044B\u0439 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A \u0438 \u0438\u043D\u0441\u043F\u0435\u043A\u0442\u043E\u0440 \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u0430 \u0420\u0424\u0421. \u041F\u0438\u0448\u0438 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E, \u0436\u0438\u0432\u044B\u043C \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u043C \u044F\u0437\u044B\u043A\u043E\u043C, \u0431\u0435\u0437 \u043A\u0430\u043D\u0446\u0435\u043B\u044F\u0440\u0438\u0442\u0430 \u0438 \u0431\u0430\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u044F\u0440\u043B\u044B\u043A\u043E\u0432 \u0432\u0440\u043E\u0434\u0435 \xAB\u0441\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439\xBB \u0438\u043B\u0438 \xAB\u0440\u043E\u0432\u043D\u043E\u0435 \u0441\u0443\u0434\u0435\u0439\u0441\u0442\u0432\u043E\xBB.";
      const prompt = `\u041D\u0430\u0439\u0434\u0438 \u0432 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435 \u0440\u0435\u0430\u043B\u044C\u043D\u0443\u044E \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u043C \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u043E\u043C \u0430\u0440\u0431\u0438\u0442\u0440\u0435: ${r.name} (\u0433\u043E\u0440\u043E\u0434: ${r.city}, \u043B\u0438\u0433\u0438: ${(r.leagues || []).join(", ").toUpperCase()}).
\u041F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u044C \u044D\u0442\u043E\u0433\u043E \u0430\u0440\u0431\u0438\u0442\u0440\u0430 \u0442\u0430\u043A, \u043A\u0430\u043A \u0431\u0443\u0434\u0442\u043E \u0442\u044B \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0448\u044C \u043E \u043D\u0451\u043C \u0442\u0440\u0435\u043D\u0435\u0440\u0443 \u0438\u043B\u0438 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u043C\u0443 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0443 \u043F\u0435\u0440\u0435\u0434 \u0432\u0430\u0436\u043D\u044B\u043C \u043C\u0430\u0442\u0447\u0435\u043C.
\u041D\u0430\u043F\u0438\u0448\u0438 \u0431\u043E\u043B\u044C\u0448\u043E\u0439, \u043E\u0441\u043C\u044B\u0441\u043B\u0435\u043D\u043D\u044B\u0439 \u0438 \u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0430\u0441\u0441\u043A\u0430\u0437 (\u043D\u0435 \u043C\u0435\u043D\u0435\u0435 15 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0445 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439!) \u043E \u0442\u043E\u043C, \u043A\u0442\u043E \u044D\u0442\u043E\u0442 \u0441\u0443\u0434\u044C\u044F \u0438 \u043A\u0430\u043A \u0438\u043C\u0435\u043D\u043D\u043E \u043E\u043D \u0441\u0443\u0434\u0438\u0442 \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0439 \u0436\u0438\u0437\u043D\u0438:
1. \u041A\u0430\u043A\u043E\u0439 \u043E\u043D \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 (\u0424\u0418\u0424\u0410, \u0432\u0441\u0435\u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0430\u044F, \u043F\u0435\u0440\u0432\u0430\u044F \u0438 \u0442.\u0434.), \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0442 \u0441\u0443\u0434\u0438\u0442 \u043D\u0430 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u043C \u0443\u0440\u043E\u0432\u043D\u0435 \u0438 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u043C\u0430\u0442\u0447\u0435\u0439 \u043E\u0442\u0441\u0443\u0434\u0438\u043B \u0432 \u0420\u041F\u041B, \u0424\u041D\u041B \u0438 \u041A\u0443\u0431\u043A\u0435 \u0420\u043E\u0441\u0441\u0438\u0438.
2. \u041A\u0430\u043A \u043E\u043D \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0435\u0442 \u0438\u0433\u0440\u0443: \u0434\u0435\u0440\u0436\u0438\u0442 \u043B\u0438 \u043D\u0438\u0442\u044C \u043C\u0430\u0442\u0447\u0430 \u0432 \u0440\u0443\u043A\u0430\u0445 \u0438\u043B\u0438 \u043F\u043E\u0440\u043E\u0439 \u0442\u0435\u0440\u044F\u0435\u0442 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C, \u043A\u0430\u043A \u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043D\u0430 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043F \u0438 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0442\u0440\u0438\u0431\u0443\u043D.
3. \u041A\u0430\u043A\u0430\u044F \u0443 \u043D\u0435\u0433\u043E \u043F\u043B\u0430\u043D\u043A\u0430 \u0444\u043E\u043B\u043E\u0432: \u0434\u0430\u0451\u0442 \u043B\u0438 \u0432\u0435\u0441\u0442\u0438 \u0436\u0451\u0441\u0442\u043A\u0443\u044E \u0441\u0438\u043B\u043E\u0432\u0443\u044E \u0431\u043E\u0440\u044C\u0431\u0443 \u0438\u043B\u0438 \u0441\u0432\u0438\u0441\u0442\u0438\u0442 \u043C\u0430\u043B\u0435\u0439\u0448\u0438\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B, \u043A\u0430\u043A \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A \u0442\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0444\u043E\u043B\u0430\u043C \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043F\u043E\u043B\u044F.
4. \u041A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0441 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438: \u0447\u0430\u0441\u0442\u043E \u043B\u0438 \u0434\u043E\u0441\u0442\u0430\u0451\u0442 \u0436\u0451\u043B\u0442\u044B\u0435 \u0438 \u043A\u0440\u0430\u0441\u043D\u044B\u0435, \u043F\u043E\u0441\u043F\u0435\u0448\u043D\u044B\u0435 \u043B\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u0438\u043B\u0438 \u0434\u043E\u043B\u0433\u043E \u0442\u0435\u0440\u043F\u0438\u0442, \u043A\u0430\u043A \u043D\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0437\u0430 \u0441\u043F\u043E\u0440\u044B, \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u0438 \u0438 \u0437\u0430\u0442\u044F\u0436\u043A\u0443 \u0432\u0440\u0435\u043C\u0435\u043D\u0438.
5. \u041A\u0430\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u0432 \u0448\u0442\u0440\u0430\u0444\u043D\u043E\u0439 \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u0438 \u0441 \u0412\u0410\u0420: \u043E\u0445\u043E\u0442\u043D\u043E \u043B\u0438 \u0441\u0442\u0430\u0432\u0438\u0442 \u043F\u0435\u043D\u0430\u043B\u044C\u0442\u0438, \u043B\u044E\u0431\u0438\u0442 \u043B\u0438 \u0436\u0434\u0430\u0442\u044C \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043E\u043A \u0412\u0410\u0420 \u0443 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0430 \u0438\u043B\u0438 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0440\u0435\u0448\u0430\u0435\u0442 \u0441\u0430\u043C.
6. \u041A\u0430\u043A\u0438\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0435 \u043C\u0430\u0442\u0447\u0438 \u0438\u043B\u0438 \u0440\u0435\u0437\u043E\u043D\u0430\u043D\u0441\u043D\u044B\u0435 \u044D\u043F\u0438\u0437\u043E\u0434\u044B \u0431\u044B\u043B\u0438 \u0432 \u0435\u0433\u043E \u043A\u0430\u0440\u044C\u0435\u0440\u0435, \u0438 \u043A\u0430\u043A \u043E\u043D \u043E\u0431\u0449\u0430\u0435\u0442\u0441\u044F \u0441 \u0438\u0433\u0440\u043E\u043A\u0430\u043C\u0438 \u0438 \u0442\u0440\u0435\u043D\u0435\u0440\u0430\u043C\u0438 \u0443 \u0431\u0440\u043E\u0432\u043A\u0438.`;
      const bio = await llm(sys, prompt, { json: false, task: "referee_portfolio", temp: 0.5, max: 2500, grounded: true });
      r.bio = bio.trim();
      save();
      return res.json({ ok: 1, bio: r.bio });
    } catch (e) {
      console.error("referee/portfolio:", e.message);
      return fail(res, "\u041E\u0448\u0438\u0431\u043A\u0430 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043F\u043E\u0440\u0442\u0440\u0435\u0442\u0430: " + e.message);
    }
  }
  return fail(res, "\u041D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D \u043A\u043B\u044E\u0447 \u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u0438 \u0434\u043B\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043F\u043E\u0440\u0442\u0440\u0435\u0442\u0430");
});
app.post("/api/admin/referees/assign-round", admin, (req, res) => {
  const { comp, label, round } = req.body || {};
  if (!comp) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0442\u0443\u0440\u043D\u0438\u0440");
  const matches = seasonFx().filter(
    (f) => f.comp === comp && f.status !== "done" && (label ? f.label === label : round !== void 0 ? String(f.round) === String(round) : true)
  );
  if (!matches.length) return fail(res, "\u041D\u0435\u0442 \u0437\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u043C\u0430\u0442\u0447\u0435\u0439 \u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u043C \u0442\u0443\u0440\u0435");
  assignTourReferees(matches);
  save();
  res.json({ ok: 1, count: matches.length });
});
function getMediaCupGroups() {
  const mFx = seasonFx().filter((f) => f.comp === "media_cup" && !f.cupStage);
  const groups = { A: [], B: [], C: [], D: [] };
  for (const gid of ["A", "B", "C", "D"]) {
    const gFx = mFx.filter((f) => f.group === gid);
    const ids = [...new Set(gFx.flatMap((f) => [f.home, f.away]).filter(Boolean))];
    const R = {};
    ids.forEach((id) => {
      const tm = team(id);
      R[id] = { id, name: tn(id), logo: teamLogo(id), colors: getTeamColors(tm?.name || ""), p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] };
    });
    for (const f of gFx.filter((x) => x.status === "done")) {
      for (const [tid, gf, ga] of [[f.home, f.hg, f.ag], [f.away, f.ag, f.hg]]) {
        const r = R[tid];
        if (!r) continue;
        r.p++;
        r.gf += gf;
        r.ga += ga;
        if (gf > ga) {
          r.w++;
          r.pts += 3;
          r.form.push("\u0412");
        } else if (gf === ga) {
          r.d++;
          r.pts++;
          r.form.push("\u041D");
        } else {
          r.l++;
          r.form.push("\u041F");
        }
      }
    }
    const rows = Object.values(R).sort((a, b) => b.pts - a.pts || b.w - a.w || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
    rows.forEach((r, i) => {
      r.pos = i + 1;
      r.gd = r.gf - r.ga;
      r.form = r.form.slice(-5).join("");
      if (r.pos === 1) {
        r.zone = "zone-cl";
        r.zoneLabel = "\u041F\u043B\u0435\u0439-\u043E\u0444\u0444 (1/4)";
      } else if (r.pos === 2 || r.pos === 3) {
        r.zone = "zone-el";
        r.zoneLabel = "\u0421\u0442\u044B\u043A\u0438";
      }
    });
    groups[gid] = rows;
  }
  return groups;
}
function advanceMediaCupPlayoffs() {
  const allMc = seasonFx().filter((f) => f.comp === "media_cup");
  if (!allMc.length) return;
  const groupFx = allMc.filter((f) => !f.cupStage);
  if (!groupFx.length || groupFx.some((f) => f.status !== "done")) return;
  const season = S();
  const winnerOf2 = (f) => {
    if (!f || f.status !== "done") return null;
    if (f.hg > f.ag) return f.home;
    if (f.ag > f.hg) return f.away;
    if (f.penHome != null && f.penAway != null) return f.penHome > f.penAway ? f.home : f.away;
    return f.home;
  };
  let playIn = allMc.filter((f) => f.cupStage === "playin");
  if (!playIn.length) {
    const g = getMediaCupGroups();
    if (g.A.length >= 3 && g.B.length >= 3 && g.C.length >= 3 && g.D.length >= 3) {
      const pairs = [
        { home: g.B[1].id, away: g.C[2].id, label: "\u0421\u0442\u044B\u043A\u0438 \u0437\u0430 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444 \xB7 \u041C\u0430\u0442\u0447 1 (2B \u2014 3C)" },
        { home: g.C[1].id, away: g.D[2].id, label: "\u0421\u0442\u044B\u043A\u0438 \u0437\u0430 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444 \xB7 \u041C\u0430\u0442\u0447 2 (2C \u2014 3D)" },
        { home: g.D[1].id, away: g.A[2].id, label: "\u0421\u0442\u044B\u043A\u0438 \u0437\u0430 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444 \xB7 \u041C\u0430\u0442\u0447 3 (2D \u2014 3A)" },
        { home: g.A[1].id, away: g.B[2].id, label: "\u0421\u0442\u044B\u043A\u0438 \u0437\u0430 \u043F\u043B\u0435\u0439-\u043E\u0444\u0444 \xB7 \u041C\u0430\u0442\u0447 4 (2A \u2014 3B)" }
      ];
      const lastDate = groupFx.map((f) => f.date).sort().pop() || "2026-10-01";
      pairs.forEach((p, idx) => {
        db.fixtures.push({
          id: uid(),
          season,
          comp: "media_cup",
          round: 11,
          cupStage: "playin",
          label: p.label,
          date: addDays(lastDate, 7),
          time: "19:00",
          home: p.home,
          away: p.away,
          status: "scheduled",
          hg: null,
          ag: null,
          pos: idx + 1
        });
      });
      save();
      playIn = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "playin");
    }
  }
  if (!playIn.length || playIn.some((f) => f.status !== "done")) return;
  let qf = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "qf");
  if (!qf.length) {
    const g = getMediaCupGroups();
    const w1 = winnerOf2(playIn[0]), w2 = winnerOf2(playIn[1]), w3 = winnerOf2(playIn[2]), w4 = winnerOf2(playIn[3]);
    if (w1 && w2 && w3 && w4) {
      const pairs = [
        { home: g.A[0].id, away: w1, label: "1/4 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 1 (1A \u2014 \u041F\u043E\u0431. 2B/3C)" },
        { home: g.B[0].id, away: w2, label: "1/4 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 2 (1B \u2014 \u041F\u043E\u0431. 2C/3D)" },
        { home: g.C[0].id, away: w3, label: "1/4 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 3 (1C \u2014 \u041F\u043E\u0431. 2D/3A)" },
        { home: g.D[0].id, away: w4, label: "1/4 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 4 (1D \u2014 \u041F\u043E\u0431. 2A/3B)" }
      ];
      const lastDate = playIn.map((f) => f.date).sort().pop() || "2026-10-08";
      pairs.forEach((p, idx) => {
        db.fixtures.push({
          id: uid(),
          season,
          comp: "media_cup",
          round: 12,
          cupStage: "qf",
          label: p.label,
          date: addDays(lastDate, 7),
          time: "19:00",
          home: p.home,
          away: p.away,
          status: "scheduled",
          hg: null,
          ag: null,
          pos: idx + 1
        });
      });
      save();
      qf = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "qf");
    }
  }
  if (!qf.length || qf.some((f) => f.status !== "done")) return;
  let sf = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "sf");
  if (!sf.length) {
    const w1 = winnerOf2(qf[0]), w2 = winnerOf2(qf[1]), w3 = winnerOf2(qf[2]), w4 = winnerOf2(qf[3]);
    if (w1 && w2 && w3 && w4) {
      const lastDate = qf.map((f) => f.date).sort().pop() || "2026-10-15";
      [
        { home: w1, away: w2, label: "1/2 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 1" },
        { home: w3, away: w4, label: "1/2 \u0444\u0438\u043D\u0430\u043B\u0430 \xB7 \u041C\u0430\u0442\u0447 2" }
      ].forEach((p, idx) => {
        db.fixtures.push({
          id: uid(),
          season,
          comp: "media_cup",
          round: 13,
          cupStage: "sf",
          label: p.label,
          date: addDays(lastDate, 7),
          time: "19:00",
          home: p.home,
          away: p.away,
          status: "scheduled",
          hg: null,
          ag: null,
          pos: idx + 1
        });
      });
      save();
      sf = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "sf");
    }
  }
  if (!sf.length || sf.some((f) => f.status !== "done")) return;
  const fin = seasonFx().filter((f) => f.comp === "media_cup" && f.cupStage === "final");
  if (!fin.length) {
    const w1 = winnerOf2(sf[0]), w2 = winnerOf2(sf[1]);
    if (w1 && w2) {
      const lastDate = sf.map((f) => f.date).sort().pop() || "2026-10-22";
      db.fixtures.push({
        id: uid(),
        season,
        comp: "media_cup",
        round: 14,
        cupStage: "final",
        label: "\u0424\u0438\u043D\u0430\u043B Winline \u041A\u0443\u0431\u043A\u0430 \u041B\u0438\u0433\u0438",
        date: addDays(lastDate, 7),
        time: "20:00",
        home: w1,
        away: w2,
        status: "scheduled",
        hg: null,
        ag: null,
        pos: 1
      });
      save();
    }
  }
}
app.get("/api/media_cup/structure", (req, res) => {
  advanceMediaCupPlayoffs();
  const groups = getMediaCupGroups();
  const allMc = seasonFx().filter((f) => f.comp === "media_cup");
  const enrich = (f) => ({
    ...f,
    homeName: tn(f.home),
    awayName: tn(f.away),
    homeLogo: teamLogo(f.home),
    awayLogo: teamLogo(f.away)
  });
  res.json({
    groups,
    playIn: allMc.filter((f) => f.cupStage === "playin").map(enrich),
    quarterfinals: allMc.filter((f) => f.cupStage === "qf").map(enrich),
    semifinals: allMc.filter((f) => f.cupStage === "sf").map(enrich),
    final: allMc.filter((f) => f.cupStage === "final").map(enrich)
  });
});
app.get("/api/admin/coaches", admin, (req, res) => {
  res.json({
    coaches: (db.staff || []).filter((s) => s.role === "head"),
    staff: db.staff || [],
    roles: STAFF_ROLES
  });
});
app.post("/api/admin/coach", admin, async (req, res) => {
  const { name, role = "head", teamId = "", age: reqAge, nationality: reqNat, specialty: reqSpec, favoriteFormation = "4-3-3", bio: reqBio, style: reqStyle } = req.body;
  if (!name) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0424\u0418\u041E \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430");
  if (!db.staff) db.staff = [];
  const validRole = ["head", "assistant", "gk", "fitness", "attack", "doctor"].includes(role) ? role : "head";
  const roleMeta = STAFF_ROLES[validRole] || STAFF_ROLES.head;
  let age2 = Number(reqAge) || 45;
  let nat = reqNat ? String(reqNat).trim() : "\u0420\u043E\u0441\u0441\u0438\u044F";
  let specialty = reqSpec ? String(reqSpec).trim() : roleMeta.desc;
  let bio = reqBio ? String(reqBio).trim() : "";
  if (hasLLM() && !bio) {
    try {
      const tm2 = team(teamId);
      const prompt = `\u0421\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430 \u043D\u0430 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C "${roleMeta.title}" (${name})${tm2 ? ` \u0432 \u043A\u043B\u0443\u0431 "${tm2.name}"` : ""}.
\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438 \u0435\u0433\u043E \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u044B\u0439 \u0432\u043E\u0437\u0440\u0430\u0441\u0442 (\u0447\u0438\u0441\u043B\u043E), \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u0442\u0432\u043E (\u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C), \u0443\u0437\u043A\u0443\u044E \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044E (1 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435) \u0438 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043E\u043F\u044B\u0442/\u0431\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044E (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F).
\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON: { "age": 46, "nat": "\u0420\u043E\u0441\u0441\u0438\u044F", "specialty": "...", "bio": "..." }`;
      const info = await llmJSON("\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u0430\u044F \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F \u044D\u043D\u0446\u0438\u043A\u043B\u043E\u043F\u0435\u0434\u0438\u044F.", prompt, { temp: 0.4, max: 500 });
      if (info.age) age2 = Number(info.age) || age2;
      if (info.nat) nat = String(info.nat);
      if (info.specialty) specialty = String(info.specialty);
      if (info.bio) bio = String(info.bio);
    } catch {
    }
  }
  const tm = team(teamId);
  const member = {
    id: "staff_" + uid(),
    name: String(name).trim(),
    role: validRole,
    roleTitle: roleMeta.title,
    teamId: teamId || "",
    teamName: tm ? tm.name : "",
    age: age2,
    nationality: nat,
    specialty,
    favoriteFormation: validRole === "head" ? favoriteFormation || "4-3-3" : void 0,
    style: validRole === "head" ? reqStyle || "possession" : void 0,
    styleTitle: validRole === "head" ? "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C" : void 0,
    bio: bio || `${name} \u2014 ${roleMeta.title.toLowerCase()}${tm ? ` \u043A\u043B\u0443\u0431\u0430 \xAB${tm.name}\xBB` : ""}. ${specialty}.`
  };
  db.staff.push(member);
  save();
  res.json({ ok: 1, coach: member, member });
});
app.post("/api/admin/coach/assign", admin, (req, res) => {
  const { coachId, teamId, role } = req.body;
  const c = (db.staff || []).find((x) => x.id === coachId);
  if (!c) return fail(res, "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  c.teamId = teamId || "";
  const tm = team(teamId);
  c.teamName = tm ? tm.name : "";
  if (role && ["head", "assistant", "gk", "fitness", "attack", "doctor"].includes(role)) {
    c.role = role;
    c.roleTitle = STAFF_ROLES[role]?.title || c.roleTitle;
  }
  save();
  res.json({ ok: 1, coach: c, member: c });
});
app.post("/api/admin/coach/update", admin, (req, res) => {
  const { id, name, role, teamId, age: age2, nationality, specialty, favoriteFormation, bio } = req.body;
  const c = (db.staff || []).find((x) => x.id === id);
  if (!c) return fail(res, "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  if (name) c.name = String(name).trim();
  if (role && ["head", "assistant", "gk", "fitness", "attack", "doctor"].includes(role)) {
    c.role = role;
    c.roleTitle = STAFF_ROLES[role]?.title || c.roleTitle;
  }
  if (teamId !== void 0) {
    c.teamId = teamId || "";
    const tm = team(teamId);
    c.teamName = tm ? tm.name : "";
  }
  if (age2) c.age = Number(age2) || c.age;
  if (nationality) c.nationality = String(nationality).trim();
  if (specialty) c.specialty = String(specialty).trim();
  if (favoriteFormation && c.role === "head") c.favoriteFormation = String(favoriteFormation).trim();
  if (bio) c.bio = String(bio).trim();
  save();
  res.json({ ok: 1, coach: c, member: c });
});
app.post("/api/admin/coach/delete", admin, (req, res) => {
  const { id } = req.body;
  const idx = (db.staff || []).findIndex((x) => x.id === id);
  if (idx < 0) return fail(res, "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  db.staff.splice(idx, 1);
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/club/custom", admin, (req, res) => {
  const { name, city, country } = req.body;
  if (!name) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043B\u0443\u0431\u0430");
  const nm = String(name).trim();
  const existing = db.teams.find((t) => t.name.toLowerCase() === nm.toLowerCase());
  if (existing) return res.json({ ok: 1, team: existing });
  const newTeam = {
    id: "tm_" + uid(),
    name: nm,
    comp: "friendly",
    city: String(city || "").trim(),
    country: String(country || "").trim(),
    lat: null,
    lon: null,
    stadium: "",
    logo: getTeamLogo(nm, "", "friendly"),
    code: Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
  };
  db.teams.push(newTeam);
  save();
  res.json({ ok: 1, team: newTeam });
});
app.get("/api/tournaments", (req, res) => {
  res.json({ tournaments: db.tournaments || [] });
});
app.post("/api/admin/tournament", admin, (req, res) => {
  const { name, pauseType, country, city, startDate, teamIds } = req.body;
  if (!name || !country || !city || !startDate) return fail(res, "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435, \u0441\u0442\u0440\u0430\u043D\u0443, \u0433\u043E\u0440\u043E\u0434 \u0438 \u0434\u0430\u0442\u0443");
  const teams = Array.isArray(teamIds) ? teamIds.filter((id) => team(id)) : [];
  if (teams.length < 2) return fail(res, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u043A\u043E\u043C\u0430\u043D\u0434\u044B");
  const tid = "trn_" + uid();
  const compId = "tournament_" + tid;
  const trn = {
    id: tid,
    compId,
    name: String(name).trim(),
    pauseType: pauseType === "winter" ? "winter" : "summer",
    country: String(country).trim(),
    city: String(city).trim(),
    startDate,
    teamIds: teams,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.tournaments.push(trn);
  const arr = [...teams];
  if (arr.length % 2) arr.push(null);
  const n = arr.length;
  let dayOffset = 0;
  for (let k = 0; k < n - 1; k++) {
    const matchDate = addDays(startDate, dayOffset);
    let slot = 0;
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i], b = arr[n - 1 - i];
      if (a && b) {
        const fxObj = {
          id: uid(),
          season: S(),
          comp: compId,
          round: k + 1,
          date: matchDate,
          time: ["14:00", "17:00", "19:30"][slot % 3],
          home: k % 2 ? b : a,
          away: k % 2 ? a : b,
          status: "scheduled",
          hg: null,
          ag: null,
          pos: 0,
          tournamentName: trn.name,
          venue: `${trn.city}, ${trn.country}`
        };
        assignReferee(fxObj);
        db.fixtures.push(fxObj);
        slot++;
      }
    }
    arr.splice(1, 0, arr.pop());
    dayOffset += 3;
  }
  save();
  res.json({ ok: 1, tournament: trn });
});
app.delete("/api/admin/tournament/:id", admin, (req, res) => {
  const trn = db.tournaments.find((x) => x.id === req.params.id);
  if (!trn) return fail(res, "\u0422\u0443\u0440\u043D\u0438\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  db.tournaments = db.tournaments.filter((x) => x.id !== req.params.id);
  db.fixtures = db.fixtures.filter((f) => f.comp !== trn.compId);
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/transfer/direct", admin, (req, res) => {
  const { pid, toTeamId, transferType, fee, force } = req.body;
  const p = player(pid);
  const toTeam = team(toTeamId);
  if (!p || !toTeam) return fail(res, "\u0418\u0433\u0440\u043E\u043A \u0438\u043B\u0438 \u043A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const fromTeamId = p.teamId;
  const fromTeam = team(fromTeamId);
  const feeStr = String(fee || "\u20AC5.0M").trim();
  const feeNum = parseFeeAmount(feeStr);
  const loanMap = {
    "loan_0.5": "\u0410\u0440\u0435\u043D\u0434\u0430 (0.5 \u0433\u043E\u0434\u0430)",
    "loan_1": "\u0410\u0440\u0435\u043D\u0434\u0430 (1 \u0433\u043E\u0434)",
    "loan_1.5": "\u0410\u0440\u0435\u043D\u0434\u0430 (1.5 \u0433\u043E\u0434\u0430)",
    "loan_2": "\u0410\u0440\u0435\u043D\u0434\u0430 (2 \u0433\u043E\u0434\u0430)"
  };
  const isLoan = !!loanMap[transferType];
  const note = loanMap[transferType] || "\u041F\u043E\u043B\u043D\u043E\u0446\u0435\u043D\u043D\u044B\u0439 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440";
  const isRplToRpl = fromTeam?.comp === "rpl" && toTeam?.comp === "rpl";
  const trObj = {
    id: uid(),
    pid: p.id,
    playerName: p.name,
    pos: p.pos || "\u0426\u041F",
    from: fromTeamId || "free_agent",
    fromName: fromTeam?.name || "\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u0430\u0433\u0435\u043D\u0442",
    to: toTeamId,
    toName: toTeam.name,
    fee: feeStr,
    feeAmount: feeNum,
    type: isLoan ? "loan" : "transfer",
    note,
    status: "pending",
    isRplToRpl,
    adminApproval: "approved",
    clubApproval: isRplToRpl && !force ? "pending" : "approved",
    clubApprovedBy: fromTeamId,
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    byAdmin: true
  };
  db.transfers.unshift(trObj);
  if (!isRplToRpl || force) {
    executeTransferIfBothApproved(trObj);
    save();
    return res.json({
      ok: 1,
      executed: true,
      player: p,
      transfer: trObj,
      message: `\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440 \u0438\u0433\u0440\u043E\u043A\u0430 ${p.name} \u0432 \xAB${toTeam.name}\xBB (${feeStr}) \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D.`
    });
  }
  save();
  res.json({
    ok: 1,
    executed: false,
    pendingClub: true,
    transfer: trObj,
    message: `\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0430 ${isLoan ? "\u0430\u0440\u0435\u043D\u0434\u0443" : "\u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440"} \u0438\u0433\u0440\u043E\u043A\u0430 ${p.name} (${feeStr}) \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0443 \xAB${fromTeam?.name}\xBB. \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0441\u043E\u0441\u0442\u043E\u0438\u0442\u0441\u044F \u043F\u0440\u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0438 \u043A\u043B\u0443\u0431\u0430.`
  });
});
function ensureNationalTeam() {
  db.nationalTeam ||= {
    current: {
      title: "\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0430\u044F \u043F\u0430\u0443\u0437\u0430 \u043D\u0430 \u043C\u0430\u0442\u0447\u0438 \u0441\u0431\u043E\u0440\u043D\u044B\u0445",
      stage: "extended",
      extended: [],
      final: [],
      matches: []
    },
    archive: []
  };
  return db.nationalTeam;
}
function enrichNationalBreak(brk) {
  const enrichIds = (ids) => (ids || []).map((id) => {
    const p = player(id);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      pos: p.pos,
      teamId: p.teamId,
      teamName: tn(p.teamId),
      teamLogo: teamLogo(p.teamId),
      ovr: p.ovr || 70,
      goals: p.goals || 0,
      assists: p.assists || 0,
      matches: p.matches || 0,
      rating: p.rating || 0
    };
  }).filter(Boolean);
  const matches = (brk.matches || []).map((m) => ({
    ...m,
    russiaLogo: "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
    opponentLogo: teamLogo(m.opponent)
  }));
  return {
    ...brk,
    teamLogo: "/assets/aistudio/russia_russia-national-team.football-logos.cc_2a5e3ddc.svg",
    matches,
    extendedPlayers: enrichIds(brk.extended),
    finalPlayers: enrichIds(brk.final)
  };
}
app.get("/api/national", (req, res) => {
  const nt = ensureNationalTeam();
  const nationalBreaks = (db.internationalBreaks || DEFAULT_INTERNATIONAL_BREAKS).filter((b) => b.id.startsWith("ib_"));
  res.json({
    current: enrichNationalBreak(nt.current),
    archive: (nt.archive || []).map(enrichNationalBreak),
    breaks: nationalBreaks
  });
});
app.post("/api/admin/national/generate", admin, async (req, res) => {
  const nt = ensureNationalTeam();
  const stage = req.body.stage === "final" ? "final" : "extended";
  const count = stage === "final" ? 25 : 40;
  if (req.body.title) nt.current.title = String(req.body.title).trim();
  let pool = db.players.filter((p) => !p.nat || p.nat === "RUS" || p.nat === "\u0420\u043E\u0441\u0441\u0438\u044F");
  if (stage === "final" && nt.current.extended?.length >= 25) {
    const extSet = new Set(nt.current.extended);
    pool = pool.filter((p) => extSet.has(p.id));
  }
  const sortedPool = [...pool].sort(
    (a, b) => (b.rating || 0) * 10 + (b.goals || 0) * 3 + (b.assists || 0) * 2 + (b.ovr || 70) * 0.2 - ((a.rating || 0) * 10 + (a.goals || 0) * 3 + (a.assists || 0) * 2 + (a.ovr || 70) * 0.2)
  );
  let chosenIds = [];
  if (hasLLM() && sortedPool.length > 0) {
    try {
      const candidates = sortedPool.slice(0, 75).map(
        (p) => `${p.id}|${p.name}|${p.pos}|${tn(p.teamId)}|OVR:${p.ovr || 70}|\u041C:${p.matches || 0}|\u0413:${p.goals || 0}|\u041F:${p.assists || 0}|\u0420\u0435\u0439\u0442:${Number(p.rating || 0).toFixed(2)}`
      ).join("\n");
      const sys = "\u0422\u044B \u2014 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u0442\u0440\u0435\u043D\u0435\u0440 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438 \u043F\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0443. \u0412\u044B\u0431\u0438\u0440\u0430\u0439 \u0441\u043E\u0441\u0442\u0430\u0432 \u0441\u0442\u0440\u043E\u0433\u043E \u043F\u043E \u043F\u043E\u0437\u0438\u0446\u0438\u0438 (\u043C\u0438\u043D\u0438\u043C\u0443\u043C 3 \u0432\u0440\u0430\u0442\u0430\u0440\u044F, 8 \u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u043E\u0432, 8 \u043F\u043E\u043B\u0443\u0437\u0430\u0449\u0438\u0442\u043D\u0438\u043A\u043E\u0432, 4 \u043D\u0430\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445) \u0438 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u0438\u0433\u0440\u043E\u0432\u043E\u0439 \u0444\u043E\u0440\u043C\u0435/\u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0435.";
      const prompt = `\u0421\u0444\u043E\u0440\u043C\u0438\u0440\u0443\u0439 ${stage === "final" ? "\u0418\u0422\u041E\u0413\u041E\u0412\u042B\u0419 \u0441\u043E\u0441\u0442\u0430\u0432 (\u0440\u043E\u0432\u043D\u043E 25 \u0438\u0433\u0440\u043E\u043A\u043E\u0432)" : "\u0420\u0410\u0421\u0428\u0418\u0420\u0415\u041D\u041D\u042B\u0419 \u0441\u043E\u0441\u0442\u0430\u0432 (\u0440\u043E\u0432\u043D\u043E 40 \u0438\u0433\u0440\u043E\u043A\u043E\u0432)"} \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u0420\u043E\u0441\u0441\u0438\u0438 \u043D\u0430 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0443\u044E \u043F\u0430\u0443\u0437\u0443 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u043A\u0430\u043D\u0434\u0438\u0434\u0430\u0442\u043E\u0432:
${candidates}

\u0412\u0435\u0440\u043D\u0438 JSON: {"ids": ["id1", "id2", ...]}`;
      const raw = await llm(sys, prompt, { json: true, task: "national_squad", temp: 0.3, max: 2e3 });
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.ids)) {
        const validSet = new Set(sortedPool.map((p) => p.id));
        chosenIds = parsed.ids.filter((id) => validSet.has(id)).slice(0, count);
      }
    } catch (e) {
      console.error("national/generate:", e.message);
    }
  }
  if (chosenIds.length < Math.min(count, sortedPool.length)) {
    const have = new Set(chosenIds);
    for (const p of sortedPool) {
      if (!have.has(p.id)) {
        chosenIds.push(p.id);
        have.add(p.id);
        if (chosenIds.length >= count) break;
      }
    }
  }
  nt.current.stage = stage;
  nt.current[stage] = chosenIds;
  save();
  res.json({ ok: 1, current: enrichNationalBreak(nt.current) });
});
app.post("/api/admin/national/squad", admin, (req, res) => {
  const nt = ensureNationalTeam();
  const { action, pid, stage } = req.body;
  const st = stage || nt.current.stage || "extended";
  nt.current[st] ||= [];
  if (action === "add" && pid) {
    if (!nt.current[st].includes(pid)) nt.current[st].push(pid);
  } else if (action === "remove" && pid) {
    nt.current[st] = nt.current[st].filter((id) => id !== pid);
  } else if (action === "stage" && (stage === "extended" || stage === "final")) {
    nt.current.stage = stage;
  }
  save();
  res.json({ ok: 1, current: enrichNationalBreak(nt.current) });
});
app.post("/api/admin/national/match", admin, (req, res) => {
  const nt = ensureNationalTeam();
  const { opponent, date, time, home } = req.body;
  if (!opponent) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0441\u043E\u043F\u0435\u0440\u043D\u0438\u043A\u0430");
  if (!date) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u043C\u0430\u0442\u0447\u0430");
  const nationalBreaks = (db.internationalBreaks || DEFAULT_INTERNATIONAL_BREAKS).filter((b) => b.id.startsWith("ib_"));
  const isValidDate = nationalBreaks.some((b) => date >= b.start && date <= b.end);
  if (!isValidDate) return fail(res, "\u041C\u0430\u0442\u0447 \u0441\u0431\u043E\u0440\u043D\u043E\u0439 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0434\u0430\u0442\u044B \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u043F\u0430\u0443\u0437 \u043D\u0430 \u0441\u0431\u043E\u0440\u043D\u044B\u0435!");
  nt.current.matches ||= [];
  nt.current.matches.push({
    id: uid(),
    opponent: String(opponent).trim(),
    date,
    time: time || "19:00",
    home: home !== false
  });
  save();
  res.json({ ok: 1, current: enrichNationalBreak(nt.current) });
});
app.post("/api/admin/national/match/delete", admin, (req, res) => {
  const nt = ensureNationalTeam();
  const matchId = req.body.matchId || req.body.id;
  if (matchId) {
    nt.current.matches = (nt.current.matches || []).filter((m) => m.id !== matchId);
    save();
  }
  res.json({ ok: 1, current: enrichNationalBreak(nt.current) });
});
app.post("/api/admin/national/archive", admin, (req, res) => {
  const nt = ensureNationalTeam();
  nt.archive ||= [];
  nt.archive.unshift({
    ...nt.current,
    archivedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  nt.current = {
    title: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043F\u0430\u0443\u0437\u0430 \u043D\u0430 \u043C\u0430\u0442\u0447\u0438 \u0441\u0431\u043E\u0440\u043D\u044B\u0445",
    stage: "extended",
    extended: [],
    final: [],
    matches: []
  };
  save();
  res.json({ ok: 1 });
});
app.post("/api/admin/check-squad", admin, async (req, res) => {
  const t = team(req.body.teamId);
  if (!t) return fail(res, "\u041A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const sq = squadOf(t.id);
  if (!sq.length) return res.json({ realistic: true, summary: "\u0421\u043E\u0441\u0442\u0430\u0432 \u043F\u0443\u0441\u0442.", flaggedPlayers: [] });
  const squadText = sq.map((p) => `${p.name} (${p.pos}, ${p.age || 25} \u043B\u0435\u0442, ${p.nat || "RUS"}, OVR ${p.ovr || 70})`).join("\n");
  if (hasLLM()) {
    try {
      const prompt = `\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u0441\u043A\u0430\u0443\u0442 \u0438 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u043E\u043C\u0443 \u0444\u0443\u0442\u0431\u043E\u043B\u0443. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u043E\u0441\u0442\u0430\u0432 \u043A\u043B\u0443\u0431\u0430 "${t.name}" (\u043B\u0438\u0433\u0430: ${t.comp.toUpperCase()}) \u043D\u0430 \u0440\u0435\u0430\u043B\u0438\u0437\u043C.
\u0412\u044B\u044F\u0432\u0438 \u043D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u043C\u0438\u0440\u043E\u0432\u044B\u0445 \u0441\u0443\u043F\u0435\u0440\u0437\u0432\u0451\u0437\u0434 \u0443\u0440\u043E\u0432\u043D\u044F \u041C\u0435\u0441\u0441\u0438, \u0420\u043E\u043D\u0430\u043B\u0434\u0443, \u041C\u0431\u0430\u043F\u043F\u0435 \u0432 \u0441\u0435\u0440\u0435\u0434\u043D\u044F\u043A\u0430\u0445/\u0430\u0443\u0442\u0441\u0430\u0439\u0434\u0435\u0440\u0430\u0445 \u0420\u041F\u041B \u0438\u043B\u0438 \u0424\u041D\u041B, \u043D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0443\u0440\u043E\u0432\u043D\u044F \u043B\u0438\u0433\u0438, \u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0435 \u0438\u043C\u0435\u043D\u0430).
\u0421\u043E\u0441\u0442\u0430\u0432:
${squadText}

\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON:
{
  "realistic": true/false,
  "summary": "\u043A\u0440\u0430\u0442\u043A\u0438\u0439 \u0432\u044B\u0432\u043E\u0434 \u043F\u043E \u0441\u043E\u0441\u0442\u0430\u0432\u0443 \u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F)",
  "flaggedPlayers": [
    { "name": "\u0418\u043C\u044F \u0438\u0433\u0440\u043E\u043A\u0430", "reason": "\u043F\u043E\u0447\u0435\u043C\u0443 \u043D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E", "suggestion": "\u043A\u0435\u043C \u0437\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043B\u0438 \u0447\u0442\u043E \u0438\u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C" }
  ]
}`;
      const r = await llmJSON("\u0422\u044B \u2014 \u0441\u0442\u0440\u043E\u0433\u0438\u0439 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0440\u0435\u0430\u043B\u0438\u0437\u043C\u0443 \u0441\u043E\u0441\u0442\u0430\u0432\u043E\u0432.", prompt, { temp: 0.3, max: 2e3 });
      return res.json({
        realistic: !!r.realistic,
        summary: r.summary || "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430.",
        flaggedPlayers: Array.isArray(r.flaggedPlayers) ? r.flaggedPlayers : []
      });
    } catch (e) {
      console.error("check-squad:", e.message);
    }
  }
  const stars = ["\u043C\u0435\u0441\u0441\u0438", "messi", "\u0440\u043E\u043D\u0430\u043B\u0434\u0443", "ronaldo", "\u043C\u0431\u0430\u043F\u043F\u0435", "mbappe", "\u0445\u043E\u043B\u0430\u043D\u0434", "haaland", "\u043D\u0435\u0439\u043C\u0430\u0440", "neymar", "\u0432\u0438\u043D\u0438\u0446\u0438\u0443\u0441", "vinicius", "\u0431\u0435\u043B\u043B\u0438\u043D\u0433\u0435\u043C", "bellingham"];
  const flagged = sq.filter((p) => stars.some((s) => String(p.name || "").toLowerCase().includes(s))).map((p) => ({
    name: p.name,
    reason: `\u0418\u0433\u0440\u043E\u043A \u043C\u0438\u0440\u043E\u0432\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F (${p.name}) \u043D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u0435\u043D \u0434\u043B\u044F \u043A\u043B\u0443\u0431\u0430 ${t.name}`,
    suggestion: "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430 \u0438\u0433\u0440\u043E\u043A\u0430 \u0443\u0440\u043E\u0432\u043D\u044F \u0420\u041F\u041B/\u0424\u041D\u041B"
  }));
  res.json({
    realistic: flagged.length === 0,
    summary: flagged.length ? `\u041E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u043E ${flagged.length} \u043D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0432 \u0441\u043E\u0441\u0442\u0430\u0432\u0435 ${t.name}.` : `\u0421\u043E\u0441\u0442\u0430\u0432 \u043A\u043B\u0443\u0431\u0430 ${t.name} \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E.`,
    flaggedPlayers: flagged
  });
});
app.post("/api/club/transfer-request", needClub, async (req, res) => {
  const { playerName, fee } = req.body;
  if (!playerName) return fail(res, "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0424\u0418\u041E \u0438\u0433\u0440\u043E\u043A\u0430");
  let pos = "\u0426\u041F", age2 = 24, nationality = "\u0418\u043D\u043E\u0441\u0442\u0440\u0430\u043D\u0435\u0446", fromClub = "\u0417\u0430\u0440\u0443\u0431\u0435\u0436\u043D\u044B\u0439 \u043A\u043B\u0443\u0431";
  if (hasLLM()) {
    try {
      const prompt = `\u041D\u0430\u0439\u0434\u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u0444\u0443\u0442\u0431\u043E\u043B\u0438\u0441\u0442\u0435 "${playerName}". \u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438 \u0435\u0433\u043E \u043E\u0441\u043D\u043E\u0432\u043D\u0443\u044E \u043F\u043E\u0437\u0438\u0446\u0438\u044E \u043D\u0430 \u043F\u043E\u043B\u0435 (\u043E\u0434\u043D\u0430 \u0438\u0437: \u0412\u0420, \u0426\u0417, \u041B\u0417, \u041F\u0417, \u041E\u041F, \u0426\u041F, \u0410\u041F, \u041B\u0412, \u041F\u0412, \u0426\u0424), \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0432\u043E\u0437\u0440\u0430\u0441\u0442 (\u0447\u0438\u0441\u043B\u043E), \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u0442\u0432\u043E (\u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C) \u0438 \u0442\u0435\u043A\u0443\u0449\u0438\u0439/\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043A\u043B\u0443\u0431.
\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON: { "pos": "\u0426\u041F", "age": 25, "nationality": "\u0411\u0440\u0430\u0437\u0438\u043B\u0438\u044F", "fromClub": "\u0424\u043B\u0430\u043C\u0435\u043D\u0433\u043E" }`;
      const info = await llmJSON("\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u0430\u044F \u0431\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445.", prompt, { temp: 0.2, max: 300 });
      if (info.pos) pos = String(info.pos);
      if (info.age) age2 = Number(info.age) || 24;
      if (info.nationality) nationality = String(info.nationality);
      if (info.fromClub) fromClub = String(info.fromClub);
    } catch {
    }
  }
  const reqObj = {
    id: "trq_" + uid(),
    clubId: req.me.teamId,
    playerName: String(playerName).trim(),
    pos,
    age: age2,
    nationality,
    fromClub,
    fee: String(fee || "\u041F\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u044E").trim(),
    status: "pending",
    aiVerdict: null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.transferRequests.unshift(reqObj);
  save();
  res.json({ ok: 1, request: reqObj });
});
app.get("/api/club/transfer-requests", needClub, (req, res) => {
  const list = (db.transferRequests || []).filter((r) => r.clubId === req.me.teamId);
  res.json({ requests: list });
});
app.get("/api/admin/transfer-requests", admin, (req, res) => {
  const byClub = {};
  for (const r of db.transferRequests || []) {
    if (!byClub[r.clubId]) {
      const t = team(r.clubId);
      byClub[r.clubId] = {
        clubId: r.clubId,
        clubName: t?.name || r.clubId,
        clubLogo: teamLogo(r.clubId),
        comp: t?.comp || "rpl",
        requests: []
      };
    }
    byClub[r.clubId].requests.push(r);
  }
  res.json({ groups: Object.values(byClub) });
});
app.post("/api/admin/transfer-requests/check-ai", admin, async (req, res) => {
  const { clubId } = req.body;
  const t = team(clubId);
  if (!t) return fail(res, "\u041A\u043B\u0443\u0431 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  const pending = (db.transferRequests || []).filter((r) => r.clubId === clubId && r.status === "pending");
  if (!pending.length) return fail(res, "\u041D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0437\u0430\u044F\u0432\u043E\u043A \u043E\u0442 \u044D\u0442\u043E\u0433\u043E \u043A\u043B\u0443\u0431\u0430");
  const reqText = pending.map((r, i) => `${i + 1}. ${r.playerName} (${r.pos}, ${r.age} \u043B\u0435\u0442, ${r.nationality}, \u0438\u0437 \u043A\u043B\u0443\u0431\u0430 "${r.fromClub}", \u0441\u0443\u043C\u043C\u0430: ${r.fee})`).join("\n");
  if (hasLLM()) {
    try {
      const prompt = `\u0422\u044B \u2014 \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440 \u0438 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u0430\u043C. \u041A\u043B\u0443\u0431 "${t.name}" (\u043B\u0438\u0433\u0430: ${t.comp.toUpperCase()}) \u043F\u043E\u0434\u0430\u043B \u0437\u0430\u044F\u0432\u043A\u0438 \u043D\u0430 \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u044B \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0438\u0437-\u0437\u0430 \u0440\u0443\u0431\u0435\u0436\u0430:
${reqText}

\u041E\u0446\u0435\u043D\u0438 \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E\u0441\u0442\u044C \u0438 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u0430 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043A\u043B\u0443\u0431\u0430 (\u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044F \u0441\u0442\u0430\u0442\u0443\u0441 \u043A\u043B\u0443\u0431\u0430, \u043B\u0438\u0433\u0443, \u0444\u0438\u043D\u0430\u043D\u0441\u044B \u0438 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0438\u0433\u0440\u043E\u043A\u0430).
\u041E\u0442\u0432\u0435\u0442\u044C \u0441\u0442\u0440\u043E\u0433\u043E \u0432 JSON:
{
  "overallVerdict": "\u043E\u0431\u0449\u0438\u0439 \u0432\u044B\u0432\u043E\u0434 \u043F\u043E \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u043D\u043E\u0439 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438 \u043A\u043B\u0443\u0431\u0430 (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F)",
  "results": [
    { "index": 1, "playerName": "\u0418\u043C\u044F", "realistic": true/false, "verdict": "\u0420\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E" \u0438\u043B\u0438 "\u041D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E", "reason": "\u043A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u0431\u044A\u044F\u0441\u043D\u0435\u043D\u0438\u0435" }
  ]
}`;
      const r = await llmJSON("\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E \u0444\u0443\u0442\u0431\u043E\u043B\u044C\u043D\u044B\u043C \u0442\u0440\u0430\u043D\u0441\u0444\u0435\u0440\u0430\u043C.", prompt, { temp: 0.3, max: 2e3 });
      const results2 = Array.isArray(r.results) ? r.results : [];
      pending.forEach((pReq, idx) => {
        const match = results2.find((x) => x.index === idx + 1 || x.playerName === pReq.playerName);
        if (match) {
          pReq.aiVerdict = { realistic: !!match.realistic, verdict: match.verdict, reason: match.reason };
        }
      });
      save();
      return res.json({ clubId, overallVerdict: r.overallVerdict || "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430.", results: results2 });
    } catch (e) {
      console.error("transfer-check-ai:", e.message);
    }
  }
  const results = pending.map((pReq, idx) => {
    const isSuperstar = /месси|messi|роналду|ronaldo|мбаппе|mbappe|холанд|haaland/i.test(pReq.playerName);
    const v = {
      realistic: !isSuperstar,
      verdict: isSuperstar ? "\u041D\u0435\u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E" : "\u0420\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E",
      reason: isSuperstar ? `\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440 ${pReq.playerName} \u0432 ${t.name} \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u043F\u043E \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u043C \u0438 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u043C \u043F\u0440\u0438\u0447\u0438\u043D\u0430\u043C.` : `\u0422\u0440\u0430\u043D\u0441\u0444\u0435\u0440 ${pReq.playerName} \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0443\u0440\u043E\u0432\u043D\u044E \u043A\u043B\u0443\u0431\u0430 ${t.name}.`
    };
    pReq.aiVerdict = v;
    return { index: idx + 1, playerName: pReq.playerName, ...v };
  });
  save();
  res.json({ clubId, overallVerdict: `\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E \u0437\u0430\u044F\u0432\u043E\u043A: ${pending.length}.`, results });
});
app.post("/api/admin/transfer-requests/resolve", admin, (req, res) => {
  const { requestId, action } = req.body;
  const r = (db.transferRequests || []).find((x) => x.id === requestId);
  if (!r || r.status !== "pending") return fail(res, "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
  if (action === "approve") {
    r.status = "approved";
    const newPlayer = {
      id: "p_" + uid(),
      name: r.playerName,
      pos: r.pos,
      age: r.age,
      nat: r.nationality,
      teamId: r.clubId,
      ovr: 74,
      goals: 0,
      assists: 0,
      matches: 0,
      yellowCards: 0,
      redCards: 0,
      saves: 0,
      tackles: 0,
      shots: 0,
      xg: 0,
      cleanSheets: 0,
      rating: 7,
      seasonYC: 0,
      banLeft: 0
    };
    db.players.push(newPlayer);
    db.squads[r.clubId] = [.../* @__PURE__ */ new Set([...squadOf(r.clubId).map((x) => x.id), newPlayer.id])];
  } else {
    r.status = "rejected";
  }
  save();
  res.json({ ok: 1 });
});
function syncRplFridaySchedules() {
  const rplCupDates = new Set(
    (db.fixtures || []).filter((f) => f.comp === "cup" && f.cupPath === "rpl_group").map((f) => f.date)
  );
  const rplFx = (db.fixtures || []).filter((f) => f.comp === "rpl" && f.status !== "done");
  const byRound = {};
  rplFx.forEach((f) => {
    byRound[f.round] = byRound[f.round] || [];
    byRound[f.round].push(f);
  });
  let changed = false;
  for (const [rStr, list] of Object.entries(byRound)) {
    const ri = Number(rStr) - 1;
    if (!list || list.length < 8) continue;
    let sat = list.map((f) => f.date).find((d) => (/* @__PURE__ */ new Date(d + "T12:00:00Z")).getUTCDay() === 6);
    if (!sat) {
      const d0 = list[0].date;
      const day = (/* @__PURE__ */ new Date(d0 + "T12:00:00Z")).getUTCDay();
      sat = addDays(d0, (6 - day + 7) % 7);
    }
    const tue = addDays(sat, -4), wed = addDays(sat, -3), thu = addDays(sat, -2);
    const hasRplCup = rplCupDates.has(tue) || rplCupDates.has(wed) || rplCupDates.has(thu);
    if (!hasRplCup) {
      const satCount = ri % 2 === 0 ? 3 : 4;
      list.forEach((f, mi) => {
        let newDate = sat, newTime = "16:30";
        if (mi === 0) {
          newDate = addDays(sat, -1);
          newTime = "19:00";
        } else if (mi <= satCount) {
          newDate = sat;
          const times = satCount === 3 ? ["14:00", "16:30", "19:00"] : ["13:00", "15:15", "17:30", "20:00"];
          newTime = times[(mi - 1) % times.length];
        } else {
          newDate = addDays(sat, 1);
          const sunTimes = satCount === 3 ? ["14:00", "16:30", "19:00", "21:00"] : ["14:00", "16:30", "19:00"];
          newTime = sunTimes[(mi - 1 - satCount) % sunTimes.length];
        }
        if (f.date !== newDate || f.time !== newTime) {
          f.date = newDate;
          f.time = newTime;
          changed = true;
        }
      });
    } else {
      list.forEach((f, mi) => {
        let newDate = sat, newTime = "16:30";
        if (mi < 3) {
          newDate = sat;
          newTime = ["14:00", "16:30", "19:00"][mi];
        } else if (mi < 7) {
          newDate = addDays(sat, 1);
          newTime = ["14:00", "16:30", "19:00", "21:00"][mi - 3];
        } else {
          newDate = addDays(sat, 2);
          newTime = "19:30";
        }
        if (f.date !== newDate || f.time !== newTime) {
          f.date = newDate;
          f.time = newTime;
          changed = true;
        }
      });
    }
  }
  if (changed) save();
}
syncRplFridaySchedules();
invalidateAgg();
resumeLive();
setInterval(() => {
  if (!db.settings.auto) return;
  const now = /* @__PURE__ */ new Date();
  const due = seasonFx().filter((f) => f.status === "scheduled" && at(f) <= now);
  if (due.length) runBatch(due).catch(console.error);
}, 6e4);
process.on("SIGINT", () => {
  saveNow();
  process.exit(0);
});
process.on("SIGTERM", () => {
  saveNow();
  process.exit(0);
});
async function startServer() {
  if (process.env.NODE_ENV === "production" && fs.existsSync(path.join(__dirname, "dist"))) {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  } else {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch {
      app.use(express.static(path.join(__dirname, "public")));
      app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
    }
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u0412\u0438\u0440\u0442 \u0420\u041F\u041B \u0437\u0430\u043F\u0443\u0449\u0435\u043D: http://localhost:${PORT}`);
    console.log(`\u041A\u043E\u0434 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430: ${process.env.ADMIN_CODE || db.settings.adminCode}`);
    if (!hasLLM()) {
      console.log("\u041A\u043B\u044E\u0447\u0435\u0439 \u043D\u0435\u0439\u0440\u043E\u0441\u0435\u0442\u0438 \u043D\u0435\u0442 \u2014 \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043D\u0430 \u0437\u0430\u043F\u0430\u0441\u043D\u043E\u043C \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0435. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043A\u043B\u044E\u0447 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0430\u0434\u043C\u0438\u043D\u043A\u0438 \u0438\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F.");
    }
  });
}
startServer();
export {
  app,
  db
};
