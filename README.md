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
- **Sauvegarde** : Réglages permet d'exporter (JSON, CSV) et d'importer une sauvegarde, pour changer d'appareil ou ne rien perdre si le navigateur est vidé.
- N'y notez ni numéro de sécurité sociale, ni RIB, ni mot de passe : l'outil vous avertit si une saisie y ressemble.

## Limites

- Pas de synchronisation entre appareils : passez par l'export puis l'import.
- Effacer les données du site dans le navigateur supprime vos fiches. Exportez régulièrement.

## Développement

Le site tient dans un seul fichier, `index.html` (HTML, CSS et JavaScript sans dépendance). Il se déploie tel quel sur GitHub Pages.
