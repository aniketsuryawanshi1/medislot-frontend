import { useDispatch, useSelector } from "react-redux";
import {
  getTelegramUsers,
  linkTelegramUser,
  getTelegramUserById,
  unlinkTelegramUser,
  getTelegramLogs,
  sendTelegramNotification,
} from "../api/telegram/telegramThunks";

const useTelegram = () => {
  const dispatch = useDispatch();
  const telegramState = useSelector((state) => state.telegram);

  return {
    // State
    users: telegramState.users,
    logs: telegramState.logs,
    loading: telegramState.loading,
    error: telegramState.error,

    // Actions
    fetchUsers: () => dispatch(getTelegramUsers()),
    linkUser: (data) => dispatch(linkTelegramUser(data)),
    fetchUserById: (uuid) => dispatch(getTelegramUserById(uuid)),
    unlinkUser: (uuid) => dispatch(unlinkTelegramUser(uuid)),

    fetchLogs: () => dispatch(getTelegramLogs()),
    sendNotification: (data) => dispatch(sendTelegramNotification(data)),

    clearError: () => dispatch({ type: "telegram/clearError" }),
  };
};

export default useTelegram;
