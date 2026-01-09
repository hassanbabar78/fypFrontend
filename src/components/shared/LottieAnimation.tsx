// LottieAnimation.js
import Lottie from "react-lottie";

type LottieAnimationProps = {
  lotti: object;
  width?: number;
  height?: number;
};

export default function LottieAnimation({ lotti, width, height }: LottieAnimationProps) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lotti, 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
}