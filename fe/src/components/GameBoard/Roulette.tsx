import { useGameInfoValue } from '@store/reducer';
import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { styled } from 'styled-components';

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const gameInfo = useGameInfoValue();

  if (gameInfo.eventList.length === 0) return null;
  const wheelData = gameInfo.eventList.map((event) => {
    return { option: event.title };
  });

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        fontSize={16}
        textColors={['#fff', '#000']}
        pointerProps={{ style: { width: '70px', height: '70px' } }}
        backgroundColors={['#3e3e3e', '#f4acb7']}
        onStopSpinning={() => {
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
