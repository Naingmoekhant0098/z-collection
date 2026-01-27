function ProgressRing({
    size = 80,
    stroke = 0.25,        // progress stroke (thin)
    trackStroke = 0.2,    // background track stroke (even thinner)
    progress = 0,
  }) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
  
    return (
      <svg
        width={size}
        height={size}
        className="absolute inset-0 m-auto pointer-events-none"
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="geometricPrecision"
      >
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={trackStroke}
          fill="none"
        />
       
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-main"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 200ms linear",
          }}
        />
      </svg>
    );
  }
  
  export default ProgressRing;
  

