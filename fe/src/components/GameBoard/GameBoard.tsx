import { useGameInfo, usePlayersValue } from '@store/reducer';
import { useRef } from 'react';
import { css, styled } from 'styled-components';
import Cell from './Cell';
import CenterArea from './CenterArea';
import PlayerToken from './PlayerToken';
import { initialBoard } from './constants';

export default function GameBoard() {
  const tokenRef1 = useRef<HTMLDivElement | null>(null);
  const tokenRef2 = useRef<HTMLDivElement | null>(null);
  const tokenRef3 = useRef<HTMLDivElement | null>(null);
  const tokenRef4 = useRef<HTMLDivElement | null>(null);

  const [gameInfo] = useGameInfo();
  const players = usePlayersValue();

  const setToken = (order: number) => {
    switch (order) {
      case 1:
        return tokenRef1;
      case 2:
        return tokenRef2;
      case 3:
        return tokenRef3;
      case 4:
        return tokenRef4;
      default:
        return null;
    }
  };

  return (
    <>
      <Board>
        {initialBoard.map((line, index) => (
          <Line key={index} $lineNum={index + 1}>
            {line.map((cell) => (
              <Cell
                key={cell.name}
                theme={cell.theme}
                logo={cell.logo}
                name={cell.name}
                price={cell.price}
              />
            ))}
          </Line>
        ))}
        {gameInfo.isPlaying && <CenterArea />}
        {players.map((player) => {
          if (player.playerId === '') return;
          const tokenRef = setToken(player.order);
          return (
            <PlayerToken
              key={player.playerId}
              ref={tokenRef}
              order={player.order}
            />
          );
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
