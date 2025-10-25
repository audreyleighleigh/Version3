// Function to get category name based on element ID
function getCategory(elementId) {
  const categoryMap = {
    'Square1': 'clothing',
    'Square2': 'housing', 
    'Square3': 'groceries',
    'Square4': 'medical',
    'Square5': 'education',
    'Square6': 'energy'
  };
  return categoryMap[elementId] || '';
}

// Function to show tooltip with percentage change relative to median income
function showTooltip(year, category, percentageChange, event) {
  // Create tooltip if it doesn't exist
  let tooltip = document.getElementById('percentage-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'percentage-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: 'Georgia', serif;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    document.body.appendChild(tooltip);
  }
  
  // Convert category to display name
  const displayNames = {
    'clothing': 'Clothing',
    'housing': 'Housing',
    'groceries': 'Groceries',
    'medical': 'Medical Care',
    'education': 'Education',
    'energy': 'Energy'
  };
  
  const displayCategory = displayNames[category] || category;
  
  // Update tooltip content
  tooltip.innerHTML = `
    <strong>${year}</strong><br>
    <strong>${displayCategory}</strong><br>
    <span style="color: #ffd700;">${percentageChange.toFixed(2)}%</span> change since 1984<br>
    <em>relative to median income</em>
  `;
  
  // Position tooltip near the mouse
  tooltip.style.left = (event.clientX + 15) + 'px';
  tooltip.style.top = (event.clientY - 15) + 'px';
  tooltip.style.display = 'block';
  
  // Hide tooltip after a delay
  setTimeout(() => {
    tooltip.style.display = 'none';
  }, 3000);
}

