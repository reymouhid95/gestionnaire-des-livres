// NotificationComponent.jsx
const Notification = ({ type, message, date }) => {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <small>{date}</small>
    </div>
  );
};

export default Notification;
