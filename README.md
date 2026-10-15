# Cap Stage

Un outil gratuit pour suivre ses candidatures de stage, sans compte et sans serveur.

**Utiliser l'outil : https://aziz3r.github.io/cap-stage/**

## Ce qu'il permet

- **Candidatures** : une fiche par entreprise (statut, stage proposé, domaine, compétences demandées avec les compétences clés, ce que l'entreprise cherche vraiment, contraintes, équipe, processus de recrutement), en vue kanban ou en liste.
- **Données fournies** : CV, lettre, portfolio, liens et pièces envoyés à chaque entreprise, version par version et avec la date.
- **Suivi** : contacts, historique des échanges, prochaine action, relances à faire.
- **Projets** : une fiche complète par projet réalisé (contexte, rôle, technologies, résultats, liens, pitch).
- **Compétences** : ce que demandent les offres, comparé à ce que démontrent vos projets.
- **Aperçu** : chiffres clés, relances et échéances, pipeline, compte à rebours jusqu'au début du stage.

## Vos données restent chez vous

- Tout est enregistré **dans votre navigateur** (`localStorage`), sur votre appareil. Il n'y a ni compte, ni base de données, ni serveur : chaque personne qui ouvre le site a ses propres données, que personne d'autre ne peut lire.
- La page est servie avec une politique de sécurité (`Content-Security-Policy`) qui **interdit tout envoi réseau** (`connect-src 'none'`). Seule la feuille de style des polices est chargée depuis Google Fonts.
- **Verrouillage par mot de passe** (optionnel, dans Réglages) : vos données sont chiffrées dans le navigateur (AES-256-GCM, clé dérivée par PBKDF2 avec 310 000 itérations). Si vous perdez le mot de passe, les données sont irrécupérables.
- **Sauvegarde automatique dans un dossier** (Chrome, Edge et navigateurs équivalents sur ordinateur) : dans Réglages, vous choisissez un emplacement et l'outil y crée un dossier « Cap Stage ». Vos données y sont réécrites à chaque modification (`cap-stage.json`, `candidatures.csv`). Elles survivent à un nettoyage du navigateur, et se synchronisent entre vos appareils si l'emplacement est dans iCloud Drive, OneDrive, Dropbox ou Google Drive. L'outil n'accède qu'à ce dossier, avec votre autorisation, que le navigateur peut redemander à chaque session. Avec le verrouillage par mot de passe, les fichiers sont chiffrés (`cap-stage.chiffre.json`).
- **Export et import** : Réglages permet aussi d'exporter (JSON, CSV) et d'importer une sauvegarde à la main, sur tous les navigateurs.
- N'y notez ni numéro de sécurité sociale, ni RIB, ni mot de passe : l'outil vous avertit si une saisie y ressemble.

## Limites

- Pas de synchronisation directe entre appareils : utilisez un dossier synchronisé (voir plus haut) ou l'export puis l'import. Deux appareils qui modifient en même temps le même dossier peuvent s'écraser : l'outil demande quel jeu de données garder quand il détecte une différence.
- La sauvegarde dans un dossier n'existe pas sur Safari, Firefox ni sur mobile : l'export et l'import y restent disponibles.
- Effacer les données du site dans le navigateur supprime vos fiches. Exportez régulièrement.

## Développement

Le site tient dans un seul fichier, `index.html` (HTML, CSS et JavaScript sans dépendance). Il se déploie tel quel sur GitHub Pages.
