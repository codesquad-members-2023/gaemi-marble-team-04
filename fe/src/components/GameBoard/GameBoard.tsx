import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import Cell from './Cell';

type DirectionType = 'top' | 'right' | 'bottom' | 'left';

export default function GameBoard() {
  const [dice, setDice] = useState(0);
  const tokenRef = useRef<HTMLDivElement>(null);
  const coordinates = useRef({ x: 0, y: 0 });
  const isStart = useRef(true);
  const currentCell = useRef(0);
  const direction = useRef<DirectionType>('top');

  const throwDice = () => {
    const randomNum = Math.floor(Math.random() * 11) + 2;
    setDice(randomNum);
    moveToken(randomNum);
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

  const moveToken = async (주사위눈: number) => {
    for (let i = 주사위눈; i > 0; i--) {
      if (
        (!isStart.current && currentCell.current === 0) ||
        currentCell.current === 6 ||
        currentCell.current === 12 ||
        currentCell.current === 18
      ) {
        direction.current = changeDirection(direction.current);
      }

      switch (direction.current) {
        case 'top':
          coordinates.current.y -= 6;
          tokenRef.current!.style.transform = `translate(${coordinates.current.x}rem, ${coordinates.current.y}rem)`;
          break;
        case 'right':
          coordinates.current.x += 6;
          tokenRef.current!.style.transform = `translate(${coordinates.current.x}rem, ${coordinates.current.y}rem)`;
          break;
        case 'bottom':
          coordinates.current.y += 6;
          tokenRef.current!.style.transform = `translate(${coordinates.current.x}rem, ${coordinates.current.y}rem)`;
          break;
        case 'left':
          coordinates.current.x -= 6;
          tokenRef.current!.style.transform = `translate(${coordinates.current.x}rem, ${coordinates.current.y}rem)`;
          break;
        default:
          break;
      }
      currentCell.current = (currentCell.current + 1) % 24;
      isStart.current = false;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
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
          <RollButton onClick={throwDice}>굴리기</RollButton>
        </Center>
        <PlayerToken ref={tokenRef} />
      </Board>
    </>
  );
}

const Board = styled.div`
  width: 42rem;
  height: 42rem;
  border-color: ${({ theme: { color } }) => color.accentText};
  position: relative;
`;

const Line1 = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: absolute;
  top: 6rem;
  left: 0;

  div {
    border-top: none;
  }
`;

const Line2 = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;

  div {
    border-right: none;
  }
`;

const Line3 = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;

  div {
    border-bottom: none;
  }
`;

const Line4 = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  bottom: 0;
  left: 6rem;

  div {
    border-left: none;
  }
`;

const RollButton = styled.button`
  width: 6rem;
  height: 4rem;
  background-color: grey;
`;

const Center = styled.div`
  width: 30rem;
  height: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 6rem;
  left: 6rem;
`;

const PlayerToken = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;

  transition: all 0.2s;
`;
