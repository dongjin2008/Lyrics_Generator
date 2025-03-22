document.addEventListener('DOMContentLoaded', function() {
    const inputLyrics = document.getElementById('inputLyrics');
    const orderInput = document.getElementById('orderInput');
    const outputLyrics = document.getElementById('outputLyrics');
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Update the button text
    saveBtn.textContent = 'Copy to Clipboard';

    generateBtn.addEventListener('click', generateLyrics);
    saveBtn.addEventListener('click', copyToClipboard);

    function generateLyrics() {
        const lyrics = inputLyrics.value;
        const order = orderInput.value.toUpperCase();
        
        if (!lyrics || !order) {
            alert('Please enter both lyrics and order');
            return;
        }

        // Process the lyrics
        const lines = lyrics.split('\n');
        const result = [];
        const part = {};
        
        let currentIndex = 0;
        let tempLyrics = [];
        
        let i = 0;
        while (i < lines.length) {
            const line = lines[i].trim();
            
            // Check if the line is just a single letter (A, B, C, etc.)
            if (line.length === 1 && /^[A-Z]$/.test(line)) {
                part[line] = currentIndex;
                i++; // Skip the letter line
            } else {
                tempLyrics.push(line);
                i++;
            }
            
            // If we encounter a separator or reach the end
            if ((i < lines.length && lines[i] === "//") || i === lines.length) {
                if (tempLyrics.length > 0) { // Only add non-empty sections
                    result.push(tempLyrics.join('\n'));
                    tempLyrics = [];
                    currentIndex++;
                    if (i < lines.length) {
                        i++; // Skip the separator
                    }
                }
            }
        }
        
        // Add an END marker
        part["END"] = result.length;
        
        // Generate new lyrics based on the order
        const keys = Object.keys(part);
        const newLyrics = [];
        
        for (const o of order) {
            if (o === "M") {
                newLyrics.push("");
            } else if (part.hasOwnProperty(o)) {
                let nextKey = null;
                
                for (const k of keys) {
                    if (k !== o && part[k] > part[o]) {
                        if (nextKey === null || part[k] < part[nextKey]) {
                            nextKey = k;
                        }
                    }
                }
                
                if (nextKey) {
                    for (let i = part[o]; i < part[nextKey]; i++) {
                        newLyrics.push(result[i]);
                    }
                } else {
                    // If there's no next key, go to the end
                    for (let i = part[o]; i < part["END"]; i++) {
                        newLyrics.push(result[i]);
                    }
                }
            }
        }
        
        // Combine the new lyrics with separators
        const combinedLyrics = [];
        for (let i = 0; i < newLyrics.length; i++) {
            combinedLyrics.push(newLyrics[i]);
            if (i < newLyrics.length - 1) {
                combinedLyrics.push("//");
            }
        }
        
        outputLyrics.value = combinedLyrics.join('\n');
        
        console.log("Part dictionary:", part);
    }

    // Replace saveLyrics function with copyToClipboard
    function copyToClipboard() {
        const lyrics = outputLyrics.value;
        if (!lyrics) {
            alert('No lyrics to copy');
            return;
        }
        
        // Select the text and copy to clipboard
        outputLyrics.select();
        document.execCommand('copy');
        
        // Provide feedback to the user
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Copied!';
        
        // Reset button text after a short delay
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 2000);
    }
});