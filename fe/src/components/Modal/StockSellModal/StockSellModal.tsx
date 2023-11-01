import Modal from '../Modal';
import StockSellModalContent from './StockSellModalContent';

type StockSellModalProps = {
  handleClose: () => void;
};

export default function StockSellModal({ handleClose }: StockSellModalProps) {
  return (
    <Modal
      header="주식 매도창"
      content={<StockSellModalContent handleClose={handleClose} />}
    />
  );
}
