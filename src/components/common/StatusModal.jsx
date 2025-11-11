export default function StatusModal({ open, onClose, title, message }) {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-[linear-gradient(90deg,#16db5e_0%,#12c451_100%)]
                       text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  