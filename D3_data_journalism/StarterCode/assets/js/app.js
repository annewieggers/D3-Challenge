// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 620;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#svg-area")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import data
d3.csv("data.csv").then(function(lifeData) {

// console.log(lifeData);

// Step 1: Parse Data/Cast as numbers
lifeData.forEach(function(data) {
data.poverty = +data.poverty;
data.healthcare = +data.healthcare
});

// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(lifeData, d => d.poverty)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(lifeData, d => d.healthcare)])
      .range([chartHeight, 0]);

// Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(lifeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

// Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty (%): ${d.poverty}<br>Healthcare (%): ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  

  // Create label for data points
  chartGroup.append("text")
  .style("text-anchor", "middle")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(lifeData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty - 0);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare - 0.2);
      })
      .text(function(data) {
          return data.abbr
      });

// Create labels for axis

chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - chartMargin.left + 40)
.attr("x", 0 - (svgHeight / 2))
.attr("dy", "1em")  
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});

