// Code adapted from from https://observablehq.com/@d3/histogram/
// Original license
// Copyright 2017–2023 Observable, Inc.
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

function Histogram(
  data,
  {
    x = (d) => d[0],
    xLabel = "",
    yLabel = "Frequency",
    width = 600,
    height = 300,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 40,
    vertical = false,
  } = {}
) {
  // Bin the data.
  const bins = d3.bin().thresholds(40).value(x)(data);

  const xRange = [marginLeft, width - marginRight];
  const yRange = [marginTop, height - marginBottom];

  // Declare the x (horizontal position) scale.
  const xS = d3
    .scaleLinear()
    .domain([bins[0].x0, bins[bins.length - 1].x1])
    .range(vertical ? yRange.reverse() : xRange);

  // Declare the y (vertical position) scale.
  const yS = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range(vertical ? xRange : yRange.reverse());

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a rect for each bin.
  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(bins)
    .join("rect")
    .attr(vertical ? "y" : "x", (d) => (vertical ? xS(d.x1) : xS(d.x0) + 1))
    .attr(vertical ? "height" : "width", (d) =>
      vertical ? xS(d.x0) - xS(d.x1) - 1 : xS(d.x1) - xS(d.x0) - 1
    )
    .attr(vertical ? "x" : "y", (d) => (vertical ? yS(0) : yS(d.length)))
    .attr(vertical ? "width" : "height", (d) =>
      vertical ? yS(d.length) : yS(0) - yS(d.length)
    );

  // Add the x-axis and label.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(vertical ? yS : xS)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", width)
        .attr("y", marginBottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(`${vertical ? yLabel : xLabel}→`)
    );

  // Add the y-axis and label, and remove the domain line.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(vertical ? xS : yS).ticks(height / 40))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(`↑ ${vertical ? xLabel : yLabel}`)
    );

  // Exposing intervals
  svg.node()._margin = {
    left: marginLeft,
    right: marginRight,
    bottom: marginBottom,
    top: marginTop,
  };
  svg.node()._height = height;
  svg.node()._width = width;
  svg.node()._xS = xS;
  svg.node()._bins = bins;

  return svg.node();
}
