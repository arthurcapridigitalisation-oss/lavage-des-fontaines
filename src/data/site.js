// Toutes les infos du site au même endroit : horaires, tarifs, équipements, contacts.
// Les éléments marqués « À CONFIRMER » sont à valider avec le client.

export const company = {
  name: 'Lavage des Fontaines',
  tagline: 'Toute la technologie WashTec pour un véhicule impeccable !',
  phone: '06 38 85 22 65',
  phoneHref: 'tel:+33638852265',
  founded: 2019,
  siret: '839 262 995 00047',
  hq: '183 allée des Trolles, 74300 Thyez',
  socials: {
    facebook: 'https://www.facebook.com/lavagedesfontaines',
    instagram: 'https://www.instagram.com/lavagedesfontaines/',
    linkedin: 'https://www.linkedin.com/company/lavage-des-fontaines/',
  },
};

// Programmes portique, d'après le panneau en station. Chaque formule inclut les précédentes.
export const programmes = [
  {
    id: 'basic',
    name: 'Basic',
    price: 8,
    color: '#8a8a8a',
    steps: ['Lavage', 'Haute pression bas de caisse + roues', 'Séchage'],
  },
  {
    id: 'classic',
    name: 'Classic',
    price: 12,
    color: '#d0d0d0',
    steps: ['Mousse', 'Haute pression latérale'],
  },
  {
    id: 'emeraude',
    name: 'Émeraude',
    price: 16,
    color: '#3f9b4b',
    steps: ['Prélavage intensif', 'Rinçage eau osmosée'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 20,
    color: '#e0a21b',
    steps: ['Rideau de mousse colorée', 'Haute pression intégrale', 'Lavage châssis'],
  },
  {
    id: 'rubis',
    name: 'Rubis',
    price: 26,
    color: '#d82400',
    steps: ['Polish premium', 'Spécial jantes', 'Séchage intensif'],
  },
];

export const stations = {
  marnaz: {
    slug: 'marnaz',
    name: 'Marnaz',
    // À CONFIRMER : « rue des Fontaines » (client) vs « rue de la Rosée » (Google)
    address: 'Rue des Fontaines',
    city: '74460 Marnaz',
    mapsQuery: 'Lavage des Fontaines Marnaz',
    hoursLabel: '7j/7 · jusqu’à 22h',
    // À CONFIRMER : heure d'ouverture inconnue, le statut en direct est désactivé tant qu'elle manque
    hours: { open: null, close: '22:00' },
    rating: 4.8,
    reviews: 420,
    access:
      'Route blanche, au rond-point de la rue des Fontaines. Accès depuis Bonneville, Cluses et Thyez par le quartier du Crozet.',
    intro:
      'Notre station phare : deux portiques WashTec SoftCar Pro 2 avec option Turbo, trois pistes haute pression et une piste chauffée l’hiver.',
    hero: '/img/marnaz-portique2.webp',
    gallery: [
      { src: '/img/marnaz-accueil.webp', alt: 'Accueil et pistes de la station de Marnaz' },
      { src: '/img/marnaz-portique2.webp', alt: 'Portique 2 et terrasse de la station de Marnaz' },
      { src: '/img/ferrari-marnaz.webp', alt: 'Ferrari rouge devant la station de Marnaz' },
      { src: '/img/distributeur-microfibre.webp', alt: 'Distributeur de microfibres à 2 €' },
    ],
    equipment: [
      { icon: 'portique', title: '2 portiques WashTec SoftCar Pro 2', text: 'Option Turbo, passage 2,60 m de large et de haut : SUV et fourgons bienvenus. Premier centre des 2 Savoies équipé.' },
      { icon: 'foam', title: 'Rideau de mousse colorée', text: 'Le fameux canon à mousse rose, sur les portiques comme sur les pistes.' },
      { icon: 'pressure', title: '3 pistes haute pression', text: 'Brosse, lance haute pression et canon à mousse sur chaque piste.' },
      { icon: 'heat', title: 'Piste chauffée l’hiver', text: 'Lavage à l’eau chaude et piste hors gel, même en plein janvier.' },
      { icon: 'vacuum', title: '5 aspirateurs couverts', text: 'Avec soufflette, à l’abri de la pluie et de la neige.' },
      { icon: 'carpet', title: 'Lave-tapis automatique', text: 'Vos tapis ressortent propres et prêts à reposer.' },
      { icon: 'scent', title: 'Diffuseur de parfums', text: 'Pour finir avec un habitacle qui sent bon.' },
      { icon: 'tire', title: 'Borne de gonflage', text: 'Contrôlez la pression de vos pneus avant de repartir.' },
      { icon: 'card', title: 'CB sans contact & badge', text: 'Paiement sans contact sur la borne, lecteur de badge sur toute la station, distributeur de jetons et rechargement de badge.' },
      { icon: 'shop', title: 'Boutique 7j/7', text: 'Produits d’entretien allemands, jetons et microfibres à 2 €.' },
    ],
  },
  scionzier: {
    slug: 'scionzier',
    name: 'Scionzier',
    // À CONFIRMER : « rue Claude Ballaloud » (client) vs « rue César Vuarchex » (Google)
    address: 'Rue Claude Ballaloud',
    city: '74950 Scionzier',
    mapsQuery: 'Lavage des Fontaines Scionzier',
    hoursLabel: 'Ouvert 24h/24 · 7j/7',
    hours: { open: '00:00', close: '24:00' },
    rating: 4.6,
    reviews: 111,
    access: 'En plein cœur de Scionzier, accessible de jour comme de nuit.',
    intro:
      'La station qui ne dort jamais : ouverte 24h/24, avec un distributeur dernière génération et la seule shampouineuse de sièges en libre-service du secteur.',
    hero: '/img/station-nuit.webp',
    gallery: [
      { src: '/img/station-nuit.webp', alt: 'La station de Scionzier éclairée de nuit' },
      { src: '/img/station-pistes.webp', alt: 'Les pistes couvertes de la station de Scionzier' },
      { src: '/img/distributeur-24h.webp', alt: 'Distributeur automatique 24h/24' },
      { src: '/img/panneau-programmes.webp', alt: 'Panneau des programmes de lavage' },
    ],
    // À CONFIRMER : le client n'a pas détaillé les autres équipements de Scionzier
    equipment: [
      { icon: 'clock', title: 'Ouvert 24h/24', text: 'Lavez quand vous voulez, même tard le soir ou très tôt le matin.' },
      { icon: 'seat', title: 'Shampouineuse sièges', text: 'En libre-service, une exclusivité sur le secteur. Vos sièges en tissu retrouvent leur fraîcheur.' },
      { icon: 'shop', title: 'Distributeur dernière génération', text: 'Produits d’entretien et dépannage disponibles à toute heure.' },
      { icon: 'store', title: 'Boutique 7j/7', text: 'Produits d’entretien allemands et jetons.' },
    ],
  },
};

export const rdvServices = [
  {
    title: 'Nettoyage complet',
    subtitle: 'Intérieur & extérieur',
    text: 'Carrosserie, jantes, vitres, habitacle, sièges et tapis : on vous rend un véhicule comme au premier jour.',
    img: '/img/ferrari-mousse.webp',
  },
  {
    title: 'Traitement céramique',
    subtitle: 'Protection longue durée',
    text: 'Une couche protectrice qui fait briller la peinture et la protège des agressions : sel, pollen, insectes, UV.',
    img: '/img/ferrari-marnaz.webp',
  },
  {
    title: 'Formules intérieur',
    subtitle: 'Habitacle',
    text: 'Aspiration en profondeur, shampoing des sièges, plastiques et vitres : plusieurs formules selon l’état du véhicule.',
    img: '/img/porsche-pistes.webp',
  },
];

// Thèmes qui reviennent dans les avis Google (pas des citations).
export const reviewThemes = [
  { title: 'Une station très propre', text: 'Pistes, portiques et aspirateurs entretenus tous les jours.' },
  { title: 'Un gérant présent', text: 'Sympathique, disponible et de bon conseil, 7 jours sur 7.' },
  { title: 'Le bon rapport qualité/prix', text: 'Du matériel haut de gamme sans tarifs exorbitants.' },
  { title: 'La mousse rose', text: 'Le canon à mousse colorée, la star des réseaux.' },
];
