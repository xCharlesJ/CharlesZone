import { useEffect, useRef } from "react";

export default function ClickSpark({
  children,
  sparkColor = "#ffffff",
  sparkSize = 10,
  sparkRadius = 19,
  sparkCount = 12,
  duration = 250,
  easing = "linear",
  extraScale = 1.3
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    let animationFrame = 0;

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawSpark(spark, now) {
      const elapsed = now - spark.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing === "linear" ? progress : 1 - (1 - progress) ** 2;
      const distance = sparkRadius * (1 + easedProgress * extraScale);
      const tailDistance = Math.max(sparkRadius * 0.35, distance - sparkSize);
      const alpha = 1 - progress;

      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = sparkColor;
      context.lineWidth = Math.max(1, sparkSize / 5);
      context.lineCap = "round";

      spark.angles.forEach((angle) => {
        const startX = spark.x + Math.cos(angle) * tailDistance;
        const startY = spark.y + Math.sin(angle) * tailDistance;
        const endX = spark.x + Math.cos(angle) * distance;
        const endY = spark.y + Math.sin(angle) * distance;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      });

      context.restore();
      return progress < 1;
    }

    function animate(now) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparksRef.current = sparksRef.current.filter((spark) => drawSpark(spark, now));
      animationFrame = window.requestAnimationFrame(animate);
    }

    function handlePointerDown(event) {
      if (event.button !== 0) return;
      const step = (Math.PI * 2) / sparkCount;
      sparksRef.current.push({
        x: event.clientX,
        y: event.clientY,
        startTime: performance.now(),
        angles: Array.from({ length: sparkCount }, (_, index) => index * step)
      });
    }

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [duration, easing, extraScale, sparkColor, sparkCount, sparkRadius, sparkSize]);

  return (
    <>
      {children}
      <canvas className="click-spark" ref={canvasRef} aria-hidden="true" />
    </>
  );
}
