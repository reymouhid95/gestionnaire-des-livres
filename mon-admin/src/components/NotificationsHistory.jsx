// NotificationHistory.jsx
import Notification from "./Notifications";

const NotificationHistory = ({ notifications }) => {
  return (
    <div className="notification-history">
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          type={notification.type}
          message={notification.message}
          date={notification.date}
        />
      ))}
    </div>
  );
};

export default NotificationHistory;
