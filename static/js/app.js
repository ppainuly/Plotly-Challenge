function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = `/metadata/${sample}`;
  console.log(url);
    // Use d3 to select the panel with id of `#sample-metadata`
    let metaPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metaPanel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json("/metadata/"+ sample).then(function(response){
      console.log(response);
      Object.entries(response).forEach(([key, value]) => {
        metaPanel.append("h4").text(`${key}: ${value}`
        );
      });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }

function buildCharts(sample) {
  console.log("Running BuildCharts")
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = `/samples/${sample}`;
  console.log(url);
  d3.json(url).then(function(response){
    // @TODO: Build a Bubble Chart using the sample data
    let traceBubble = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
        colorscale: "Earth"
      },
      type:"Scatter"
    };
    let traceBubble1 = [traceBubble];

    let layout = {
      showlegend: false,
      height: 700,
      width: 1400,
      font:{
        family:"Droid Sans Mono",
        size:17
      }
    };

    Plotly.newPlot('bubble', traceBubble1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    let data = [{
      values: response.sample_values.slice(0, 10),
      labels: response.otu_ids.slice(0, 10),
      //hoverinfo: 'label+percent+name',
      hovertext: response.otu_labels.slice(0, 10),
      type: 'pie',
      pull:0.1
    }];
    let layout1 = {
      title: 'Belly Button Samples - Top 10',
      showlegend: true,
      font:{
        family:"Droid Sans Mono",
        size:17
      }
    };
    Plotly.newPlot('pie', data, layout1);


  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    console.log("Running BuildMetadata");
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
console.log("Starting js File.....")