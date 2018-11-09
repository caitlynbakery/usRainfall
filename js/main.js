const width = 800;
const height = 600;
const margin = {left: 100, right: 100, top: 100, bottom: 100};
const svgWidth = width + margin.left + margin.right;
const svgHeight = height + margin.top + margin.bottom;

var svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

drawLabels(svg, width, height);

const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.5);

const xAxis = d3.axisBottom(xScale);

const xGroup = svg.append('g')
    .attr('transform', `translate(0, ${height})`);

const yScale = d3.scaleLinear()
    .range([height, 0]);




d3.csv("data/rainfall.csv").then(data => {
    data.forEach(stateData => {
        stateData.rainfall = +stateData.rainfall;
        
        const checkChar = /^[A-Z]/;
        for (let i = 0; i < 5; i++){
            if (checkChar.test(stateData.state)) {
                break;
            } else {
                stateData.state = stateData.state.substring(1);
            }
        }
    })

    const rainfallMinMax = d3.extent(data, d => d.rainfall);
    const rainfallMin = d3.min(data, d => d.rainfall);
    const rainfallMax = d3.max(data, d => d.rainfall);
    yScale.domain([rainfallMin-10, rainfallMax + 10]);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .call(yAxis)
        .attr('class', 'axis');


    let dataset1 = [];
    let dataset2 = [];
    let dataset3 = [];
    let dataset4 = [];
    let dataset5 = [];

    data.forEach((stateData, index) => {
        if(index < 10){
            dataset1.push(stateData);
        }
        else if(index < 20){
            dataset2.push(stateData);
        }
        else if(index < 30){
            dataset3.push(stateData);
        }
        else if(index < 40){
            dataset4.push(stateData);
        }
        else if(index < 50){
            dataset5.push(stateData);
        }
    })
    const datasets = [dataset1, dataset2, dataset3, dataset4, dataset5];

    const buttons = d3.selectAll('input');
    buttons.on('change', function(d){
        const selection = this.value;
        drawRain(selection, datasets);
    })
    

})

function drawRain(selection, datasets){
    var dataset;
    if (selection == "set1"){
        dataset = datasets[0];
    } else if (selection == "set2") {
        dataset = datasets[1];
    } else if (selection == "set3") {
        dataset = datasets[2];
    } else if (selection == "set4") {
        dataset = datasets[3]; 
    } else if (selection == "set5") {
        dataset = datasets[4];
    }

    let states = [];
    dataset.forEach(element => {
        states.push(element.state);
    })

    xScale.domain(states);

    xGroup.call(xAxis)
    .attr('class', 'axis');

    const circles = svg.selectAll('circle')
        .data(dataset);
    circles.exit().remove();
    circles
        .attr('cy', '0')
        .transition()
        .attr('cy', d => yScale(d.rainfall))
        .duration(1000);

    circles.enter()
        .append('circle')
        .attr('cy', '0')
        .attr('cx', d => xScale(d.state) + xScale.bandwidth()/2)
        .attr('r', xScale.bandwidth()/2)
        .style('fill', (d, i) => d3.schemeSet3[i])
        .transition()
        .attr('cy', d => yScale(d.rainfall))
        .duration(1000)



}

function drawLabels(surface, w, h) {
    surface.append('g')
        .attr('class', 'title')
        .append('text')
        .text('Rainfall by US State')
        .attr('x', w/2)
        .attr('y', -10)
        .attr('text-anchor', 'middle');

    surface.append('g')
        .attr('class', 'axisLabel')
        .append('text')
        .text('annual rainfall (inches)')
        .attr('x', -50)
        .attr('y', h/2)
        .attr('transform', `rotate(-90, -50, ${h/2})`);
}

