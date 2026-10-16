// Génère les captures et la vidéo de démonstration à partir de données fictives.
// Prérequis : Node 22+, Google Chrome, ffmpeg (vidéo seulement).
//   python3 -m http.server 8780        (depuis la racine du dépôt, dans un autre terminal)
//   node tools/capture.mjs OUT_DIR shots|video
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2]);
const MODE = process.argv[3] || 'shots';
const BASE = 'http://127.0.0.1:8780/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

/* ---------- données de démonstration (fictives, sauf les projets personnels publics) ---------- */
function seedFn(opts) {
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  const now = new Date().toISOString();
  const base = { company: '', sector: '', domains: [], location: '', website: '', channel: '', priority: 'mid', status: 'todo', title: '', offerUrl: '', offerRef: '', durationMonths: 4, startDate: '2027-04-01', workMode: '', pay: '', missions: '', profile: '', constraints: '', realNeed: '', softSkills: [], team: '', process: '', whyMe: '', skills: [], keySkills: [], provided: [], contacts: [], events: [], projectIds: [], projectNote: '', nextAction: '', nextDate: '', deadline: '', appliedAt: '', notes: '', createdAt: now, updatedAt: now };
  const doc = (kind, label, date) => ({ id: 'd' + Math.random().toString(36).slice(2, 7), kind, label, url: '', date, note: '' });
  const ev = (date, type, text) => ({ id: 'e' + Math.random().toString(36).slice(2, 7), date, type, text });
  const apps = {};
  const A = (id, o) => { apps[id] = Object.assign({}, base, o); };
  A('orion', {
    company: 'Orion Cybersécurité', sector: 'Conseil en cybersécurité', domains: ['Pentest / Red team'], location: 'Paris', channel: 'Forum / salon', priority: 'high', status: 'interview',
    title: 'Stagiaire pentest, missions Active Directory et web', durationMonths: 4, startDate: '2027-04-01', workMode: 'hybrid', pay: 1400, offerRef: 'ORI-2027-STG-07',
    missions: 'Participer à des audits d’intrusion internes et web chez des clients bancaires, rédiger les rapports, contribuer à l’outillage interne.',
    profile: 'Étudiant en école d’ingénieurs, bases solides en réseaux et systèmes, première pratique du pentest (CTF, projets).',
    constraints: 'Nationalité française exigée (enquête de sécurité).',
    skills: ['Python', 'Active Directory', 'Burp Suite', 'Linux', 'Docker', 'Réseaux'], keySkills: ['Active Directory', 'Python'], softSkills: ['Autonomie', 'Rigueur', 'Esprit d’équipe'],
    realNeed: 'Renforcer l’équipe pentest sur des missions Active Directory pour des clients bancaires : ils cherchent quelqu’un d’autonome, capable d’écrire un rapport clair pour un lecteur non technique.',
    team: 'Équipe de 6 pentesteurs, tuteur senior', process: 'Échange RH, entretien technique, mini-CTF de 2 h',
    whyMe: 'CyberQuest montre ma pratique offensive, Aegis Mini SOC ma vision défensive : je sais aussi rédiger ce que je trouve.',
    appliedAt: d(-14), nextAction: 'Mini-CTF technique', nextDate: d(3),
    provided: [doc('cv', 'CV v3, orienté pentest', d(-14)), doc('letter', 'Lettre, pentest', d(-14)), doc('portfolio', 'Portfolio', d(-14)), doc('github', 'GitHub', d(-14)), doc('grades', 'Relevé de notes 3A', d(-9))],
    contacts: [{ id: 'c1', name: 'Camille Roux', role: 'Responsable recrutement', email: 'camille.roux@orion.example', phone: '', linkedin: '', note: '' }, { id: 'c2', name: 'Samir Haddad', role: 'Tuteur, pentester senior', email: '', phone: '', linkedin: '', note: '' }],
    events: [ev(d(-14), 'status', 'Statut : À postuler → Envoyée'), ev(d(-9), 'reply', 'Accusé de réception et proposition d’échange'), ev(d(-6), 'call', 'Appel de présentation, 20 minutes'), ev(d(-2), 'interview', 'Entretien technique : parcours, projets, mises en situation'), ev(d(-2), 'status', 'Statut : En échange → Entretien')],
    projectIds: ['p-cyberquest', 'p-aegis'], projectNote: 'CyberQuest en démonstration, Aegis pour la partie détection.'
  });
  A('vega', { company: 'Vega Data', sector: 'Éditeur logiciel', domains: ['Data engineering'], location: 'Lyon', priority: 'low', status: 'todo', title: 'Data engineer, sécurité des données', skills: ['Python', 'Spark', 'SQL', 'Airflow'], keySkills: ['Spark'], deadline: d(5) });
  A('nebula', { company: 'Nébula Cloud', sector: 'Hébergement cloud', domains: ['Cloud security'], location: 'Nantes', priority: 'mid', status: 'sent', title: 'Stagiaire sécurité cloud', skills: ['Docker', 'Terraform', 'AWS', 'Kubernetes'], keySkills: ['Docker'], appliedAt: d(-13), provided: [doc('cv', 'CV v2', d(-13)), doc('letter', 'Lettre, cloud', d(-13))], events: [ev(d(-13), 'status', 'Statut : À postuler → Envoyée')] });
  A('atlas', { company: 'Atlas SOC', sector: 'Centre opérationnel de sécurité', domains: ['SOC / détection'], location: 'Rennes', priority: 'high', status: 'contact', title: 'Analyste SOC junior', skills: ['Splunk', 'Python', 'MITRE ATT&CK', 'Linux'], keySkills: ['Splunk'], appliedAt: d(-8), nextAction: 'Préparer le test technique', nextDate: d(5), provided: [doc('cv', 'CV v3, orienté SOC', d(-8)), doc('letter', 'Lettre, SOC', d(-8))], events: [ev(d(-8), 'status', 'Statut : À postuler → Envoyée'), ev(d(-4), 'reply', 'Invitation à un test technique')], projectIds: ['p-aegis'] });
  A('helios', { company: 'Hélios Conseil', sector: 'Conseil', domains: ['Audit / Conformité (GRC)'], location: 'Bourges', priority: 'mid', status: 'offer', title: 'Auditeur sécurité junior', skills: ['ISO 27001', 'EBIOS RM', 'Rédaction'], appliedAt: d(-30), provided: [doc('cv', 'CV v2', d(-30)), doc('letter', 'Lettre, audit', d(-30)), doc('grades', 'Relevé de notes 3A', d(-30))], events: [ev(d(-30), 'status', 'Statut : À postuler → Envoyée'), ev(d(-5), 'status', 'Statut : Entretien → Offre reçue')] });
  A('pulsar', { company: 'Pulsar Réseaux', sector: 'Opérateur', domains: ['Sécurité des réseaux'], location: 'Toulouse', priority: 'low', status: 'rejected', title: 'Stage sécurité réseau', skills: ['Cisco', 'Wireshark', 'Linux'], appliedAt: d(-25), provided: [doc('cv', 'CV v1', d(-25))], events: [ev(d(-25), 'status', 'Statut : À postuler → Envoyée'), ev(d(-10), 'status', 'Statut : Envoyée → Refusée')] });
  A('quantum', { company: 'Quantum Labs', sector: 'Recherche', domains: ['Cryptographie'], location: 'Grenoble', priority: 'mid', status: 'sent', title: 'Stage cryptographie appliquée', skills: ['Cryptographie', 'Python', 'C'], keySkills: ['Cryptographie'], appliedAt: d(-4), provided: [doc('cv', 'CV v3', d(-4)), doc('portfolio', 'Portfolio', d(-4))], events: [ev(d(-4), 'status', 'Statut : À postuler → Envoyée')] });
  A('zephyr', { company: 'Zéphyr Analytics', sector: 'Analyse de données', domains: ['Data science / ML', 'IA et sécurité'], location: 'Paris', priority: 'high', status: 'interview', title: 'Stage détection d’anomalies par apprentissage automatique', skills: ['Python', 'scikit-learn', 'SQL', 'Statistiques'], keySkills: ['scikit-learn'], appliedAt: d(-18), nextAction: 'Entretien avec le responsable data', nextDate: d(2), provided: [doc('cv', 'CV v3', d(-18)), doc('portfolio', 'Portfolio', d(-18)), doc('github', 'GitHub', d(-18))], events: [ev(d(-18), 'status', 'Statut : À postuler → Envoyée'), ev(d(-3), 'status', 'Statut : En échange → Entretien')], projectIds: ['p-aegis'] });
  A('boree', { company: 'Borée Industries', sector: 'Industrie', domains: ['Systèmes embarqués / IoT'], location: 'Bourges', priority: 'mid', status: 'todo', title: 'Stage sécurité des systèmes embarqués', skills: ['C', 'Systèmes embarqués', 'Linux'], deadline: d(12) });

  const P = (name, o) => Object.assign({ name, status: 'done', context: 'school', startMonth: '', endMonth: '', role: '', teamSize: '', summary: '', description: '', contributions: '', results: '', technologies: [], skills: [], domains: [], links: [], learnings: '', pitch: '', createdAt: now, updatedAt: now }, o);
  const projects = {
    'p-insacloud': P('InsaCloud', { startMonth: '2026-09', endMonth: '2026-10', role: 'Conception et développement', summary: 'Mini fournisseur cloud : location de machines Linux à la minute, avec terminal ou bureau graphique dans le navigateur.', technologies: ['Python', 'Flask', 'Docker', 'Ansible', 'Vagrant', 'Nginx', 'noVNC'], skills: ['DevOps', 'Réseaux'], domains: ['Cloud security'] }),
    'p-cyberquest': P('CyberQuest', { context: 'perso', startMonth: '2026-10', role: 'Conception et développement', summary: 'RPG de simulation de pentest : carte réseau interactive, vrai terminal (nmap, sqlmap), quatre flags à capturer en six minutes.', technologies: ['React', 'Vite', 'xterm.js', 'Node.js', 'CSP'], skills: ['Pentest', 'Sécurité applicative'], domains: ['Pentest / Red team'] }),
    'p-aegis': P('Aegis Mini SOC', { context: 'perso', startMonth: '2026-10', role: 'Conception et développement', summary: 'Détection d’intrusion comportementale par apprentissage automatique : flux, score d’anomalie calibré, seuils adaptatifs par hôte, corrélation d’incidents. 99,6 % de rappel.', technologies: ['Python', 'FastAPI', 'scikit-learn', 'React', 'TypeScript'], skills: ['SOC', 'Splunk', 'Statistiques'], domains: ['SOC / détection', 'IA et sécurité'] }),
    'p-medievail': P('MedievAIl Battle', { startMonth: '2025-10', endMonth: '2026-01', role: 'Développement en équipe', teamSize: 4, summary: 'Jeu de bataille stratégique en Python (POO, architecture MVP) avec IA et simulation, prolongé par une infrastructure pair-à-pair avec démon réseau en C.', technologies: ['Python', 'C', 'Sockets UDP/TCP'], skills: ['Réseaux', 'Systèmes'], domains: [] }),
    'p-planner': P('Revision Planner', { context: 'perso', startMonth: '2025-08', summary: 'Planificateur de révisions par répétition espacée : moteur de planification isolé et testé (45 tests).', technologies: ['TypeScript', 'React', 'Strapi', 'Vite', 'Vitest'], skills: ['Tests'], domains: [] })
  };
  localStorage.clear();
  localStorage.setItem('capavril:apps', JSON.stringify(apps));
  localStorage.setItem('capavril:projects', JSON.stringify(projects));
  localStorage.setItem('capavril:settings', JSON.stringify({ prefs: { targetStart: '2027-04-01', eventLabel: 'Forum Stages', eventDate: d(21) } }));
  localStorage.setItem('capavril:lastExport', String(Date.now()));
  if (opts.nogate) localStorage.setItem('capavril:nogate', '1');
  if (opts.theme) localStorage.setItem('capavril:theme', opts.theme);
}

