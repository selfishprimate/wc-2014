"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";

/* ================================================================
   TYPES
   ================================================================ */
interface TeamData { name: string; flag: string; }
interface MatchData {
  date: string; group: string;
  home: TeamData; away: TeamData;
  homeScore: number; awayScore: number;
}
interface ApiData {
  matches: MatchData[];
  teams: Record<string, TeamData>;
  stadiums: Record<string, string>;
  matchesByStadium: Record<string, number[]>;
  matchesByDate: Record<string, number[]>;
  teamsByGroup: Record<string, TeamData[]>;
}

/* ================================================================
   SVG HOVER MAPS (unchanged)
   ================================================================ */
const svgIdToTeamKey: Record<string, string> = {
  almanya: "almanya", abd: "abd", arjantin: "arjantin", avustralya: "avustralya",
  belcika: "belcika", bosna: "bosna", brezilya: "brezilya", cezayir: "cezayir",
  ekvador: "ekvador", fildisi: "fildisiSahili", fransa: "fransa", gana: "gana",
  "guney-kore": "guneyKore", hirvatistan: "hirvatistan", hollanda: "hollanda",
  honduras: "honduras", ingiltere: "ingiltere", iran: "iran", ispanya: "ispanya",
  isvicre: "isvicre", italya: "italya", japonya: "japonya", kamerun: "kamerun",
  kolombiya: "kolombiya", "kosta-rika": "kostaRika", meksika: "meksika",
  nijerya: "nijerya", portekiz: "portekiz", rusya: "rusya", sili: "sili",
  uruguay: "uruguay", yunanistan: "yunanistan",
};

const svgIdToGroup: Record<string, string> = {
  "a-grubu": "A Grubu", "a-grubu_1_": "A Grubu",
  "b-grubu": "B Grubu", "b-grubu_1_": "B Grubu",
  "c-grubu": "C Grubu", "c-grubu_1_": "C Grubu",
  "d-grubu": "D Grubu", "d-grubu_1_": "D Grubu",
  "e-grubu": "E Grubu", "e-grubu_1_": "E Grubu",
  "f-grubu": "F Grubu", "f-grubu_1_": "F Grubu",
  "g-grubu": "G Grubu", "g-grubu_1_": "G Grubu",
  "h-grubu": "H Grubu", "h-grubu_1_": "H Grubu",
  "son-16": "Son 16", "son-16_1_": "Son 16",
  "ceyrek-final": "Çeyrek Final", "ceyrek-final_1_": "Çeyrek Final",
  "yari-final": "Yarı Final", "yari-final_1_": "Yarı Final",
  "ucunculuk": "Üçüncülük", "ucunculuk_1_": "Üçüncülük",
  "final": "Final", "final_1_": "Final",
};

const svgIdToDate: Record<string, string> = {
  "_x31_2-haziran": "12.06.14", "_x31_3-haziran": "13.06.14",
  "_x31_4-haziran": "14.06.14", "_x31_5-haziran": "15.06.14",
  "_x31_6-haziran": "16.06.14", "_x31_7-haziran": "17.06.14",
  "_x31_8-haziran": "18.06.14", "_x31_9-haziran": "19.06.14",
  "_x32_0-haziran": "20.06.14", "_x32_1-haziran": "21.06.14",
  "_x32_2-haziran": "22.06.14", "_x32_3-haziran": "23.06.14",
  "_x32_4-haziran": "24.06.14", "_x32_5-haziran": "25.06.14",
  "_x32_6-haziran": "26.06.14", "_x32_8-haziran": "28.06.14",
  "_x32_9-haziran": "29.06.14", "_x33_0-haziran": "30.06.14",
  "_x31_-temmuz": "01.07.14", "_x34_-temmuz": "04.07.14",
  "_x35_-temmuz": "05.07.14", "_x38_-temmuz": "08.07.14",
  "_x39_-temmuz": "09.07.14", "_x31_2-temmuz": "12.07.14",
  "_x31_3-temmuz": "13.07.14",
};

const svgStadiumIds = new Set([
  "spaulo", "salvador", "rio", "recife", "porto", "natal",
  "manaus", "fortaleza", "curitiba", "cuiaba", "brasilia", "belo",
]);

type HoverState =
  | { type: "none" }
  | { type: "team"; key: string }
  | { type: "group"; name: string }
  | { type: "stadium"; id: string }
  | { type: "date"; date: string };

const sectionIds = new Set(["teams", "groups", "stadiums", "calendar"]);

