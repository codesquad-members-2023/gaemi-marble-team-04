import { Icon } from '@components/icon/Icon';
import { ANT_LIST } from '@pages/constants';
import { PlayerType } from '@store/reducer/type';
import { PrimitiveAtom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

type PlayerTokenWithAtomProps = {
  playerAtom: PrimitiveAtom<PlayerType>;
};

export default function PlayerToken({ playerAtom }: PlayerTokenWithAtomProps) {
  const tokenRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useAtom(playerAtom);
  const antName = ANT_LIST.find((ant) => ant.order === player?.order)!.antName;

  useEffect(() => {
    setPlayer((prev) => {
      return {
        ...prev,
        gameboard: {
          ...prev.gameboard,
          ref: tokenRef,
        },
      };
    });
  }, [setPlayer]);

  if (player.playerId === '') return null;

  return (
    <Token ref={tokenRef} $order={player.order}>
      <Icon name={antName} size="2.5rem" />
    </Token>
  );
}

const Token = styled.div<{ $order: number }>`
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  bottom: ${({ $order }) => ($order === 1 || $order === 2 ? 3 : 0.5)}rem;
  left: ${({ $order }) => ($order === 2 || $order === 3 ? 3 : 0.5)}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.accentTertiary};
  transition: transform 0.2s;
`;
