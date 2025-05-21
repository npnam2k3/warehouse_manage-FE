import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  getNotificationsUnseen,
  getOneNotification,
  markSeenNotification,
} from "../apis/notificationsService";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null); // không gây re-render
  const [connect, setConnect] = useState(false);

  const [notificationsUnseen, setNotificationUnseen] = useState([]);

  const fetchDataNotificationsUnseen = useCallback(async () => {
    try {
      const res = await getNotificationsUnseen();
      // console.log("check data::", res.data);
      setNotificationUnseen(formatDataNotifications(res.data.data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetDataNotificationDetail = useCallback(async (id) => {
    try {
      const res = await getOneNotification(id);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchDataAllNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleMarkSeenNotification = useCallback(async (id) => {
    try {
      await markSeenNotification(id);
      setNotificationUnseen((prev) =>
        prev.filter((notification) => notification.notificationId !== id)
      );
    } catch (error) {
      console.log(error);
    }
  }, []);
  const formatDataNotifications = (data) => {
    return data.map((item) => {
      return {
        notificationId: item.notification?.id,
        shortMessage: item.notification?.short_message,
      };
    });
  };

  const connectSocket = useCallback((token) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log(" Socket connected:", newSocket.id);
      setConnect(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnect(false);
    });

    socketRef.current = newSocket;
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnect(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      connectSocket(token);
      fetchDataNotificationsUnseen();
    }
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, fetchDataNotificationsUnseen]);

  useEffect(() => {
    const handleMessage = (data) => {
      const newNotification = {
        notificationId: data.message?.id,
        shortMessage: data.message?.short_message,
      };
      setNotificationUnseen((prev) => [newNotification, ...prev]);
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.on("notification", handleMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("notification", handleMessage);
      }
    };
  }, [connect]);

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        disconnectSocket,
        notificationsUnseen,
        fetDataNotificationDetail,
        handleMarkSeenNotification,
        fetchDataAllNotifications,
        fetchDataNotificationsUnseen,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
