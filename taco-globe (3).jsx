import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const tacoPeople = [
  {name:"Monte Mahler",city:"Richmond"},{name:"Danny Avital",city:"NYC"},{name:"Aidan Dufal",city:"Hellertown"},
  {name:"Freddy",city:"Chicago"},{name:"Ryan Roehl",city:"Scottsdale"},{name:"Angelo Apps",city:"NYC"},
  {name:"Kyle Ventura",city:"Scotch Plains"},{name:"Georgio",city:"Chicago"},{name:"Anthony Gross",city:"NYC"},
  {name:"Alex Slater",city:"London"},{name:"Chris Slater",city:"London"},{name:"Connor McLaren",city:"Washington DC"},
  {name:"Jack Reidenbach",city:"Philadelphia"},{name:"Daniel Jeetan",city:"Scotch Plains"},
  {name:"Steven Judd",city:"Scotch Plains"},{name:"Chris Nielsen",city:"Scotch Plains"},
  {name:"Tyler Cobb",city:"Scotch Plains"},{name:"Drew Wander",city:"NYC"},
  {name:"Tayt Shelman",city:"Scottsdale"},{name:"Bryant Ward",city:"Tampa"},
  {name:"Troy (Squid Haus)",city:"Austin"},{name:"Lukas Pakter",city:"Austin"},{name:"Dyson Allen",city:"Austin"},
  {name:"Zain Zitawi",city:"NYC"},{name:"Hector",city:"San Francisco"},{name:"Jett Blatter",city:"Scotch Plains"},
  {name:"Moe Jaber",city:"NYC"},{name:"Ben Avital",city:"NYC"},{name:"Maxance",city:"Paris"},
  {name:"Dylan",city:"Paris"},{name:"Jack Hubbard",city:"Detroit"},{name:"Ryan Yarnell",city:"Scotch Plains"},
  {name:"Zack Peters",city:"Detroit"},{name:"Cody K1CKS",city:"Orlando"},{name:"Eric Braz",city:"Scotch Plains"},
  {name:"James Kneiser",city:"Miami"},{name:"Cade Steach",city:"—"},{name:"Charlie Schwartz",city:"—"},
  {name:"Duy",city:"—"},{name:"Carson",city:"—"},{name:"Dior",city:"—"},
  {name:"Sam Doyle",city:"—"},{name:"Jorge Rodriguez",city:"—"},
  {name:"Joey (Unique Chicago)",city:"Chicago"},{name:"Caleb Kuechly",city:"—"},
];

