import { usePlayerId } from '@store/index';
import {
  PlayerTokenAtom,
  usePlayerToken1,
  usePlayerToken2,
  usePlayerToken3,
  usePlayerToken4,
} from '@store/playerToken';
import { useGameInfo, usePlayersValue } from '@store/reducer';
import { delay } from '@utils/index';
import {
  ForwardedRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';
import { useParams } from 'react-router-dom';
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

type GameBoardProps = {
  sendJsonMessage: ReturnType<typeof useWebSocket>['sendJsonMessage'];
};

export default function GameBoard({ sendJsonMessage }: GameBoardProps) {
  const tokenRef1 = useRef<HTMLDivElement | null>(null);
  const tokenRef2 = useRef<HTMLDivElement | null>(null);
  const tokenRef3 = useRef<HTMLDivElement | null>(null);
  const tokenRef4 = useRef<HTMLDivElement | null>(null);
  const reactDice = useRef<ReactDiceRef>(null);

  const { gameId } = useParams();

  const playerId = usePlayerId();
  const players = usePlayersValue();
  const [gameInfo] = useGameInfo();
  const [token1, setToken1] = usePlayerToken1();
  const [token2, setToken2] = usePlayerToken2();
  const [token3, setToken3] = usePlayerToken3();
  const [token4, setToken4] = usePlayerToken4();

  const tokenList: {
    [key: number]: {
      atom: PlayerTokenAtom;
      setAtom: (
        updateFunction: (prev: PlayerTokenAtom) => PlayerTokenAtom
      ) => void;
    };
  } = {
    1: { atom: token1, setAtom: setToken1 },
    2: { atom: token2, setAtom: setToken2 },
    3: { atom: token3, setAtom: setToken3 },
    4: { atom: token4, setAtom: setToken4 },
  };

  useEffect(() => {
    if (gameInfo.dice[0] === 0 || gameInfo.dice[1] === 0) return;
    rollDice(gameInfo.dice[0], gameInfo.dice[1]);
  }, [gameInfo.dice]);

  const rollDone = () => {
    const targetPlayer = players.find(
      (player) => player.playerId === gameInfo.currentPlayerId
    );

    if (!targetPlayer) return;

    const targetTokenAtom = tokenList[targetPlayer.order].atom;
    const setTargetTokenAtom = tokenList[targetPlayer.order].setAtom;
    moveToken(
      gameInfo.dice[0] + gameInfo.dice[1],
      targetPlayer.tokenRef,
      targetTokenAtom,
      setTargetTokenAtom
    );
  };

  const rollDice = (dice1: number, dice2: number) => {
    reactDice.current?.rollAll([dice1, dice2]);
  };

  const throwDice = () => {
    const message = {
      type: 'dice',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  const endTurn = () => {
    const message = {
      type: 'endTurn',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  const moveToNextCell = (
    x: number,
    y: number,
    tokenRef: ForwardedRef<HTMLDivElement>,
    tokenAtom: PlayerTokenAtom
  ) => {
    if (!tokenRef) return;
    const ref = tokenRef as MutableRefObject<HTMLDivElement>;
    tokenAtom.coordinates.x += x;
    tokenAtom.coordinates.y += y;
    ref.current.style.transform = `translate(${tokenAtom.coordinates.x}rem, ${tokenAtom.coordinates.y}rem)`;
  };

  const moveToken = useCallback(
    async (
      diceCount: number,
      tokenRef: ForwardedRef<HTMLDivElement>,
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
          {playerId === gameInfo.currentPlayerId && (
            <>
              <Button onClick={() => throwDice()}>굴리기</Button>
              <Button onClick={() => endTurn()}>턴종료</Button>
            </>
          )}
        </Center>
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

const Button = styled.button`
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
