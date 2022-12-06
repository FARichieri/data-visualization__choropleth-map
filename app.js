const displayChoroplethMap = async () => {
  try {
    // Fetch data
    let [usEducationalData, usCountryData] = await Promise.all([
      fetch(
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
      ),
      fetch(
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
      ),
    ]);
    usEducationalData = await usEducationalData.json();
    usCountryData = await usCountryData.json();

    console.log({ usEducationalData });
    console.log({ usCountryData });

    // Constants
    const width = 550;
    const height = 400;
    const padding = 50;
    const path = d3.geoPath();

    const colors = {
      '#4575b4': {
        min: 3,
        max: 12,
      },
      '#74add1': {
        min: 12,
        max: 21,
      },
      '#abd9e9': {
        min: 21,
        max: 30,
      },
      '#e0f3f8': {
        min: 30,
        max: 39,
      },
      '#ffffbf': {
        min: 39,
        max: 48,
      },
      '#fee090': {
        min: 48,
        max: 57,
      },
      '#fdae61': {
        min: 57,
        max: 66,
      },
    };

    // Create svg
    const svg = d3
      .select('.container')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Add title
    svg
      .append('text')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.2rem')
      .text('United States Educational Attainment');

    // Add description
    svg
      .append('text')
      .attr('id', 'description')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '.5rem')
      .text(
        `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`
      );

    // Add paths
    svg
      .append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(
        topojson.feature(usCountryData, usCountryData.objects.counties).features
      )
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('data-fips', (d) => d.id)
      .attr('data-education', (d) => {
        const matching = usEducationalData.find((e) => e.fips === d.id);
        return matching.bachelorsOrHigher ? matching.bachelorsOrHigher : 0;
      })
      .attr('d', path);

    // Add Legend
    const legendWidth = width / 5;
    const colorsData = Object.entries(colors);
    const xScaleColors = d3
      .scaleBand()
      .domain(d3.range(colorsData.length))
      .range([0, legendWidth]);
    const axisColors = d3
      .axisBottom(xScaleColors)
      .tickFormat((d, i) => colorsData[i][1].min);

    svg
      .append('g')
      .attr('transform', `translate(${padding / 2},${height / 1.6})`)
      .attr('id', 'legend')
      .append('g')
      .attr('class', 'axis-colors')
      .call(axisColors)
      .attr('font-size', '.25rem');

    svg
      .select('#legend')
      .append('g')
      .attr('id', 'colors')
      .selectAll('rect')
      .data(colorsData)
      .enter()
      .append('rect')
      .attr('transform', `translate(${0}, ${-20})`)
      .attr('x', (d, i) => xScaleColors(i))
      .attr('y', 10)
      .attr('width', 5)
      .attr('height', 10)
      .attr('fill', (d) => d[0]);

    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChoroplethMap();
