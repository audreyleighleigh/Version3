// Tooltip functionality for mini squares under the slider
(function() {
  console.log("Tooltip script loaded for mini squares under slider");
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = 'icon-tooltip';
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);
  
  // Map of tooltip descriptions based on visual position or other attributes
  // These will be used as fallback if we can't determine exact IDs
  const tooltipTexts = {
    "Housing": "Housing Costs",
    "Medical": "Medical Care",
    "Food": "Food Costs",
    "Education": "Education Costs",
    "Transportation": "Transportation Costs"
  };
  
  // Function to find and attach tooltips to mini squares under the slider
  function setupMiniSquareTooltips() {
    console.log("Searching for mini squares under slider");
    
    const svgObject = document.getElementById('svgObject');
    if (!svgObject || !svgObject.contentDocument) return;
    
    const svgDoc = svgObject.contentDocument;
    
    // Look for elements in the slider area that might be mini squares
    // Since we don't know the exact IDs, we'll use more general selectors
    
    // Approach 1: Look for elements in a specific area (slider area)
    const sliderElements = svgDoc.querySelectorAll('[id*="slider"], [class*="slider"]');
    console.log("Found slider-related elements:", sliderElements.length);
    
    // Approach 2: Look for small squares that might be positioned under the slider
    const allRects = svgDoc.querySelectorAll('rect, [id*="square"], [id*="Square"], [class*="square"], [class*="Square"]');
    console.log("Found rectangle/square elements:", allRects.length);
    
    // Combine both approaches and attach event listeners
    const potentialMiniSquares = [...sliderElements, ...allRects];
    
    // Process all potential elements
    potentialMiniSquares.forEach((element, index) => {
      // Skip if it's a large element (likely not a mini square)
      const box = element.getBBox ? element.getBBox() : null;
      if (box && (box.width > 50 || box.height > 50)) return;
      
      // For debugging
      console.log(`Potential mini square ${index}:`, element.id || element.className || 'unnamed');
      
      // Determine tooltip text based on position or attributes
      let tooltipText = determineTooltipText(element);
      
      // Add mouseenter event
      element.addEventListener('mouseenter', function(e) {
        if (tooltipText) {
          console.log(`Mouse entered mini square: ${element.id || index}`);
          
          // Get position
          const rect = element.getBoundingClientRect();
          const svgRect = svgObject.getBoundingClientRect();
          
          // Position tooltip above the mini square
          tooltip.textContent = tooltipText;
          tooltip.style.opacity = '1';
          tooltip.style.left = (svgRect.left + rect.left + (rect.width / 2)) + 'px';
          tooltip.style.top = (svgRect.top + rect.top - tooltip.offsetHeight - 5) + 'px';
          
          // Ensure tooltip is centered
          const tooltipRect = tooltip.getBoundingClientRect();
          tooltip.style.left = (parseFloat(tooltip.style.left) - tooltipRect.width / 2) + 'px';
        }
      });
      
      // Add mouseleave event
      element.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
      });
    });
  }
  
  // Helper function to determine tooltip text based on element properties
  function determineTooltipText(element) {
    const id = element.id || '';
    const classes = element.className ? element.className.baseVal || element.className : '';
    
    // Try to match against our tooltip texts
    for (const key in tooltipTexts) {
      if (id.includes(key) || classes.includes(key)) {
        return tooltipTexts[key];
      }
    }
    
    // Use positional information as fallback
    // This assumes the mini squares are in a specific order from left to right
    const tooltipValues = Object.values(tooltipTexts);
    const box = element.getBBox ? element.getBBox() : null;
    
    if (box) {
      // Horizontal position might correlate with the type of mini square
      const centerX = box.x + box.width/2;
      // Calculate which section this falls into (divide svg width into 5 sections)
      const svgWidth = svgObject.contentDocument.documentElement.viewBox.baseVal.width;
      const section = Math.floor((centerX / svgWidth) * 5);
      
      // Return corresponding tooltip text based on position
      if (section >= 0 && section < tooltipValues.length) {
        return tooltipValues[section];
      }
    }
    
    return null; // No tooltip text determined
  }
  
  // Set up a MutationObserver to detect when new elements are added
  function setupMutationObserver() {
    const svgObject = document.getElementById('svgObject');
    if (!svgObject) return;
    
    svgObject.addEventListener('load', function() {
      const svgDoc = svgObject.contentDocument;
      if (!svgDoc) return;
      
      // Create an observer instance
      const observer = new MutationObserver(function(mutations) {
        setupMiniSquareTooltips();
      });
      
      // Observe the entire SVG document for changes
      observer.observe(svgDoc, { 
        childList: true, 
        subtree: true,
        attributes: true
      });
      
      // Initial setup
      setupMiniSquareTooltips();
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMutationObserver);
  } else {
    setupMutationObserver();
  }
  
  // Periodic check as fallback
  setInterval(setupMiniSquareTooltips, 2000);
})();
