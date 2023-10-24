import {
  PlayerTokenAtom,
  usePlayerToken1,
  usePlayerToken2,
  usePlayerToken3,
  usePlayerToken4,
} from '@store/playerToken';
import { delay } from '@utils/index';
import { RefObject, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import Cell from './Cell';
import PlayerToken from './PlayerToken';
import {
  CORNER_CELLS,
  TOKEN_TRANSITION_DELAY,
  changeDirection,
  directions,
  initialBoard,
} from './constants';

export default function GameBoard() {
  const [dice, setDice] = useState(0);

  const tokenRef1 = useRef<HTMLDivElement>(null);
  const tokenRef2 = useRef<HTMLDivElement>(null);
  const tokenRef3 = useRef<HTMLDivElement>(null);
  const tokenRef4 = useRef<HTMLDivElement>(null);

  const [token1, setToken1] = usePlayerToken1();
  const [token2, setToken2] = usePlayerToken2();
  const [token3, setToken3] = usePlayerToken3();
  const [token4, setToken4] = usePlayerToken4();

  // TODO: 본인 차례에만 주사위 굴리기 버튼이 렌더링되고 클릭 가능하도록 구현
  // TODO: 자기 차례에 주사위를 굴리면 자신의 말만 이동할 수 있도록 구현
  const throwDice = (order: number) => {
    const randomNum = Math.floor(Math.random() * 11) + 2;

    switch (order) {
      case 1:
        moveToken(randomNum, tokenRef1, token1, setToken1);
        break;
      case 2:
        moveToken(randomNum, tokenRef2, token2, setToken2);
        break;
      case 3:
        moveToken(randomNum, tokenRef3, token3, setToken3);
        break;
      case 4:
        moveToken(randomNum, tokenRef4, token4, setToken4);
        break;
      default:
        break;
    }

    setDice(randomNum);
  };

  const moveToNextCell = (
    x: number,
    y: number,
    tokenRef: RefObject<HTMLDivElement>,
    tokenAtom: PlayerTokenAtom
  ) => {
    tokenAtom.coordinates.x += x;
    tokenAtom.coordinates.y += y;
    tokenRef.current!.style.transform = `translate(${tokenAtom.coordinates.x}rem, ${tokenAtom.coordinates.y}rem)`;
  };

  const moveToken = async (
    diceCount: number,
    tokenRef: RefObject<HTMLDivElement>,
    tokenAtom: PlayerTokenAtom,
    setTokenAtom: (
      updateFunction: (prev: PlayerTokenAtom) => PlayerTokenAtom
    ) => void
  ) => {
    const tokenCoordinates = tokenAtom.coordinates;
    let tokenDirection = tokenAtom.direction;
    let tokenLocation = tokenAtom.location;

    for (let i = diceCount; i > 0; i--) {
      const directionData = directions[tokenDirection];
      moveToNextCell(directionData.x, directionData.y, tokenRef, tokenAtom);

      tokenLocation = (tokenLocation + 1) % 24;
      const isCorner = CORNER_CELLS.includes(tokenLocation); // 0, 6, 12, 18 칸에서 방향 전환

      if (isCorner) {
        tokenDirection = changeDirection(tokenDirection);
      }

      await delay(TOKEN_TRANSITION_DELAY);
    }

    setTokenAtom((prev) => ({
      ...prev,
      coordinates: tokenCoordinates,
      direction: tokenDirection,
      location: tokenLocation,
    }));
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
        <Center>
          <span>주사위 결과: {dice}</span>
          <RollButton onClick={() => throwDice(1)}>주사위1</RollButton>
          <RollButton onClick={() => throwDice(2)}>주사위2</RollButton>
          <RollButton onClick={() => throwDice(3)}>주사위3</RollButton>
          <RollButton onClick={() => throwDice(4)}>주사위4</RollButton>
        </Center>
        <PlayerToken ref={tokenRef1} order={1} />
        <PlayerToken ref={tokenRef2} order={2} />
        <PlayerToken ref={tokenRef3} order={3} />
        <PlayerToken ref={tokenRef4} order={4} />
      </Board>
    </>
  );
}

const Board = styled.div`
  width: 42rem;
  height: 42rem;
  position: relative;
  border-color: ${({ theme: { color } }) => color.accentText};
`;

const Line = styled.div<{ $lineNum: number }>`
  position: absolute;
  display: flex;
  ${({ $lineNum }) => drawLine($lineNum)}
`;

const RollButton = styled.button`
  width: 6rem;
  height: 4rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
`;

const Center = styled.div`
  width: 30rem;
  height: 30rem;
  position: absolute;
  top: 6rem;
  left: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
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
