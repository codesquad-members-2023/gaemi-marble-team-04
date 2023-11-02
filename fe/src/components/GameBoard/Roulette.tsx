import EventModal from '@components/Modal/EventModal/EventModal';
import useGetSocketUrl from '@hooks/useGetSocketUrl';
import useSound from '@hooks/useSound';
import { usePlayerIdValue } from '@store/index';
import { useGameInfo, useResetEventRound } from '@store/reducer';
import { delay } from '@utils/index';
import { useCallback, useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [stockSellTime, setStockSellTime] = useState(30);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const { gameId } = useParams();
  const [gameInfo] = useGameInfo();
  const playerId = usePlayerIdValue();
  const socketUrl = useGetSocketUrl();
  const resetGameInfo = useResetEventRound();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const [isRolling, setIsRolling] = useState(false);
  const { sound: RouletteRollingSound } = useSound({
    src: '/sound/roulette.mp3',
  });

  const startSpin = useCallback(() => {
    const eventListData = gameInfo.eventList.map((event) => event.title);
    if (eventListData.length === 0) return;
    if (gameInfo.firstPlayerId !== playerId) return;
    const message = {
      type: 'eventResult',
      gameId,
      events: eventListData,
    };
    sendJsonMessage(message);
    setIsRolling(true);
  }, [
    gameId,
    playerId,
    gameInfo.eventList,
    gameInfo.firstPlayerId,
    sendJsonMessage,
  ]);

  useEffect(() => {
    let isMounted = true;
    const stockSellTimer = async () => {
      await delay(1000);
      if (!isMounted) return;
      if (stockSellTime > 0) {
        setStockSellTime((prev) => prev - 1);
      } else {
        startSpin();
      }
    };
    stockSellTimer();

    return () => {
      isMounted = false;
    };
  }, [stockSellTime, startSpin]);

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

  const handleSpinDone = async () => {
    setIsEventModalOpen(true);
    setIsRolling(false);
    await delay(5000);
    resetGameInfo();
    setMustSpin(false);
    setIsEventModalOpen(false);
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        fontSize={16}
        spinDuration={0.5}
        radiusLineWidth={2}
        outerBorderWidth={2}
        pointerProps={{ style: { width: '70px', height: '70px' } }}
        textColors={['#FCF5ED', '#000']}
        backgroundColors={['#3e3e3e', '#f4acb7']}
        onStopSpinning={handleSpinDone}
      />
      <Wrapper>
        <Timer>남은 매도시간: {stockSellTime}</Timer>
        <Button onClick={startSpin}>룰렛 테스트 버튼</Button>
      </Wrapper>
      {isEventModalOpen && <EventModal />}
      {isRolling && RouletteRollingSound}
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const Timer = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sMedium};
`;

const Button = styled.button`
  width: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  align-self: flex-end;
  border: 1px solid ${({ theme }) => theme.color.accentText};
  border-radius: ${({ theme }) => theme.radius.small};
  color: ${({ theme }) => theme.color.neutralTextStrong};
  background-color: ${({ theme }) => theme.color.neutralBackground};
`;
