/**
 * Simple tooltip system for mini icons under the slider
 */
(function() {
  console.log("Mini icons tooltip script loaded");
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = 'mini-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'black';
  tooltip.style.color = 'white';
  tooltip.style.padding = '5px 8px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '12px';
  tooltip.style.zIndex = '9999';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.3s';
  tooltip.style.textAlign = 'center';
  tooltip.style.maxWidth = '120px';
  tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)';
  document.body.appendChild(tooltip);
  
  // Tooltip text for each mini icon (you can customize these)
  const tooltips = {
    "housing": "Housing Costs",
    "medical": "Medical Costs",
    "food": "Food Costs",
    "education": "Education Costs",
    "transportation": "Transportation Costs"
  };
  
  // Function to initialize tooltips
  function initTooltips() {
    // Get the SVG object
    const svgObj = document.getElementById('svgObject');
    if (!svgObj) return;
    
    svgObj.addEventListener('load', function() {
      const svgDoc = svgObj.contentDocument;
      if (!svgDoc) return;
      
      // Find the slider element first
      const slider = svgDoc.querySelector('[id*="slider"],[id*="Slider"],[class*="slider"],[class*="Slider"]');
      if (!slider) {
        console.log("Slider element not found");
        return;
      }
      
      // Get slider position
      const sliderBBox = slider.getBBox ? slider.getBBox() : null;
      if (!sliderBBox) {
        console.log("Could not get slider position");
        return;
      }
      
      console.log("Found slider at y position:", sliderBBox.y + sliderBBox.height);
      
      // Look for mini icons that are positioned just below the slider
      const allElements = svgDoc.querySelectorAll('*');
      const miniIcons = [];
      
      // Find elements positioned below the slider
      allElements.forEach(el => {
        if (el.getBBox) {
          const bbox = el.getBBox();
          // Check if element is below the slider
          if (bbox.y > sliderBBox.y + sliderBBox.height && 
              bbox.y < sliderBBox.y + sliderBBox.height + 50) { // Within 50 units below slider
            
            // Only include small elements (mini icons)
            if (bbox.width < 50 && bbox.height < 50) {
              miniIcons.push(el);
              console.log("Found potential mini icon:", el.id || "unnamed", "at position", bbox.x, bbox.y);
            }
          }
        }
      });
      
      // Add event listeners to each mini icon
      miniIcons.forEach((icon, index) => {
        // Get tooltip text based on index or ID
        let tooltipText = null;
        
        // Try to match icon ID with tooltip keys
        const id = icon.id ? icon.id.toLowerCase() : '';
        for (const key in tooltips) {
          if (id.includes(key)) {
            tooltipText = tooltips[key];
            break;
          }
        }
        
        // Fallback to index-based tooltip
        if (!tooltipText) {
          const keys = Object.keys(tooltips);
          if (index < keys.length) {
            tooltipText = tooltips[keys[index]];
          } else {
            tooltipText = "Icon " + (index + 1);
          }
        }
        
        // Add event listeners
        icon.addEventListener('mouseenter', function(e) {
          const rect = icon.getBoundingClientRect();
          const svgRect = svgObj.getBoundingClientRect();
          
          tooltip.textContent = tooltipText;
          tooltip.style.opacity = '1';
          tooltip.style.left = (svgRect.left + rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
          tooltip.style.top = (svgRect.top + rect.top - tooltip.offsetHeight - 5) + 'px';
        });
        
        icon.addEventListener('mouseleave', function() {
          tooltip.style.opacity = '0';
        });
      });
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }
  
  // Make sure it runs after everything is loaded
  window.addEventListener('load', initTooltips);
})();
