// Stockage des données
let residences = [];
let filteredResidences = [];
let markers = [];

// Configuration des filtres
const filters = {
    dateConstruction: [],
    modeProductionChauffage: [],
    modeProductionECS: [],
    natureEnergieChauffage: [],
    natureEnergieECS: [],
    postesCharges: [],
    dpe: [],
    copropriete: [],
    rehabilitation: []
};

// Fonction pour charger les données
async function loadData() {
    try {
        const response = await fetch('charlock.json');
        residences = await response.json();
        filteredResidences = [...residences];
        updateMap();
        updateUI();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Fonction pour mettre à jour la carte
function updateMap() {
    // Supprimer les marqueurs existants
    markers.forEach(marker => marker.remove());
    markers = [];

    // Ajouter les nouveaux marqueurs
    filteredResidences.forEach(residence => {
        if (residence.latitude && residence.longitude) {
            const marker = L.marker([residence.latitude, residence.longitude])
                .bindPopup(createPopupContent(residence))
                .addTo(map);
            markers.push(marker);
        }
    });

    // Ajuster la vue de la carte si nécessaire
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }
}

// Fonction pour créer le contenu du popup
function createPopupContent(residence) {
    return `
        <div class="popup-content">
            <h3>${residence.label}</h3>
            <p>${residence.adresse}</p>
            <p>Logements: ${residence.nb_logements}</p>
            <p>Surface: ${residence.surface_habitable}m²</p>
            <p>DPE: ${residence.lettre_dpe || 'Non disponible'}</p>
            <button onclick="showDetails('${residence.id}')" class="popup-button">
                Voir plus
            </button>
        </div>
    `;
}

// Fonction pour mettre à jour l'interface
function updateUI() {
    // Mettre à jour le compteur de résidences
    document.querySelector('.title').textContent = 
        `${filteredResidences.length} résidences (${getTotalLogements()} logements)`;

    // Mettre à jour les compteurs de filtres
    updateFilterCounts();

    // Mettre à jour les boutons d'action
    updateActionButtons();
}

// Fonction pour obtenir le nombre total de logements
function getTotalLogements() {
    return filteredResidences.reduce((total, res) => total + (res.nb_logements || 0), 0);
}

// Fonction pour mettre à jour les compteurs de filtres
function updateFilterCounts() {
    // Date de construction
    const constructionCount = new Set(residences.map(r => r.annee_construction)).size;
    document.querySelector('[data-filter="dateConstruction"] .filter-count').textContent = constructionCount;

    // Mode de production chauffage
    const chauffageCount = new Set(residences.map(r => r.mode_production_chauffage)).size;
    document.querySelector('[data-filter="modeProductionChauffage"] .filter-count').textContent = chauffageCount;

    // Autres filtres...
}

// Fonction pour appliquer les filtres
function applyFilters() {
    filteredResidences = residences.filter(residence => {
        return (
            (filters.dateConstruction.length === 0 || filters.dateConstruction.includes(residence.annee_construction)) &&
            (filters.modeProductionChauffage.length === 0 || filters.modeProductionChauffage.includes(residence.mode_production_chauffage)) &&
            (filters.dpe.length === 0 || filters.dpe.includes(residence.lettre_dpe))
            // Ajouter d'autres conditions de filtrage...
        );
    });

    updateMap();
    updateUI();
}

// Fonction de recherche
function searchResidences(searchTerm) {
    if (!searchTerm) {
        filteredResidences = [...residences];
    } else {
        filteredResidences = residences.filter(residence => {
            const searchString = `${residence.label} ${residence.adresse}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
    }

    updateMap();
    updateUI();
}

// Fonction pour afficher les détails d'une résidence
function showDetails(id) {
    const residence = residences.find(r => r.id === id);
    if (!residence) return;

    // Créer et afficher une modale avec les détails
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${residence.label}</h2>
            <div class="modal-details">
                <div class="detail-group">
                    <h3>Informations générales</h3>
                    <p>Adresse: ${residence.adresse}</p>
                    <p>Nombre de logements: ${residence.nb_logements}</p>
                    <p>Surface habitable: ${residence.surface_habitable}m²</p>
                    <p>Année de construction: ${residence.annee_construction}</p>
                </div>
                <div class="detail-group">
                    <h3>Caractéristiques énergétiques</h3>
                    <p>DPE: ${residence.lettre_dpe || 'Non disponible'}</p>
                    <p>Mode de chauffage: ${residence.mode_production_chauffage}</p>
                    <p>Énergie chauffage: ${residence.nature_energie_chauffage}</p>
                </div>
            </div>
            <button onclick="closeModal()" class="modal-close">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// Fonction pour fermer la modale
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Chargement initial des données
    loadData();

    // Gestionnaire de recherche
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        searchResidences(e.target.value);
    });

    // Gestionnaire de filtres
    document.querySelectorAll('.filter-item').forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.dataset.filter;
            // Implémenter l'ouverture du menu de filtre
            showFilterMenu(filterType);
        });
    });

    // Gestionnaire pour le bouton Favoris
    document.querySelector('.action-button.secondary').addEventListener('click', () => {
        // Implémenter la logique des favoris
    });

    // Gestionnaire pour le bouton Dépenses
    document.querySelector('.action-button.primary').addEventListener('click', () => {
        // Implémenter l'affichage des dépenses
    });
}); 