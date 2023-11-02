import {
  playerAtomsAtom,
  useGameInfoValue,
  usePlayersValue,
  useStocksValue,
} from '@store/reducer';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { css, styled } from 'styled-components';
import Cell from './Cell';
import CenterArea from './CenterArea';
import PlayerToken from './PlayerToken';
import { initialBoard } from './constants';

export default function GameBoard() {
  const [targetLocation, setTargetLocation] = useState<number | null>(null);
  const gameInfo = useGameInfoValue();
  const stockList = useStocksValue();
  const players = usePlayersValue();
  const [playerAtoms] = useAtom(playerAtomsAtom);

  const currentPlayer = players.find(
    (player) => player.playerId === gameInfo.currentPlayerId
  );
  const currentPlayerStatus = currentPlayer?.gameboard.status ?? 'event';

  const selectTargetLocation = (location: number) => {
    setTargetLocation(location);
  };

  const resetTargetLocation = () => {
    setTargetLocation(null);
  };

  return (
    <>
      <Board>
        {initialBoard.map((line, index) => (
          <Line key={index} $lineNum={index + 1}>
            {line.map((cell) => {
              const stockPrice = stockList.find(
                (stock) => stock.logo === cell.logo
              )?.price;
              return (
                <Cell
                  key={cell.name}
                  cell={cell}
                  price={stockPrice}
                  playerStatus={currentPlayerStatus}
                  targetLocation={targetLocation}
                  selectTargetLocation={selectTargetLocation}
                />
              );
            })}
          </Line>
        ))}
        {gameInfo.isPlaying && (
          <CenterArea
            currentStatus={currentPlayerStatus}
            targetLocation={targetLocation}
            resetTargetLocation={resetTargetLocation}
          />
        )}
        {playerAtoms.map((playerAtom) => {
          return <PlayerToken key={`${playerAtom}`} playerAtom={playerAtom} />;
        })}
      </Board>
    </>
  );
}

const Board = styled.div`
  min-width: 42rem;
  min-height: 42rem;
  position: relative;
  border-color: ${({ theme: { color } }) => color.accentText};
`;

const Line = styled.div<{ $lineNum: number }>`
  position: absolute;
  display: flex;
  ${({ $lineNum }) => drawLine($lineNum)}
`;

const drawLine = (lineNum: number) => {
  switch (lineNum) {
    case 1:
      return css`
        top: 6rem;
        left: 0;
        flex-direction: column-reverse;
        div {
          border-top: none;
        }
      `;
    case 2:
      return css`
        top: 0;
        flex-direction: row;
        div {
          border-right: none;
        }
      `;
    case 3:
      return css`
        right: 0;
        flex-direction: column;
        div {
          border-bottom: none;
        }
      `;
    case 4:
      return css`
        bottom: 0;
        left: 6rem;
        flex-direction: row-reverse;
        div {
          border-left: none;
        }
      `;
    default:
      return css``;
  }
};
