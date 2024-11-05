import React from 'react';

interface TaskbarIconProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const TaskbarIcon: React.FC<TaskbarIconProps> = ({ icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-white/10 transition-colors ${
        isActive ? 'bg-white/20' : ''
      }`}
    >
      {icon}
    </button>
  );
};

export default TaskbarIcon;