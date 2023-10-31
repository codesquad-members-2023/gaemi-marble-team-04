import { RouletteEvent } from '@store/reducer/type';

type EventModalContentProps = {
  eventInfo: RouletteEvent;
};

export default function EventModalContent({
  eventInfo,
}: EventModalContentProps) {
  return (
    <>
      <div>{eventInfo.content}</div>
      <div>{eventInfo.impact}</div>
    </>
  );
}
