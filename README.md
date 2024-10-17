# reactive-widget

A helper function to create Reactive Visualization Widgets

## Example Usage

```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vegaSelected test</title>
  </head>
  <body>
    <h1>Vega Selected demo</h1>
    <div id="target"></div>
    <div id="status"></div>
    // 🧰 Add dependencies
    <script src="https://cdn.jsdelivr.net/npm/vega@5.30.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5.21.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6.26.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-selected"></script>
    <!-- <script src="../dist/vegaSelected.js"></script> -->

    <script>
      const spec = {...} // a parsed vega/vega-lite spec
      
      async function runtIt() {
        // 🧰 Wrap your spec with vegaSelected
        const myWidget = await vegaSelected(spec);

        // 🧰 Listen to changes in the widget
        const onInput = (e) => {
          console.log("do something with the current value", myWidget.value);          
        };
        myWidget.addEventListener("input", onInput);
        onInput();

        // 🧰 Append your widget to the page
        document.getElementById("target").appendChild(myWidget);
      }

      runtIt();
    </script>
  </body>
</html>

``