function resolveHover(target: Element): HoverState | null {
  let el: Element | null = target;
  while (el) {
    const id = el.getAttribute("id");
    if (!id || sectionIds.has(id)) { el = el.parentElement; continue; }
    if (svgIdToTeamKey[id]) return { type: "team", key: svgIdToTeamKey[id] };
    if (svgIdToGroup[id]) return { type: "group", name: svgIdToGroup[id] };
    if (svgStadiumIds.has(id)) return { type: "stadium", id };
    if (svgIdToDate[id]) return { type: "date", date: svgIdToDate[id] };
    el = el.parentElement;
  }
  return null;
}

/* ================================================================
   DUMMY NEWS DATA
   ================================================================ */
interface NewsArticle {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image?: string;
}

const IMG = {
  stadium: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
  pitch: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
  action: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
  goal: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
  crowd: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=600&fit=crop",
  ball: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop",
  night: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&h=600&fit=crop",
  keeper: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop",
  fans: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop",
  trophy: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
  field: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop",
  player: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&h=600&fit=crop",
};

const heroArticle: NewsArticle = {
  id: 0,
  category: "FİNAL",
  categoryColor: "#3cffd0",
  title: "Götze'nin 113. Dakika Golü Almanya'yı Dünya Şampiyonu Yaptı",
  excerpt: "Mario Götze, 113. dakikada André Schürrle'nin soldan ortasını göğsüyle kontrol edip sol ayağıyla Sergio Romero'nun üzerinden ağlara gönderdi. Maracanã'da oynanan final maçında Almanya, Arjantin'i 1-0 yenerek tarihindeki 4. Dünya Kupası'nı kazandı. 1990'dan bu yana ilk şampiyonluk, birleşik Almanya'nın ise ilk kupası oldu.",
  author: "Spor Servisi",
  time: "13 Temmuz 2014",
  image: "/gotze-2.avif",
};

const sidebarNews: NewsArticle[] = [
  { id: 1, category: "YARI FİNAL", categoryColor: "#ffc2e7", title: "Almanya 7-1 Brezilya: Futbol Tarihinin En Büyük Şoku", excerpt: "", author: "Analiz Masası", time: "8 Temmuz 2014", image: IMG.fans },
  { id: 2, category: "ALTIN AYAKKABI", categoryColor: "#d6f31f", title: "James Rodríguez 6 Golle Altın Ayakkabı'nın Sahibi Oldu", excerpt: "", author: "Editör", time: "13 Temmuz 2014", image: IMG.trophy },
  { id: 3, category: "GRUP", categoryColor: "#3cffd0", title: "Şampiyon İspanya Grup Aşamasında Elendi: Hollanda 5-1, Şili 2-0", excerpt: "", author: "Spor Servisi", time: "18 Haziran 2014", image: IMG.field },
  { id: 4, category: "SÜRPRİZ", categoryColor: "#ffd5c8", title: "Kosta Rika 'Ölüm Grubunu' Lider Bitirip Çeyrek Finale Yükseldi", excerpt: "", author: "Taktik Analiz", time: "5 Temmuz 2014", image: IMG.keeper },
  { id: 5, category: "SON 16", categoryColor: "#a980ff", title: "Tim Howard'dan Tarihi Performans: Belçika'ya Karşı 16 Kurtarış", excerpt: "", author: "Özel Muhabir", time: "1 Temmuz 2014", image: IMG.player },
];