const locations = [
  {city:"Scottsdale",country:"USA",lat:33.49,lng:-111.93,spots:[{n:"Farm and Craft",t:"food",d:"Healthy breakfast — bottomless mimosa"},{n:"Sakai Steakhouse",t:"food",d:"Status hibachi"},{n:"El Hefe / Vortex",t:"bar",d:"All the bars — The Vortex"},{n:"Bottled Blonde",t:"club",d:"Bar/club. Girls 24, guys 28"},{n:"The Remi",t:"bar",d:"Status lounge"},{n:"Postino",t:"bar",d:"Wine bar. Mon/Tue $25 deal"},{n:"Elements",t:"food",d:"Boujee sushi/seafood ★9.1"},{n:"Thea",t:"bar",d:"Mediterranean rooftop"},{n:"Mavrix",t:"activity",d:"Laser tag"},{n:"Olive & Ivy",t:"food",d:"Italian Old Town $20-40"},{n:"Sushiholic",t:"food",d:"Great sushi ★8.7"},{n:"Canal Club",t:"bar",d:"Hotel lounge, luxury"},{n:"Kyoto Old Town",t:"food",d:"Hibachi sushi"},{n:"The Montauk",t:"food",d:"Breakfast/dinner"}]},
  {city:"Tempe",country:"USA",lat:33.43,lng:-111.94,spots:[{n:"C.A.S.A.",t:"club",d:"Mill St. Popping"},{n:"AZ88",t:"food",d:"Fire dinner"},{n:"Neon Spur",t:"bar",d:"Mill St going out"}]},
  {city:"New York City",country:"USA",lat:40.71,lng:-74.01,spots:[{n:"Maison Close",t:"club",d:"20/10. Dinner→club"},{n:"Marinara",t:"food",d:"Vodka pasta pizza ★9.5"},{n:"Tao Downtown",t:"food",d:"$50 resi ★8+"},{n:"Fini Pizza",t:"food",d:"White pizza w/ lemon"},{n:"Ha Salon",t:"food",d:"Party dinner Hell's Kitchen"},{n:"Fuku Omakase",t:"food",d:"13 rolls $75"},{n:"JG Melon",t:"food",d:"Great burger, cash only"},{n:"Taco Mahal",t:"food",d:"Indian chipotle ★8.7"},{n:"Standard Grill",t:"food",d:"Meatpacking ★8.6"},{n:"The Spaniard",t:"bar",d:"West Village"},{n:"Galway Hooker",t:"bar",d:"3 levels packed"},{n:"Magic Hour",t:"bar",d:"Rooftop"},{n:"Albatross",t:"activity",d:"Bowling + mini golf"},{n:"Bathhouse",t:"activity",d:"Cold plunge sauna"},{n:"Marquee/Palace",t:"club",d:"Clubs"},{n:"RH Rooftop",t:"food",d:"Status brunch"},{n:"John's Pizza",t:"food",d:"Bleecker Portnoy rated"},{n:"Salt & Straw",t:"food",d:"Ice cream ★8.6"},{n:"Carmines",t:"food",d:"Italian massive portions"}]},
  {city:"Hoboken/NJ",country:"USA",lat:40.74,lng:-74.03,spots:[{n:"De Novo",t:"food",d:"River view fire food"},{n:"Robongi",t:"food",d:"Great sushi low price"},{n:"Sofia",t:"food",d:"Italian/steak ★8.6"},{n:"Morelia",t:"food",d:"Ice cream insane"},{n:"Hamilton Inn",t:"food",d:"Chicken burrata ★8.4"},{n:"IPIC",t:"activity",d:"Movie date spot"},{n:"Flaming Burritos",t:"food",d:"Birria tacos"},{n:"Turning Point",t:"food",d:"Breakfast mimosas"}]},
  {city:"Rome",country:"Italy",lat:41.90,lng:12.50,spots:[{n:"Osteria da Fortunata",t:"food",d:"Good pasta"}]},
  {city:"Florence",country:"Italy",lat:43.77,lng:11.26,spots:[{n:"Caffe Vettori",t:"food",d:"Local coffee"},{n:"Street Vintage",t:"shopping",d:"Vintage store"}]},
  {city:"Milan",country:"Italy",lat:45.46,lng:9.19,spots:[{n:"All'Antico Vinaio",t:"food",d:"Amazing sandwiches"},{n:"Just Me",t:"club",d:"Best Wed club"},{n:"Hollywood",t:"club",d:"Bring a girl"}]},
  {city:"Zürich",country:"Switzerland",lat:47.38,lng:8.54,spots:[{n:"5 Hotel Spa",t:"activity",d:"Spa is fire"}]},
  {city:"St. Moritz",country:"Switzerland",lat:46.49,lng:9.84,spots:[{n:"Monopol Spa",t:"activity",d:"$30 day pass"}]},
  {city:"New Delhi",country:"India",lat:28.61,lng:77.21,spots:[{n:"Roseate House",t:"hotel",d:"~$130/night"}]},
  {city:"Tallahassee",country:"USA",lat:30.44,lng:-84.28,spots:[{n:"Maple St Biscuit",t:"food",d:"Gas breakfast"},{n:"Madison Social",t:"food",d:"College town fire"}]},
  {city:"Las Vegas",country:"USA",lat:36.17,lng:-115.14,spots:[{n:"High Roller",t:"activity",d:"Ferris wheel ~$50"},{n:"XS at Wynn",t:"club",d:"Fire club"},{n:"Cheri Rooftop",t:"food",d:"French, cool view"},{n:"Fremont St",t:"spot",d:"Old Vegas insane TVs"}]},
  {city:"Cancun",country:"Mexico",lat:21.16,lng:-86.85,spots:[{n:"Da Cave",t:"club",d:"Insane club"}]},
  {city:"Barranquilla",country:"Colombia",lat:10.97,lng:-74.78,spots:[{n:"STORI DAMONE",t:"food",d:"High-end ~$25"},{n:"Buenavista Mall",t:"shopping",d:"Massive mall"}]},
  {city:"London",country:"UK",lat:51.51,lng:-0.13,spots:[{n:"Flat Iron Soho",t:"food",d:"Steak 20 pounds"},{n:"Breakfast Club",t:"food",d:"Full Monty"},{n:"Waxy O'Connor's",t:"bar",d:"Massive Soho bar"},{n:"Be At One",t:"bar",d:"Popping good crowd"}]},
  {city:"Paris",country:"France",lat:48.86,lng:2.35,spots:[{n:"Pachamma",t:"club",d:"6 floors insane"},{n:"Relais Entrecôte",t:"food",d:"Steak frites ★8.8"},{n:"Dans Le Noir",t:"food",d:"Blind eating"},{n:"Caveau Huchette",t:"activity",d:"Jazz club"},{n:"Eggs and Co",t:"food",d:"Breakfast Benedict"}]},
  {city:"Lisbon",country:"Portugal",lat:38.72,lng:-9.14,spots:[{n:"Adamastor",t:"bar",d:"Beer view cheap"},{n:"Pink Street",t:"bar",d:"Pregame"},{n:"Bairro Alto",t:"bar",d:"Bars/clubs"}]},
  {city:"Boston",country:"USA",lat:42.36,lng:-71.06,spots:[{n:"Al Dente Area",t:"spot",d:"Like Soho"}]},
  {city:"Seattle",country:"USA",lat:47.61,lng:-122.33,spots:[{n:"Portage Bay Cafe",t:"food",d:"Good food"}]},
  {city:"Hamptons",country:"USA",lat:40.96,lng:-72.18,spots:[{n:"Surf Lodge",t:"bar",d:"6-9pm Montauk"},{n:"Bounce",t:"club",d:"Sat only"},{n:"Montauk Project",t:"club",d:"After 11pm"}]},
  {city:"Austin",country:"USA",lat:30.27,lng:-97.74,spots:[{n:"Terry Black's",t:"food",d:"Gas BBQ"},{n:"Two Hands",t:"food",d:"Fire breakfast"}]},
  {city:"Miami",country:"USA",lat:25.76,lng:-80.19,spots:[{n:"Ojo de Agua",t:"food",d:"Mexican breakfast"},{n:"Pura Vida",t:"food",d:"Açaí brunch"},{n:"Balans Hookah",t:"bar",d:"Outdoor no ID"},{n:"Gekko",t:"club",d:"Lounge club"},{n:"Moxies",t:"food",d:"Good dinner"}]},
  {city:"Chicago",country:"USA",lat:41.88,lng:-87.63,spots:[{n:"RH Cafe",t:"food",d:"Gas food ★9.0"},{n:"Trivoli Tavern",t:"food",d:"All types ★8.0"},{n:"LÝRA",t:"food",d:"Nice dinner"},{n:"Gibsons",t:"food",d:"Very good"}]},
  {city:"San Diego",country:"USA",lat:32.72,lng:-117.16,spots:[{n:"Flamingo Deck",t:"bar",d:"Espresso martini"},{n:"La Jolla",t:"spot",d:"Nice area + hike"}]},
  {city:"Tampa",country:"USA",lat:27.95,lng:-82.46,spots:[{n:"Naked Farmer",t:"food",d:"Better Chipotle ★9.0"},{n:"Oxford Exchange",t:"food",d:"Soho House vibes"}]},
  {city:"Tokyo",country:"Japan",lat:35.68,lng:139.65,spots:[{n:"Helen's Bar",t:"bar",d:"¥500 infinite alcohol"},{n:"Atom Club",t:"club",d:"3 stories Shibuya"},{n:"Happy Pancakes",t:"food",d:"Fluffy must try"},{n:"200¥ Moonwalk",t:"bar",d:"200 yen drinks"},{n:"Rambling St",t:"bar",d:"Fire bar strip"},{n:"BAIA",t:"club",d:"Euro/USA vibe"},{n:"Yo Yogi Park",t:"activity",d:"Basketball pickup"},{n:"Meiji Shrine",t:"spot",d:"Nature vibes"}]},
  {city:"Washington DC",country:"USA",lat:38.91,lng:-77.04,spots:[{n:"Shoto",t:"food",d:"Japanese dress code"}]},
  {city:"Charlotte",country:"USA",lat:35.23,lng:-80.84,spots:[{n:"Fahrenheit",t:"food",d:"Cool rooftop"},{n:"Whitewater Ctr",t:"activity",d:"Rafting zip lining"}]},
  {city:"Detroit",country:"USA",lat:42.33,lng:-83.05,spots:[{n:"Prime & Proper",t:"food",d:"Best steak 2oz wagyu"},{n:"Mad Nice",t:"food",d:"Pink pizza place"},{n:"Sweetwaters",t:"food",d:"Tenders ★8.4"}]},
  {city:"Mykonos",country:"Greece",lat:37.45,lng:25.33,spots:[{n:"Nice n Easy",t:"food",d:"Best on island"},{n:"Nammos",t:"club",d:"Sat party 3pm+"},{n:"Scorpios",t:"club",d:"Most expensive"},{n:"Queen",t:"club",d:"10s+ table needed"},{n:"Bonbonniere",t:"club",d:"$400 min table"},{n:"Toy Room",t:"club",d:"$1.5k packed"},{n:"Raceland",t:"activity",d:"Go-karts till 4am"}]},
  {city:"Nashville",country:"USA",lat:36.16,lng:-86.78,spots:[{n:"Honky Tonk Bars",t:"bar",d:"The bar scene"}]},
  {city:"Algarve",country:"Portugal",lat:37.02,lng:-7.93,spots:[{n:"Old Town",t:"food",d:"Restaurants"},{n:"The Strip",t:"bar",d:"Bars clubs"}]},
  {city:"Philadelphia",country:"USA",lat:39.95,lng:-75.17,spots:[{n:"Philly",t:"spot",d:"Spots TBD"}]},
];

