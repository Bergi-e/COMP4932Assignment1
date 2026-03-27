const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function blendImages() {
    const numSteps = 8;
    const totalIntervals = 9;

    // Define the output directory
    const outputDir = path.join(__dirname, 'output');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    for (let i = 1; i <= numSteps; i++) {
        const t = i / totalIntervals;

        try {
            // Load the warped images from the 'images' subfolder
            const img0 = await loadImage(`./images/W0.t${i}.jpg`);
            const img1 = await loadImage(`./images/W1.t${i}.jpg`);

            // Initialize canvas matching the image dimensions
            const canvas = createCanvas(img0.width, img0.height);
            const ctx = canvas.getContext('2d');

            // Draw W0 as the base (100% opacity)
            ctx.globalAlpha = 1;
            ctx.drawImage(img0, 0, 0);

            // Draw W1 over it with opacity t
            ctx.globalAlpha = t;
            ctx.drawImage(img1, 0, 0);

            // Save the output to a new JPG file in the 'output' directory
            const buffer = canvas.toBuffer('image/jpeg');
            const outputPath = path.join(outputDir, `blended_t${i}.jpg`);
            fs.writeFileSync(outputPath, buffer);
            console.log(`Successfully generated ${outputPath}`);
            
        } catch (error) {
            console.error(`Error processing step ${i}. Ensure files exist in the /images/ folder.`);
        }
    }
}

blendImages();