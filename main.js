
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


window.addEventListener('DOMContentLoaded', (event) => {
    let svgObject = document.querySelector('#svgObject');
    svgObject.addEventListener('load', function() {
        let svgDocument = svgObject.contentDocument;
        let elements = svgDocument.querySelectorAll('.wiggle');

        // Keep track of the currently visible element
        let currentVisibleElement = null;

        elements.forEach(element => {
            // Use D3 to attach the click event listener
            d3.select(element)
                .on('click', function (event, d) {
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
                    let stagedElementId = event.currentTarget.getAttribute('data-staged-id');

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
                });
        });
    });
});

/*

//cute microinteraction 
window.addEventListener('DOMContentLoaded', (event) => {
    let svgObject = document.querySelector('#svgObject');
    svgObject.addEventListener('load', function() {
        let svgDocument = svgObject.contentDocument;
        let elements = svgDocument.querySelectorAll('.wiggle');

        elements.forEach(element => {
            // Use D3 to attach the click event listener
            d3.select(element)
                .on('click', function (event, d) {
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
                });
        });
    });
});






/*

        const button = svg.select('#Dot1'); // Select your slider button (thumb)
        const house = svg.select('#Square2Staged'); // Select your house group
    
        // Load the CSV data
        d3.csv('https://raw.githubusercontent.com/audreyleighleigh/Visualization/main/Housing2.csv').then(data => {
            // Create scales for year and size mapping
            const yearScale = d3.scaleLinear()
                .domain([288, 1755])
                .range([1984, 2022]);
            const sizeScale = d3.scaleLinear()
                .domain([18.31, 40.98])
                .range([.75, 1.5]); // Adjusted to represent your scaling range
    
            // Set the transform origin to the center of the house
            house.style('transform-origin', 'center bottom');
    
            if (!svg.select('#yearDisplay').empty()) {
                svg.select('#yearDisplay').remove(); // Remove the old text element if it exists
            }
    
            svg.append('text')
            .attr('id', 'yearDisplay')
            .attr('x', 1755) // x position right under the slider
            .attr('y', 300) // y position adjusted as needed
            .attr('font-family', 'sans-serif')
            .attr('font-size', '80px')
            .attr('text-anchor', 'end')
            .text('1984'); // Default starting year text
    
            // Find the size value for 1984
    const size1984 = +data.find(d => d.YEAR === '1984').SIZE; // Convert to number
    
    // Add a text element for the percentage display
    svg.append('text')
        .attr('id', 'percentageDisplay')
        .attr('x', 288) // x position under the left side of the slider
        .attr('y', 300) // y position adjusted as needed
        .attr('font-family', 'sans-serif')
        .attr('font-size', '80px')
        .attr('text-anchor', 'start')
        .text('0%'); // Default starting percentage
    
    svg.append('text')
        .attr('id', 'sinceText')
        .attr('x', 288) // x position under the left side of the slider
        .attr('y', 350) // y position adjusted as needed
        .attr('font-family', 'sans-serif')
        .attr('font-size', '30px')
        .attr('text-anchor', 'start')
        .text('since 1984');
    
    
            // Create the drag behavior
            const drag = d3.drag()
                .on('drag', function (event) {
                    // Calculate the new X position within constraints
                    const newX = Math.max(288, Math.min(1755, event.x));
                    
                    // Update the button's position
                    d3.select(this).attr('transform', `translate(${newX}, 176)`);
    
                    // Calculate the current year based on slider position
                    const currentYear = Math.round(yearScale(newX));
    
                    // Update the year display text
                    svg.select('#yearDisplay').text(currentYear);
                    // Find the corresponding data entry for the current year
                    const currentSizeData = data.find(d => +d.YEAR === currentYear);
    
                    // If data is found, update the house size
                    if (currentSizeData) {
                        // Use the sizeScale to calculate a scale factor based on the size
                        const scaleFactor = sizeScale(+currentSizeData.SIZE);
                        
                        // Update the transform attribute of the house group to scale it
                        house.attr('transform', `scale(${scaleFactor})`);
                    }
                    // Find the size value for the current year
                const currentSize = +data.find(d => d.YEAR === currentYear.toString()).SIZE; // Convert to number  const currentSize = +data.find(d => d.YEAR === newYear.toString()).SIZE; // Convert to number
    
                 // Calculate the percentage change
                    const percentageChange = ((currentSize - size1984) / size1984) * 100;
    
                    // Update the percentage displayed under the left side of the slider
                    svg.select('#percentageDisplay').text(`+${percentageChange.toFixed(2)}%`);
                    // Update the additional text
                    svg.select('#sinceText').text('since 1984');
                });
    
            // Apply the drag behavior to the button
            button.call(drag);
           
            });           
*/