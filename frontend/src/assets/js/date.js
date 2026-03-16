// 1. On cible notre champ de date
const dateInput = document.getElementById('date-input');

// 2. On récupère la date exacte d'aujourd'hui
const aujourdhui = new Date();

// 3. On extrait l'année, le mois et le jour
const annee = aujourdhui.getFullYear();
// Attention: getMonth() commence à 0 (Janvier = 0), donc on ajoute 1
const mois = String(aujourdhui.getMonth() + 1).padStart(2, '0'); 
const jour = String(aujourdhui.getDate()).padStart(2, '0');

// 4. On assemble le tout au format "YYYY-MM-DD" exigé par HTML
const dateMax = `${annee}-${mois}-${jour}`;

// 5. On applique cette limite à l'attribut 'max' de notre champ
dateInput.max = dateMax;