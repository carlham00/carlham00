document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const game = {
        // Ingredients
        flour: 0,
        sugar: 0,
        eggs: 0,
        butter: 0,
        
        // Progress
        step: 1, // 1: ingredients, 2: mix, 3: bake, 4: decorate, 5: complete
        isMixing: false,
        isBaking: false,
        isDecorating: false,
        
        // Baking
        temperature: 0,
        bakeTime: 0,
        bakeProgress: 0,
        
        // Messages
        messages: [
            "Welcome to our café! Let's bake something special together! 💕",
            "Great start! Add more flour 🌾",
            "Perfect! Now add sugar 🍬",
            "Sweet! Time for eggs 🥚",
            "Egg-cellent! Don't forget butter 🧈",
            "All ingredients ready! Time to mix! 🥄",
            "Mixing our love into the batter... 💖",
            "Perfect batter! Ready to bake! 🔥",
            "Preheating oven... getting warm! 🌡️",
            "Baking our cake! Smells amazing! 👃",
            "Almost done baking! ⏰",
            "Perfectly baked! Time to decorate! 🎨",
            "Adding sweet decorations... ✨",
            "Beautiful! Our cake is complete! 🎂",
            "There's one more special thing to add... 💝"
        ],
        currentMessage: 0,
        
        // Recipe requirements
        requirements: {
            flour: 2,
            sugar: 1,
            eggs: 3,
            butter: 1
        }
    };

    // DOM Elements
    const elements = {
        // Counters
        countFlour: document.getElementById('count-flour'),
        countSugar: document.getElementById('count-sugar'),
        countEggs: document.getElementById('count-eggs'),
        countButter: document.getElementById('count-butter'),
        
        // Checks
        checkFlour: document.getElementById('check-flour'),
        checkSugar: document.getElementById('check-sugar'),
        checkEggs: document.getElementById('check-eggs'),
        checkButter: document.getElementById('check-butter'),
        checkLove: document.getElementById('check-love'),
        
        // Display
        cakeStatus: document.getElementById('cake-status'),
        progressFill: document.getElementById('progress-fill'),
        temperature: document.getElementById('temperature'),
        timer: document.getElementById('timer'),
        messageBox: document.getElementById('message-box'),
        currentStep: document.getElementById('current-step'),
        
        // Visual elements
        cakeBatter: document.getElementById('cake-batter'),
        bakingCake: document.getElementById('baking-cake'),
        cakeToppings: document.getElementById('cake-toppings'),
        
        // Buttons
        btnMix: document.getElementById('btn-mix'),
        btnBake: document.getElementById('btn-bake'),
        btnDecorate: document.getElementById('btn-decorate'),
        btnReset: document.getElementById('btn-reset'),
        btnYes: document.getElementById('btn-yes'),
        btnNo: document.getElementById('btn-no'),
        
        // Steps
        steps: document.querySelectorAll('.progress-step'),
        
        // Proposal
        proposalSection: document.getElementById('proposal-section')
    };

    // Initialize
    initGame();

    // Event Listeners
    document.querySelectorAll('.ingredient-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            handleIngredientClick(type);
        });
    });

    elements.btnMix.addEventListener('click', handleMix);
    elements.btnBake.addEventListener('click', handleBake);
    elements.btnDecorate.addEventListener('click', handleDecorate);
    elements.btnReset.addEventListener('click', resetGame);
    elements.btnYes.addEventListener('click', handleYes);
    elements.btnNo.addEventListener('click', handleNo);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') handleIngredientClick('flour');
        if (e.key === '2') handleIngredientClick('sugar');
        if (e.key === '3') handleIngredientClick('eggs');
        if (e.key === '4') handleIngredientClick('butter');
        if (e.key === 'l') handleIngredientClick('love');
        if (e.key === 'm' && !elements.btnMix.disabled) handleMix();
        if (e.key === 'b' && !elements.btnBake.disabled) handleBake();
        if (e.key === 'd' && !elements.btnDecorate.disabled) handleDecorate();
        if (e.key === 'r') resetGame();
        if (e.key === 'y' && elements.proposalSection.style.display !== 'none') handleYes();
    });

    // Game Functions
    function initGame() {
        updateDisplay();
        updateMessage();
        playSound('click');
        createParticles('💖', 10);
    }

    function handleIngredientClick(type) {
        if (game.step !== 1) return;
        
        switch(type) {
            case 'flour':
                if (game.flour < game.requirements.flour) {
                    game.flour++;
                    updateIngredientDisplay('flour', game.flour);
                    createParticles('🌾', 3);
                    playSound('click');
                    
                    if (game.flour === game.requirements.flour) {
                        elements.checkFlour.textContent = '✓';
                        updateStepMessage("Great! Now add sugar 🍬");
                    }
                }
                break;
                
            case 'sugar':
                if (game.sugar < game.requirements.sugar && game.flour === game.requirements.flour) {
                    game.sugar++;
                    updateIngredientDisplay('sugar', game.sugar);
                    createParticles('🍬', 5);
                    playSound('click');
                    
                    if (game.sugar === game.requirements.sugar) {
                        elements.checkSugar.textContent = '✓';
                        updateStepMessage("Sweet! Time for eggs 🥚");
                    }
                }
                break;
                
            case 'eggs':
                if (game.eggs < game.requirements.eggs && game.sugar === game.requirements.sugar) {
                    game.eggs++;
                    updateIngredientDisplay('eggs', game.eggs);
                    createParticles('🥚', 2);
                    playSound('click');
                    
                    if (game.eggs === game.requirements.eggs) {
                        elements.checkEggs.textContent = '✓';
                        updateStepMessage("Egg-cellent! Don't forget butter 🧈");
                    }
                }
                break;
                
            case 'butter':
                if (game.butter < game.requirements.butter && game.eggs === game.requirements.eggs) {
                    game.butter++;
                    updateIngredientDisplay('butter', game.butter);
                    createParticles('🧈', 3);
                    playSound('click');
                    
                    if (game.butter === game.requirements.butter) {
                        elements.checkButter.textContent = '✓';
                        updateStepMessage("Perfect! All ingredients ready! 🎉");
                        completeStep(1);
                        elements.btnMix.disabled = false;
                    }
                }
                break;
                
            case 'love':
                createParticles('💖', 8);
                playSound('success');
                showMessage("Extra love added! That's the secret ingredient! 💕");
                break;
        }
        
        checkIngredientsComplete();
    }

    function handleMix() {
        if (game.step !== 2 || game.isMixing) return;
        
        game.isMixing = true;
        game.step = 3;
        elements.btnMix.disabled = true;
        
        showMessage("Mixing our love into the batter... 💖");
        elements.cakeStatus.textContent = "Mixing...";
        
        // Animate mixing
        let mixProgress = 0;
        const mixInterval = setInterval(() => {
            mixProgress += 20;
            elements.progressFill.style.width = `${mixProgress}%`;
            elements.cakeBatter.style.height = `${mixProgress}%`;
            
            if (mixProgress >= 100) {
                clearInterval(mixInterval);
                game.isMixing = false;
                completeStep(2);
                elements.btnBake.disabled = false;
                showMessage("Perfect batter! Ready to bake! 🔥");
                elements.cakeStatus.textContent = "Batter ready!";
                createParticles('✨', 15);
                playSound('success');
            }
        }, 200);
    }

    function handleBake() {
        if (game.step !== 3 || game.isBaking) return;
        
        game.isBaking = true;
        game.step = 4;
        elements.btnBake.disabled = true;
        
        showMessage("Preheating oven... 🌡️");
        elements.cakeStatus.textContent = "Preheating...";
        
        // Preheat animation
        let temp = 0;
        const preheatInterval = setInterval(() => {
            temp += 10;
            game.temperature = temp;
            elements.temperature.textContent = `${temp}°C`;
            
            if (temp >= 180) {
                clearInterval(preheatInterval);
                startBaking();
            }
        }, 150);
    }

    function startBaking() {
        showMessage("Baking our cake! Smells amazing! 👃");
        elements.cakeStatus.textContent = "Baking...";
        
        let time = 0;
        const bakeInterval = setInterval(() => {
            time += 1;
            game.bakeTime = time;
            
            // Update timer
            const seconds = time % 60;
            const minutes = Math.floor(time / 60);
            elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update progress
            const progress = Math.min((time / 60) * 100, 100);
            game.bakeProgress = progress;
            elements.progressFill.style.width = `${progress}%`;
            elements.bakingCake.style.height = `${progress}%`;
            
            if (time >= 60) {
                clearInterval(bakeInterval);
                finishBaking();
            }
        }, 1000);
    }

    function finishBaking() {
        game.isBaking = false;
        completeStep(3);
        elements.btnDecorate.disabled = false;
        
        showMessage("Perfectly baked! Time to decorate! 🎨");
        elements.cakeStatus.textContent = "Ready to decorate!";
        elements.timer.textContent = "Done!";
        
        // Cake rise animation
        elements.bakingCake.style.transition = 'all 0.5s ease';
        elements.bakingCake.style.height = '120%';
        setTimeout(() => {
            elements.bakingCake.style.height = '100%';
            createParticles('🎂', 10);
            playSound('success');
        }, 500);
    }

    function handleDecorate() {
        if (game.step !== 4 || game.isDecorating) return;
        
        game.isDecorating = true;
        game.step = 5;
        elements.btnDecorate.disabled = true;
        
        showMessage("Adding sweet decorations... ✨");
        elements.cakeStatus.textContent = "Decorating...";
        
        // Decoration animations
        const decorations = ['🍓', '💖', '✨', '🎀', '⭐', '🌸'];
        let count = 0;
        
        const decorateInterval = setInterval(() => {
            if (count >= decorations.length) {
                clearInterval(decorateInterval);
                finishDecoration();
                return;
            }
            
            const decor = document.createElement('div');
            decor.textContent = decorations[count];
            decor.style.position = 'absolute';
            decor.style.left = `${Math.random() * 180}px`;
            decor.style.top = `${Math.random() * 60}px`;
            decor.style.fontSize = `${Math.random() * 20 + 15}px`;
            decor.style.animation = `bounce 1s infinite`;
            elements.cakeToppings.appendChild(decor);
            
            createParticles(decorations[count], 3);
            count++;
        }, 400);
    }

    function finishDecoration() {
        game.isDecorating = false;
        completeStep(4);
        
        showMessage("Beautiful! Our cake is complete! 🎂");
        elements.cakeStatus.textContent = "Cake complete!";
        
        // Show proposal after delay
        setTimeout(() => {
            completeStep(5);
            showMessage("There's one more special thing to add... 💝");
            setTimeout(() => {
                elements.proposalSection.style.display = 'block';
                createParticles('💝', 20);
                playSound('success');
            }, 1500);
        }, 2000);
    }

    function handleYes() {
        elements.btnYes.disabled = true;
        elements.btnNo.disabled = true;
        elements.btnYes.innerHTML = '<i class="fas fa-heart"></i> YAY! I SAID YES!';
        
        showMessage("🎉 YAY! I'm so excited! 🎉<br>Our first date will be sweeter than this cake! 💖🎂");
        
        // Celebration!
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createParticles(['💖', '💕', '💗', '🎉', '🎂'][Math.floor(Math.random() * 5)], 5);
            }, i * 100);
        }
        
        playSound('success');
    }

    function handleNo() {
        showMessage("That's okay! We can keep baking virtual cakes together! 🥰<br>I'll be here whenever you're ready! 💕");
        elements.btnNo.innerHTML = '<i class="fas fa-heart"></i> Let\'s bake another cake!';
        elements.btnYes.style.display = 'none';
        
        createParticles('💕', 10);
        playSound('click');
    }

    function resetGame() {
        // Reset game state
        game.flour = 0;
        game.sugar = 0;
        game.eggs = 0;
        game.butter = 0;
        game.step = 1;
        game.isMixing = false;
        game.isBaking = false;
        game.isDecorating = false;
        game.temperature = 0;
        game.bakeTime = 0;
        game.bakeProgress = 0;
        
        // Reset UI
        updateIngredientDisplay('flour', 0);
        updateIngredientDisplay('sugar', 0);
        updateIngredientDisplay('eggs', 0);
        updateIngredientDisplay('butter', 0);
        
        elements.checkFlour.textContent = '□';
        elements.checkSugar.textContent = '□';
        elements.checkEggs.textContent = '□';
        elements.checkButter.textContent = '□';
        
        elements.cakeBatter.style.height = '0%';
        elements.bakingCake.style.height = '0%';
        elements.cakeToppings.innerHTML = '';
        elements.progressFill.style.width = '0%';
        elements.temperature.textContent = '0°C';
        elements.timer.textContent = '00:00';
        
        elements.btnMix.disabled = true;
        elements.btnBake.disabled = true;
        elements.btnDecorate.disabled = true;
        
        elements.proposalSection.style.display = 'none';
        elements.btnYes.disabled = false;
        elements.btnNo.disabled = false;
        elements.btnYes.style.display = 'flex';
        elements.btnYes.innerHTML = '<i class="fas fa-heart"></i> YES!';
        elements.btnNo.innerHTML = '<i class="fas fa-clock"></i> Maybe later?';
        
        // Reset steps
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('completed', 'active');
            if (index === 0) step.classList.add('active');
        });
        
        updateStepMessage("Start by adding flour! 🌾");
        showMessage("Let's bake another cake together! Every one is special with you! 💕");
        
        playSound('click');
    }

    // Helper Functions
    function updateIngredientDisplay(type, count) {
        const element = elements[`count${type.charAt(0).toUpperCase() + type.slice(1)}`];
        const requirement = game.requirements[type];
        element.textContent = `${count}/${requirement}`;
        
        // Update ingredient item style
        const item = document.querySelector(`[data-type="${type}"]`);
        if (count === requirement) {
            item.style.background = 'linear-gradient(135deg, #c8e6c9, #e8f5e9)';
            item.style.borderColor = '#4CAF50';
        } else if (count > 0) {
            item.style.background = 'linear-gradient(135deg, #fff9c4, #fffde7)';
            item.style.borderColor = '#ffd54f';
        } else {
            item.style.background = 'linear-gradient(135deg, #fff, #f9f9f9)';
            item.style.borderColor = '#ffb7b2';
        }
    }

    function checkIngredientsComplete() {
        if (game.flour === 2 && game.sugar === 1 && game.eggs === 3 && game.butter === 1) {
            completeStep(1);
            elements.btnMix.disabled = false;
            updateStepMessage("All set! Click 'Mix Batter'! 🥄");
        }
    }

    function completeStep(stepNumber) {
        // Mark step as completed
        elements.steps[stepNumber - 1].classList.remove('active');
        elements.steps[stepNumber - 1].classList.add('completed');
        
        // Activate next step
        if (stepNumber < 5) {
            elements.steps[stepNumber].classList.add('active');
        }
    }

    function updateStepMessage(message) {
        elements.currentStep.innerHTML = `<p><i class="fas fa-arrow-right"></i> ${message}</p>`;
    }

    function showMessage(message) {
        elements.messageBox.innerHTML = `<p>${message}</p>`;
    }

    function updateMessage() {
        showMessage(game.messages[game.currentMessage]);
    }

    function updateDisplay() {
        // Update all counters
        updateIngredientDisplay('flour', game.flour);
        updateIngredientDisplay('sugar', game.sugar);
        updateIngredientDisplay('eggs', game.eggs);
        updateIngredientDisplay('butter', game.butter);
    }

    // Visual Effects
    function createParticles(emoji, count) {
        const container = document.getElementById('effects-container');
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = Array.isArray(emoji) ? emoji[Math.floor(Math.random() * emoji.length)] : emoji;
            particle.style.fontSize = `${Math.random() * 20 + 15}px`;
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${window.innerHeight}px`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    function playSound(type) {
        try {
            const sound = document.getElementById(`sound-${type}`);
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        } catch (e) {
            // Sound playback failed, continue silently
        }
    }

    // Easter egg: Click love ingredient for surprise
    document.querySelector('.love-ingredient').addEventListener('click', () => {
        createParticles(['💖', '💕', '💗', '💓', '💞'], 15);
        playSound('success');
    });
});