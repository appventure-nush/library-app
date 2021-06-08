import React from 'react';

interface MinimumIntervalProps {
  disabled: boolean;
  /** Callback when entering(mouse move/touch move) a **disabled** interval */
  onEnterDisabledCallback: () => void;
  /** Callback when touching(touch start/touch move) a **non-disabled** interval */
  onTouchEnabledCallback: () => void;
}

const MinimumInterval: React.FC<MinimumIntervalProps> = props => {
  return (
    <div
      className={`w-full h-full border border-gray-400 dark:border-gray-700 ${
        props.disabled ? 'bg-gray-300' : 'bg-white dark:bg-black'
      }`}
      onMouseMove={() => props.disabled && props.onEnterDisabledCallback()}
      onTouchMove={() => props.disabled && props.onEnterDisabledCallback()}
    />
  );
};

export default MinimumInterval;