/* ---------- Chrome DevTools Protocol ---------- */
async function launch() {
  const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'capstage-chrome-'));
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch (e) {} await sleep(200); }
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); } else if (msg.method) listeners.forEach((l) => l(msg)); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const on = (fn) => listeners.push(fn);
  const evaluate = async (expr, awaitPromise = true) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  const close = async () => { try { ws.close(); } catch (e) {} proc.kill('SIGTERM'); };
  return { send, on, evaluate, close };
}

async function load(c, hash, opts) {
  if (!(await c.evaluate('location.origin')).startsWith('http://127.0.0.1')) { await c.send('Page.navigate', { url: BASE }); await sleep(1200); }
  await c.evaluate(`(${seedFn.toString()})(${JSON.stringify(opts)}); true`);
  await c.send('Page.navigate', { url: `${BASE}?v=${Date.now()}${hash}` });
  await sleep(1400);
  await c.evaluate('document.fonts.ready.then(()=>true)');
  await sleep(500);
}
async function viewport(c, w, h, dsf, mobile = false) {
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile });
  if (mobile) await c.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  else await c.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
}
async function snap(c, name) {
  const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(r.data, 'base64'));
  console.log('shot', name);
}

/* ---------- captures ---------- */
async function shots(c) {
  const D = (js) => c.evaluate(js);
  await viewport(c, 1880, 1050, 1.2);
  for (const theme of ['light', 'dark']) {
    const t = theme === 'light' ? 'clair' : 'sombre';
    await load(c, '#overview', { nogate: true, theme }); await snap(c, `apercu-${t}`);
    await load(c, '#apps', { nogate: true, theme }); await snap(c, `kanban-${t}`);
    await D(`[...document.querySelectorAll('.acard')].find(x=>x.textContent.includes('Orion')).click(); true`); await sleep(900); await snap(c, `fiche-synthese-${t}`);
    await D(`(()=>{const b=document.querySelector('.dbody');const s=document.querySelector('#s-competences');b.scrollTo({top:s.offsetTop-10,behavior:'instant'});return true})()`); await sleep(500); await snap(c, `fiche-competences-${t}`);
  }
  await load(c, '#dossiers', { nogate: true, theme: 'light' }); await snap(c, 'dossiers-clair');
  await load(c, '#projects', { nogate: true, theme: 'light' }); await snap(c, 'projets-clair');
  await load(c, '#skills', { nogate: true, theme: 'light' }); await snap(c, 'competences-clair');
  await load(c, '#settings', { nogate: true, theme: 'light' }); await snap(c, 'reglages-clair');
  await load(c, '#apps', { nogate: false, theme: 'light' }); await snap(c, 'connexion-clair');
  await load(c, '#apps', { nogate: false, theme: 'dark' }); await snap(c, 'connexion-sombre');
  // liste
  await load(c, '#apps', { nogate: true, theme: 'light' }); await D(`[...document.querySelectorAll('.seg button')].find(b=>b.textContent.includes('Liste')).click();true`); await sleep(700); await snap(c, 'liste-clair');
  // mobile
  await viewport(c, 390, 844, 3, true);
  await load(c, '#overview', { nogate: true, theme: 'light' }); await snap(c, 'mobile-apercu-clair');
  await load(c, '#apps', { nogate: true, theme: 'dark' }); await snap(c, 'mobile-candidatures-sombre');
  await D(`document.querySelectorAll('.tbl tbody tr')[0].click(); true`); await sleep(900); await snap(c, 'mobile-fiche-sombre');
  await load(c, '#apps', { nogate: false, theme: 'dark' }); await snap(c, 'mobile-connexion-sombre');
}

