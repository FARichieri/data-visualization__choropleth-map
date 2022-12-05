const displayChoroplethMap = async () => {
  try {
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

    const width = 550;
    const height = 400;
    const padding = 50;

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
      .attr('data-flips', '')
      .attr('data-education', '');
    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChoroplethMap();
