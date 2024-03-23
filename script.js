document.addEventListener("DOMContentLoaded", (event) => {
  var canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    // Function to draw a rectangle with a health bar and border around the health bar
    function drawRectWithHealthBar(x, y, width, height, healthPercent, color) {
      // Draw the main rectangle
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);

      // Calculate health bar width based on health percentage
      var healthBarWidth = (width * healthPercent) / 100;
      var healthBarHeight = 5; // Height of the health bar
      var healthBarY = y - 10; // Position the health bar above the rectangle

      // Draw the health bar
      ctx.fillStyle = "red"; // Color of the health bar
      ctx.fillRect(x, healthBarY, healthBarWidth, healthBarHeight);

      // Draw border around the health bar
      ctx.strokeStyle = "black"; // Color of the border
      ctx.lineWidth = 1; // Width of the border
      ctx.strokeRect(x, healthBarY, width, healthBarHeight); // Draw border using the full width
    }

    // Draw three rectangles with health bars and borders
    drawRectWithHealthBar(10, 10, 50, 50, 100, "rgb(200, 0, 0)"); // Red rectangle with 100% health
    drawRectWithHealthBar(70, 10, 50, 50, 75, "rgb(0, 200, 0)"); // Green rectangle with 75% health
    drawRectWithHealthBar(130, 10, 50, 50, 50, "rgb(0, 0, 200)"); // Blue rectangle with 50% health
  }
});
