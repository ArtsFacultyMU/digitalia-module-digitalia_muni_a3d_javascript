const RESULTS_PER_PAGE = drupalSettings.digitaliaMuniA3dJavascript.calculatePosition['items_per_page'];
const DISPLAY_FORMAT = drupalSettings.digitaliaMuniA3dJavascript.calculatePosition['display_format'];

console.log(drupalSettings.digitaliaMuniA3dJavascript.calculatePosition);

let separator = "&";
if (!location.search || location.search.length === 0) {
    separator = "?";
}

const paged_search_url = location.pathname + "/paged" + location.search + separator + "page=";
const params = new URLSearchParams(location.search);

let page_number = params.get("page");
let link;
if (page_number == null) {
    page_number = 0;
}


let items;
let tags;
let counter = 0;

if (DISPLAY_FORMAT == "grid") {
    const taxonomy_page = document.getElementsByClassName('region-content')[0];
    const taxonomy_results = taxonomy_page.getElementsByClassName('view-content')[0];
    const grid_sections = taxonomy_results.getElementsByClassName('views-view-grid');
    
    for (let i = 0; i < grid_sections.length; i++) {
        items = grid_sections[i].getElementsByClassName('views-col');
        for (let j = 0; j < items.length; j++) {
            link = paged_search_url + "0%2C" + (page_number * RESULTS_PER_PAGE + counter);
            tags = items[j].getElementsByClassName('field-content');
            for (let k = 0; k < tags.length; k++) {
                    if (tags[k].firstChild) {
                        tags[k].firstChild.setAttribute('href', link);
                    }
            }
            counter += 1;
        }
    }
}

if (DISPLAY_FORMAT == "table") {
    const tables = document.querySelectorAll("table.views-view-table tbody");
    
    for (let i = 0; i < tables.length; i++) {
    	  let table_rows = tables[i].querySelectorAll("tr");
    	  for (let j = 0; j < table_rows.length; j++) {
    	  	  link = paged_search_url + "0%2C" + (page_number * RESULTS_PER_PAGE + counter);
            let element = table_rows[j].querySelector("td.views-field-field-artefact-id a");
            if (element) {
                element.setAttribute('href', link);
            }
    	  	  counter += 1;
    	  }
    }
}
