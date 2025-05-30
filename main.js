
window.addEventListener('DOMContentLoaded', (event) => {
  let svgObject = document.querySelector('#svgObject');
  let backgroundMusic; // Declare backgroundMusic here

  svgObject.addEventListener('load', function() {
    // Fetch the audio file
// Fetch the audio file
    // Fetch the audio file
    fetch('https://raw.githubusercontent.com/audreyleighleigh/Version3/main/MA_BlueFoxMusic_Moonlight_30s.wav')
      .then(response => response.blob())
      .then(blob => {
        // Create an Audio object
        backgroundMusic = new Audio(URL.createObjectURL(blob));

        backgroundMusic.volume = 1.0;
        
        // Debugging statement: Check if the audio file is loading
        backgroundMusic.addEventListener('canplaythrough', function() {
          console.log('Audio file has loaded and can be played');
        });

        // Play the background music after a click
        window.addEventListener('click', function() {
          console.log('Window was clicked'); // Debugging statement: Check if the click event is firing
          backgroundMusic.play();
        });

        // Debugging statement: Check if the audio is playing
        backgroundMusic.addEventListener('play', function() {
          console.log('Audio is playing');
        });
      });

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

    let svgObject = document.querySelector('#svgObject');
    let svgDocument = svgObject.contentDocument;
    let svgRoot = d3.select(svgDocument.documentElement);
    const newGroup = svgRoot.append('g');
        // Select Square1 from the SVG documen

    // Append mini icon of currentVisibleElement
    let elementId = stagedElement.id.replace('Staged', '');

    let yPosMap = {
    'Square1': 670,
    'Square2': 500,
    'Square3': 340,
    'Square4': 180,
    'Square5': 20,
    'Square6': -140,
    // Add more elements as needed
    };

    let icon = newGroup.append('use')
    .attr('xlink:href', `#${elementId}`) // Reference the SVG element by id
    .attr('y', yPosMap[elementId])
    .attr('transform', 'scale(0.33)');  // Scale the elem
  

    

    console.log('SVG Root: ', svgRoot.node()); // Log the SVG root

   
    console.log('SVG: ', svgRoot);
  
    const button = svgRoot.select('#Dot1');
    console.log('Button: ', button);
  
    const sliderInteraction = d3.select(stagedElement); // Select the staged element
    console.log('Slider Interaction: ', sliderInteraction);
  
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
        .domain([0, 1467])
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
      .on('drag', function (event, d) {
        const svgPosition = svgRoot.node().getBoundingClientRect();
        const newX = Math.max(0, Math.min(1467, event.x - svgPosition.left - 288)); // Add 288 to the newX calculation
        console.log('New X position: ', newX);

        // Update the icon's position
        icon.attr('x', 3*(newX) + 745.5);

  

          // Update the button's position
          d3.select(this).attr('transform', `translate(${newX}, 0)`);  
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
  
          // Append text elements
          newGroup.selectAll("text").remove(); // Remove existing text elements


  /*
          newGroup.append("text")
            .attr("x", newX)
            .attr("y", 200) // Adjust y position as needed
            .text(`Year: ${currentYear}`)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black"); */

          newGroup.append("text")
            .attr("id", "yearDisplay")
            .attr("x", newX + 400)
            .attr("y", 275) // Adjust y position as needed
            .attr("font-family", "sans-serif")
            .attr("font-size", "30px")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .text(`${currentYear}`);
  
         /* newGroup.append("text")
            .attr("x", newX)
            .attr("y", 230) // Adjust y position as needed
            .text(`Size: ${currentSize}`)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");*/
  
            newGroup.append("text")
            .attr("x", newX + 290)
            .attr("y", 320) // Adjust y position as needed
            .text(`     + ${percentageChange.toFixed(2)}%`)
            .attr("font-family", "sans-serif")
            .attr("font-size", "30px")
            .attr("fill", "red");
/*
            // Append mini icon of currentVisibleElement
            let elementId = stagedElement.id.replace('Staged', '');

            let yPosMap = {
              'Square1': 670,
              'Square2': 500,
              'Square3': 340,
              'Square4': 180,
              'Square5': 20,
              'Square6': -140,
              // Add more elements as needed
          };

            newGroup.append('use')
                .attr('xlink:href', `#${elementId}`) // Reference the SVG element by id
                .attr('x', 3*(newX) + 745.5)
                .attr('y', yPosMap[elementId])
                .attr('transform', 'scale(0.33)');  // Scale the element
                console.log('Y value for element', elementId, ':', 670); // Log the y value
             
                console.log(yValue);
            console.log('Text elements and image appended');
              */
          
        });
  
      // Apply the drag behavior to the button
      button.call(drag);
    }).catch(error => {
      console.error('Error loading CSV data: ', error);
    });
  }
  
  
/*latest working handleSliderInteraction 2/25/24
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

 */   
