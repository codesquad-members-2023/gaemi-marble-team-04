import { useGameInfoValue } from '@store/reducer';
import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

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
        backgroundColors={['#3e3e3e', '#df3428']}
        textColors={['#ffffff']}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <button onClick={handleSpinClick}>Spin!</button>
    </>
  );
}
