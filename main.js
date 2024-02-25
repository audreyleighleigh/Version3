
window.addEventListener('DOMContentLoaded', (event) => {
    let svgObject = document.querySelector('#svgObject');
    svgObject.addEventListener('load', function() {
      let svgDocument = svgObject.contentDocument;
      let elements = svgDocument.querySelectorAll('.wiggle');
  
      // Keep track of the currently visible element
      let currentVisibleElement = null;
  
      elements.forEach(element => {
        d3.select(element)
          .on('click', function (event, d) {
            let stagedElementId = handleMicrointeraction(event);
            currentVisibleElement = handleStagedElement(svgDocument, stagedElementId, currentVisibleElement);
      
            // Check if currentVisibleElement is not null before calling handleSliderInteraction
            if (currentVisibleElement) {
              console.log('currentVisibleElement before handleSliderInteraction:', currentVisibleElement);  
              handleSliderInteraction(currentVisibleElement);
            }
          });
      });
      });
    });




function changeColor() {
    const svgObject = document.querySelector('#svgObject'); // select the <object> tag
    const svgDocument = svgObject.contentDocument; // get the SVG document

    if (svgDocument) {
        const svgElement = svgDocument.querySelector('#Cloud1 path'); // select the <path> inside <g id="Cloud1">
        if (svgElement) {
            svgElement.style.fill = 'yellow';
            console.log('Color changed to orange');
        } else {
            console.log('Path element inside SVG element with id "Cloud1" is not found');
        }
    } else {
        console.log('SVG document is not loaded');
    }
}

function handleMicrointeraction(event) {
    console.log('Element clicked:', event.currentTarget); // Log the clicked element
  
    // Get the current bounding box of the group
    const bbox = event.currentTarget.getBBox();
    console.log('Bounding box:', bbox); // Log the bounding box
  
    // Calculate the center of the group
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    console.log('Center coordinates:', cx, cy); // Log the center coordinates
  
    // Apply the transform to the entire group
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr('transform', `translate(${cx}, ${cy}) scale(1.2) translate(-${cx}, -${cy})`)
      .transition()
      .duration(200)
      .attr('transform', `translate(${cx}, ${cy}) scale(1) translate(-${cx}, -${cy})`);
  
    // Get the id of the associated staged element
    return event.currentTarget.getAttribute('data-staged-id');
  }
  
  
  function handleStagedElement(svgDocument, stagedElementId, currentVisibleElement) {
    // Hide the currently visible element if it exists
    if (currentVisibleElement) {
      currentVisibleElement.style.visibility = 'hidden';
    }
  
    // Get the staged element and make it visible
    let stagedElement = svgDocument.getElementById(stagedElementId);
    if (stagedElement) {
      stagedElement.style.visibility = 'visible';
      currentVisibleElement = stagedElement;
    }
  
    return currentVisibleElement;
  }

  

  

  function handleSliderInteraction(stagedElement) {
    console.log('handleSliderInteraction called');
    //console.log('This is the staged element: ', stagedElement.outerHTML);
  
    const svgDocument = d3.select('#svgObject').node().contentDocument;
    const svg = d3.select(svgDocument);
    const button = svg.select('#Dot1');
    const sliderInteraction = d3.select(stagedElement); // Select the staged element
  
    // Get the CSV URL from the data-csv-url attribute
    let csvUrl = sliderInteraction.node().getAttribute('data-csv-url');
    console.log('CSV URL: ', csvUrl);
  
    // Load the CSV data
    d3.csv(csvUrl).then(data => {
      console.log('Loaded data: ', data);
        // Find the size value for the year 1984
    const size1984 = +data.find(d => d.YEAR === '1984').SIZE; // Convert to number
    console.log('Size in 1984: ', size1984);
      
  
      // Create scales for year and size mapping
      const yearScale = d3.scaleLinear()
        .domain([288, 1755])
        .range([1984, 2022]);
      console.log('Year scale: ', yearScale);
  
      const sizeScale = d3.scaleLinear()
        .domain([18.31, 40.98])
        .range([.75, 1.5]); // Adjusted to represent your scaling range
      console.log('Size scale: ', sizeScale);
  
      // Set the transform origin to the center of the sliderInteraction
      sliderInteraction.style('transform-origin', 'center bottom');
  
      // Create the drag behavior
      const drag = d3.drag()
        .on('drag', function (event) {
          // Calculate the new X position within constraints
          const newX = Math.max(288, Math.min(1755, event.x));
          console.log('New X position: ', newX);
  
          // Update the button's position
          d3.select(this).attr('transform', `translate(${newX}, 176)`);
  
          // Calculate the current year based on slider position
          const currentYear = Math.round(yearScale(newX));
          console.log('Current year: ', currentYear);
  
          // Find the corresponding data entry for the current year
          const currentSizeData = data.find(d => +d.YEAR === currentYear);
          console.log('Current size data: ', currentSizeData);
  
          // If data is found, update the sliderInteraction size
          if (currentSizeData) {
            // Use the sizeScale to calculate a scale factor based on the size
            const scaleFactor = sizeScale(+currentSizeData.SIZE);
            console.log('Scale factor: ', scaleFactor);
  
            // Update the transform attribute of the sliderInteraction group to scale it
            sliderInteraction.attr('transform', `scale(${scaleFactor})`);
          }
  
          // Find the size value for the current year
          const currentSize = +data.find(d => d.YEAR === currentYear.toString()).SIZE; // Convert to number
          console.log('Current size: ', currentSize);
  
          // Calculate the percentage change
          const percentageChange = ((currentSize - size1984) / size1984) * 100;
          console.log('Percentage change: ', percentageChange);
        });
  
      // Apply the drag behavior to the button
      button.call(drag);
    }).catch(error => {
      console.error('Error loading CSV data: ', error);
    });
}

    