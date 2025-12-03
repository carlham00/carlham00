// Additional game functionality
document.addEventListener('DOMContentLoaded', () => {
    // Prevent right-click context menu for better game feel
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // // Add click functionality to buildings as alternative to walking
    // document.querySelectorAll('.building').forEach(building => {
    //     building.addEventListener('click', (e) => {
    //         const targetPage = e.currentTarget.getAttribute('data-target');
    //         window.location.href = targetPage;
    //     });
    // });

    // otter click interaction
    const otter = document.querySelector('.otter');
    otter.addEventListener('click', (e) => {
        // Remove any previous image
        const existing = document.querySelector('.otter-side-image');
        if (existing) existing.remove();
        // Create new image
        const img = document.createElement('img');
        img.src = 'assets/images/character/bubble.png'; // Change to your desired image
        img.className = 'otter-side-image';
        img.style.position = 'absolute';
        img.style.left = (otter.offsetLeft + otter.offsetWidth) + 'px';
        img.style.top = (otter.offsetTop - 30) + 'px';
        img.style.width = '128px';
        img.style.height = '128px';
        img.style.zIndex = 40;
        otter.parentElement.appendChild(img);
        // Remove bubble after 10 seconds
        setTimeout(() => {
            if (img.parentElement) img.remove();
        }, 2000);
    });
    
    // Add background details
    addBackgroundDetails();
});

function addBackgroundDetails() {
    const background = document.querySelector('.valley-background');
    
    // Add some cloud details
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.style.position = 'absolute';
        cloud.style.width = `${Math.random() * 100 + 50}px`;
        cloud.style.height = `${Math.random() * 40 + 20}px`;
        cloud.style.background = 'rgba(255, 255, 255, 0.8)';
        cloud.style.borderRadius = '50%';
        cloud.style.top = `${Math.random() * 30}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.animation = `float ${Math.random() * 20 + 20}s linear infinite`;
        // cloud.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add CSS for floating animation
        if (!document.querySelector('#cloud-animation')) {
            const style = document.createElement('style');
            style.id = 'cloud-animation';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100vw); }
                }
            `;
            document.head.appendChild(style);
        }
        
        background.appendChild(cloud);
    }
}