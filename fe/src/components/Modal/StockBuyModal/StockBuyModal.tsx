import Modal from '../Modal';
import StockBuyModalContent from './StockBuyModalContent';

export default function StockBuyModal() {
  return <Modal header="주식 매수창" content={<StockBuyModalContent />} />;
}
