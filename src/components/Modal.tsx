/** @format */

export default function Modal({ children, isOpen, onClose }: any) {
  if (isOpen) {
    return (
      <div className="flex-center bg-main position-absolute top-0 left-0" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex bg-white">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {children}
        </div>
      </div>
    );
  }
  return null;
}