const moreNews: NewsArticle[] = [
  { id: 6, category: "ÜÇÜNCÜLÜK", categoryColor: "#3cffd0", title: "Hollanda, Brezilya'yı 3-0 Yıktı: Van Persie, Blind ve Wijnaldum", excerpt: "Robin van Persie penaltıdan açılışı yaptı (3'), Daley Blind ikinci golü ekledi (17'), Georginio Wijnaldum uzatmada skoru belirledi (90+1'). Brezilya son iki maçında 10 gol yedi.", author: "Spor Servisi", time: "12 Temmuz 2014", image: IMG.stadium },
  { id: 7, category: "İKONİK GOL", categoryColor: "#d6f31f", title: "Van Persie'nin Uçan Kafa Golü İspanya'yı Şoke Etti", excerpt: "Daley Blind'ın uzun pasında Robin van Persie, 44. dakikada yaklaşık 15 metreden uçarak Casillas'ın üzerinden kafa golü attı. Hollanda bu maçı 5-1 kazandı.", author: "Spor Servisi", time: "13 Haziran 2014", image: IMG.action },
  { id: 8, category: "SKANDAL", categoryColor: "#ffc2e7", title: "Suárez, Chiellini'yi Isırdı: FIFA'dan 4 Ay Men Cezası", excerpt: "79. dakikada Luis Suárez, İtalyan defans oyuncusu Giorgio Chiellini'yi omzundan ısırdı. FIFA, Suárez'e 9 uluslararası maç ve 4 ay futboldan men cezası verdi. Kariyerindeki üçüncü ısırma vakasıydı.", author: "Editör", time: "24 Haziran 2014", image: IMG.player },
  { id: 9, category: "SAKATLIK", categoryColor: "#ffd5c8", title: "Neymar'ın Omurgası Kırıldı: Brezilya Yıldızını Kaybetti", excerpt: "Kolombiya çeyrek finalinde 88. dakikada Juan Camilo Zúñiga'nın dizinden darbe alan Neymar'ın 3. bel omuru kırıldı. Brezilya maçı 2-1 kazandı ama yıldız oyuncusuz yarı finalde 7-1 yıkıldı.", author: "Sağlık Servisi", time: "4 Temmuz 2014", image: IMG.crowd },
  { id: 10, category: "GRUP", categoryColor: "#a980ff", title: "Kolombiya, C Grubunu 3 Galibiyet ve 9 Golle Lider Bitirdi", excerpt: "1998'den bu yana ilk Dünya Kupası'nda Kolombiya, Yunanistan'ı 3-0, Fildişi Sahili'ni 2-1, Japonya'yı 4-1 yenerek grubunu namağlup tamamladı. James Rodríguez turnuvanın yıldızı oldu.", author: "Veri Analiz", time: "24 Haziran 2014", image: IMG.trophy },
  { id: 11, category: "TARİHİ", categoryColor: "#d6f31f", title: "Cezayir İlk Kez Son 16'ya Yükseldi, Almanya'ya Diş Geçirdi", excerpt: "Cezayir, H Grubunda Güney Kore'yi 4-2 yenip Rusya ile 1-1 berabere kalarak tarihinde ilk kez eleme turuna çıktı. Son 16'da Almanya'yı uzatmalara taşıdı, Mesut Özil'in 120. dakika golüyle 2-1 elendi.", author: "Spor Servisi", time: "30 Haziran 2014", image: IMG.field },
];

/* ================================================================
   MATCH ROW (for SVG chart circle)
   ================================================================ */
const monthNames: Record<string, string> = {
  "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan",
  "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos",
  "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık",
};

const monthShort: Record<string, string> = {
  "01": "Oca", "02": "Şub", "03": "Mar", "04": "Nis",
  "05": "May", "06": "Haz", "07": "Tem", "08": "Ağu",
  "09": "Eyl", "10": "Eki", "11": "Kas", "12": "Ara",
};

function formatDate(d: string) {
  const [day, month, year] = d.split(".");
  return `${parseInt(day)} ${monthNames[month] || month} 20${year}`;
}

function formatDateShort(d: string) {
  const [day, month] = d.split(".");
  return `${parseInt(day)} ${(monthShort[month] || month).toUpperCase()}`;
}