/* ---------- vidéo ---------- */
const DEMO_JS = `
window.__demo=(()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const st=document.createElement('style');
  st.textContent=\`
  #dcursor{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;transition:transform .75s cubic-bezier(.3,.7,.2,1);transform:translate(-100px,-100px);filter:drop-shadow(0 3px 5px rgba(0,0,0,.35))}
  #dcursor svg{display:block;margin:-3px 0 0 -3px}
  .dripple{position:fixed;z-index:99998;pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:3px solid #FF8F6E;animation:drip .6s ease-out forwards}
  @keyframes drip{to{transform:scale(4.5);opacity:0}}
  #dcap{position:fixed;left:50%;bottom:34px;transform:translateX(-50%) translateY(20px);z-index:99997;max-width:min(980px,90vw);padding:14px 28px;border-radius:999px;background:rgba(10,18,28,.86);color:#fff;font:600 22px/1.3 "IBM Plex Sans",system-ui,sans-serif;letter-spacing:-.005em;text-align:center;opacity:0;transition:opacity .35s,transform .35s;backdrop-filter:blur(10px)}
  #dcap.on{opacity:1;transform:translateX(-50%)}
  #dcard{position:fixed;inset:0;z-index:99996;display:grid;place-items:center;text-align:center;background:radial-gradient(900px 520px at 90% -10%,rgba(32,190,176,.55),transparent 62%),radial-gradient(760px 480px at -6% 4%,rgba(255,128,92,.45),transparent 60%),#09111A;color:#fff;opacity:0;pointer-events:none;transition:opacity .6s}
  #dcard.on{opacity:1}
  #dcard h1{margin:0;font:700 92px/1 "Bricolage Grotesque",system-ui,sans-serif;letter-spacing:-.045em}
  #dcard p{margin:18px 0 0;font:500 28px/1.4 "IBM Plex Sans",system-ui,sans-serif;color:#cfe3ea}
  #dcard small{display:block;margin-top:30px;font:500 20px "IBM Plex Mono",ui-monospace,monospace;color:#4ED8C6;letter-spacing:.04em}
  \`;
  document.head.append(st);
  const cur=document.createElement('div');cur.id='dcursor';cur.innerHTML='<svg width="30" height="34" viewBox="0 0 30 34"><path d="M3 2 L3 26 L9.5 20.5 L14 31 L18.5 29 L14 19 L23 19 Z" fill="#fff" stroke="#0d1b28" stroke-width="2" stroke-linejoin="round"/></svg>';document.body.append(cur);
  const cap=document.createElement('div');cap.id='dcap';document.body.append(cap);
  const card=document.createElement('div');card.id='dcard';document.body.append(card);
  const api={
    sleep,
    caption(t){cap.textContent=t;cap.classList.add('on')},
    hideCaption(){cap.classList.remove('on')},
    card(h,p,s){card.innerHTML='<div><h1>'+h+'</h1><p>'+p+'</p><small>'+(s||'')+'</small></div>';card.classList.add('on')},
    hideCard(){card.classList.remove('on')},
    async moveTo(el,ms){const r=el.getBoundingClientRect();cur.style.transform='translate('+(r.left+r.width/2)+'px,'+(r.top+r.height/2)+'px)';await sleep(ms||800)},
    async click(el){await api.moveTo(el);const r=el.getBoundingClientRect();const d=document.createElement('div');d.className='dripple';d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.top+r.height/2)+'px';document.body.append(d);setTimeout(()=>d.remove(),700);await sleep(180);el.click();await sleep(250)},
    async type(el,text,delay){el.focus();for(const ch of text){el.value+=ch;el.dispatchEvent(new Event('input',{bubbles:true}));await sleep(delay||55)}},
    async drag(card,col){
      await api.moveTo(card,700);const dt=new DataTransfer();
      card.dispatchEvent(new DragEvent('dragstart',{dataTransfer:dt,bubbles:true}));await sleep(250);
      const r=col.getBoundingClientRect();cur.style.transform='translate('+(r.left+r.width/2)+'px,'+(r.top+90)+'px)';
      col.dispatchEvent(new DragEvent('dragover',{dataTransfer:dt,bubbles:true,cancelable:true}));await sleep(900);
      col.dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}));
      card.dispatchEvent(new DragEvent('dragend',{dataTransfer:dt,bubbles:true}));await sleep(500)
    },
    async scroll(el,top,ms){el.scrollTo({top,behavior:'smooth'});await sleep(ms||1200)}
  };
  return api;
})(); true`;

