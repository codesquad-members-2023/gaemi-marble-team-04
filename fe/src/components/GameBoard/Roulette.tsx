import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { useGameInfo } from '@store/reducer';
import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const { gameId } = useParams();
  const [gameInfo, setGameInfo] = useGameInfo();
  const socketUrl = useGetSocketUrl();

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  useEffect(() => {
    if (gameInfo.eventResult === '') return;
    const prizeNumber = gameInfo.eventList.findIndex(
      (event) => event.title === gameInfo.eventResult
    );
    setPrizeNumber(prizeNumber);
    setMustSpin(true);
  }, [gameInfo.eventResult, gameInfo.eventList]);

  if (gameInfo.eventList.length === 0) return null;
  const wheelData = gameInfo.eventList.map((event) => {
    return { option: event.title };
  });

  const handleSpinClick = () => {
    const eventListData = gameInfo.eventList.map((event) => event.title);
    const message = {
      type: 'eventResult',
      gameId,
      events: eventListData,
    };
    sendJsonMessage(message);
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        fontSize={16}
        spinDuration={0.5}
        textColors={['#fff', '#000']}
        pointerProps={{ style: { width: '70px', height: '70px' } }}
        backgroundColors={['#3e3e3e', '#f4acb7']}
        onStopSpinning={() => {
          setGameInfo((prev) => ({
            ...prev,
            dice: [0, 0],
            eventResult: '',
            currentPlayerId: gameInfo.firstPlayerId,
          }));
          setMustSpin(false);
        }}
      />
      <Button onClick={handleSpinClick}>Spin!</Button>
    </>
  );
}

const Button = styled.button`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  align-self: flex-end;
  border: 1px solid ${({ theme }) => theme.color.accentText};
  border-radius: ${({ theme }) => theme.radius.small};
  color: ${({ theme }) => theme.color.neutralTextStrong};
  background-color: ${({ theme }) => theme.color.neutralBackground};
`;
