import { createContext, ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});

export const SocketContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
          withCredentials: true,
          transports: ['websocket'],
          auth: {
            token,
          },
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      }
    }
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