const tagColors = {food:"#e63946",bar:"#f7c948",club:"#a855f7",activity:"#22c55e",hotel:"#3b82f6",spot:"#ec4899",shopping:"#fb923c"};
const tacoIdx = {NYC:2,Scottsdale:0,Chicago:22,London:14,"Washington DC":26,Philadelphia:32,"Scotch Plains":3,Tampa:24,Austin:20,Paris:15,Detroit:28,Miami:21};

const randomActivities = [
  { name: "Mini Golf", emoji: "⛳" },
  { name: "Top Golf", emoji: "🏌️" },
  { name: "Hibachi Dinner", emoji: "🔥" },
  { name: "Boat / Jetski", emoji: "🚤" },
  { name: "Helicopter Ride", emoji: "🚁" },
  { name: "Cook Together (grocery store & all)", emoji: "👨‍🍳" },
  { name: "Drive by Insanely Expensive Mansions", emoji: "🏠" },
  { name: "Cigar Lounge", emoji: "🚬" },
  { name: "ATV / Dune Buggy", emoji: "🏎️" },
  { name: "Resort Day Pass (nice hotel pool)", emoji: "🏊" },
  { name: "Ride Bikes or Electric Scooters", emoji: "🛴" },
  { name: "Movie Theater", emoji: "🎬" },
  { name: "Gun Range", emoji: "🎯" },
  { name: "Random Sports Game (NBA, MLB)", emoji: "🏀" },
  { name: "Shooting Range / Paintball", emoji: "🔫" },
  { name: "Bowling", emoji: "🎳" },
  { name: "Padel / Pickleball", emoji: "🎾" },
  { name: "Wine Bar", emoji: "🍷" },
  { name: "Rooftop Bar / Lounge", emoji: "🌃" },
  { name: "Campfire with S'mores", emoji: "🏕️" },
  { name: "Greek / Party Restaurant", emoji: "🎉" },
  { name: "Bath House — Sauna, Cold Plunge", emoji: "🧖" },
  { name: "Comedy Club", emoji: "😂" },
  { name: "Quiplash / Jackbox Party Pack", emoji: "🎮" },
  { name: "Live Tinder on Screen (group of 10)", emoji: "📱" },
  { name: "Get a Massage", emoji: "💆" },
  { name: "Ski / Snowboard", emoji: "⛷️" },
  { name: "Poker Night", emoji: "♠️" },
  { name: "Play 2K on Xbox", emoji: "🎮" },
  { name: "Ping Pong / Arcade", emoji: "🏓" },
  { name: "Basketball", emoji: "🏀" },
  { name: "Tennis / Paddle", emoji: "🎾" },
  { name: "Beach Day", emoji: "🏖️" },
  { name: "Lifetime Fitness", emoji: "💪" },
  { name: "Soho House / Hookah Lounge", emoji: "💨" },
  { name: "Broadway / Cabaret Show", emoji: "🎭" },
  { name: "Concert", emoji: "🎵" },
  { name: "Club Night", emoji: "🪩" },
  { name: "Jetski", emoji: "🌊" },
  { name: "UFC / Boxing Match", emoji: "🥊" },
];

