# Lavage des Fontaines — site vitrine

Astro + GSAP, site statique (5 pages : accueil, /marnaz, /scionzier, mentions légales, 404).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/ (à déployer sur Vercel / Netlify)
```

## Modifier le contenu

Tout est dans `src/data/site.js` : téléphone, programmes et tarifs, horaires, équipements, prestations sur RDV.
Les photos sont dans `public/img/`.

## Animations

- `src/components/FoamCurtain.astro` : le rideau de mousse au scroll (moment signature)
- `src/components/Programmes.astro` : panneau des programmes interactif
- `src/scripts/motion.ts` : apparitions, compteurs, bandeau défilant, parallaxe
- Tout est désactivé si l'utilisateur a activé « réduire les animations ».

## À confirmer avec le client

- [ ] Adresse Marnaz : rue des Fontaines ou rue de la Rosée ?
- [ ] Adresse Scionzier : rue Claude Ballaloud ou rue César Vuarchex ?
- [ ] Heure d'ouverture de Marnaz (le statut « ouvert maintenant » s'activera dès qu'elle est renseignée)
- [ ] Programmes 8 € → 26 € : identiques dans les deux stations ? (photo du panneau prise à Scionzier)
- [ ] Équipements complets de Scionzier (portique ? pistes ? aspirateurs ?)
- [ ] Détail des abonnements / carte fidélité
- [ ] Tarifs des nettoyages sur RDV (ou on garde « sur devis »)
- [ ] Détails du recyclage de l'eau
- [ ] Mentions légales : forme juridique, RCS, TVA, directeur de publication, hébergeur
- [ ] Nom de domaine (à mettre dans `astro.config.mjs`)

## Photos à demander

- Vidéo du portique avec le rideau de mousse
- Photos avant/après des nettoyages sur RDV, photos d'intérieurs
- Photos en meilleure résolution (les actuelles font ~1000 px de haut)
