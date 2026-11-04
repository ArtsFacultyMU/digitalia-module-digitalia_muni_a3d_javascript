function alter_links(context, settings)
{
  const RESULTS_PER_PAGE = settings.digitaliaMuniPagedSearch.calculatePosition["items_per_page"];
  const DISPLAY_FORMAT = settings.digitaliaMuniPagedSearch.calculatePosition["display_format"];

  const PAGER_ID = 1;
  let search_params = new URLSearchParams(location.search);
  let pager = search_params.get("page");

  // fill pager with at least PAGER_ID zeroes
  let pager_array = [];
  if (!pager) {
    for (let i = 0; i <= PAGER_ID; ++i) {
      pager_array.push("0");
    }
  } else {
    pager_array = pager.split(",");
    for (let i = 0; i < pager_array.length; ++i) {
      if (pager_array[i] == "") {
        pager_array[i] = "0";
      }
    }
  }

  const paged_search_url = location.pathname + "/paged";
  const page_number = pager_array[0];

  let link;
  let items;
  let tags;
  let counter = 0;

  if (DISPLAY_FORMAT == "grid") {
    const grid_sections = context.querySelectorAll(".region-content .view-content .views-view-grid .views-row");

    for (let i = 0; i < grid_sections.length; i++) {
      items = grid_sections[i].getElementsByClassName("views-col");

      for (let j = 0; j < items.length; j++) {
        pager_array[PAGER_ID] = page_number * RESULTS_PER_PAGE + counter;
        search_params.set("page", pager_array.join(","));

        link = paged_search_url + "?" + search_params.toString();
        tags = items[j].getElementsByClassName("field__item");

        for (let k = 0; k < tags.length; k++) {
            let el = tags[k].getElementsByTagName("a")[0];
            if (el instanceof Element) {
              el.setAttribute("href", link);
            }
        }

        counter += 1;
      }
    }
  }

  if (DISPLAY_FORMAT == "table") {
    const tables = context.querySelectorAll("table.views-view-table tbody");

    for (let i = 0; i < tables.length; i++) {
      let table_rows = tables[i].querySelectorAll("tr");

      for (let j = 0; j < table_rows.length; j++) {
        pager_array[PAGER_ID] = page_number * RESULTS_PER_PAGE + counter;
        search_params.set("page", pager_array.join(","));
        link = paged_search_url + "?" + search_params.toString();

        let tags = table_rows[j].querySelectorAll("td.views-field a");

        for (let k = 0; k < tags.length; k++) {
          if (tags[k] && tags[k] instanceof Element) {
            tags[k].setAttribute("href", link);
          }
        }

        counter += 1;
      }
    }
  }
}

// Using behaivors, because on admin pages the code was executed too early.
// Now it executes twice on admin pages. Not ideal, but works.
Drupal.behaviors.digitaliaCalculateBehavior = {
  attach: function (context, settings) {
    alter_links(context, settings);
  }
}
