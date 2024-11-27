const RESULTS_PER_PAGE = document.getElementById("calculate-position-grid").getAttribute("var-pages");

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

const taxonomy_page = document.getElementsByClassName('region-content')[0];
const taxonomy_results = taxonomy_page.getElementsByClassName('view-content')[0];
const grid_sections = taxonomy_results.getElementsByClassName('views-view-grid');
let items;
let tags;
let counter = 0;
for (let i = 0; i < grid_sections.length; i++) {
    items = grid_sections[i].getElementsByClassName('views-col');
    for (let j = 0; j < items.length; j++) {
        link = paged_search_url + "0%2C" + (page_number * RESULTS_PER_PAGE + counter);
        tags = items[j].getElementsByClassName('field-content');
        for (let k = 0; k < tags.length; k++) {
                //document.write(tags[k].children[0]);
                tags[k].children[0].href=link;
        }
        counter += 1;
    }
}
