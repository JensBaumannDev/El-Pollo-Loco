/**
 * @file DrawableObject base class
 * @description Base class for all drawable game objects
 */

/**
 * Base class for all drawable objects in the game
 * @class
 */
class DrawableObject {
    /**
     * Current image element to display
     * @type {Image}
     */
    img;
    
    /**
     * Cache of loaded images
     * @type {Object.<string, Image>}
     */
    imageCache = {};
    
    /**
     * Current frame index for animations
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * X-coordinate position
     * @type {number}
     */
    x = 120;
    
    /**
     * Y-coordinate position
     * @type {number}
     */
    y = 280;
    
    /**
     * Object height
     * @type {number}
     */
    height = 150;
    
    /**
     * Object width
     * @type {number}
     */
    width = 100;
    
    /**
     * Collision detection offset
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Loads a single image
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into cache
     * @param {string[]} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws collision frame for debugging (empty implementation)
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    drawFrame(ctx) {
    }
}