async function video(c) {
  const frames = [];
  c.on((m) => {
    if (m.method === 'Page.screencastFrame') {
      frames.push({ t: m.params.metadata.timestamp, data: m.params.data });
      c.send('Page.screencastFrameAck', { sessionId: m.params.sessionId }).catch(() => {});
    }
  });
  await viewport(c, 1440, 900, 1);
  await load(c, '#apps', { nogate: false, theme: 'light' });
  await c.evaluate(DEMO_JS);
  await c.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  const D = (js) => c.evaluate(js);
  const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
  const qa = (sel, i) => `document.querySelectorAll(${JSON.stringify(sel)})[${i}]`;
  const nav = (i) => `document.querySelectorAll('.nav-i')[${i}]`;
  const find = (sel, text) => `[...document.querySelectorAll(${JSON.stringify(sel)})].find(b=>b.textContent.includes(${JSON.stringify(text)}))`;

  await D(`__demo.card('Cap Stage','Suivez toutes vos candidatures de stage au même endroit','aziz3r.github.io/cap-stage')`); await sleep(3200);
  await D(`__demo.hideCard()`); await sleep(900);
  await D(`__demo.caption('Première page : connexion avec Google, ou continuer sans compte')`); await sleep(3200);
  await D(`__demo.click(${find('button', 'Continuer sans compte')})`); await sleep(900);
  await D(`__demo.caption('Aperçu : chiffres clés, relances à faire et pipeline')`); await sleep(4000);
  await D(`__demo.scroll(document.scrollingElement,520,1400)`); await sleep(2600);
  await D(`__demo.scroll(document.scrollingElement,0,900)`); await sleep(500);

  await D(`__demo.click(${nav(1)})`); await sleep(900);
  await D(`__demo.caption('Kanban : glissez une carte pour changer son statut')`); await sleep(2200);
  await D(`__demo.drag(${find('.acard', 'Vega Data')},${q('.col[data-st="sent"]')})`); await sleep(2200);

  await D(`__demo.click(${find('.acard', 'Orion Cybersécurité')})`); await sleep(1500);
  await D(`__demo.caption('Chaque fiche s’ouvre sur une synthèse : domaine, compétences clés, ce qu’ils cherchent vraiment')`); await sleep(5200);
  await D(`__demo.scroll(${q('.dbody')},430,1500)`); await sleep(3200);
  await D(`__demo.caption('Compétences clés (étoile) et couverture par vos projets')`);
  await D(`__demo.scroll(${q('.dbody')},document.querySelector('#s-competences').offsetTop-10,1600)`); await sleep(3800);
  await D(`__demo.caption('Données fournies : ce que cette entreprise a reçu de vous')`);
  await D(`__demo.scroll(${q('.dbody')},document.querySelector('#s-dossier').offsetTop-10,1600)`); await sleep(3800);
  await D(`__demo.hideCaption()`);
  await D(`__demo.click(${q('.dfoot .btn.primary')})`); await sleep(1000);

  await D(`__demo.caption('Ajout rapide d’une offre')`);
  await D(`__demo.click(${q('#quick-app')})`); await sleep(700);
  await D(`__demo.type(${q('#qa-name')},'Atlas Sécurité')`); await sleep(300);
  await D(`__demo.type(${q('#qa-title')},'Stagiaire analyste SOC',45)`); await sleep(600);
  await D(`__demo.click(${q('.modal button[type="submit"]')})`); await sleep(1800);
  await D(`__demo.click(${q('.xbtn[aria-label="Fermer la fiche"]')})`); await sleep(1500);

  await D(`__demo.click(${nav(2)})`); await sleep(900);
  await D(`__demo.caption('Dossiers envoyés : qui a reçu quel document, version par version')`); await sleep(4000);
  await D(`__demo.click(${nav(3)})`); await sleep(900);
  await D(`__demo.caption('Projets : une fiche complète par projet réalisé')`); await sleep(3600);
  await D(`__demo.click(${nav(4)})`); await sleep(900);
  await D(`__demo.caption('Compétences : ce que demandent les offres, face à ce que démontrent vos projets')`); await sleep(4200);

  await D(`__demo.click(${q('.tswitch button:nth-child(2)')})`); await sleep(1200);
  await D(`__demo.caption('Mode sombre')`); await sleep(1200);
  await D(`__demo.click(${nav(0)})`); await sleep(3400);
  await D(`__demo.click(${nav(1)})`); await sleep(3400);

  await D(`__demo.click(${nav(5)})`); await sleep(900);
  await D(`__demo.caption('Vos données restent chez vous : mot de passe, dossier de sauvegarde, Google Drive')`); await sleep(2600);
  await D(`__demo.scroll(document.scrollingElement,640,1800)`); await sleep(3600);
  await D(`__demo.hideCaption()`);
  await D(`__demo.card('Cap Stage','Gratuit, sans compte à créer, données privées','aziz3r.github.io/cap-stage')`); await sleep(3600);

  await c.send('Page.stopScreencast');
  await sleep(300);
  // assemble
  const dir = path.join(OUT, 'frames'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let list = '';
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]; const name = `f${String(i).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(dir, name), Buffer.from(f.data, 'base64'));
    const dur = i < frames.length - 1 ? Math.max(0.01, frames[i + 1].t - f.t) : 1.2;
    list += `file '${name}'\nduration ${dur.toFixed(4)}\n`;
  }
  list += `file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(path.join(dir, 'list.txt'), list);
  console.log('frames', frames.length, 'span', (frames[frames.length - 1].t - frames[0].t).toFixed(1), 's');
}

const c = await launch();
try { if (MODE === 'shots') await shots(c); else await video(c); }
finally { await c.close(); }
console.log('done');
