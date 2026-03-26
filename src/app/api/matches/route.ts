import { NextResponse } from "next/server";

export interface TeamData {
  name: string;
  flag: string;
}

export interface MatchData {
  date: string;
  group: string;
  home: TeamData;
  away: TeamData;
  homeScore: number;
  awayScore: number;
}

const teams: Record<string, TeamData> = {
  brezilya: { name: "Brezilya", flag: "/takimlar-images/brezilya.png" },
  hirvatistan: { name: "Hırvatistan", flag: "/takimlar-images/hirvatistan.png" },
  meksika: { name: "Meksika", flag: "/takimlar-images/meksika.png" },
  kamerun: { name: "Kamerun", flag: "/takimlar-images/kamerun.png" },
  ispanya: { name: "İspanya", flag: "/takimlar-images/ispanya.png" },
  hollanda: { name: "Hollanda", flag: "/takimlar-images/hollanda.png" },
  sili: { name: "Şili", flag: "/takimlar-images/sili.png" },
  avustralya: { name: "Avustralya", flag: "/takimlar-images/avustralya.png" },
  kolombiya: { name: "Kolombiya", flag: "/takimlar-images/kolombiya.png" },
  yunanistan: { name: "Yunanistan", flag: "/takimlar-images/yunanistan.png" },
  fildisiSahili: { name: "Fildişi Sahili", flag: "/takimlar-images/fildisi-sahili.png" },
  japonya: { name: "Japonya", flag: "/takimlar-images/japonya.png" },
  uruguay: { name: "Uruguay", flag: "/takimlar-images/uruguay.png" },
  kostaRika: { name: "Kosta Rika", flag: "/takimlar-images/kosta-rika.png" },
  ingiltere: { name: "İngiltere", flag: "/takimlar-images/ingiltere.png" },
  italya: { name: "İtalya", flag: "/takimlar-images/italya.png" },
  isvicre: { name: "İsviçre", flag: "/takimlar-images/isvicre.png" },
  ekvador: { name: "Ekvador", flag: "/takimlar-images/ekvador.png" },
  fransa: { name: "Fransa", flag: "/takimlar-images/fransa.png" },
  honduras: { name: "Honduras", flag: "/takimlar-images/honduras.png" },
  arjantin: { name: "Arjantin", flag: "/takimlar-images/arjantin.png" },
  bosna: { name: "Bosna Hersek", flag: "/takimlar-images/bosna.png" },
  iran: { name: "İran", flag: "/takimlar-images/iran.png" },
  nijerya: { name: "Nijerya", flag: "/takimlar-images/nijerya.png" },
  almanya: { name: "Almanya", flag: "/takimlar-images/almanya.png" },
  portekiz: { name: "Portekiz", flag: "/takimlar-images/portekiz.png" },
  gana: { name: "Gana", flag: "/takimlar-images/gana.png" },
  abd: { name: "ABD", flag: "/takimlar-images/abd.png" },
  belcika: { name: "Belçika", flag: "/takimlar-images/belcika.png" },
  cezayir: { name: "Cezayir", flag: "/takimlar-images/cezayir.png" },
  rusya: { name: "Rusya", flag: "/takimlar-images/rusya.png" },
  guneyKore: { name: "Güney Kore", flag: "/takimlar-images/guney-kore.png" },
};

const t = teams;

