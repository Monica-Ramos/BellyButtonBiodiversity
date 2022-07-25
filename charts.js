function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var Samplesarray =data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var Samples =Samplesarray.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var firstSamples=Samples[0] ;
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OtuID=firstSamples.otu_ids;
    var OtuLabels=firstSamples.otu_labels;
    var SampleValues=firstSamples.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var WashingFreq = result.wfreq;
   
    // Create the yticks for the bar chart.
    var yticks = OtuID.slice(0,10).map(OTU => "OTU " + OTU ).reverse();

    var barData = [{
      x:SampleValues.slice(0,10).reverse(),
      y:yticks,
      type:"bar",
      orientation:'h',
      text: OtuLabels.slice(0,10).reverse()
    }];

    
    // Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found"
    

     
    };
    //  Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);


//Bubble chart

    var bubbleData = [{
      x: OtuID,
      y: SampleValues,
      hovertext: OtuLabels,
      mode:"markers",
      marker:{
        size:SampleValues,  color:OtuID ,colorscale:"haline" }
   
   
  }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Culture Per Sample",
      xaxis: {title: "IDs"},
      //xaxis:"OTU ID",
      hovermode:"closest",
      
    };
    console.log(OtuID);
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
  


  //Gauge
  var gaugeData = [{
    type: "indicator",
    mode: "gauge+number",
    title: {text: "Belly Button Washing Frequency <br> Scrubs per Week"},
    value:WashingFreq,
    gauge: {
        xaxis:{range:[0,10]},
        steps:[
          {range : [0,2],color:'r'},
          {range : [2,4],color:'orange'},
          {range : [4,6],color:'yellow'},
          {range : [6,8],color:'greenyellow'},
          {range : [8,10],color:'green'},
        ]
    }

  }];

  var gaugeLayout = { width:700,height:450,margin:{t:0,b:0} };

  Plotly.newPlot("gauge",gaugeData,gaugeLayout); 
    
   
    
  
  });
}


