function getTacos(city) {
  return tacoPeople.filter(p => {
    if (city === "New York City" && p.city === "NYC") return true;
    if (city === "Hoboken/NJ" && (p.city === "Scotch Plains")) return true;
    return p.city === city;
  });
}

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

// ═══════════════════════════════════════════
// TOPOJSON DECODER (minimal inline implementation)
// ═══════════════════════════════════════════
function topoFeature(topo, obj) {
  if (typeof obj === "string") obj = topo.objects[obj];
  function decodeArc(arcIdx) {
    const arc = topo.arcs[arcIdx < 0 ? ~arcIdx : arcIdx];
    const coords = [];
    let x = 0, y = 0;
    for (const pt of arc) { x += pt[0]; y += pt[1]; coords.push([x, y]); }
    if (topo.transform) {
      const { scale, translate } = topo.transform;
      return coords.map(c => [c[0] * scale[0] + translate[0], c[1] * scale[1] + translate[1]]);
    }
    return coords;
  }
  function decodeRing(arcs) {
    let coords = [];
    for (const a of arcs) {
      let decoded = decodeArc(a);
      if (a < 0) decoded = decoded.slice().reverse();
      if (coords.length) decoded = decoded.slice(1);
      coords = coords.concat(decoded);
    }
    return coords;
  }
  function decodeGeom(geom) {
    if (geom.type === "Polygon") return { type: "Polygon", coordinates: geom.arcs.map(decodeRing) };
    if (geom.type === "MultiPolygon") return { type: "MultiPolygon", coordinates: geom.arcs.map(poly => poly.map(decodeRing)) };
    return null;
  }
  if (obj.type === "GeometryCollection") {
    return { type: "FeatureCollection", features: obj.geometries.map(g => ({ type: "Feature", properties: g.properties || {}, geometry: decodeGeom(g) })).filter(f => f.geometry) };
  }
  return { type: "Feature", properties: obj.properties || {}, geometry: decodeGeom(obj) };
}

// ═══════════════════════════════════════════
// EARTH TEXTURE FROM REAL GEO DATA
// ═══════════════════════════════════════════
async function generateEarthTexture() {
  const W = 4096, H = 2048;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  // Ocean gradient — rich saturated blue
  const og = ctx.createLinearGradient(0, 0, 0, H);
  og.addColorStop(0, "#0a2a52"); og.addColorStop(0.2, "#0f3468"); og.addColorStop(0.5, "#133d78");
  og.addColorStop(0.8, "#0f3468"); og.addColorStop(1, "#0a2a52");
  ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);

  // Ocean depth texture
  for (let i = 0; i < 20000; i++) {
    ctx.fillStyle = `rgba(30,80,160,${Math.random() * 0.07})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 5, 1);
  }
  // Subtle lighter swirls
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(50,120,200,${Math.random() * 0.04})`;
    ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 8, 0, Math.PI * 2); ctx.fill();
  }

  // Grid lines — visible
  ctx.strokeStyle = "rgba(100,180,255,0.07)"; ctx.lineWidth = 0.6;
  for (let la = -80; la <= 80; la += 10) { const y = H / 2 - (la / 180) * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let lo = -180; lo <= 180; lo += 15) { const x = (lo + 180) / 360 * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

  // Helper to draw GeoJSON polygons
  function lngLatToXY(lng, lat) {
    return [(lng + 180) / 360 * W, (90 - lat) / 180 * H];
  }
  function drawRing(ring) {
    for (let i = 0; i < ring.length; i++) {
      const [x, y] = lngLatToXY(ring[i][0], ring[i][1]);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }
  function drawPolygon(coords) {
    coords.forEach(ring => drawRing(ring));
  }
  function drawFeature(geom, fillStyle, strokeStyle, lineWidth) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    if (geom.type === "Polygon") drawPolygon(geom.coordinates);
    else if (geom.type === "MultiPolygon") geom.coordinates.forEach(p => drawPolygon(p));
    ctx.fill(); ctx.stroke();
  }

  // Fetch real country data
  try {
    const worldRes = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
    const worldTopo = await worldRes.json();
    const countries = topoFeature(worldTopo, "countries");

    // Draw country fills — vivid saturated green
    countries.features.forEach(f => {
      if (f.geometry) drawFeature(f.geometry, "rgba(18,110,55,0.92)", "rgba(40,220,120,0.6)", 1.0);
    });

    // Draw country borders again (bright crisp lines)
    countries.features.forEach(f => {
      if (f.geometry) drawFeature(f.geometry, "rgba(0,0,0,0)", "rgba(60,240,140,0.5)", 0.8);
    });
  } catch (e) {
    console.warn("World data fetch failed, using fallback", e);
  }

  // Fetch US state borders
  try {
    const usRes = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
    const usTopo = await usRes.json();
    const states = topoFeature(usTopo, "states");

    states.features.forEach(f => {
      if (f.geometry) drawFeature(f.geometry, "rgba(0,0,0,0)", "rgba(120,240,180,0.35)", 0.6);
    });
  } catch (e) {
    console.warn("US states fetch failed", e);
  }

  // Location glows — bright gold markers
  locations.forEach(loc => {
    const [px, py] = lngLatToXY(loc.lng, loc.lat);
    const g = ctx.createRadialGradient(px, py, 0, px, py, 16);
    g.addColorStop(0, "rgba(247,201,72,0.9)"); g.addColorStop(0.3, "rgba(247,201,72,0.35)"); g.addColorStop(1, "rgba(247,201,72,0)");
    ctx.fillStyle = g; ctx.fillRect(px - 16, py - 16, 32, 32);
    ctx.fillStyle = "rgba(255,220,100,1)"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
  });

  return new THREE.CanvasTexture(c);
}

