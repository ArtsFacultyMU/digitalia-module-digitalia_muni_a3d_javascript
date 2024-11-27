const RESULTS_PER_PAGE = document.getElementById("calculate-position-table").getAttribute("var-pages");

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

const tables = document.querySelectorAll("table.views-view-table tbody");
let items;
let tags;
let counter = 0;

for (let i = 0; i < tables.length; i++) {
	let table_rows = tables[i].querySelectorAll("tr");
	for (let j = 0; j < table_rows.length; j++) {
		link = paged_search_url + "0%2C" + (page_number * RESULTS_PER_PAGE + counter);
		table_rows[j].querySelector("td.views-field-field-artefact-id a").href = link;
		counter += 1;
	}
}
