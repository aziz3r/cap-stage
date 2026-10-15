import os, re, sys
# usage: python3 build/build.py OUT_DIR [GOOGLE_CLIENT_ID]
# Génère index.html et confidentialite.html à partir de build/source.html.
# Sans identifiant client Google, la synchronisation Drive est désactivée et la CSP interdit tout envoi réseau.
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'source.html')
OUT = sys.argv[1]
GID = sys.argv[2] if len(sys.argv) > 2 else ''
if GID and not re.fullmatch(r'[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com', GID) and not GID.startswith('test'):
    print('Identifiant client Google invalide:', GID); sys.exit(1)

s = open(SRC, encoding='utf8').read()
assert s.count("const GOOGLE_CLIENT_ID='';") == 1
s = s.replace("const GOOGLE_CLIENT_ID='';", "const GOOGLE_CLIENT_ID='%s';" % GID)
i = s.index('</style>') + len('</style>')
head_part, body_part = s[:i], s[i:]
head_part = head_part.replace('<title>Cap Avril</title>\n', '', 1)
assert '<title>' not in head_part

if GID:
    CSP = ("default-src 'none'; script-src 'unsafe-inline' https://accounts.google.com/gsi/client; "
           "style-src 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style; "
           "font-src https://fonts.gstatic.com; img-src data:; "
           "connect-src https://www.googleapis.com https://accounts.google.com; frame-src https://accounts.google.com; "
           "form-action 'none'; base-uri 'none'; object-src 'none'")
else:
    CSP = ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; "
           "font-src https://fonts.gstatic.com; img-src data:; connect-src 'none'; form-action 'none'; "
           "base-uri 'none'; object-src 'none'; frame-src 'none'")
TITLE = 'Cap Stage – suivi de candidatures de stage'
DESC = ('Suivez vos candidatures de stage : entreprises, compétences demandées, documents envoyés, projets. '
        'Gratuit, sans compte à créer, données privées.')
ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2313201C'/%3E"
        "%3Cpath d='M9 23L23 9M13 9h10v10' stroke='%23EBEFEC' stroke-width='2.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")

html = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="no-referrer">
<title>{TITLE}</title>
<meta name="description" content="{DESC}">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#EBEFEC">
<meta property="og:type" content="website">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESC}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="{ICON}">
<style>:root{{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{head_part}
</head>
<body>
<noscript>Cet outil nécessite JavaScript pour fonctionner.</noscript>
{body_part}
</body>
</html>
'''
os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(html)
open(os.path.join(OUT, '.nojekyll'), 'w').write('')

drive = '''
<h2>Google Drive (si vous activez la synchronisation)</h2>
<p>Quand vous cliquez sur « Se connecter avec Google », le site demande une seule autorisation : <code>drive.appdata</code>. Elle donne accès à un <strong>espace caché propre à cette application</strong> dans votre Google Drive. Le site ne peut lire, modifier ni lister aucun de vos autres fichiers. Vos données y sont enregistrées dans un fichier <code>cap-stage.json</code> (ou <code>cap-stage.chiffre.json</code> si vous avez activé le verrouillage par mot de passe, auquel cas elles sont chiffrées avant l’envoi et Google ne peut pas les lire).</p>
<p>L’auteur du site n’a <strong>aucun accès</strong> à cet espace : les échanges se font directement entre votre navigateur et Google. Ces données sont soumises aux conditions et à la politique de confidentialité de Google.</p>
<p>Pour couper l’accès, utilisez « Déconnecter » dans Réglages, ou retirez l’application dans <a href="https://myaccount.google.com/permissions" rel="noopener noreferrer">les autorisations de votre compte Google</a>. « Tout effacer » supprime aussi le fichier de votre Drive si vous êtes connecté à ce moment-là.</p>
''' if GID else ''

privacy = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'">
<meta name="referrer" content="no-referrer"><meta name="robots" content="index,follow">
<title>Confidentialité – Cap Stage</title>
<style>
:root{{color-scheme:light dark;--bg:#EBEFEC;--fg:#13201C;--mute:#465650;--line:#D5DCD7;--accent:#2447C6}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0C1311;--fg:#E5ECE8;--mute:#AEBBB5;--line:#27322E;--accent:#7C98FF}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 "IBM Plex Sans","Segoe UI",system-ui,sans-serif}}
main{{max-width:720px;margin:0 auto;padding:32px 20px 64px}}
h1{{font-size:30px;line-height:1.2;margin:0 0 8px}} h2{{font-size:19px;margin:32px 0 8px}}
p,li{{color:var(--mute)}} strong{{color:var(--fg)}} a{{color:var(--accent)}}
code{{font-family:ui-monospace,Menlo,monospace;font-size:.9em;border:1px solid var(--line);border-radius:5px;padding:0 5px}}
</style></head><body><main>
<p><a href="./">← Retour à Cap Stage</a></p>
<h1>Confidentialité</h1>
<p>Dernière mise à jour : 15 octobre 2026.</p>
<h2>En bref</h2>
<p>Cap Stage est un outil gratuit de suivi de candidatures de stage. Il n’a <strong>pas de serveur</strong> : l’auteur du site ne reçoit, ne voit et ne conserve aucune de vos données.</p>
<h2>Ce que vous saisissez</h2>
<p>Des candidatures (entreprises, offres, contacts, notes, documents envoyés) et des fiches de projets. Ces informations restent les vôtres.</p>
<h2>Où elles sont enregistrées</h2>
<ul>
<li><strong>Dans votre navigateur</strong>, sur votre appareil, dans le stockage local du site. C’est le cas dès que vous utilisez l’outil.</li>
<li><strong>Dans un dossier de votre ordinateur</strong>, uniquement si vous activez la sauvegarde automatique dans un dossier (Chrome, Edge) et en choisissez un. L’outil n’accède qu’à ce dossier.</li>
<li><strong>Dans un fichier d’export</strong>, uniquement si vous cliquez sur Exporter.</li>
</ul>
<p>Le verrouillage par mot de passe (facultatif) chiffre ces données dans votre navigateur (AES-256-GCM). Le mot de passe n’est jamais enregistré : si vous l’oubliez, les données sont irrécupérables.</p>
{drive}
<h2>Aucun suivi</h2>
<p>Pas de cookies, pas de statistiques, pas de publicité, pas de traceurs. La page est servie avec une politique de sécurité qui limite ce qu’elle peut contacter. Deux services tiers voient tout de même votre adresse IP, comme pour tout site : <strong>GitHub Pages</strong> (qui héberge le site) et <strong>Google Fonts</strong> (qui fournit les polices).</p>
<h2>Supprimer vos données</h2>
<p>« Tout effacer » dans Réglages supprime vos fiches de ce navigateur, du dossier de sauvegarde automatique et, si vous êtes connecté, de Google Drive. Vider les données du site dans votre navigateur a le même effet sur le navigateur.</p>
<h2>Contact</h2>
<p>Une question ou un signalement : <a href="https://github.com/aziz3r/cap-stage/issues" rel="noopener noreferrer">github.com/aziz3r/cap-stage/issues</a>.</p>
</main></body></html>
'''
open(os.path.join(OUT, 'confidentialite.html'), 'w', encoding='utf8').write(privacy)
print('built', len(html), 'bytes ->', OUT, '| google:', GID or 'non')
