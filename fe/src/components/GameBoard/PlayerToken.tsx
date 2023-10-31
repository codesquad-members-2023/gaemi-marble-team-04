import { PlayerType } from '@store/reducer/type';
import { PrimitiveAtom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { DefaultTheme } from 'styled-components/dist/types';

type PlayerTokenWithAtomProps = {
  playerAtom: PrimitiveAtom<PlayerType>;
};

export default function PlayerToken({ playerAtom }: PlayerTokenWithAtomProps) {
  const tokenRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useAtom(playerAtom);

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
      {player.order}
    </Token>
  );
}

const Token = styled.div<{ $order: number }>`
  width: 2rem;
  height: 2rem;
  position: absolute;
  bottom: ${({ $order }) => ($order === 1 || $order === 2 ? 3 : 0.5)}rem;
  left: ${({ $order }) => ($order === 2 || $order === 3 ? 3 : 0.5)}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme, $order }) =>
    theme.color[`player${$order}` as keyof DefaultTheme['color']]};
  transition: transform 0.2s;
`;
