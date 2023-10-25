import { getCell, postBuy, postEnter, postReady, postSell } from '@api/ws';
import useOutsideClick from '@hooks/useOutsideClick';
import useGameReducer from '@store/reducer/useGameReducer';
import { styled } from 'styled-components';
import Modal from './Modal';

type PlayerTestModalProps = {
  handleClose: () => void;
};

export default function PlayerTestModal({ handleClose }: PlayerTestModalProps) {
  const { ref: testModalRef } = useOutsideClick<HTMLDivElement>(handleClose);
  const { dispatch } = useGameReducer();

  const handleEnter = async () => {
    const res = await postEnter('fuse12');

    if (res.status === 201) {
      dispatch({ type: res.data.type, payload: res.data.data });
    }
  };

  const handleReady = async () => {
    const res = await postReady({
      type: 'ready',
      gameId: 1,
      playerId: 'fuse12',
      isReady: true,
    });

    if (res.status === 201) {
      dispatch({ type: res.data.type, payload: res.data.data });
    }
  };

  const handleBuy = async () => {
    const res = await postBuy({
      type: 'buy',
      gameId: 1,
      playerId: 'fuse12',
      stockName: 'Google',
      count: 20,
    });

    if (res.status === 201) {
      dispatch({ type: res.data.type, payload: res.data.data });
    }
  };

  const handleSell = async () => {
    const res = await postSell({
      type: 'sell',
      gameId: 1,
      playerId: 'fuse12',
      stockList: [
        {
          name: 'Google',
          count: 10,
        },
      ],
    });

    if (res.status === 201) {
      dispatch({ type: res.data.type, payload: res.data.data });
    }
  };

  const handleCell = async () => {
    const res = await getCell();

    if (res.status === 200) {
      dispatch({ type: res.data.type, payload: res.data.data });
    }
  };

  return (
    <Modal
      ref={testModalRef}
      header="reducer 테스트"
      content={
        <PlayerTestModalContent>
          <Button onClick={handleEnter}>유저 입장</Button>
          <Button onClick={handleReady}>유저 준비</Button>
          <Button onClick={handleBuy}>주식 구매</Button>
          <Button onClick={handleSell}>주식 판매</Button>
          <Button onClick={handleCell}>칸 도착</Button>
        </PlayerTestModalContent>
      }
    />
  );
}

const PlayerTestModalContent = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  width: 3rem;
  border-radius: ${({ theme }) => theme.radius.small};
  color: ${({ theme }) => theme.color.accentText};
  background-color: ${({ theme }) => theme.color.accentPrimary};
`;
