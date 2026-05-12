export function FrogIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 883 750"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M360 73C347.939 56.3883 323.621 33.5 288.5 33.5C240 33.5 200.5 90.5 200.5 162.5C200.5 234.5 240.5 289 289 289C323 289 347.5 266 360 249.5V73Z"
        fill="#17A866"
      />
      <path
        d="M523 73C535.061 56.3883 559.379 33.5 594.5 33.5C643 33.5 682.5 90.5 682.5 162.5C682.5 234.5 642.5 289 594 289C560 289 535.5 266 523 249.5V73Z"
        fill="#17A866"
      />
      <circle cx="320" cy="123" r="40" fill="white" />
      <circle cx="320" cy="123" r="24" fill="black" />
      <circle cx="563" cy="123" r="40" fill="white" />
      <circle cx="563" cy="123" r="24" fill="black" />
      <path
        d="M150 350C100 350 50 420 50 520C50 620 100 700 200 730L683 730C783 700 833 620 833 520C833 420 783 350 733 350C683 350 633 400 583 450C533 500 483 520 441.5 520C400 520 350 500 300 450C250 400 200 350 150 350Z"
        fill="#17A866"
      />
      <ellipse cx="180" cy="620" rx="70" ry="80" fill="#17A866" />
      <ellipse cx="703" cy="620" rx="70" ry="80" fill="#17A866" />
    </svg>
  );
}
