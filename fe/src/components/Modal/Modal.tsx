import { Dim } from '@styles/common';
import React, { LegacyRef } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';

type ModalProps = {
  ref: LegacyRef<HTMLDivElement>;
  header: string;
  content: React.ReactNode;
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ header, content }, ref) => {
    return createPortal(
      <Dim>
        <StyledModal ref={ref}>
          <ModalHeader>{header}</ModalHeader>
          {content}
        </StyledModal>
      </Dim>,
      document.getElementById('modal-root')!
    );
  }
);

const StyledModal = styled.div`
  min-width: 20rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  border-radius: ${({ theme: { radius } }) => radius.medium};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.span`
  font-size: ${({ theme: { fontSize } }) => fontSize.sMedium};
`;

export default Modal;
