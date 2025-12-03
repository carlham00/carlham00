class Character {
    constructor() {
        this.element = document.getElementById('player-character');
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2 - 80;
        this.speed = 8;
        this.direction = 'down';
        this.keys = {};
        this.isMoving = false;
        
        this.init();
    }
    
    init() {
        // Set initial position
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        // Add keyboard event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start animation loop
        this.animate();
    }
    
    handleKeyDown(e) {
        this.keys[e.key] = true;
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    updateDirection() {
        if (this.keys['ArrowUp']) {
            this.direction = 'up';
            this.element.style.backgroundImage = "url('assets/images/character/hedgehog-up.png')";
        } else if (this.keys['ArrowDown']) {
            this.direction = 'down';
            this.element.style.backgroundImage = "url('assets/images/character/hedgehog-down.png')";
        } else if (this.keys['ArrowLeft']) {
            this.direction = 'left';
            this.element.style.backgroundImage = "url('assets/images/character/hedgehog-left.png')";
        } else if (this.keys['ArrowRight']) {
            this.direction = 'right';
            this.element.style.backgroundImage = "url('assets/images/character/hedgehog-right.png')";
        }
    }
    
    move() {
        this.isMoving = false;
        
        if (this.keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
            this.isMoving = true;
        }
        if (this.keys['ArrowDown'] && this.y < window.innerHeight - 128) {
            this.y += this.speed;
            this.isMoving = true;
        }
        if (this.keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
            this.isMoving = true;
        }
        if (this.keys['ArrowRight'] && this.x < window.innerWidth - 64) {
            this.x += this.speed;
            this.isMoving = true;
        }
        
        // Update position
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        // Check for collisions with buildings
        this.checkBuildingCollisions();
        
        // Check for collisions with otter
        this.checkOtterCollisions();
    }
    
    checkBuildingCollisions() {
        const buildings = document.querySelectorAll('.building');
        const charRect = this.element.getBoundingClientRect();
        
        buildings.forEach(building => {
            const buildingRect = building.getBoundingClientRect();
            
            // Simple collision detection
            if (charRect.left < buildingRect.right &&
                charRect.right > buildingRect.left &&
                charRect.top < buildingRect.bottom &&
                charRect.bottom > buildingRect.top) {
                
                // Get the target page from data attribute
                const targetPage = building.getAttribute('data-target');
                
                // Navigate to the building's page
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 200);
            }
        });
    }
    
    checkOtterCollisions() {
        const otter = document.querySelector('.otter');
        const charRect = this.element.getBoundingClientRect();
        
        const otterRect = otter.getBoundingClientRect();
        const margin = 25; // Collision margin in pixels
        
        // Collision detection with margin
        if (charRect.left < otterRect.right + margin &&
            charRect.right > otterRect.left - margin &&
            charRect.top < otterRect.bottom + margin &&
            charRect.bottom > otterRect.top - margin) {
            
            // Change otter image to heart
            otter.style.backgroundImage = "url('assets/images/character/otterheart.png')";
        } else {
            // Revert to normal otter image
            otter.style.backgroundImage = "url('assets/images/character/otter.png')";
        }
    }    animate() {
        this.updateDirection();
        this.move();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize character when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Character();
});