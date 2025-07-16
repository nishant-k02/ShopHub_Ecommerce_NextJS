'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Chatbot from './Chatbot';

const ChatbotWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show the floating chatbot on the dedicated chat page
  if (pathname === '/chat') {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Chatbot 
      isOpen={isOpen} 
      onToggle={handleToggle}
    />
  );
};

export default ChatbotWrapper; 