const matches: MatchData[] = [
  // A Grubu
  { date: "12.06.14", group: "A Grubu", home: t.brezilya, away: t.hirvatistan, homeScore: 3, awayScore: 1 },
  { date: "13.06.14", group: "A Grubu", home: t.meksika, away: t.kamerun, homeScore: 1, awayScore: 0 },
  { date: "17.06.14", group: "A Grubu", home: t.brezilya, away: t.meksika, homeScore: 0, awayScore: 0 },
  { date: "18.06.14", group: "A Grubu", home: t.kamerun, away: t.hirvatistan, homeScore: 0, awayScore: 4 },
  { date: "23.06.14", group: "A Grubu", home: t.kamerun, away: t.brezilya, homeScore: 1, awayScore: 4 },
  { date: "23.06.14", group: "A Grubu", home: t.hirvatistan, away: t.meksika, homeScore: 1, awayScore: 3 },
  // B Grubu
  { date: "13.06.14", group: "B Grubu", home: t.ispanya, away: t.hollanda, homeScore: 1, awayScore: 5 },
  { date: "13.06.14", group: "B Grubu", home: t.sili, away: t.avustralya, homeScore: 3, awayScore: 1 },
  { date: "18.06.14", group: "B Grubu", home: t.avustralya, away: t.hollanda, homeScore: 2, awayScore: 3 },
  { date: "18.06.14", group: "B Grubu", home: t.ispanya, away: t.sili, homeScore: 0, awayScore: 2 },
  { date: "23.06.14", group: "B Grubu", home: t.avustralya, away: t.ispanya, homeScore: 0, awayScore: 3 },
  { date: "23.06.14", group: "B Grubu", home: t.hollanda, away: t.sili, homeScore: 2, awayScore: 0 },
  // C Grubu
  { date: "14.06.14", group: "C Grubu", home: t.kolombiya, away: t.yunanistan, homeScore: 3, awayScore: 0 },
  { date: "15.06.14", group: "C Grubu", home: t.fildisiSahili, away: t.japonya, homeScore: 2, awayScore: 1 },
  { date: "19.06.14", group: "C Grubu", home: t.kolombiya, away: t.fildisiSahili, homeScore: 2, awayScore: 1 },
  { date: "19.06.14", group: "C Grubu", home: t.japonya, away: t.yunanistan, homeScore: 0, awayScore: 0 },
  { date: "24.06.14", group: "C Grubu", home: t.japonya, away: t.kolombiya, homeScore: 1, awayScore: 4 },
  { date: "24.06.14", group: "C Grubu", home: t.yunanistan, away: t.fildisiSahili, homeScore: 2, awayScore: 1 },
  // D Grubu
  { date: "14.06.14", group: "D Grubu", home: t.uruguay, away: t.kostaRika, homeScore: 1, awayScore: 3 },
  { date: "14.06.14", group: "D Grubu", home: t.ingiltere, away: t.italya, homeScore: 1, awayScore: 2 },
  { date: "19.06.14", group: "D Grubu", home: t.uruguay, away: t.ingiltere, homeScore: 2, awayScore: 1 },
  { date: "20.06.14", group: "D Grubu", home: t.italya, away: t.kostaRika, homeScore: 0, awayScore: 1 },
  { date: "24.06.14", group: "D Grubu", home: t.italya, away: t.uruguay, homeScore: 0, awayScore: 1 },
  { date: "24.06.14", group: "D Grubu", home: t.kostaRika, away: t.ingiltere, homeScore: 0, awayScore: 0 },
  // E Grubu
  { date: "15.06.14", group: "E Grubu", home: t.isvicre, away: t.ekvador, homeScore: 2, awayScore: 1 },
  { date: "15.06.14", group: "E Grubu", home: t.fransa, away: t.honduras, homeScore: 3, awayScore: 0 },
  { date: "20.06.14", group: "E Grubu", home: t.isvicre, away: t.fransa, homeScore: 2, awayScore: 5 },
  { date: "20.06.14", group: "E Grubu", home: t.honduras, away: t.ekvador, homeScore: 1, awayScore: 2 },
  { date: "25.06.14", group: "E Grubu", home: t.honduras, away: t.isvicre, homeScore: 0, awayScore: 3 },
  { date: "25.06.14", group: "E Grubu", home: t.ekvador, away: t.fransa, homeScore: 0, awayScore: 0 },
  // F Grubu
  { date: "15.06.14", group: "F Grubu", home: t.arjantin, away: t.bosna, homeScore: 2, awayScore: 1 },
  { date: "16.06.14", group: "F Grubu", home: t.iran, away: t.nijerya, homeScore: 0, awayScore: 0 },
  { date: "21.06.14", group: "F Grubu", home: t.arjantin, away: t.iran, homeScore: 1, awayScore: 0 },
  { date: "21.06.14", group: "F Grubu", home: t.nijerya, away: t.bosna, homeScore: 1, awayScore: 0 },
  { date: "25.06.14", group: "F Grubu", home: t.nijerya, away: t.arjantin, homeScore: 2, awayScore: 3 },
  { date: "25.06.14", group: "F Grubu", home: t.bosna, away: t.iran, homeScore: 3, awayScore: 1 },
  // G Grubu
  { date: "16.06.14", group: "G Grubu", home: t.almanya, away: t.portekiz, homeScore: 4, awayScore: 0 },
  { date: "16.06.14", group: "G Grubu", home: t.gana, away: t.abd, homeScore: 1, awayScore: 2 },
  { date: "21.06.14", group: "G Grubu", home: t.almanya, away: t.gana, homeScore: 2, awayScore: 2 },
  { date: "22.06.14", group: "G Grubu", home: t.abd, away: t.portekiz, homeScore: 2, awayScore: 2 },
  { date: "26.06.14", group: "G Grubu", home: t.abd, away: t.almanya, homeScore: 0, awayScore: 1 },
  { date: "26.06.14", group: "G Grubu", home: t.portekiz, away: t.gana, homeScore: 2, awayScore: 1 },
  // H Grubu
  { date: "17.06.14", group: "H Grubu", home: t.belcika, away: t.cezayir, homeScore: 2, awayScore: 1 },
  { date: "17.06.14", group: "H Grubu", home: t.rusya, away: t.guneyKore, homeScore: 1, awayScore: 1 },
  { date: "22.06.14", group: "H Grubu", home: t.belcika, away: t.rusya, homeScore: 1, awayScore: 0 },
  { date: "22.06.14", group: "H Grubu", home: t.guneyKore, away: t.cezayir, homeScore: 2, awayScore: 4 },
  { date: "26.06.14", group: "H Grubu", home: t.guneyKore, away: t.belcika, homeScore: 0, awayScore: 1 },
  { date: "26.06.14", group: "H Grubu", home: t.cezayir, away: t.rusya, homeScore: 1, awayScore: 1 },
  // Son 16
  { date: "28.06.14", group: "Son 16", home: t.brezilya, away: t.sili, homeScore: 1, awayScore: 1 },
  { date: "28.06.14", group: "Son 16", home: t.kolombiya, away: t.uruguay, homeScore: 2, awayScore: 0 },
  { date: "29.06.14", group: "Son 16", home: t.hollanda, away: t.meksika, homeScore: 2, awayScore: 1 },
  { date: "29.06.14", group: "Son 16", home: t.kostaRika, away: t.yunanistan, homeScore: 1, awayScore: 1 },
  { date: "30.06.14", group: "Son 16", home: t.fransa, away: t.nijerya, homeScore: 2, awayScore: 0 },
  { date: "30.06.14", group: "Son 16", home: t.almanya, away: t.cezayir, homeScore: 2, awayScore: 1 },
  { date: "01.07.14", group: "Son 16", home: t.arjantin, away: t.isvicre, homeScore: 1, awayScore: 0 },
  { date: "01.07.14", group: "Son 16", home: t.belcika, away: t.abd, homeScore: 2, awayScore: 1 },
  // Çeyrek Final
  { date: "04.07.14", group: "Çeyrek Final", home: t.fransa, away: t.almanya, homeScore: 0, awayScore: 1 },
  { date: "04.07.14", group: "Çeyrek Final", home: t.brezilya, away: t.kolombiya, homeScore: 2, awayScore: 1 },
  { date: "05.07.14", group: "Çeyrek Final", home: t.arjantin, away: t.belcika, homeScore: 1, awayScore: 0 },
  { date: "05.07.14", group: "Çeyrek Final", home: t.hollanda, away: t.kostaRika, homeScore: 0, awayScore: 0 },
  // Yarı Final
  { date: "08.07.14", group: "Yarı Final", home: t.brezilya, away: t.almanya, homeScore: 1, awayScore: 7 },
  { date: "09.07.14", group: "Yarı Final", home: t.hollanda, away: t.arjantin, homeScore: 0, awayScore: 0 },
  // Üçüncülük
  { date: "12.07.14", group: "Üçüncülük", home: t.brezilya, away: t.hollanda, homeScore: 0, awayScore: 3 },
  // Final
  { date: "13.07.14", group: "Final", home: t.almanya, away: t.arjantin, homeScore: 1, awayScore: 0 },
];

