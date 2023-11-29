import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export const strings = { 
    language: "fr-fr",
    _components: {
        "pnp-search-results": {
            seeAllLink: "Voir tout",
            results: "résultats"
        },
        "pnp-pagination": {
            nextBtn: "Suivant",
            previousBtn: "Précédent",
            tooManyPages: "Trop de pages!",
            screenTipContent: `Il semble que ta recherche ait retourné beaucoup trop de pages!
Essaye de restreindre le périmètre de ta recherche en utilisant des mots-clés plus précis🙏
            `
        },
        "pnp-filter-date": {
            anyTime: "N'importe quand",
            today: "Aujourd'hui",
            past24: "Dernières 24h",
            pastWeek: "Semaine dernière",
            pastMonth: "Mois dernier",
            past3Months: "Derniers 3 mois",
            pastYear: "Année dernière",
            olderThanAYear: "Au delà d'un an",
            reset: "Réinitialiser",
            from: "À partir du",
            to: "Au",
            applyDates: "Appliquer",
            selections: "sélection(s)"
        },
        "pnp-filter-checkbox": {
            reset: "Réinitialiser",
            searchPlaceholder: "Rechercher une valeur...",
            apply: "Appliquer",
            cancel: "Annuler",
            selections: "sélection(s)"
        },
        "pnp-search-filters": {
            resetAllFilters: "Réinitialiser les filtres",
            noFilters: "Aucun filtre à afficher"
        },
        "pnp-search-input": {
            searchPlaceholder: "Rechercher un mot clé...",
            clearSearch: "Réinitialiser la boîte de recherche",
            previousSearches: "Recherche(s) précédente(s)"
        },
        "pnp-search-infos": {
            searchQueryResultText: (keywords) : string => `Voici ce que nous avons trouvé pour "${keywords}"`,
            resultCountText: (count): string  => `${count} résultats trouvés auxquels vous avez accès.`,
            notFoundSuggestions: (keywords) => html`
                        <h2 class="font-primary text-3xl mb-4">Votre recherche pour "${keywords}" n'a retourné aucun résultat.</h2>
                        <p>Quelques suggestions:</p>
                        <ul class="list-disc pl-8">
                            <li>Vérifiez que l'orthographe est correcte.</li>
                            <li>Essayer de spécifier d'autres mots clés.</li>
                        </ul>
            `,
            didYouMean: (handlerFunction, updatedQueryString) => html`
                <p>Vouliez-vous dire: "<a href="#" @click=${handlerFunction}>${unsafeHTML(updatedQueryString)}"?</a></p> 
            `
        },
        "pnp-error-message": {
            errorMessage:"Erreur"
        },
        "pnp-search-sort":{
            sortedByRelevance: "Trier par pertinence",
            sortDefault:"Pertinence",
            sortAscending: "Tri ascendant",
            sortDescending: "Tri descendant",
        }
    }
};