window.addEventListener('DOMContentLoaded', (event) => {
  // Initialize stamp state globally
  window.stampEnabled = false;
  
  let svgObject = document.querySelector('#svgObject');
  let backgroundMusic; // Declare backgroundMusic here

  svgObject.addEventListener('load', function() {
    // Fetch the audio file
// Fetch the audio file
    // Fetch the audio file
    fetch('https://raw.githubusercontent.com/audreyleighleigh/Version3/main/MA_BlueFoxMusic_Moonlight_30s_optimized.m4a')
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
      .attr('transform', 'translate(1650, 45)')
      .style('cursor', 'pointer');
    
    // Create elegant button background with subtle gradient and enhanced shadow
    stampButtonGroup.append('rect')
      .attr('width', 80)
      .attr('height', 80)
      .attr('rx', 20) // Even more rounded corners for elegance
      .attr('fill', 'rgba(255,255,255,0.1)') // Subtle white background
      .attr('stroke', 'rgba(255,255,255,0.8)') // Softer white border
      .attr('stroke-width', 2) // Thinner, more elegant border
      .style('filter', 'drop-shadow(0 6px 12px rgba(0,0,0,0.2)) blur(0.5px)') // Enhanced shadow with subtle blur
      .style('backdrop-filter', 'blur(4px)') // Subtle backdrop blur for depth
      .style('transition', 'all 0.3s ease'); // Smooth transitions
    
    // Add camera icon
    const cameraGroup = stampButtonGroup.append('g')
      .attr('transform', 'translate(40, 43)');
    
    // Camera body (rounded rectangle) - elegant styling with subtle fill
    cameraGroup.append('rect')
      .attr('x', -30)
      .attr('y', -22.5)
      .attr('width', 60)
      .attr('height', 45)
      .attr('rx', 8)
      .attr('fill', 'rgba(255,255,255,0.05)') // Very subtle white fill
      .attr('stroke', 'rgba(255,255,255,0.9)') // Softer white border
      .attr('stroke-width', 2.5) // Slightly thinner for elegance
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'); // Subtle inner shadow
    
    // Camera lens (circle) - elegant styling with inner detail
    cameraGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 12)
      .attr('fill', 'rgba(255,255,255,0.08)') // Subtle white fill
      .attr('stroke', 'rgba(255,255,255,0.9)') // Softer white border
      .attr('stroke-width', 2.5);
    
    // Inner lens detail for more realistic look
    cameraGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 8)
      .attr('fill', 'transparent')
      .attr('stroke', 'rgba(255,255,255,0.6)') // Inner ring
      .attr('stroke-width', 1);
    
    // Camera viewfinder (small rectangle on top) - elegant styling
    cameraGroup.append('rect')
      .attr('x', -12)
      .attr('y', -37.5)
      .attr('width', 24)
      .attr('height', 12)
      .attr('rx', 4)
      .attr('fill', 'rgba(255,255,255,0.05)') // Very subtle white fill
      .attr('stroke', 'rgba(255,255,255,0.9)') // Softer white border
      .attr('stroke-width', 2.5);
    
    // Store current state for the stamp button to use
    window.currentStampState = {
      elementId: null,
      position: null,
      year: null,
      percentage: null
    };
    
    // Add one-time tooltip for the stamp button (only shows if user hasn't seen it before)
    const hasSeenTooltip = localStorage.getItem('stampTooltipSeen');
    
    if (!hasSeenTooltip) {
      // Show tooltip after a short delay on first visit
      setTimeout(() => {
        const tooltip = d3.select('body').append('div')
          .attr('class', 'stamp-button-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '14px')
          .style('font-family', 'Arial, sans-serif')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)')
          .style('opacity', '0')
          .style('transition', 'opacity 0.3s ease')
          .text('Snapshot');
        
        // Position tooltip near the button
        const buttonRect = stampButtonGroup.node().getBoundingClientRect();
        const tooltipX = buttonRect.left + buttonRect.width / 2;
        const tooltipY = buttonRect.top - 10;
        tooltip
          .style('left', (tooltipX - 30) + 'px')
          .style('top', tooltipY + 'px');
        
        // Fade in the tooltip
        setTimeout(() => {
          tooltip.style('opacity', '1');
        }, 100);
        
        // Auto-remove after 3 seconds and mark as seen
        setTimeout(() => {
          tooltip.style('opacity', '0');
          setTimeout(() => {
            tooltip.remove();
            localStorage.setItem('stampTooltipSeen', 'true');
          }, 300);
        }, 3000);
               }, 1000);
     }
    
    // Add click handler to stamp button - works like a camera shutter
    stampButtonGroup.on('click', function(event) {
      // Enhanced visual feedback with elegant animation
      const buttonRect = d3.select(this).select('rect');
      const cameraGroup = d3.select(this).select('g');
      
      // Elegant click animation - subtle scale and color change
      buttonRect
        .transition()
        .duration(150)
        .attr('fill', 'rgba(255,255,255,0.25)') // Elegant white glow
        .attr('transform', 'scale(0.95)') // Subtle scale down
        .transition()
        .duration(150)
        .attr('fill', 'rgba(255,255,255,0.1)') // Back to subtle background
        .attr('transform', 'scale(1)'); // Back to normal size
      
      // Subtle camera icon animation
      cameraGroup
        .transition()
        .duration(100)
        .attr('transform', 'translate(40, 43) scale(0.9)') // Slight scale down
        .transition()
        .duration(100)
        .attr('transform', 'translate(40, 43) scale(1)'); // Back to normal
      
      // If we have current state information, create a stamp
      if (window.currentStampState.elementId) {
        console.log('Taking a snapshot! Creating stamp at:', window.currentStampState);
        
        // Store the stamp data for this specific stamp
        const stampData = {
          elementId: window.currentStampState.elementId,
          year: window.currentStampState.year,
          percentage: window.currentStampState.percentage,
          position: window.currentStampState.position,
          yPos: window.currentStampState.yPos
        };
        
        // Create permanent icon at the saved position
        const stampedIcon = stampGroup.append('use')
          .attr('xlink:href', `#${stampData.elementId}`)
          .attr('x', 3*(stampData.position) + 745.5)
          .attr('y', stampData.yPos)
          .attr('transform', 'scale(0.33)')
          .style('opacity', 0.7)
          .style('cursor', 'pointer')
          .datum(stampData); // Attach the stamp data to this element
        
        // Add hover functionality to the stamped icon
        stampedIcon
          .on('mouseenter', function(event) {
            // Get the stamp data attached to this specific element
            const data = d3.select(this).datum();
            
            // Determine category based on elementId from the stamp data
            const category = getCategory(data.elementId);
            
            // Convert category to display name
            const displayNames = {
              'clothing': 'Clothing',
              'housing': 'Housing',
              'groceries': 'Groceries',
              'medical': 'Medical Care',
              'education': 'Education',
              'energy': 'Energy'
            };
            
            const displayCategory = displayNames[category] || category;
            
            // Debug: Log the elementId and category
            console.log('Stamp tooltip - elementId:', data.elementId, 'category:', category);
            
            // Create tooltip
            const tooltip = d3.select('body').append('div')
              .attr('class', 'stamp-tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0, 0, 0, 0.8)')
              .style('color', 'white')
              .style('padding', '8px 12px')
              .style('border-radius', '6px')
              .style('font-size', '14px')
              .style('font-family', 'Arial, sans-serif')
              .style('pointer-events', 'none')
              .style('z-index', '1000')
              .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)')
              .html(`Category: ${displayCategory}<br>Year: ${data.year}<br>Increase: +${data.percentage.toFixed(2)}%`);
            
            // Position tooltip near the mouse
            const mouseX = event.pageX + 10;
            const mouseY = event.pageY - 10;
            tooltip
              .style('left', mouseX + 'px')
              .style('top', mouseY + 'px');
          })
          .on('mousemove', function(event) {
            // Update tooltip position as mouse moves
            const tooltip = d3.select('.stamp-tooltip');
            if (!tooltip.empty()) {
              const mouseX = event.pageX + 10;
              const mouseY = event.pageY - 10;
              tooltip
                .style('left', mouseX + 'px')
                .style('top', mouseY + 'px');
            }
          })
          .on('mouseleave', function() {
            // Remove tooltip when mouse leaves
            d3.selectAll('.stamp-tooltip').remove();
          });
        
        // Create permanent year text
        stampGroup.append("text")
          .attr("x", window.currentStampState.position + 400)
          .attr("y", 275)
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("text-anchor", "end")
          .attr("fill", "rgba(255,255,255,0.7)")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)")
          .text(`${window.currentStampState.year}`);
        
        // Create permanent percentage text
        stampGroup.append("text")
          .attr("x", window.currentStampState.position + 290)
          .attr("y", 320)
          .text(`     + ${window.currentStampState.percentage.toFixed(2)}%`)
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("fill", "rgba(255,255,255,0.7)")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)");
      }
      

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
          
          // Remove any existing category labels when switching icons
          let svgRoot = d3.select(svgDocument.documentElement);
          svgRoot.selectAll('.category-label').remove();
          
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
    
    // Load the master CSV data (only once, then filter by category)
    let masterData = null;
    
    // Check if we already have the master data loaded
    if (window.masterCSVData) {
      masterData = window.masterCSVData;
      console.log('Using cached master CSV data');
      initializeSlider();
    } else {
      // Load the master CSV data for the first time
      console.log('Loading master CSV data...');
              d3.csv('all_categories_affordability.csv').then(data => {
        window.masterCSVData = data; // Cache it globally
        masterData = data;
        console.log('Master CSV data loaded:', data);
        initializeSlider();
      }).catch(error => {
        console.error('Error loading master CSV data:', error);
        return;
      });
      return; // Exit early, will continue in initializeSlider callback
    }
    
    // Function to initialize slider after data is loaded
    function initializeSlider() {
      // Filter data for the current category
      const category = getCategory(elementId);
      const categoryData = masterData.filter(d => d.CATEGORY === category);
      console.log(`Filtered data for ${category}:`, categoryData);
      
      // Find the size value for the year 1984
      const size1984 = +categoryData.find(d => d.YEAR === '1984').SIZE;
      console.log('Size in 1984: ', size1984);
      
      // Create scales for year and size mapping
      const yearScale = d3.scaleLinear()
        .domain([0, 1467])
        .range([1984, 2023]); // Updated to 2023
      console.log('Year scale: ', yearScale);
      
      // Create dynamic size scale based on actual data range
      const sizeValues = categoryData.map(d => +d.SIZE);
      const minSize = Math.min(...sizeValues);
      const maxSize = Math.max(...sizeValues);
      const sizeScale = d3.scaleLinear()
        .domain([minSize, maxSize])
        .range([0.75, 1.5]);
      console.log('Size scale: ', sizeScale);
      
      // Set the transform origin to the center
      sliderInteraction.style('transform-origin', 'center bottom');
      
      // Add category label immediately when icon is selected
      if (category) {
        console.log(`${elementId} icon selected! Adding ${category} label...`);
        svgRoot.append('text')
          .attr('class', 'category-label')
          .attr('x', 1800)
          .attr('y', 1000)
          .attr('font-family', 'Georgia, serif')
          .attr('font-size', '94px')
          .attr('font-weight', 'bold')
          .attr('fill', 'white')
          .attr('text-anchor', 'end')
          .text(category);
      }
  
      // Create the drag behavior
      const drag = d3.drag()
      .on('drag', function (event, d) {
        const svgPosition = svgRoot.node().getBoundingClientRect();
        const newX = Math.max(0, Math.min(1467, event.x - svgPosition.left - 288));
        
        // Update the button's position
        d3.select(this).attr('transform', `translate(${newX}, 0)`);  
        
        // Calculate current year and percentage
        const currentYear = Math.round(yearScale(newX));
        
        // Find the data for current year
        const currentSizeData = categoryData.find(d => +d.YEAR === currentYear);
        console.log('Current size data: ', currentSizeData);
        
        const currentSize = +categoryData.find(d => d.YEAR === currentYear.toString()).SIZE;
        // The CSV already contains the percentage values, so use them directly
        const percentageChange = currentSize;
        
        // Add tooltip showing percentage change relative to median income
        showTooltip(currentYear, category, percentageChange, event);
        
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
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("text-anchor", "end")
          .attr("fill", "white")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)")
          .text(`${currentYear}`);

        tempGroup.append("text")
          .attr("x", newX + 290)
          .attr("y", 320)
          .text(`     + ${percentageChange.toFixed(2)}%`)
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("fill", "white")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)");
          
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
        
        // Debug: Log the elementId to see what it actually is
        console.log('Current elementId:', elementId);
        console.log('Is elementId === ShirtImage?', elementId === 'ShirtImage');
      });

      // Apply the drag behavior to the button
      button.call(drag);
      
      // Initialize display with current thumb position
      setTimeout(() => {
        const currentThumbX = parseFloat(button.attr('transform')?.replace('translate(', '').replace(', 0)', '') || 0);
        const currentThumbYear = Math.round(yearScale(currentThumbX));
        const currentThumbSizeData = categoryData.find(d => +d.YEAR === currentThumbYear);
        const currentThumbSize = +categoryData.find(d => d.YEAR === currentThumbYear.toString()).SIZE;
        // The CSV already contains the percentage values, so use them directly
        const currentThumbPercentageChange = currentThumbSize;
        
        // Store current state for the stamp button to use
        window.currentStampState = {
          elementId: elementId,
          position: currentThumbX,
          year: currentThumbYear,
          percentage: currentThumbPercentageChange,
          yPos: yPosMap[elementId]
        };
        
        // Display current year and percentage immediately
        tempGroup.append("text")
          .attr("id", "yearDisplay")
          .attr("x", currentThumbX + 400)
          .attr("y", 275)
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("text-anchor", "end")
          .attr("fill", "white")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)")
          .text(`${currentThumbYear}`);

        tempGroup.append("text")
          .attr("x", currentThumbX + 290)
          .attr("y", 320)
          .text(`     + ${currentThumbPercentageChange.toFixed(2)}%`)
          .attr("font-family", "Georgia, serif")
          .attr("font-size", "32px")
          .attr("font-weight", "normal")
          .attr("fill", "white")
          .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)");
          
        // Create temporary mini icon that follows the slider
        tempGroup.append('use')
          .attr('xlink:href', `#${elementId}`)
          .attr('x', 3*(currentThumbX) + 745.5)
          .attr('y', yPosMap[elementId])
          .attr('transform', 'scale(0.33)');
        
        // Update the scale of the element based on the current data
        if (currentThumbSizeData) {
          const scaleFactor = sizeScale(+currentThumbSizeData.SIZE);
          sliderInteraction.attr('transform', `scale(${scaleFactor})`);
        }
      }, 50);
    } // End of initializeSlider function
  } // End of handleSliderInteraction function
