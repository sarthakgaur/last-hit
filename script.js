document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const lastHitCounterElement = document.getElementById("last-hit-counter");
  const missedCounterElement = document.getElementById("missed-counter");
  const minionHealthInput = document.getElementById("minion-health");
  const damageInput = document.getElementById("damage");
  const applyConfigurationBtn = document.getElementById("apply-configuration");
  let initialHealth = 100;
  let initialDamage = 10;

  let rectangles = [
    getInitialRectangle(canvas.getBoundingClientRect().width / 1.5, canvas.getBoundingClientRect().height / 2 - 75, "rgb(200, 0, 0)"),
    getInitialRectangle(canvas.getBoundingClientRect().width / 1.5, canvas.getBoundingClientRect().height / 2, "rgb(0, 200, 0)"),
    getInitialRectangle(canvas.getBoundingClientRect().width / 1.5, canvas.getBoundingClientRect().height / 2 + 75, "rgb(0, 0, 200)")
  ];

  const player = {
    x: canvas.getBoundingClientRect().width / 3,
    y: canvas.getBoundingClientRect().height / 2.3,
    width: 200,
    height: 200,
    color: "rgb(100, 100, 100)"
  };

  function getInitialRectangle(x, y, color) {
    return {
      x: x,
      y: y,
      width: 50,
      height: 50,
      health: 100,
      color: color,
    }
  }

  let lastHitCounter = 0;
  let missedCounter = 0;

  let projectile = null;

  function resizeCanvas() {
    canvas.height = canvas.parentElement.clientHeight; // Set to the height of the parent container
    canvas.width = canvas.parentElement.clientWidth * 0.75; // Set to 75% of the width of the parent container
    drawAllRectangles(); // Redraw everything on canvas resize
  }

  function drawRectWithHealthBar(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    const healthBarWidth = (rect.width * rect.health) / initialHealth;
    const healthBarHeight = 5;
    const healthBarY = rect.y - 10;

    ctx.fillStyle = "red";
    ctx.fillRect(rect.x, healthBarY, healthBarWidth, healthBarHeight);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x, healthBarY, rect.width, healthBarHeight);
  }

  function drawAllRectangles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(drawRectWithHealthBar);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (projectile) {
      ctx.fillStyle = projectile.color;
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
  }

  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    rectangles.forEach(function (rectangle) {
      if (
        x > rectangle.x &&
        x < rectangle.x + rectangle.width &&
        y > rectangle.y &&
        y < rectangle.y + rectangle.height
      ) {
        projectile = {
          x: player.x + player.width / 2 - 5, // Adjust the position based on the size of the projectile
          y: player.y + player.height / 2 - 5, // Adjust the position based on the size of the projectile
          width: 10,
          height: 10,
          color: "rgb(255, 0, 0)", // Red color
          targetX: x - 5, // Adjust for the size of the rectangle
          targetY: y - 5, // Adjust for the size of the rectangle
          speed: 5 // Adjust the speed of the projectile
        };

        // Calculate the direction of the projectile
        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        projectile.dx = dx / distance * projectile.speed;
        projectile.dy = dy / distance * projectile.speed;

        moveProjectile(rectangle);

        // rectangle.health -= initialDamage;
        // if (rectangle.health <= 0) {
        //   rectangle.health = 0;
        //   // Remove rectangle if health is zero
        //   rectangles = rectangles.filter((r) => r.health > 0);
        //   lastHitCounter++; // Increment the counter
        //   lastHitCounterElement.textContent = lastHitCounter; // Update the counter display

        //   fadeInNewRectangle(getInitialRectangle(rectangle.x, rectangle.y, rectangle.color));
        // }
        drawAllRectangles();
      }
    });
  });

  function moveProjectile(rectangle) {
    if (!projectile) return;

    projectile.x += projectile.dx;
    projectile.y += projectile.dy;

    if (
      projectile.x < projectile.targetX + 5 &&
      projectile.x + projectile.width > projectile.targetX &&
      projectile.y < projectile.targetY + 5 &&
      projectile.y + projectile.height > projectile.targetY
    ) {
      // Projectile reached the target, decrease health
      rectangles.forEach(rectangle => {
        if (
          projectile.targetX > rectangle.x &&
          projectile.targetX < rectangle.x + rectangle.width &&
          projectile.targetY > rectangle.y &&
          projectile.targetY < rectangle.y + rectangle.height
        ) {
          rectangle.health -= initialDamage;
          if (rectangle.health <= 0) {
            rectangle.health = 0;
            // Remove rectangle if health is zero
            rectangles = rectangles.filter((r) => r.health > 0);
            lastHitCounter++; // Increment the counter
            lastHitCounterElement.textContent = lastHitCounter; // Update the counter display

            fadeInNewRectangle(getInitialRectangle(rectangle.x, rectangle.y, rectangle.color));
          }
        }
      });

      // Reset the projectile
      projectile = null;
      drawAllRectangles();
    } else {
      // Continue moving the projectile
      drawAllRectangles();
      requestAnimationFrame(moveProjectile);
    }
  }

  function getConfigInput(inputValue, defaultValue) {
    const input = parseInt(inputValue);

    return isNaN(input) ? defaultValue : input
  }

  applyConfigurationBtn.addEventListener("click", function () {
    const newMinionHealth = getConfigInput(minionHealthInput.value);
    const newDamage = getConfigInput(damageInput.value);

    rectangles.forEach((rectangle) => {
      rectangle.health = newMinionHealth;
      initialHealth = newMinionHealth;
      initialDamage = newDamage;
    });
  });

  function reduceHealthRandomly() {
    rectangles.forEach(function (rectangle) {
      // Reduce the health by a random amount between 1 and 1/10th of initialHealth
      const randomReduction = Math.floor(Math.random() * (initialHealth / 10)) + 1;
      rectangle.health -= randomReduction;

      if (rectangle.health <= 0) {
        missedCounter++; // Increment the counter
        missedCounterElement.textContent = missedCounter; // Update the counter display

        fadeInNewRectangle(getInitialRectangle(rectangle.x, rectangle.y, rectangle.color));
      }
    });
    // Filter out rectangles with zero health
    rectangles = rectangles.filter((rectangle) => rectangle.health > 0);

    drawAllRectangles();
  }

  drawAllRectangles(); // Initial draw

  // Reduce the health of each rectangle by a random amount every second
  setInterval(reduceHealthRandomly, 1000);

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Initial resize

  function fadeInNewRectangle(rectangle) {
    const fadeInInterval = setInterval(function () {
      drawRectWithHealthBar(rectangle);

      rectangles.push(rectangle);

      clearInterval(fadeInInterval);
    }, 500);
  }
});