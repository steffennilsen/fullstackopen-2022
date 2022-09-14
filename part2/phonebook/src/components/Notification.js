const Notification = ({ message }) => {
  if (!message) {
    return null;
  }
  const { content, type = 'success' } = message;
  return <div className={`message ${type}`}>{content}</div>;
};

export default Notification;
