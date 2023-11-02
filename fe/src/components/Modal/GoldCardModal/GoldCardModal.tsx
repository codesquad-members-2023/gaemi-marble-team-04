import Modal from '../Modal';
import GoldCardModalContent from './GoldCardModalContent';

export default function GoldCardModal() {
  return <Modal header="황금 카드" content={<GoldCardModalContent />} />;
}
