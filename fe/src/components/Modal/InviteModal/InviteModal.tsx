import useOutsideClick from '@hooks/useOutsideClick';
import Modal from '../Modal';
import InviteModalContent from './InviteModalContent';

type InviteModalProps = {
  handleClose: () => void;
};

export default function InviteModal({ handleClose }: InviteModalProps) {
  const { ref: inviteModalRef } = useOutsideClick<HTMLDivElement>(handleClose);

  return (
    <Modal
      ref={inviteModalRef}
      header="아이디를 입력하세요"
      content={<InviteModalContent handleClose={handleClose} />}
    />
  );
}
