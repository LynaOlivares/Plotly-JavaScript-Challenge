//  Belly Button Biodiversity Analysis of Test Subjects
//     Using Plotly to plot a Bar Chart and a Bubble Chart
//     Using .json file with Test Subject and test results
//
// Create Array for each Type of data within the .json file
//  names:  test subject id list
//  metadata:  test subject personal information
//  samples:  test subject sample results
// 
var dataNames = [];
// d3.json("samples.json").then(function(data) { 
d3.json('https://lynaolivares.github.io/Plotly-JavaScript-Challenge/samples.json').then(function(data) { 
    // console.log(data)
    dataNames = data.names;
    console.log(dataNames);

    dataMeta = data.metadata;
    console.log(dataMeta);

    dataSamples = data.samples;
    console.log(dataSamples);

    // Build Drop down list of Test Subject Ids
    var idList = d3.select("#selDataset");

    dataNames.forEach(name => {
        var cell = idList.append("option");
        cell.text(name);
    });
});

// ************************************//
// Demographic Table Function
// ************************************//
function infoTable(idValue) {

    var filterData = dataMeta.filter(md => md.id == idValue);
    console.log(filterData);
 
    var pbody = d3.select(".panel-body");
    pbody.html("");

    filterData.forEach(info => {
        var row = pbody.append("tr");
        
        // Use `Object.entries` to log each information value 
        Object.entries(info).forEach(([key, value]) => {
        
        // Use d3 to append 1 cell per siting values
            var row = pbody.append("tr");
            var cell = row.append("td");
        
        // Use d3 to update each cell's text with siting data
            cell.text(`${key}:  ${value}`);
        });
    });
};

// ************************************//
// Build Charts Function 
// ************************************//
// filter on the Test Subjects Samples Data, plot all and plot top 10 results
function buildCharts(idValue) {
    var filterSample = [];
    var sampleIds = [];
    var sampleValues = [];
    var sampleLabels = [];

    filterSample =  dataSamples.filter(sd => sd.id == idValue);
    console.log(filterSample);
 
    filterSample.forEach(info => {
        Object.entries(info).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    sampleIds =  value.map(arr => arr);
                    console.log(sampleIds);
                    break;
                case "sample_values":
                    sampleValues = value.map(arr => arr);
                    console.log(sampleValues);
                    break;
                case "otu_labels":
                    sampleLabels = value.map(arr => arr);
                    console.log(sampleLabels);
                    break;
            }
        });
    });

    var tenIds =  sampleIds.slice(0,10);
    var tenValues =  sampleValues.slice(0,10);
    var tenLabels =  sampleLabels.slice(0,10);

    // **********************
    // Plot BarCode - top 10
    // **********************
    var trace1 = {
        x: tenValues,
        y: Object.keys(tenIds).reverse(),
        text: tenLabels,
        name: "UTO BarChart",
        type: "bar",
        orientation: "h",
    };
    // data & layout
    var chartData = [trace1];

    var layout = {
        title: 'Top 10 OTUs',
        xaxis: {
            title: "OTU Values",
            showgird: true
        },
        yaxis: {
            tickvals: Object.keys(tenIds).reverse(),
            ticktext: tenIds.map(item => `OTU ${item}`)
            }
        };
    
    Plotly.newPlot("bar", chartData, layout);

           
    // **********************
    //  Bubble Chart
    // **********************
    var trace2 = {
        x: sampleIds,
        y: sampleValues,
        text: sampleLabels,
        mode: 'markers',
        marker: {
        color: sampleIds,
        size: sampleValues,
        sizeref: 0.1,
        sizemode: 'area'
        }
        };
        
    var data = [trace2];
        
    var layout2 = {
        title: 'OTUs Values',
        showlegend: false,
        xaxis: {
            title: "OTU IDs",
            showgird: true
        },
    };
        
    Plotly.newPlot("bubble", data, layout2);

};

// ************************************//
// Selection Handler and Listerner
// ************************************//
// Assign Button to a variable
var button = d3.select("#selDataset");

// Button handler Listen for selection change

button.on("change", function() {
       
   // Select Values from drop down box selections
    var inId = d3.select("#selDataset");
    var idValue = inId.property("value");
    console.log(idValue);

   // Build Demographic Table
    infoTable(idValue);
   
   // Build Charts 
    buildCharts(idValue);   
    
});
