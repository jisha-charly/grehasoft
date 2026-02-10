interface Props {
  show: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = ({
  show,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
}: Props) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom">
        <h5 className="mb-2">{title}</h5>
        <p className="text-muted">{message}</p>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
