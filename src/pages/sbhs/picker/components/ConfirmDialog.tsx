type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmClass?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = '実行',
  confirmClass = 'bg-indigo-600 hover:bg-indigo-700',
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[70]" onClick={onCancel} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
          <p
            className="text-gray-600 text-center"
            dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br>') }}
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 text-white rounded-lg transition-colors ${confirmClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
