window.addEventListener('DOMContentLoaded', (event) => {
  // Initialize stamp state globally
  window.stampEnabled = false;
  
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
    
    // Create the SVG root selection (only once)
    let svgRoot = d3.select(svgDocument.documentElement);
    
    // Create a persistent stamp group for saved snapshots (only once)
    const stampGroup = svgRoot.append('g').attr('class', 'stamp-elements');
    
    // Create temp group for elements that shouldn't be stamped
    const globalTempGroup = svgRoot.append('g').attr('class', 'global-temp-elements');
    
    // Create stamp button in SVG that works like a camera shutter
    const stampButtonGroup = svgRoot.append('g')
      .attr('class', 'stamp-button-group')
      .attr('transform', 'translate(1500, 150)')
      .style('cursor', 'pointer');
    
    // Create button background
    stampButtonGroup.append('rect')
      .attr('width', 120)
      .attr('height', 50)
      .attr('rx', 8)
      .attr('fill', '#4CAF50')
      .attr('stroke', '#000')
      .attr('stroke-width', 3);
    
    // Create button text
    stampButtonGroup.append('text')
      .attr('x', 60)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-family', 'Arial, sans-serif')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('STAMP');
    
    // Store current state for the stamp button to use
    window.currentStampState = {
      elementId: null,
      position: null,
      year: null,
      percentage: null
    };
    
    // Add click handler to stamp button - works like a camera shutter
    stampButtonGroup.on('click', function(event) {
      // Visual feedback (briefly change color)
      const buttonRect = d3.select(this).select('rect');
      buttonRect.attr('fill', '#FF5722');
      
      // If we have current state information, create a stamp
      if (window.currentStampState.elementId) {
        console.log('Taking a snapshot! Creating stamp at:', window.currentStampState);
        
        // Create permanent icon at the saved position
        stampGroup.append('use')
          .attr('xlink:href', `#${window.currentStampState.elementId}`)
          .attr('x', 3*(window.currentStampState.position) + 745.5)
          .attr('y', window.currentStampState.yPos)
          .attr('transform', 'scale(0.33)')
          .style('opacity', 0.7);
        
        // Create permanent year text
        stampGroup.append("text")
          .attr("x", window.currentStampState.position + 400)
          .attr("y", 275)
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .attr("text-anchor", "end")
          .attr("fill", "rgba(0,0,0,0.5)")
          .text(`${window.currentStampState.year}`);
        
        // Create permanent percentage text
        stampGroup.append("text")
          .attr("x", window.currentStampState.position + 290)
          .attr("y", 320)
          .text(`     + ${window.currentStampState.percentage.toFixed(2)}%`)
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .attr("fill", "rgba(255,0,0,0.5)");
      }
      
      // Reset button color after brief delay
      setTimeout(() => {
        buttonRect.attr('fill', '#4CAF50');
      }, 200);
    });

    // Keep track of the currently visible element
    let currentVisibleElement = null;
    
    // Track if we're switching between icons (to prevent stamping)
    window.switchingIcons = false;

    elements.forEach(element => {
      d3.select(element)
        .on('click', function (event, d) {
          // Set flag to indicate we're switching icons
          window.switchingIcons = true;
          
          // Clear any temporary elements from previous interactions
          globalTempGroup.selectAll("*").remove();
          
          let stagedElementId = handleMicrointeraction(event);
          currentVisibleElement = handleStagedElement(svgDocument, stagedElementId, currentVisibleElement);

          if (currentVisibleElement) {
            console.log('currentVisibleElement before handleSliderInteraction:', currentVisibleElement);  
            handleSliderInteraction(currentVisibleElement, stampGroup, globalTempGroup);
          }
          
          // Reset flag after a delay
          setTimeout(() => {
            window.switchingIcons = false;
          }, 100);
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

  


  function handleSliderInteraction(stagedElement, stampGroup, globalTempGroup) {
    console.log('handleSliderInteraction called');

    let svgObject = document.querySelector('#svgObject');
    let svgDocument = svgObject.contentDocument;
    let svgRoot = d3.select(svgDocument.documentElement);
    
    // Create new group for slider-specific elements
    const newGroup = svgRoot.append('g').attr('class', 'slider-elements');
    
    // Use the passed globalTempGroup instead of creating a new temp group
    // This ensures we maintain proper state when switching between icons
    const tempGroup = globalTempGroup;
    
    // Clear any existing temp elements to start fresh
    tempGroup.selectAll("*").remove();
    
    // Get element ID for the icon references
    let elementId = stagedElement.id.replace('Staged', '');
    
    let yPosMap = {
      'Square1': 670,
      'Square2': 500,
      'Square3': 340,
      'Square4': 180,
      'Square5': 20,
      'Square6': -140,
    };
    
    // Get the slider interaction element
    const sliderInteraction = d3.select(stagedElement);
    console.log('Slider Interaction: ', sliderInteraction);
    
    // Select the slider button (THIS WAS MISSING)
    const button = svgRoot.select('#Dot1');
    console.log('Button: ', button);
    
    // Get the CSV URL
    let csvUrl = sliderInteraction.node().getAttribute('data-csv-url');
    console.log('CSV URL: ', csvUrl);

    // Load the CSV data
    d3.csv(csvUrl).then(data => {
      console.log('Loaded data: ', data);
  
      // Find the size value for the year 1984
      const size1984 = +data.find(d => d.YEAR === '1984').SIZE;
      console.log('Size in 1984: ', size1984);
  
      // Create scales for year and size mapping
      const yearScale = d3.scaleLinear()
        .domain([0, 1467])
        .range([1984, 2022]);
      console.log('Year scale: ', yearScale);
  
      const sizeScale = d3.scaleLinear()
        .domain([18.31, 40.98])
        .range([.75, 1.5]);
      console.log('Size scale: ', sizeScale);
  
      // Set the transform origin to the center
      sliderInteraction.style('transform-origin', 'center bottom');
  
      // Create the drag behavior
      const drag = d3.drag()
      .on('drag', function (event, d) {
        const svgPosition = svgRoot.node().getBoundingClientRect();
        const newX = Math.max(0, Math.min(1467, event.x - svgPosition.left - 288));
        
        // Update the button's position
        d3.select(this).attr('transform', `translate(${newX}, 0)`);  
        
        // Calculate current year and percentage
        const currentYear = Math.round(yearScale(newX));
        
        // Find the data for current year (THIS WAS MISSING)
        const currentSizeData = data.find(d => +d.YEAR === currentYear);
        console.log('Current size data: ', currentSizeData);
        
        const currentSize = +data.find(d => d.YEAR === currentYear.toString()).SIZE;
        const percentageChange = ((currentSize - size1984) / size1984) * 100;
        
        // Store current state for the stamp button to use
        window.currentStampState = {
          elementId: elementId,
          position: newX,
          year: currentYear,
          percentage: percentageChange,
          yPos: yPosMap[elementId]
        };
        
        // Remove previous temporary elements
        tempGroup.selectAll("*").remove();
        
        // Always add current year and percentage as temporary elements
        tempGroup.append("text")
          .attr("id", "yearDisplay")
          .attr("x", newX + 400)
          .attr("y", 275)
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .attr("text-anchor", "end")
          .attr("fill", "black")
          .text(`${currentYear}`);

        tempGroup.append("text")
          .attr("x", newX + 290)
          .attr("y", 320)
          .text(`     + ${percentageChange.toFixed(2)}%`)
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .attr("fill", "red");
          
        // Create temporary mini icon that follows the slider
        tempGroup.append('use')
          .attr('xlink:href', `#${elementId}`)
          .attr('x', 3*(newX) + 745.5)
          .attr('y', yPosMap[elementId])
          .attr('transform', 'scale(0.33)');
        
        // Remove the automatic stamping code here - only the STAMP button creates stamps now
        
        // Update the scale of the element based on the data
        if (currentSizeData) {
          const scaleFactor = sizeScale(+currentSizeData.SIZE);
          console.log('Scale factor: ', scaleFactor);
          sliderInteraction.attr('transform', `scale(${scaleFactor})`);
        }
      });

      // Apply the drag behavior to the button
      button.call(drag);
    }).catch(error => {
      console.error('Error loading CSV data: ', error);
    });
  }
