import {
  PlayerTokenAtom,
  usePlayerToken1,
  usePlayerToken2,
  usePlayerToken3,
  usePlayerToken4,
} from '@store/playerToken';
import { delay } from '@utils/index';
import { RefObject, useRef, useState } from 'react';
import { styled } from 'styled-components';
import Cell from './Cell';
import PlayerToken from './PlayerToken';
import { CELL, CORNER_CELLS, TOKEN_TRANSITION_DELAY } from './constants';

export type DirectionType = 'top' | 'right' | 'bottom' | 'left';

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
        moveToken(randomNum, token1, setToken1, tokenRef1);
        break;
      case 2:
        moveToken(randomNum, token2, setToken2, tokenRef2);
        break;
      case 3:
        moveToken(randomNum, token3, setToken3, tokenRef3);
        break;
      case 4:
        moveToken(randomNum, token4, setToken4, tokenRef4);
        break;
      default:
        break;
    }

    setDice(randomNum);
  };

  const changeDirection = (direction: DirectionType) => {
    switch (direction) {
      case 'top':
        return 'right';
      case 'right':
        return 'bottom';
      case 'bottom':
        return 'left';
      case 'left':
        return 'top';
      default:
        return 'top';
    }
  };

  const moveToken = async (
    diceCount: number,
    tokenAtom: PlayerTokenAtom,
    setTokenAtom: (
      updateFunction: (prev: PlayerTokenAtom) => PlayerTokenAtom
    ) => void,
    tokenRef: RefObject<HTMLDivElement>
  ) => {
    const tokenCoordinates = tokenAtom.coordinates;
    let tokenDirection = tokenAtom.direction;
    let tokenLocation = tokenAtom.location;

    const moveToNextCell = (x: number, y: number) => {
      tokenCoordinates.x += x;
      tokenCoordinates.y += y;
      tokenRef.current!.style.transform = `translate(${tokenCoordinates.x}rem, ${tokenCoordinates.y}rem)`;
    };

    const directions = {
      top: { x: 0, y: -CELL.HEIGHT },
      right: { x: CELL.WIDTH, y: 0 },
      bottom: { x: 0, y: CELL.HEIGHT },
      left: { x: -CELL.HEIGHT, y: 0 },
    };

    for (let i = diceCount; i > 0; i--) {
      const directionData = directions[tokenDirection];
      moveToNextCell(directionData.x, directionData.y);

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
        <Line1>
          <Cell logo="start" name="start" />
          <Cell
            theme="it"
            name="코드스쿼드"
            logo="codesquad"
            sharePrice={400000}
          />
          <Cell
            theme="fashion"
            name="무신사"
            logo="musinsa"
            sharePrice={500000}
          />
          <Cell
            theme="travel"
            name="하나투어"
            logo="hanatour"
            sharePrice={600000}
          />
          <Cell
            theme="construction"
            name="GS건설"
            logo="gs"
            sharePrice={700000}
          />
          <Cell theme="food" name="농심" logo="nongshim" sharePrice={800000} />
        </Line1>
        <Line2>
          <Cell logo="jail" name="유치장" />
          <Cell
            theme="construction"
            name="현대건설"
            logo="hyundai"
            sharePrice={900000}
          />
          <Cell
            theme="military"
            name="한화디펜스"
            logo="hanwha"
            sharePrice={1000000}
          />
          <Cell name="황금카드" logo="goldCard" />
          <Cell
            theme="travel"
            name="대한항공"
            logo="koreanAir"
            sharePrice={1100000}
          />
          <Cell
            theme="elonMusk"
            name="트위터"
            logo="twitter"
            sharePrice={1200000}
          />
        </Line2>
        <Line3>
          <Cell logo="goodNews" name="호재" />
          <Cell
            theme="pharmaceutical"
            name="삼성바이오로직스"
            logo="samsungBio"
            sharePrice={1300000}
          />
          <Cell theme="it" name="구글" logo="google" sharePrice={1400000} />
          <Cell logo="tax" name="세금" />
          <Cell
            theme="fashion"
            name="에르메스"
            logo="hermes"
            sharePrice={1500000}
          />
          <Cell
            theme="food"
            name="맥도날드"
            logo="mcdonalds"
            sharePrice={1600000}
          />
        </Line3>
        <Line4>
          <Cell logo="rocket" name="순간이동" />
          <Cell
            theme="elonMusk"
            name="테슬라"
            logo="tesla"
            sharePrice={1700000}
          />
          <Cell
            theme="pharmaceutical"
            name="화이자"
            logo="pfizer"
            sharePrice={1800000}
          />
          <Cell logo="goldCard" name="황금카드" />
          <Cell
            theme="military"
            name="스타크 인더스트리"
            logo="starkIndustry"
            sharePrice={1900000}
          />
          <Cell theme="it" name="애플" logo="apple" sharePrice={2000000} />
        </Line4>
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

const Line1 = styled.div`
  position: absolute;
  top: 6rem;
  left: 0;
  display: flex;
  flex-direction: column-reverse;

  div {
    border-top: none;
  }
`;

const Line2 = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: row;

  div {
    border-right: none;
  }
`;

const Line3 = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;

  div {
    border-bottom: none;
  }
`;

const Line4 = styled.div`
  position: absolute;
  bottom: 0;
  left: 6rem;
  display: flex;
  flex-direction: row-reverse;

  div {
    border-left: none;
  }
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
