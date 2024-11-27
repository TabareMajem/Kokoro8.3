import { useState, useCallback } from 'react';
import { api } from '../lib/api';

type Message = {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

export function useAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      setMessages(prev => [...prev, {
        text,
        sender: 'user',
        timestamp: new Date()
      }]);

      // In development, simulate API response
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prev => [...prev, {
          text: "I'm here to help! Let me know what you need assistance with.",
          sender: 'assistant',
          timestamp: new Date()
        }]);
        return;
      }

      // In production, call API
      const { data } = await api.post('/api/ai/chat', { message: text });
      
      setMessages(prev => [...prev, {
        text: data.response,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      console.error('AI Assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error
  };
}