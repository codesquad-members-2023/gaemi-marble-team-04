import { forwardRef } from 'react';
import { styled } from 'styled-components';
import { DefaultTheme } from 'styled-components/dist/types';

type PlayerTokenProps = {
  order: number;
};

const PlayerToken = forwardRef<HTMLDivElement, PlayerTokenProps>(
  function PlayerToken({ order }, ref) {
    return (
      <Token ref={ref} $order={order}>
        {order}
      </Token>
    );
  }
);

export default PlayerToken;

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
