import {
  PlayerTokenAtom,
  usePlayerToken1,
  usePlayerToken2,
  usePlayerToken3,
  usePlayerToken4,
} from '@store/playerToken';
import { useGameInfo } from '@store/reducer';
import { GameActionType } from '@store/reducer/type';
import useGameReducer from '@store/reducer/useGameReducer';
import { delay } from '@utils/index';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';
import useWebSocket from 'react-use-websocket';
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

const WS_URL = 'ws://localhost:8080';

export default function GameBoard() {
  const tokenRef1 = useRef<HTMLDivElement>(null);
  // const tokenRef2 = useRef<HTMLDivElement>(null);
  // const tokenRef3 = useRef<HTMLDivElement>(null);
  // const tokenRef4 = useRef<HTMLDivElement>(null);
  const reactDice = useRef<ReactDiceRef>(null);

  const [gameInfo] = useGameInfo();
  const [token1, setToken1] = usePlayerToken1();
  // const [token2, setToken2] = usePlayerToken2();
  // const [token3, setToken3] = usePlayerToken3();
  // const [token4, setToken4] = usePlayerToken4();

  const { dispatch } = useGameReducer();
  const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
  });

  // dependency에 dispatch 추가시 무한렌더링
  useEffect(() => {
    if (lastMessage !== null) {
      const messageFromServer = JSON.parse(lastMessage?.data);
      dispatch({
        type: messageFromServer.type as keyof GameActionType,
        payload: messageFromServer.data,
      });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (gameInfo.dice[0] === 0 || gameInfo.dice[1] === 0) return;
    rollDice(gameInfo.dice[0], gameInfo.dice[1]);
  }, [gameInfo.dice]);

  const rollDone = () => {
    moveToken(
      gameInfo.dice[0] + gameInfo.dice[1],
      tokenRef1,
      token1,
      setToken1
    );
  };

  const rollDice = (dice1: number, dice2: number) => {
    reactDice.current?.rollAll([dice1, dice2]);
  };

  const throwDice = () => {
    const message = JSON.stringify({
      type: 'dice',
      gameId: 1,
      playerId: 'fuse12',
    });
    sendMessage(message);
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

  const moveToken = useCallback(
    async (
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
    },
    []
  );

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
          <span>주사위 결과: {`${gameInfo.dice[0]}, ${gameInfo.dice[1]}`}</span>
          <ReactDice
            numDice={2}
            ref={reactDice}
            rollDone={rollDone}
            rollTime={0.5}
            faceColor="#fff"
            dotColor="#000"
            disableIndividual={true}
          />
          <RollButton onClick={() => throwDice()}>주사위1</RollButton>
        </Center>
        <PlayerToken ref={tokenRef1} order={1} />
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
