import { forwardRef } from 'react';
import { styled } from 'styled-components';

type PlayerTokenProps = {
  order: number;
};

const PlayerToken = forwardRef<HTMLDivElement, PlayerTokenProps>(
  function PlayerToken({ order }, ref) {
    switch (order) {
      case 1:
        return <Token1 ref={ref}>{order}</Token1>;
      case 2:
        return <Token2 ref={ref}>{order}</Token2>;
      case 3:
        return <Token3 ref={ref}>{order}</Token3>;
      case 4:
        return <Token4 ref={ref}>{order}</Token4>;
    }
  }
);

export default PlayerToken;

const Token = styled.div`
  width: 2rem;
  height: 2rem;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: transform 0.2s;
`;

const Token1 = styled(Token)`
  bottom: 3rem;
  left: 0.5rem;
  background-color: ${({ theme: { color } }) => color.player1};
`;

const Token2 = styled(Token)`
  bottom: 3rem;
  left: 3rem;
  background-color: ${({ theme: { color } }) => color.player2};
`;

const Token3 = styled(Token)`
  bottom: 0.5rem;
  left: 3rem;
  background-color: ${({ theme: { color } }) => color.player3};
`;

const Token4 = styled(Token)`
  bottom: 0.5rem;
  left: 0.5rem;
  color: black;
  background-color: ${({ theme: { color } }) => color.player4};
`;
