import { useGameInfoValue } from '@store/reducer';
import Modal from '../Modal';
import EventModalContent from './EventModalContent';

export default function EventModal() {
  const gameInfo = useGameInfoValue();
  const targetEvent = gameInfo.eventList.find(
    (event) => event.title === gameInfo.eventResult
  );

  if (!targetEvent) return null;

  return (
    <Modal
      header={targetEvent.title}
      content={<EventModalContent eventInfo={targetEvent} />}
    />
  );
}