const teamsByGroup: Record<string, TeamData[]> = {
  "A Grubu": [t.brezilya, t.hirvatistan, t.meksika, t.kamerun],
  "B Grubu": [t.ispanya, t.hollanda, t.sili, t.avustralya],
  "C Grubu": [t.kolombiya, t.yunanistan, t.fildisiSahili, t.japonya],
  "D Grubu": [t.uruguay, t.kostaRika, t.ingiltere, t.italya],
  "E Grubu": [t.isvicre, t.ekvador, t.fransa, t.honduras],
  "F Grubu": [t.arjantin, t.bosna, t.iran, t.nijerya],
  "G Grubu": [t.almanya, t.portekiz, t.gana, t.abd],
  "H Grubu": [t.belcika, t.cezayir, t.rusya, t.guneyKore],
};

// Stadium -> city name mapping
const stadiums: Record<string, string> = {
  spaulo: "São Paulo",
  salvador: "Salvador",
  rio: "Rio de Janeiro",
  recife: "Recife",
  porto: "Porto Alegre",
  natal: "Natal",
  manaus: "Manaus",
  fortaleza: "Fortaleza",
  curitiba: "Curitiba",
  cuiaba: "Cuiabá",
  brasilia: "Brasília",
  belo: "Belo Horizonte",
};

// Which matches were played in which stadium
const matchesByStadium: Record<string, number[]> = {
  spaulo: [0, 8, 16, 23, 28, 36, 42],
  salvador: [1, 9, 15, 22, 31, 38],
  rio: [6, 13, 20, 27, 34, 44, 47],
  recife: [3, 10, 17, 24, 33, 41],
  porto: [4, 11, 19, 25, 35, 43],
  natal: [2, 7, 14, 21, 30, 39],
  manaus: [5, 12, 18, 26, 32, 40],
  fortaleza: [0, 6, 13, 19, 27, 34],
  curitiba: [1, 8, 15, 22, 29, 37],
  cuiaba: [3, 10, 17, 24, 31, 38],
  brasilia: [2, 7, 14, 21, 28, 36],
  belo: [4, 11, 16, 23, 30, 39],
};

// Which matches were played on which date
const matchesByDate: Record<string, number[]> = {};
matches.forEach((m, i) => {
  if (!matchesByDate[m.date]) matchesByDate[m.date] = [];
  matchesByDate[m.date].push(i);
});

export async function GET() {
  return NextResponse.json({ matches, teams, teamsByGroup, stadiums, matchesByStadium, matchesByDate });
}
