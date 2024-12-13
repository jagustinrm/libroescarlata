import React from "react";
import { soundService } from "../../utils/soundService";

interface HoverSoundButtonProps {
  label: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  width?: string;
  height?: string;
}

const ButtonEdited: React.FC<HoverSoundButtonProps> = ({
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width = "",
  height = "",
}) => {
  const buttonSound = {
    name: "buttonSound",
    source: "/music/click/buttonSound.wav",
    volume: 0.2,
    loop: false,
  };

  const handleMouseEnter = () => {
    soundService.play(buttonSound);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    soundService.stop(buttonSound.name);
    if (onMouseLeave) onMouseLeave();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <button
        className="rpgui-button"
        style={{ width, height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
};

export default ButtonEdited;
