import { useState } from 'react';
import { styled } from 'styled-components';

type InviteModalContentProps = {
  handleClose: () => void;
};

export default function InviteModalContent({
  handleClose,
}: InviteModalContentProps) {
  const [playerId, setPlayerId] = useState('');

  const handleChangePlayerId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(e.target.value);
  };

  const handleInvite = () => {
    // Todo: 버전업시 친구 초대 기능 추가
    console.log('초대 아이디', playerId);
    handleClose();
  };

  return (
    <Content>
      <Input value={playerId} onChange={handleChangePlayerId} />
      <Button onClick={handleInvite}>초대하기</Button>
    </Content>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0 0.5rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
`;

const Button = styled.button`
  width: 10rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ theme: { color } }) => `1px solid ${color.neutralTextStrong}`};
  border-radius: ${({ theme: { radius } }) => radius.medium};
  font-size: ${({ theme: { fontSize } }) => fontSize.small};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme: { color } }) => color.accentPrimary};
    color: ${({ theme: { color } }) => color.accentText};
    background-color: ${({ theme: { color } }) => color.accentBackground};
  }
`;
