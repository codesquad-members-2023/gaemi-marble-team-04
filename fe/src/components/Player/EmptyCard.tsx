import InviteModal from '@components/Modal/InviteModal/InviteModal';
import { useState } from 'react';
import { styled } from 'styled-components';

export default function EmptyCard() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleInviteModalToggle = () => {
    setInviteModalOpen((prev) => !prev);
  };

  return (
    <>
      <StyledEmptyCard onClick={handleInviteModalToggle}>
        초대하기
      </StyledEmptyCard>
      {inviteModalOpen && <InviteModal handleClose={handleInviteModalToggle} />}
    </>
  );
}

const StyledEmptyCard = styled.button`
  width: 10rem;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  color: ${({ theme }) => theme.color.neutralText};
  background-color: ${({ theme }) => theme.color.neutralBackground};
`;