function createTacoTex() {
  const s = 64, c = document.createElement("canvas"); c.width = s; c.height = s;
  const x = c.getContext("2d"); x.font = "48px serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("🌮", s / 2, s / 2);
  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════
export default function TacoGlobe() {
  const mountRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("cities");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const stateRef = useRef({ drag: false, moved: false, prev: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, auto: false, target: null, zoomTarget: 3.8, zooming: false });
  const flyToRef = useRef(null);

  const flyTo = useCallback((idx) => {
    const l = locations[idx];
    const phi = (90 - l.lat) * Math.PI / 180, theta = (l.lng + 180) * Math.PI / 180;
    stateRef.current.target = { y: theta - Math.PI, x: -(phi - Math.PI / 2) };
    stateRef.current.auto = false;
    stateRef.current.vel = { x: 0, y: 0 };
    stateRef.current.zoomTarget = 2.6;
    stateRef.current.zooming = true;
    setSelected(idx);
    setMenuOpen(false);
  }, []);

  flyToRef.current = flyTo;

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    let disposed = false;
    const w = mount.clientWidth, h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0.3, 3.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050510);
    mount.appendChild(renderer.domElement);

    const R = 1.4;
    // Placeholder globe
    const globeMat = new THREE.MeshPhongMaterial({ color: 0x2288bb, emissive: 0x112244, emissiveIntensity: 0.5, specular: 0x446688, shininess: 15 });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 80, 80), globeMat);
    scene.add(globe);

    // Load real texture async
    generateEarthTexture().then(tex => {
      if (!disposed) { globeMat.map = tex; globeMat.needsUpdate = true; setLoading(false); }
    });

    // Atmosphere
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec3 vN;void main(){float i=pow(0.55-dot(vN,vec3(0,0,1)),2.5);gl_FragColor=vec4(0.35,0.62,1.0,1)*i*0.28;}`,
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.08, 64, 64), atmosMat));

    // Lights
    scene.add(new THREE.AmbientLight(0x6688aa, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 1.0); dl.position.set(5, 3, 5); scene.add(dl);
    const pl2 = new THREE.PointLight(0x4488cc, 0.4, 15); pl2.position.set(-4, -2, 3); scene.add(pl2);

    // Stars
    const sv = [];
    for (let i = 0; i < 2500; i++) sv.push((Math.random() - .5) * 60, (Math.random() - .5) * 60, (Math.random() - .5) * 60);
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 })));

    // Pins
    const pinGroup = new THREE.Group(); scene.add(pinGroup);
    const tacoTex = createTacoTex();
    const hitboxes = [];

    locations.forEach((loc, i) => {
      const base = latLngToVec3(loc.lat, loc.lng, R + 0.015);
      const top = latLngToVec3(loc.lat, loc.lng, R + 0.065);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.05, 6), new THREE.MeshBasicMaterial({ color: 0xf7c948 }));
      const mid = base.clone().lerp(top, 0.5); stem.position.copy(mid); stem.lookAt(new THREE.Vector3(0, 0, 0)); stem.rotateX(Math.PI / 2); pinGroup.add(stem);

      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tacoTex, transparent: true, depthWrite: false }));
      sprite.position.copy(top); sprite.scale.set(0.09, 0.09, 1); pinGroup.add(sprite);

      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), new THREE.MeshBasicMaterial({ color: 0xf7c948, transparent: true, opacity: 0.1 }));
      glow.position.copy(top); pinGroup.add(glow);

      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.copy(top); hit.userData = { index: i }; pinGroup.add(hit);
      hitboxes.push({ sprite, glow, hit, stem });
    });

    const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
    const S = stateRef.current;

    const getXY = e => {
      if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };
    const onDown = e => {
      const p = getXY(e);
      S.drag = true; S.moved = false; S.prev = p; S.vel = { x: 0, y: 0 }; S.auto = false; S.target = null;
    };
    const onMove = e => {
      const p = getXY(e);
      if (S.drag) {
        const dx = p.x - S.prev.x, dy = p.y - S.prev.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) S.moved = true;
        S.vel = { x: dx * 0.005, y: dy * 0.005 };
        globe.rotation.y += S.vel.x; pinGroup.rotation.y += S.vel.x;
        globe.rotation.x = Math.max(-1.2, Math.min(1.2, globe.rotation.x + S.vel.y));
        pinGroup.rotation.x = globe.rotation.x;
        S.prev = p;
      }
    };
    const onUp = () => { S.drag = false; };
    const onClick = e => {
      if (S.moved) return;
      const p = getXY(e);
      const rect = mount.getBoundingClientRect();
      mouse.x = ((p.x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((p.y - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(hitboxes.map(h => h.hit));
      if (hits.length > 0) flyToRef.current(hits[0].object.userData.index);
    };
    const onWheel = e => { camera.position.z = Math.max(2.2, Math.min(7, camera.position.z + e.deltaY * 0.003)); S.zoomTarget = camera.position.z; S.zooming = false; };

    // Pinch-to-zoom for mobile
    let lastPinchDist = 0;
    const onTouchStart2 = e => { if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; lastPinchDist = Math.sqrt(dx*dx+dy*dy); } };
    const onTouchMove2 = e => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const delta = (lastPinchDist - dist) * 0.01;
        camera.position.z = Math.max(2.2, Math.min(7, camera.position.z + delta));
        lastPinchDist = dist;
      }
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onDown); el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp); el.addEventListener("click", onClick);
    el.addEventListener("wheel", onWheel);
    el.addEventListener("touchstart", onTouchStart2, { passive: false });
    el.addEventListener("touchmove", onTouchMove2, { passive: false });
    el.style.cursor = "grab"; el.style.touchAction = "none";

    let t = 0, selLocal = -1, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate); t += 0.01;

      // NO auto-rotate — globe stays still unless interacted with

      // Fly-to rotation
      if (S.target) {
        const spd = 0.045;
        globe.rotation.y += (S.target.y - globe.rotation.y) * spd;
        globe.rotation.x += (S.target.x - globe.rotation.x) * spd;
        pinGroup.rotation.y = globe.rotation.y; pinGroup.rotation.x = globe.rotation.x;
        if (Math.abs(S.target.y - globe.rotation.y) < 0.003 && Math.abs(S.target.x - globe.rotation.x) < 0.003) {
          S.target = null;
        }
      }

      // Drag inertia (decays to stop, NOT back to auto-rotate)
      if (!S.drag && !S.target) {
        S.vel.x *= 0.94; S.vel.y *= 0.94;
        if (Math.abs(S.vel.x) > 0.0002 || Math.abs(S.vel.y) > 0.0002) {
          globe.rotation.y += S.vel.x;
          globe.rotation.x = Math.max(-1.2, Math.min(1.2, globe.rotation.x + S.vel.y));
          pinGroup.rotation.y = globe.rotation.y; pinGroup.rotation.x = globe.rotation.x;
        }
      }

      // Smooth camera zoom
      if (S.zooming) {
        const dz = S.zoomTarget - camera.position.z;
        camera.position.z += dz * 0.06;
        if (Math.abs(dz) < 0.01) { camera.position.z = S.zoomTarget; S.zooming = false; }
      }

      // Pin pulse animation
      hitboxes.forEach((p, i) => {
        const pulse = 1 + Math.sin(t * 2.5 + i * 0.7) * 0.15;
        const isSel = selLocal === i;
        p.sprite.scale.setScalar(isSel ? 0.14 : 0.09 * pulse);
        p.glow.scale.setScalar(isSel ? 2.2 : pulse * 1.3);
        p.glow.material.opacity = isSel ? 0.35 : 0.08 + Math.sin(t * 2.5 + i) * 0.05;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
      setIsMobile(window.innerWidth < 700);
    };
    window.addEventListener("resize", onResize);

    // Expose selLocal updater
    mount._setSelLocal = (v) => { selLocal = v; };

    return () => { disposed = true; cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); mount.removeChild(el); renderer.dispose(); };
  }, []);

  useEffect(() => { if (mountRef.current?._setSelLocal) mountRef.current._setSelLocal(selected ?? -1); }, [selected]);

  const loc = selected !== null ? locations[selected] : null;
  const tacos = loc ? getTacos(loc.city) : [];
  const totalSpots = locations.reduce((s, l) => s + l.spots.length, 0);
  const countryCount = [...new Set(locations.map(l => l.country))].length;

  return (
    <div style={{ width: "100%", height: "100vh", background: "#050510", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {loading && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050510" }}>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, background: "linear-gradient(135deg,#f7c948,#ee6723,#e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>🌮 TACO GLOBE</div>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Loading map data...</div>
          <div style={{ width: 140, height: 2, background: "#1a1a24", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg,#f7c948,#ee6723)", borderRadius: 2, animation: "loadPulse 1s ease infinite alternate" }} />
          </div>
          <style>{`@keyframes loadPulse{from{width:30%}to{width:90%}}`}</style>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        padding: isMobile ? "10px 12px" : "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(180deg,rgba(5,5,16,0.92) 50%,transparent)",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🌮</span><span style={{ background: "linear-gradient(135deg,#f7c948,#ee6723,#e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TACO GLOBE</span>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 12 : 20 }}>
          {[["Cities", locations.length], ["Spots", totalSpots], ["Tacos", tacoPeople.length], ["Countries", countryCount]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 13 : 16, color: "#f7c948" }}>{v}</div>
              <div style={{ fontSize: isMobile ? 6 : 7, textTransform: "uppercase", letterSpacing: isMobile ? 1 : 2, color: "#555" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RANDOM ACTIVITIES BUTTON ─── */}
      <button onClick={() => setActivitiesOpen(true)} style={{
        position: "absolute", top: isMobile ? 50 : 56, left: "50%", transform: "translateX(-50%)", zIndex: 12,
        padding: isMobile ? "8px 18px" : "7px 20px", borderRadius: 20,
        background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)",
        color: "#22c55e", fontWeight: 700, fontSize: isMobile ? 12 : 11,
        cursor: "pointer", backdropFilter: "blur(10px)", fontFamily: "inherit",
        letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6,
        pointerEvents: "auto", whiteSpace: "nowrap",
      }}>
        🎲 Random Activities
      </button>

      {/* ─── ACTIVITIES MODAL ─── */}
      {activitiesOpen && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", pointerEvents: "auto",
        }} onClick={(e) => { if (e.target === e.currentTarget) setActivitiesOpen(false); }}>
          <div style={{
            width: isMobile ? "100%" : 420, maxHeight: isMobile ? "80vh" : "70vh",
            background: "rgba(12,12,24,0.98)", backdropFilter: "blur(20px)",
            border: isMobile ? "none" : "1px solid rgba(34,197,94,0.2)",
            borderRadius: isMobile ? "20px 20px 0 0" : 16,
            overflow: "hidden",
            animation: isMobile ? "sheetUp .3s ease" : "popIn .25s ease",
          }}>
            <style>{`@keyframes popIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

            {/* Handle bar on mobile */}
            {isMobile && <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "10px auto 4px" }} />}

            <div style={{ padding: isMobile ? "12px 16px 8px" : "18px 20px 12px", borderBottom: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? 18 : 17, color: "#fff" }}>🎲 Random Activities</div>
                <div style={{ fontSize: isMobile ? 10 : 9, color: "#22c55e", textTransform: "uppercase", letterSpacing: 2, marginTop: 2 }}>{randomActivities.length} things to do</div>
              </div>
              <button onClick={() => setActivitiesOpen(false)} style={{
                width: isMobile ? 32 : 26, height: isMobile ? 32 : 26, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa",
                fontSize: isMobile ? 18 : 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>

            <div style={{ padding: isMobile ? "8px 14px 24px" : "8px 18px 20px", overflowY: "auto", maxHeight: isMobile ? "calc(80vh - 80px)" : "calc(70vh - 80px)" }}>
              {randomActivities.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: isMobile ? 12 : 10,
                  padding: isMobile ? "10px 4px" : "8px 4px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{
                    width: isMobile ? 36 : 30, height: isMobile ? 36 : 30, borderRadius: 8,
                    background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isMobile ? 18 : 15, flexShrink: 0,
                  }}>{a.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 14 : 12, color: "#ddd" }}>{a.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE: Menu toggle button ─── */}
      {isMobile && !selected && !activitiesOpen && (
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 20,
          padding: "10px 24px", borderRadius: 24,
          background: menuOpen ? "rgba(247,201,72,0.2)" : "rgba(20,20,40,0.85)",
          border: "1px solid rgba(247,201,72,0.3)", color: "#f7c948",
          fontWeight: 700, fontSize: 12, cursor: "pointer", backdropFilter: "blur(12px)",
          fontFamily: "inherit", letterSpacing: 1,
        }}>
          {menuOpen ? "✕ Close" : "☰ Explore"}
        </button>
      )}

      {/* ─── DESKTOP: Left sidebar ─── */}
      {!isMobile && (
        <div style={{
          position: "absolute", top: 52, left: 0, bottom: 0, width: 210, zIndex: 10,
          background: "linear-gradient(90deg,rgba(5,5,16,0.9) 75%,transparent)",
          overflowY: "auto", padding: "8px 10px 30px", pointerEvents: "auto",
        }}>
          {renderList()}
        </div>
      )}

      {/* ─── MOBILE: Bottom drawer ─── */}
      {isMobile && menuOpen && !selected && (
        <div style={{
          position: "absolute", bottom: 56, left: 0, right: 0, zIndex: 15,
          maxHeight: "55vh", overflowY: "auto",
          background: "rgba(8,8,20,0.96)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(247,201,72,0.15)",
          borderRadius: "16px 16px 0 0", padding: "12px 14px 20px",
          pointerEvents: "auto",
          animation: "sheetUp .3s ease",
        }}>
          <style>{`@keyframes sheetUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
          {renderList()}
        </div>
      )}

      {/* ─── DESKTOP: Right info panel ─── */}
      {loc && !isMobile && (
        <div style={{
          position: "absolute", top: 52, right: 14, width: 320, maxHeight: "calc(100vh - 70px)", zIndex: 10,
          background: "rgba(8,8,20,0.95)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(247,201,72,0.12)", borderRadius: 12,
          overflow: "hidden", pointerEvents: "auto", animation: "slideIn .35s ease",
        }}>
          <style>{`@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
          {renderPanel()}
        </div>
      )}

      {/* ─── MOBILE: Bottom info panel ─── */}
      {loc && isMobile && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
          maxHeight: "65vh", overflowY: "auto",
          background: "rgba(8,8,20,0.97)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(247,201,72,0.15)",
          borderRadius: "16px 16px 0 0",
          pointerEvents: "auto", animation: "sheetUp .3s ease",
        }}>
          <style>{`@keyframes sheetUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "8px auto 4px" }} />
          {renderPanel()}
        </div>
      )}

      {/* Footer hint — desktop only */}
      {!isMobile && !selected && (
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", zIndex: 10, fontSize: 8, color: "#2a2a3a", letterSpacing: 2, textTransform: "uppercase", pointerEvents: "none" }}>
          Drag to rotate · Scroll to zoom · Click a 🌮 to explore
        </div>
      )}
    </div>
  );

  // ─── SHARED RENDER HELPERS ───

  function renderList() {
    return (<>
      <div style={{ display: "flex", gap: 3, marginBottom: 8, background: "rgba(20,20,40,0.6)", borderRadius: 6, padding: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
        {["cities", "tacos"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "6px 0", background: tab === t ? "rgba(247,201,72,0.15)" : "transparent", border: "none", color: tab === t ? "#f7c948" : "#555", fontSize: isMobile ? 11 : 9, textTransform: "uppercase", letterSpacing: 1.5, cursor: "pointer", borderRadius: 4, fontFamily: "inherit", fontWeight: 600 }}>{t}</button>
        ))}
      </div>
      {tab === "cities" && locations.map((l, i) => (
        <button key={i} onClick={() => flyTo(i)} style={{
          display: "flex", alignItems: "center", gap: 6, width: "100%",
          padding: isMobile ? "8px 8px" : "5px 6px",
          background: selected === i ? "rgba(247,201,72,0.12)" : "transparent",
          border: "none", color: selected === i ? "#f7c948" : "#999",
          fontSize: isMobile ? 12 : 9.5, cursor: "pointer", borderRadius: 4, textAlign: "left", fontFamily: "inherit",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f7c948", opacity: selected === i ? 1 : 0.4, flexShrink: 0 }} />
          {l.city}
          <span style={{ marginLeft: "auto", fontSize: isMobile ? 10 : 7, color: "#555" }}>{l.spots.length}</span>
        </button>
      ))}
      {tab === "tacos" && tacoPeople.map((p, i) => (
        <button key={i} onClick={() => { const idx = tacoIdx[p.city]; if (idx !== undefined) flyTo(idx); }} style={{
          display: "flex", alignItems: "center", gap: 6, width: "100%",
          padding: isMobile ? "8px 8px" : "5px 6px",
          background: "transparent", border: "none", color: "#999",
          fontSize: isMobile ? 12 : 9.5, cursor: "pointer", borderRadius: 4, textAlign: "left", fontFamily: "inherit",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ee6723", flexShrink: 0, opacity: 0.5 }} />
          {p.name}
          <span style={{ marginLeft: "auto", fontSize: isMobile ? 10 : 7, color: "#555", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.city}</span>
        </button>
      ))}
    </>);
  }

  function renderPanel() {
    if (!loc) return null;
    return (<>
      <div style={{ padding: isMobile ? "14px 16px 10px" : "16px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
        <div style={{ fontWeight: 800, fontSize: isMobile ? 20 : 18, color: "#fff" }}>{loc.city}</div>
        <div style={{ fontSize: isMobile ? 10 : 9, color: "#f7c948", textTransform: "uppercase", letterSpacing: 2, marginTop: 2 }}>{loc.country}</div>
        <button onClick={() => { setSelected(null); stateRef.current.zoomTarget = 3.8; stateRef.current.zooming = true; }} style={{
          position: "absolute", top: isMobile ? 14 : 12, right: isMobile ? 14 : 12,
          width: isMobile ? 32 : 24, height: isMobile ? 32 : 24, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa",
          fontSize: isMobile ? 18 : 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>
      <div style={{ padding: isMobile ? "10px 16px 24px" : "8px 16px 16px", overflowY: "auto", maxHeight: isMobile ? "calc(65vh - 80px)" : "calc(100vh - 170px)" }}>
        {tacos.length > 0 && (<>
          <div style={{ fontWeight: 700, fontSize: isMobile ? 10 : 9, textTransform: "uppercase", letterSpacing: 2, color: "#ee6723", margin: "8px 0 4px", paddingBottom: 2, borderBottom: "1px solid rgba(238,103,35,0.2)" }}>🌮 Tacos Here ({tacos.length})</div>
          {tacos.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: isMobile ? "7px 0" : "5px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ width: isMobile ? 26 : 22, height: isMobile ? 26 : 22, borderRadius: "50%", background: "linear-gradient(135deg,#ee6723,#f7c948)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 12 : 10, flexShrink: 0 }}>🌮</div>
              <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 10.5, color: "#ddd" }}>{p.name}</div>
            </div>
          ))}
        </>)}
        <div style={{ fontWeight: 700, fontSize: isMobile ? 10 : 9, textTransform: "uppercase", letterSpacing: 2, color: "#f7c948", margin: "12px 0 4px", paddingBottom: 2, borderBottom: "1px solid rgba(247,201,72,0.2)" }}>📍 Spots ({loc.spots.length})</div>
        {loc.spots.map((s, i) => (
          <div key={i} style={{ padding: isMobile ? "9px 0" : "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontWeight: 700, fontSize: isMobile ? 14 : 11, color: "#e8e4df", marginBottom: 2 }}>{s.n}</div>
            <span style={{ display: "inline-block", padding: "2px 6px", borderRadius: 20, fontSize: isMobile ? 9 : 7, textTransform: "uppercase", letterSpacing: 1, background: `${tagColors[s.t]}22`, color: tagColors[s.t], marginBottom: 3 }}>{s.t}</span>
            <div style={{ fontSize: isMobile ? 12 : 9.5, lineHeight: 1.55, color: "#888" }}>{s.d}</div>
          </div>
        ))}
      </div>
    </>);
  }
}
