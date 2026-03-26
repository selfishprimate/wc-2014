"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TeamData {
  name: string;
  flag: string;
}

interface MatchData {
  date: string;
  group: string;
  home: TeamData;
  away: TeamData;
  homeScore: number;
  awayScore: number;
}

interface ApiData {
  matches: MatchData[];
  teams: Record<string, TeamData>;
  stadiums: Record<string, string>;
  matchesByStadium: Record<string, number[]>;
  matchesByDate: Record<string, number[]>;
}

// SVG element ID -> team key
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

// SVG group IDs -> group name
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

// SVG calendar IDs -> date string
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

// Walk up from target element to find which interactive group we're inside
// All interactive section parent IDs
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

function MatchRow({ match }: { match: MatchData }) {
  return (
    <li>
      <div className="li-date-group-hold">
        <div className="li-date-group-centered">
          <span className="mr-2">{match.date}</span>
          <span>{match.group.toUpperCase()}</span>
        </div>
      </div>
      <div className="black-band-hold">
        <div className="black-band-left">
          <span className="flex items-center">
            <Image src={match.home.flag} alt={match.home.name} width={26} height={26} />
            <h3>{match.home.name}</h3>
          </span>
        </div>
        <div className="black-band-center">
          <div className="black-band-score-wrapper">
            <span>{match.homeScore}</span>
            <span>-</span>
            <span>{match.awayScore}</span>
          </div>
        </div>
        <div className="black-band-right">
          <span className="flex items-center">
            <h3>{match.away.name}</h3>
            <Image src={match.away.flag} alt={match.away.name} width={26} height={26} />
          </span>
        </div>
      </div>
    </li>
  );
}

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [hover, setHover] = useState<HoverState>({ type: "none" });
  const svgRef = useRef<HTMLDivElement>(null);
  const svgLoaded = useRef(false);

  // Fetch match data from API
  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then(setData);
  }, []);

  // Fetch SVG once and inject into DOM via ref (outside React render cycle)
  // Uses data as dependency so it runs after both ref is mounted and data is ready
  useEffect(() => {
    if (svgLoaded.current) return;
    const el = svgRef.current;
    if (!el) return;

    fetch("/chart.svg")
      .then((r) => r.text())
      .then((svg) => {
        el.innerHTML = svg;
        svgLoaded.current = true;

        // Event delegation on the SVG container
        el.addEventListener("mouseover", (e) => {
          const result = resolveHover(e.target as Element);
          if (result) {
            setHover(result);
          }
        });

        el.addEventListener("mouseleave", () => {
          setHover({ type: "none" });
        });
      });
  }, [data]);

  // Filter matches based on hover
  let filteredMatches = data?.matches ?? [];
  let titleText = "Tüm Maçlar";
  let titleFlag = data?.teams.brezilya?.flag;

  if (data && hover.type === "team") {
    const team = data.teams[hover.key];
    if (team) {
      filteredMatches = data.matches.filter(
        (m) => m.home.name === team.name || m.away.name === team.name
      );
      titleText = team.name;
      titleFlag = team.flag;
    }
  } else if (data && hover.type === "group") {
    filteredMatches = data.matches.filter((m) => m.group === hover.name);
    titleText = hover.name;
  } else if (data && hover.type === "stadium") {
    const indices = data.matchesByStadium[hover.id] || [];
    filteredMatches = indices.map((i) => data.matches[i]).filter(Boolean);
    titleText = data.stadiums[hover.id] || hover.id;
  } else if (data && hover.type === "date") {
    filteredMatches = data.matches.filter((m) => m.date === hover.date);
    titleText = hover.date;
  }

  return (
    <main className="min-h-screen bg-gray-900 flex justify-center py-8">
      <div style={{ width: 980, height: 900, position: "relative" }}>
        {/* SVG Chart */}
        <div
          ref={svgRef}
          className="svg-chart-container"
          style={{ width: 980, height: 900, position: "absolute", top: 0, left: 0, overflow: "hidden" }}
        />

        {/* Left Banner */}
        <a
          href="https://www.mediamarkt.com.tr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: "absolute", top: -4, left: -214, zIndex: 5, scale: "1.01" }}
        >
          <Image src="/banners/left-banner.png" alt="Media Markt" width={507} height={880} />
        </a>

        {/* Right Banner */}
        <a
          href="https://www.mediamarkt.com.tr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: "absolute", top: 5, right: -212, zIndex: 5, scale: "1.01" }}
        >
          <Image src="/banners/right-banner.png" alt="Media Markt" width={829} height={859} />
        </a>

        {/* Match Results Circle */}
        <div
          className="wc-centered-content"
          style={{ position: "absolute", top: 166, left: 205 }}
        >
          <div className="wc-content-title-wrapper">
            <div className="wc-title-centered">
              {titleFlag && (
                <Image src={titleFlag} alt={titleText} width={30} height={30} />
              )}
              <h2>{titleText}</h2>
            </div>
          </div>

          <ul className="wc-ulist overflow-y-auto" style={{ maxHeight: 470 }}>
            {filteredMatches.map((match, i) => (
              <MatchRow key={i} match={match} />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
