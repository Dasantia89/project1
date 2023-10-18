var csvLink = './assets/data/spoonacular_top1k_ingredients_20231016.csv';
// read existing CSV file, parse according to specified delimiter, create array of objects
function readCSV(csvFileUrl) {
  return fetch(csvFileUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      const objects = [];

      lines.forEach(line => {
        const columns = line.split(';');
        const object = {
          ingredientName: columns[0],
          ingredientID: columns[1]
        };
        objects.push(object);
      });

      return $.map(objects, function (displayArray) {
        return {
          label : displayArray.ingredientName,
          value : displayArray.ingredientID
        }
    });
    });
}

// Usage

readCSV(csvLink)
    .then(objects => {
      // takes ingredients from readCSV function and add them to suggestions
      // Then append them to the results div
      $("#ingredients").autocomplete({
        source: objects, autoFocus : true,
        minLength: 3,
        select: function (e, ui) {
          console.log($(e.currentTarget).children())
          console.log(ui)
          $('#results').append(`<p class='mx-2'>${ui.item.label}</p><p>X</p>`);
          $(this).val(''); return false;
        }
      });
    })
    .catch(error => {
      console.error(error);
    });