function MatchRow({ match }: { match: MatchData }) {
  return (
    <li>
      <div className="black-band-hold">
        <div className="black-band-left">
          <span className="flex items-center">
            <h3>{match.home.name}</h3>
            <Image src={match.home.flag} alt={match.home.name} width={26} height={26} />
          </span>
        </div>
        <div className="black-band-center">
          <div className="black-band-score-wrapper">
            <span>{match.homeScore}</span>
            <span>-</span>
            <span>{match.awayScore}</span>
          </div>
          <div className="black-band-info">
            <span>{formatDateShort(match.date)}</span>
            <span className="black-band-info-separator">·</span>
            <span>{match.group.toUpperCase()}</span>
          </div>
        </div>
        <div className="black-band-right">
          <span className="flex items-center">
            <Image src={match.away.flag} alt={match.away.name} width={26} height={26} />
            <h3>{match.away.name}</h3>
          </span>
        </div>
      </div>
    </li>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [hover, setHover] = useState<HoverState>({ type: "none" });
  const svgRef = useRef<HTMLDivElement>(null);
  const svgLoaded = useRef(false);

  useEffect(() => {
    fetch("/api/matches").then((r) => r.json()).then(setData);
  }, []);

  useEffect(() => {
    if (svgLoaded.current) return;
    const el = svgRef.current;
    if (!el) return;
    fetch("/chart.svg")
      .then((r) => r.text())
      .then((svg) => {
        el.innerHTML = svg;
        svgLoaded.current = true;
        el.addEventListener("mouseover", (e) => {
          const result = resolveHover(e.target as Element);
          if (result) setHover(result);
        });
        el.addEventListener("mouseleave", () => {
          setHover({ type: "none" });
        });
      });
  }, [data]);

  const stadiumNames: Record<string, string> = {
    spaulo: "Arena Corinthians", salvador: "Arena Fonte Nova",
    rio: "Estádio do Maracanã", recife: "Arena Pernambuco",
    porto: "Estádio Beira-Rio", natal: "Arena das Dunas",
    manaus: "Arena da Amazônia", fortaleza: "Estádio Castelão",
    curitiba: "Arena da Baixada", cuiaba: "Arena Pantanal",
    brasilia: "Estádio Nacional Mané Garrincha", belo: "Estádio Mineirão",
  };

  let filteredMatches = data?.matches ?? [];
  let titleText = "Tüm Maçlar";
  let titleSubtext = "";
  let titleFlag: string | undefined = undefined;

  if (data && hover.type === "team") {
    const team = data.teams[hover.key];
    if (team) {
      filteredMatches = data.matches.filter((m) => m.home.name === team.name || m.away.name === team.name);
      titleText = team.name;
      titleFlag = team.flag;
    }
  } else if (data && hover.type === "group") {
    filteredMatches = data.matches.filter((m) => m.group === hover.name);
    titleText = hover.name;
  } else if (data && hover.type === "stadium") {
    const indices = data.matchesByStadium[hover.id] || [];
    filteredMatches = indices.map((i) => data.matches[i]).filter(Boolean);
    titleText = stadiumNames[hover.id] || hover.id;
    titleSubtext = data.stadiums[hover.id] || "";
  } else if (data && hover.type === "date") {
    filteredMatches = data.matches.filter((m) => m.date === hover.date);
    titleText = formatDate(hover.date);
  }

  const groupNames = ["A Grubu","B Grubu","C Grubu","D Grubu","E Grubu","F Grubu","G Grubu","H Grubu"];
  const font = { sans: '"Inter", sans-serif', heading: '"Space Grotesk", sans-serif', mono: '"JetBrains Mono", monospace' };

  return (
    <LazyMotion features={domAnimation}>
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 bg-[#131313]/80 backdrop-blur-md">
        <div className="max-w-[1100px] mx-auto px-4 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Image src="/wc2014-logo.png" alt="FIFA World Cup 2014" width={36} height={36} className="flex-shrink-0" priority style={{ width: 36, height: "auto" }} />
            <span className="text-[#3cffd0] text-xl font-bold tracking-tight" style={{ fontFamily: font.heading }}>
              WC
            </span>
            <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: font.heading }}>
              2014
            </span>
          </a>
          <nav className="flex items-center gap-6">
            {([["mansetler", "Manşetler"], ["haberler", "Haberler"], ["gruplar", "Gruplar"], ["maclar", "Tüm Maçlar"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => {
                const el = document.getElementById(key);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
                className="text-[#949494] text-[14px] font-medium uppercase hover:!text-[#3cffd0] transition-colors cursor-pointer"
                style={{ fontFamily: font.mono }}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 pb-10">

            {/* ========== HERO + SIDEBAR ========== */}
            <m.section id="mansetler" className="flex gap-[60px] mt-4 mb-16"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}>
              {/* HERO - Left */}
              <article className="flex-1 min-w-0">
                  <div className="relative aspect-[5/4] bg-[#1a1a1a] mb-5 overflow-hidden">
                  <Image src={heroArticle.image!} alt={heroArticle.title} fill className="object-cover" sizes="(max-width: 1100px) 100vw, 700px" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3 inline-block"
                      style={{ fontFamily: font.sans, color: heroArticle.categoryColor }}>
                      {heroArticle.category}
                    </span>
                    <h1 className="text-[36px] leading-[1] font-bold text-white mb-3"
                      style={{ fontFamily: font.heading }}>
                      {heroArticle.title}
                    </h1>
                  </div>
                </div>
                <p className="text-[18px] leading-[1.6] text-[#e9e9e9] mb-4"
                  style={{ fontFamily: font.sans }}>
                  {heroArticle.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#949494]"
                    style={{ fontFamily: font.sans }}>
                    {heroArticle.time}
                  </span>
                </div>
                <div className="border-b border-[#313131] mt-6" />
              </article>

              {/* SIDEBAR - Right */}
              <aside className="w-[340px] flex-shrink-0">
                <div className="pb-2 mb-4">
                  <span className="text-[28px] font-bold text-white" style={{ fontFamily: font.heading }}>
                    Manşetler
                  </span>
                  <p className="text-[#949494] text-[14px] mt-1" style={{ fontFamily: font.sans }}>Turnuvanın öne çıkan haberleri</p>
                </div>
                {sidebarNews.map((article, i) => (
                  <div key={article.id} className="flex items-start gap-4 py-4 border-b border-[#313131]">
                    <span className="text-[#3cffd0] text-[40px] leading-none font-medium flex-shrink-0 w-8 text-right"
                      style={{ fontFamily: font.mono }}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1 block"
                        style={{ fontFamily: font.sans, color: article.categoryColor }}>
                        {article.category}
                      </span>
                      <h3 className="text-[16px] leading-[1.2] font-bold text-white mb-2"
                        style={{ fontFamily: font.heading }}>
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.1em] text-[#949494]"
                          style={{ fontFamily: font.sans }}>
                          {article.time}
                        </span>
                      </div>
                    </div>
                    {article.image && (
                      <div className="w-[100px] h-[100px] flex-shrink-0 relative overflow-hidden">
                        <Image src={article.image} alt={article.title} fill className="object-cover" sizes="100px" />
                      </div>
                    )}
                  </div>
                ))}
              </aside>
            </m.section>

            {/* ========== MORE STORIES ========== */}
            <m.section id="haberler" className="mb-16"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="pb-2 mb-6">
                <span className="text-[28px] font-bold text-white" style={{ fontFamily: font.heading }}>
                  Haberler
                </span>
                <p className="text-[#949494] text-[14px] mt-1" style={{ fontFamily: font.sans }}>2014 Dünya Kupası'ndan haberler ve analizler</p>
              </div>
              <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                {moreNews.map((article) => (
                  <article key={article.id} className="pb-6">
                    {article.image && (
                      <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-[#1a1a1a]">
                        <Image src={article.image} alt={article.title} fill className="object-cover" sizes="(max-width: 1100px) 50vw, 350px" />
                      </div>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 block"
                      style={{ fontFamily: font.sans, color: article.categoryColor }}>
                      {article.category}
                    </span>
                    <h3 className="text-[22px] leading-[1.15] font-bold text-white mb-3"
                      style={{ fontFamily: font.heading }}>
                      {article.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-[#949494] mb-3"
                      style={{ fontFamily: font.sans }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-[#949494]"
                        style={{ fontFamily: font.sans }}>
                        {article.time}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </m.section>
          {/* ========== GROUPS TAB ========== */}
          <m.section id="gruplar" className="mt-4 mb-16"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="pb-2 mb-8">
              <span className="text-[28px] font-bold text-white" style={{ fontFamily: font.heading }}>
                Gruplar
              </span>
              <p className="text-[#949494] text-[14px] mt-1" style={{ fontFamily: font.sans }}>8 grup, 32 takım — grup sıralamaları ve kadro detayları</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {groupNames.map((groupName) => {
                const groupTeams = data?.teamsByGroup[groupName] || [];
                const letter = groupName.split(" ")[0];
                return (
                  <div key={groupName}>
                    <div className="flex items-baseline gap-2 mb-4 border-b border-[#313131] pb-2">
                      <span className="text-[#3cffd0] text-2xl font-bold" style={{ fontFamily: font.heading }}>
                        {letter}
                      </span>
                      <span className="text-[#949494] text-[11px] uppercase tracking-[0.1em]"
                        style={{ fontFamily: font.sans }}>
                        {groupName}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {groupTeams.map((team) => (
                        <div key={team.name} className="flex items-center gap-3">
                          <Image src={team.flag} alt={team.name} width={24} height={24} />
                          <span className="text-white text-[14px] font-medium"
                            style={{ fontFamily: font.sans }}>
                            {team.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </m.section>

        {/* ========== ŞAMPIYON BANNER ========== */}
        <m.section className="mb-16 border border-[#313131] p-8"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#3cffd0] block mb-2"
                style={{ fontFamily: font.sans }}>
                DÜNYA ŞAMPİYONU
              </span>
              <h2 className="text-[56px] leading-[0.9] font-bold text-white mb-3"
                style={{ fontFamily: font.heading }}>
                ALMANYA
              </h2>
              <p className="text-[#949494] text-[14px]" style={{ fontFamily: font.sans }}>
                Maracanã, Rio de Janeiro — 13 Temmuz 2014
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                {data?.teams.almanya && (
                  <Image src={data.teams.almanya.flag} alt="Almanya" width={48} height={48} />
                )}
                <span className="text-white text-[18px] font-bold" style={{ fontFamily: font.heading }}>
                  Almanya
                </span>
              </div>
              <div className="bg-[#3cffd0] px-6 py-3">
                <span className="text-black text-[28px] font-bold" style={{ fontFamily: font.heading }}>
                  1 — 0
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-[18px] font-bold" style={{ fontFamily: font.heading }}>
                  Arjantin
                </span>
                {data?.teams.arjantin && (
                  <Image src={data.teams.arjantin.flag} alt="Arjantin" width={48} height={48} />
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#313131]">
            <span className="text-[#3cffd0] text-[12px] font-medium" style={{ fontFamily: font.mono }}>
              Mario Götze 113&apos;
            </span>
          </div>
        </m.section>

      </main>

      {/* ========== INTERACTIVE CHART SECTION ========== */}
      <m.section id="maclar" className="relative py-16 overflow-hidden bg-[#0a0a0a]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <Image
          src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1600&h=1000&fit=crop&q=80"
          alt=""
          fill
          className="object-cover opacity-20 pointer-events-none" sizes="100vw"
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)",
          zIndex: 1,
        }} />
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 mb-10">
          <div className="pb-1">
            <span className="text-[28px] font-bold text-white" style={{ fontFamily: font.heading }}>
              Tüm Maçlar
            </span>
          </div>
          <p className="text-white text-[16px] mt-1" style={{ fontFamily: font.sans }}>
            Takımlar, gruplar, stadyumlar ve tarihlerin üzerine gelerek maç detaylarını keşfedin
          </p>
        </div>

        <div className="relative z-10 flex justify-center">
          <div style={{ width: 980, height: 900, position: "relative" }}>
            <div ref={svgRef} className="svg-chart-container"
              style={{ width: 980, height: 900, position: "absolute", top: 0, left: 0, overflow: "hidden" }} />

            <a href="https://www.mediamarkt.com.tr" target="_blank" rel="noopener noreferrer"
              style={{ position: "absolute", top: -4, left: -214, zIndex: 5, scale: "1.01", display: "none" }}>
              <Image src="/banners/left-banner.png" alt="Media Markt" width={507} height={880} />
            </a>

            <a href="https://www.mediamarkt.com.tr" target="_blank" rel="noopener noreferrer"
              style={{ position: "absolute", top: 5, right: -212, zIndex: 5, scale: "1.01", display: "none" }}>
              <Image src="/banners/right-banner.png" alt="Media Markt" width={829} height={859} />
            </a>

            <div className="wc-centered-content"
              style={{ position: "absolute", top: 156, left: 195 }}>
              <div className="wc-content-title-wrapper">
                <div className="wc-title-centered">
                  {titleFlag && <Image src={titleFlag} alt={titleText} width={30} height={30} />}
                  <div className="wc-title-text-wrapper">
                    <h2>{titleText}</h2>
                    {titleSubtext && <span className="wc-title-subtext">{titleSubtext}</span>}
                  </div>
                </div>
              </div>
              <ul className="wc-ulist overflow-y-auto" style={{ paddingBottom: 100, height: "100%" }}>
                {filteredMatches.map((match, i) => (
                  <MatchRow key={i} match={match} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </m.section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#131313]">
        <div className="max-w-[1100px] mx-auto px-4 py-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/wc2014-logo.png" alt="FIFA World Cup 2014" width={30} height={30} className="flex-shrink-0" style={{ width: 30, height: "auto" }} />
            <span className="text-[#3cffd0] text-lg font-bold" style={{ fontFamily: font.heading }}>WC</span>
            <span className="text-white text-lg font-bold" style={{ fontFamily: font.heading }}>2014</span>
          </div>
<span className="text-[#949494] text-[11px]" style={{ fontFamily: font.sans }}>
            DESIGNED BY <a href="https://www.linkedin.com/in/selfishprimate" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#3cffd0] transition-colors">SELFISHPRIMATE</a>
          </span>
        </div>
      </footer>
    </LazyMotion>
  );
}
