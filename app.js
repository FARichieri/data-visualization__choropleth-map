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

    // Constants
    const width = 550;
    const height = 400;
    const padding = 50;
    const path = d3.geoPath();

    const colors = {
      '#fff': {
        min: 0,
        max: 3,
      },
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
      '#0000ff': {
        min: 66,
        max: 100,
      },
    };

    const colorsData = Object.entries(colors);

    const paintColors = (percent) => {
      const match = colorsData.find(
        (color) => percent >= color[1].min && percent <= color[1].max
      );
      return match[0];
    };

    // Create tooltip
    const tooltip = d3
      .select('.container')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

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
    const projection = d3
      .geoIdentity()
      .fitSize(
        [width * 0.75, height * 0.75],
        topojson.feature(usCountryData, usCountryData.objects.states)
      );

    // set the path's projection:
    path.projection(projection);

    // Now access the array of features in the collection for use with .data():
    const counties = topojson.feature(
      usCountryData,
      usCountryData.objects.counties
    ).features;

    const getMatchingCountyData = (d) => {
      return usEducationalData.find((e) => e.fips === d.id);
    };

    svg
      .append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(counties)
      .enter()
      .append('path')
      .attr('fill', (d) => {
        const matchingData = getMatchingCountyData(d);
        return paintColors(
          matchingData.bachelorsOrHigher ? matchingData.bachelorsOrHigher : 0
        );
      })
      .attr('class', 'county')
      .attr('data-fips', (d) => d.id)
      .attr('data-education', (d) => {
        const matchingData = getMatchingCountyData(d);
        return matchingData.bachelorsOrHigher
          ? matchingData.bachelorsOrHigher
          : 0;
      })
      .on('mouseover', function (d, item) {
        d3.select(this).transition().duration('50').attr('opacity', '.85');
        tooltip.transition().duration(100).style('opacity', 1);

        const getDataEducation = (d) => {
          const matchingData = getMatchingCountyData(d);
          return matchingData.bachelorsOrHigher
            ? matchingData.bachelorsOrHigher
            : 0;
        };

        const getAreaName = (d) => {
          const matchingData = getMatchingCountyData(d);
          return matchingData.area_name;
        };

        tooltip
          .html(
            `${getAreaName(item)}
            ${getDataEducation(item)}%
        `
          )
          .attr('data-education', getDataEducation(item))
          .style('left', d.pageX + 10 + 'px')
          .style('top', d.pageY + 10 + 'px');
      })
      .on('mouseout', function (d, item) {
        d3.select(this).transition().duration('50').attr('opacity', '1');
        tooltip.transition().duration(100).style('opacity', 0);
      })
      .attr('d', path)
      .attr('transform', `scale(1.3, 1.3)`);

    // Add Legend
    const legendWidth = width / 5;
    const xScaleColors = d3
      .scaleBand()
      .domain(d3.range(colorsData.length))
      .range([0, legendWidth]);
    const axisColors = d3
      .axisBottom(xScaleColors)
      .tickFormat((d, i) => colorsData[i][1].min);

    svg
      .append('g')
      .attr('transform', `translate(${padding / 2},${height - 20})`)
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
