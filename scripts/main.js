const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const openSettingsButton = document.getElementById('open-settings-button');
    const gameOverSettingsButton = document.getElementById('game-over-settings-button');
    const applySettingsButton = document.getElementById('apply-settings');
    const resetSettingsButton = document.getElementById('reset-settings');
    const scoreDisplay = document.getElementById('score-display');
    const finalScore = document.getElementById('final-score');
    const backgroundMusicToggle = document.getElementById('background-music-toggle');
    const gameSpeedSlider = document.getElementById('game-speed');
    const gravitySlider = document.getElementById('gravity');
    const pipeSpeedSlider = document.getElementById('pipe-speed');
    const pipeFrequencySlider = document.getElementById('pipe-frequency');
    const gapSizeSlider = document.getElementById('gap-size');
    const gameSpeedValue = document.getElementById('game-speed-value');
    const gravityValue = document.getElementById('gravity-value');
    const pipeSpeedValue = document.getElementById('pipe-speed-value');
    const pipeFrequencyValue = document.getElementById('pipe-frequency-value');
    const gapSizeValue = document.getElementById('gap-size-value');
    const muteButton = document.getElementById('mute-button');
    
    const buttonClickSound = document.getElementById('buttonClickSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const collisionSound = document.getElementById('collisionSound');
    let backgroundMusicEnabled = true;
    
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let animationFrameId;
    let baseGameSpeed = 1.0;
    let gravity = 0.6;
    let basePipeSpeed = 1.0;
    let pipeFrequency = 200;
    let gapHeight = 180;
    let gameSpeed = baseGameSpeed;
    const obstacleWidth = 60;
    const obstacleColor = '#4a237c';
    const defaultSettings = { gameSpeed: 1.0, gravity: 0.6, pipeSpeed: 1.0, pipeFrequency: 200, gapSize: 180 };
    
    let bird = { x: 100, y: 300, velocity: 0, radiusX: 20, radiusY: 15, flap: -8 };
    let obstacles = [];
    let stars = [];
    let planets = [];
    let comets = [];
    
    function initBackground() {
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.01 + 0.005
      }));
      planets = Array.from({ length: 3 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        radius: Math.random() * 30 + 10,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        speed: Math.random() * 0.5 + 0.1,
        isMoon: Math.random() < 0.3
      }));
      comets = [];
    }
    
    function createComet() {
      comets.push({
        x: canvas.width + Math.random() * 100,
        y: Math.random() * (canvas.height / 3),
        length: Math.random() * 80 + 40,
        angle: Math.random() * 20 + 10,
        speed: Math.random() * 3 + 4,
        alpha: Math.random() * 0.5 + 0.5
      });
    }
    
    function createObstacle() {
      const minGapStart = 50;
      const maxGapStart = canvas.height - gapHeight - 50;
      const gapStart = Math.random() * (maxGapStart - minGapStart) + minGapStart;
      obstacles.push({
        x: canvas.width,
        gapStart: gapStart,
        gapEnd: gapStart + gapHeight,
        passed: false
      });
    }
    
    function loadBestScore() {
      let best = localStorage.getItem('bestScore') || 0;
      document.getElementById('best-score').textContent = `Best: ${best}`;
      return parseInt(best);
    }
    
    function initGame() {
      bird = { x: 100, y: 300, velocity: 0, radiusX: 20, radiusY: 15, flap: -8 };
      obstacles = [];
      score = 0;
      gameSpeed = baseGameSpeed;
      scoreDisplay.textContent = '0';
      loadBestScore();
      initBackground();
    }
    
    function gameLoop() {
      if (!gameRunning || gamePaused) return;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      updateBird();
      drawBird();
      updateObstacles();
      drawObstacles();
    
      if (checkCollisions()) {
        endGame();
      } else {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }
    
    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a2a');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    
      for (let star of stars) {
        ctx.beginPath();
        star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.05;
        star.alpha = Math.max(0.2, Math.min(1, star.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    
        star.x -= gameSpeed * 0.1;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }
      }
    
      for (let planet of planets) {
        ctx.beginPath();
        if (planet.isMoon) {
          const moonGradient = ctx.createRadialGradient(
            planet.x, planet.y, 0,
            planet.x, planet.y, planet.radius
          );
          moonGradient.addColorStop(0, '#f5f5f5');
          moonGradient.addColorStop(0.8, '#e0e0e0');
          moonGradient.addColorStop(1, '#c7c7c7');
          ctx.fillStyle = moonGradient;
          ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
          ctx.fill();
    
          ctx.fillStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath();
          ctx.arc(planet.x - 10, planet.y + 5, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(planet.x + 8, planet.y - 8, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(planet.x + 3, planet.y + 12, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = planet.color;
          ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
          ctx.fill();
    
          if (planet.radius > 20) {
            ctx.beginPath();
            ctx.ellipse(
              planet.x, planet.y,
              planet.radius * 1.5, planet.radius * 0.3,
              Math.PI / 4, 0, Math.PI * 2
            );
            ctx.strokeStyle = `${planet.color}80`;
            ctx.lineWidth = 3;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.fillStyle = `${planet.color}80`;
            ctx.arc(planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.2, planet.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
    
        planet.x -= planet.speed * gameSpeed;
        if (planet.x < -planet.radius * 2) {
          planet.x = canvas.width + planet.radius;
          if (!planet.isMoon) planet.y = Math.random() * (canvas.height / 2);
        }
      }
    
      for (let i = 0; i < comets.length; i++) {
        const comet = comets[i];
        const cometGradient = ctx.createLinearGradient(
          comet.x, comet.y,
          comet.x - comet.length, comet.y + comet.angle
        );
        cometGradient.addColorStop(0, `rgba(255, 255, 255, ${comet.alpha})`);
        cometGradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
    
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - comet.length, comet.y + comet.angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = cometGradient;
        ctx.stroke();
    
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${comet.alpha})`;
        ctx.fill();
    
        comet.x -= comet.speed * gameSpeed;
        comet.y += comet.angle * 0.02 * gameSpeed;
    
        if (comet.x < -comet.length) {
          if (Math.random() < 0.5) {
            comets.splice(i, 1);
            if (Math.random() < 0.7) createComet();
            i--;
          } else {
            comet.x = canvas.width + Math.random() * 100;
            comet.y = Math.random() * (canvas.height / 3);
            comet.length = Math.random() * 80 + 40;
            comet.angle = Math.random() * 20 + 10;
            comet.speed = Math.random() * 3 + 4;
          }
        }
      }
      if (comets.length < 2 && Math.random() < 0.005) createComet();
    }
    
    function updateBird() {
      bird.velocity += gravity;
      bird.y += bird.velocity;
      bird.rotation = bird.velocity * 2;
    }
    
    function drawBird() {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(Math.max(-0.5, Math.min(0.5, bird.velocity / 10)));
    
      ctx.beginPath();
      const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bird.radiusX);
      birdGradient.addColorStop(0, '#9771e3');
      birdGradient.addColorStop(0.7, '#6a3de0');
      birdGradient.addColorStop(1, '#4a237c');
      ctx.fillStyle = birdGradient;
      ctx.ellipse(0, 0, bird.radiusX, bird.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
    
      ctx.beginPath();
      ctx.fillStyle = 'rgba(135, 206, 250, 0.6)';
      ctx.arc(5, -2, bird.radiusY * 0.6, 0, Math.PI * 2);
      ctx.fill();
    
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.arc(2, -4, bird.radiusY * 0.2, 0, Math.PI * 2);
      ctx.fill();
    
      ctx.beginPath();
      ctx.fillStyle = '#4a237c';
      ctx.moveTo(-5, 0);
      ctx.quadraticCurveTo(-15, bird.velocity < 0 ? 15 : 5, -5, 10);
      ctx.fill();
    
      if (bird.velocity < 0) {
        ctx.beginPath();
        const flameGradient = ctx.createLinearGradient(0, 10, 0, 30);
        flameGradient.addColorStop(0, '#ff5e00');
        flameGradient.addColorStop(0.5, '#ffac00');
        flameGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        ctx.fillStyle = flameGradient;
        ctx.moveTo(-5, 10);
        ctx.quadraticCurveTo(0, 20 + (Math.random() * 10), 5, 10);
        ctx.fill();
      }
    
      ctx.restore();
    }
    
    function updateObstacles() {
      const currentPipeSpeed = gameSpeed * basePipeSpeed;
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= currentPipeSpeed;
    
        if (!obstacles[i].passed && obstacles[i].x + obstacleWidth < bird.x) {
          obstacles[i].passed = true;
          score++;
          scoreDisplay.textContent = `${score}`;
          if (score % 5 === 0) {
            gameSpeed += 0.05;
          }
        }
    
        if (obstacles[i].x + obstacleWidth < 0) {
          obstacles.splice(i, 1);
          i--;
        }
      }
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - pipeFrequency) {
        createObstacle();
      }
    }
    
    function drawObstacles() {
      for (let obstacle of obstacles) {
        ctx.fillStyle = obstacleColor;
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.gapStart);
        ctx.fillStyle = '#6a3de0';
        ctx.fillRect(obstacle.x - 5, obstacle.gapStart - 20, obstacleWidth + 10, 20);
    
        ctx.fillStyle = obstacleColor;
        ctx.fillRect(obstacle.x, obstacle.gapEnd, obstacleWidth, canvas.height - obstacle.gapEnd);
        ctx.fillStyle = '#6a3de0';
        ctx.fillRect(obstacle.x - 5, obstacle.gapEnd, obstacleWidth + 10, 20);
    
        for (let i = 1; i < 5; i++) {
          ctx.fillStyle = 'rgba(106, 61, 224, 0.7)';
          ctx.fillRect(obstacle.x + 10, obstacle.gapStart - (i * 40), obstacleWidth - 20, 10);
          if (obstacle.gapEnd + (i * 40) < canvas.height) {
            ctx.fillRect(obstacle.x + 10, obstacle.gapEnd + (i * 40), obstacleWidth - 20, 10);
          }
        }
      }
    }
    
    function checkCollisions() {
      if (bird.y + bird.radiusY > canvas.height || bird.y - bird.radiusY < 0) return true;
      for (let obstacle of obstacles) {
        if (
          bird.x + bird.radiusX > obstacle.x &&
          bird.x - bird.radiusX < obstacle.x + obstacleWidth &&
          (bird.y - bird.radiusY < obstacle.gapStart || bird.y + bird.radiusY > obstacle.gapEnd)
        ) return true;
      }
      return false;
    }
    
    function flapBird() {
      if (gameRunning && !gamePaused) {
        bird.velocity = bird.flap;
      }
    }
    
    function startGame() {
      initGame();
      gameRunning = true;
      gamePaused = false;
      startScreen.style.display = 'none';
      gameOverScreen.style.display = 'none';
      settingsScreen.style.display = 'none';
    
      if (backgroundMusicEnabled) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
      }
    
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    function endGame() {
      gameRunning = false;
      finalScore.textContent = `Your score: ${score}`;
      gameOverScreen.style.display = 'flex';
      backgroundMusic.pause();
      collisionSound.play();
    
      let best = parseInt(localStorage.getItem('bestScore')) || 0;
      if (score > best) {
        localStorage.setItem('bestScore', score);
        best = score;
      }
      document.getElementById('best-score').textContent = `Best: ${best}`;
    
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
    
    function togglePause() {
      if (!gameRunning) return;
      gamePaused = !gamePaused;
      if (gamePaused) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }
    
    function openSettings() {
      if (gameRunning && !gamePaused) togglePause();
      updateSettingsDisplay();
      settingsScreen.style.display = 'flex';
    }
    
    function closeSettings() {
      settingsScreen.style.display = 'none';
      if (gameRunning && gamePaused) {
        togglePause();
      } else if (!gameRunning) {
        startScreen.style.display = 'flex';
      }
    }
    
    function applySettings() {
      baseGameSpeed = parseFloat(gameSpeedSlider.value);
      gravity = parseFloat(gravitySlider.value);
      basePipeSpeed = parseFloat(pipeSpeedSlider.value);
      pipeFrequency = parseInt(pipeFrequencySlider.value);
      gapHeight = parseInt(gapSizeSlider.value);
      backgroundMusicEnabled = backgroundMusicToggle.checked;
    
      if (backgroundMusicEnabled && gameRunning && !gamePaused) {
        backgroundMusic.play();
      } else {
        backgroundMusic.pause();
      }
    
      gameSpeed = baseGameSpeed;
      closeSettings();
    }
    
    function updateSettingsDisplay() {
      gameSpeedValue.textContent = gameSpeedSlider.value;
      gravityValue.textContent = gravitySlider.value;
      pipeSpeedValue.textContent = pipeSpeedSlider.value;
      pipeFrequencyValue.textContent = pipeFrequencySlider.value;
      gapSizeValue.textContent = gapSizeSlider.value;
    }
    
    function resetSettings() {
      gameSpeedSlider.value = defaultSettings.gameSpeed;
      gravitySlider.value = defaultSettings.gravity;
      pipeSpeedSlider.value = defaultSettings.pipeSpeed;
      pipeFrequencySlider.value = defaultSettings.pipeFrequency;
      gapSizeSlider.value = defaultSettings.gapSize;
      updateSettingsDisplay();
    }
    
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => {
          alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
        gameContainer.classList.add('fullscreen');
      } else {
        document.exitFullscreen();
        gameContainer.classList.remove('fullscreen');
      }
    }
    
    startButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      startGame();
    });
    restartButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      startGame();
    });
    openSettingsButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      openSettings();
    });
    gameOverSettingsButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      openSettings();
    });
    applySettingsButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      applySettings();
    });
    resetSettingsButton.addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      resetSettings();
    });
    document.getElementById('fullscreen-button').addEventListener('click', () => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play();
      toggleFullscreen();
    });
    
    muteButton.addEventListener('click', () => {
      if (backgroundMusicEnabled) {
        backgroundMusic.pause();
        backgroundMusicEnabled = false;
        muteButton.textContent = '🔇';
      } else {
        if (gameRunning && !gamePaused) {
          backgroundMusic.play();
        }
        backgroundMusicEnabled = true;
        muteButton.textContent = '🔊';
      }
    });
    muteButton.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (!gameRunning) {
          buttonClickSound.currentTime = 0;
          buttonClickSound.play();
          startGame();
        } else {
          flapBird();
        }
      }
    });
    canvas.addEventListener('click', flapBird);
    
    gameSpeedSlider.addEventListener('input', () => {
      gameSpeedValue.textContent = gameSpeedSlider.value;
    });
    gravitySlider.addEventListener('input', () => {
      gravityValue.textContent = gravitySlider.value;
    });
    pipeSpeedSlider.addEventListener('input', () => {
      pipeSpeedValue.textContent = pipeSpeedSlider.value;
    });
    pipeFrequencySlider.addEventListener('input', () => {
      pipeFrequencyValue.textContent = pipeFrequencySlider.value;
    });
    gapSizeSlider.addEventListener('input', () => {
      gapSizeValue.textContent = gapSizeSlider.value;
    });
    
    updateSettingsDisplay();
    loadBestScore();