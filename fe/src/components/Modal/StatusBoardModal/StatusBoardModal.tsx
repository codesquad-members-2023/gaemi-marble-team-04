import useOutsideClick from '@hooks/useOutsideClick';
import Modal from '../Modal';
import StatusBoardModalContent from './StatusBoardModalContent';

type StatusBoardModalProps = {
  handleClose: () => void;
};

export default function StatusBoardModal({
  handleClose,
}: StatusBoardModalProps) {
  const { ref: statusBoardModalRef } =
    useOutsideClick<HTMLDivElement>(handleClose);

  return (
    <Modal
      ref={statusBoardModalRef}
      header="주식 현황판"
      content={<StatusBoardModalContent />}
    />
  );
}
