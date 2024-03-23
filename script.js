document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let rectangles = [
    {
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      health: 100,
      color: "rgb(200, 0, 0)",
    },
    {
      x: 70,
      y: 10,
      width: 50,
      height: 50,
      health: 100,
      color: "rgb(0, 200, 0)",
    },
    {
      x: 130,
      y: 10,
      width: 50,
      height: 50,
      health: 100,
      color: "rgb(0, 0, 200)",
    },
  ];

  function resizeCanvas() {
    canvas.height = canvas.parentElement.clientHeight; // Set to the height of the parent container
    canvas.width = canvas.parentElement.clientWidth * 0.75; // Set to 75% of the width of the parent container
    drawAllRectangles(); // Redraw everything on canvas resize
  }

  function drawRectWithHealthBar(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    const healthBarWidth = (rect.width * rect.health) / 100;
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
        rectangle.health -= 10;
        if (rectangle.health <= 0) {
          rectangle.health = 0;
          // Remove rectangle if health is zero
          rectangles = rectangles.filter((r) => r.health > 0);
        }
        drawAllRectangles();
      }
    });
  });

  function reduceHealthRandomly() {
    rectangles.forEach(function (rectangle) {
      // Reduce the health by a random amount between 1 and 10
      const randomReduction = Math.floor(Math.random() * 10) + 1;
      rectangle.health -= randomReduction;
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
});
