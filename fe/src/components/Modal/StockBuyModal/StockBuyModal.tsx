import Modal from '../Modal';
import StockBuyModalContent from './StockBuyModalContent';

type StockBuyModalProps = {
  handleClose: () => void;
};

export default function StockBuyModal({ handleClose }: StockBuyModalProps) {
  return (
    <Modal
      header="주식 매수창"
      content={<StockBuyModalContent handleClose={handleClose} />}
    />
  );
}
