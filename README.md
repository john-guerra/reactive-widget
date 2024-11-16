# reactive-widget

A helper function to create [Reactive Visualization Widgets](https://johnguerra.co/reactiveWidgets), web components that work like inputs holding a *value* and using *input* events to trigger changes. Useful for creating interactive visualizations and connecting them with other widgets.

To use it just pass it an html _element_ with your visualization, and an object with the initial value and a callback function for when the value changes. It will return a [reactive widget](https://johnguerra.co/reactiveWidgets) with a helper function *setValue* that you can call to update it's reactive value.

```js
// 🧰 Enhance your html element with reactive value and event handling
let widget = ReactiveWidget(element, { value, showValue });

// Then on an interaction
...
.on("click", () => {
  // you can use setValue for triggering input events
  widget.setValue(newVal)
})
```

## Full Example Usage

```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reactive Widget helper function test</title>
  </head>
  <body>
    <h1>Reactive Widget Helper Function</h1>
    <div id="target"></div>
    <div id="status"></div>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="https://cdn.jsdelivr.net/npm/reactive-widget-helper"></script>
    <script src="./Histogram.js"></script>
    

    <script>
      const BrushableHistogram = function (
        data,
        {
          value = [],
          x = (d) => d[0],
          xLabel = "",
          width = 600,
          height = 300,
          marginBottom = 30,
          vertical = false,
        } = {}
      ) {
        // ✅ Add here the code that creates your widget
        let element = Histogram(data, {
          x,
          xLabel,
          width,
          height,
          marginBottom,
          vertical,
        });

        // 🧰 Enhance your html element with reactive value and event handling
        let widget = ReactiveWidget(element, { value, showValue });

        // Enhance the Histogram with a brush
        function brushended(event) {
          let selection = event.selection;
          if (!event.sourceEvent || !selection) return;

          const [x0, x1] = selection.map((d) => element._xS.invert(d));
          widget.setValue(vertical ? [x1, x0] : [x0, x1]);
        }
        const brush = (vertical ? d3.brushY() : d3.brushX())
          .extent([
            [element._margin.left, element._margin.top],
            [
              element._width - element._margin.right,
              element._height - element._margin.bottom,
            ],
          ])
          .on("brush end", brushended);
        const gBrush = d3.select(element).append("g").call(brush);

        // 🧰 ShowValue will display the current internalValue brush position
        function showValue() {
          // ✅ Add here the code that updates the current interaction
          const [x0, x1] = widget.value;
          // Update the brush position
          gBrush.call(
            brush.move,
            x1 > x0 ? (vertical ? [x1, x0] : [x0, x1]).map(element._xS) : null
          );
        }

        showValue();

        // 🧰 Finally return the html element
        return widget;
      };

      async function runtIt() {
        const cars = await d3.json(
          "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/cars.json"
        );
        const xAttr = "Horsepower";
        const myWidget = BrushableHistogram(cars, {
          x: (d) => d[xAttr],
          xLabel: xAttr,
          height: 200,
          value: [12, 32], // initial position
        });

        // 🧰 Listen to changes in the widget
        const onInput = (e) => {
          console.log("Widget updated. value=", myWidget.value);
          document.getElementById("status").innerHTML =
            `Current Selection <pre>${JSON.stringify(myWidget.value, null, 2)}</pre>`;
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