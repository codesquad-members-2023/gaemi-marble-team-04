import { Dim } from '@styles/common';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';

type ModalProps = {
  ref: LegacyRef<HTMLDivElement>;
  header: string;
  content: React.ReactNode;
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ header, content }, ref) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);

    useEffect(() => {
      const modalElement = modalRef.current;
      const modalWidth = modalElement!.clientWidth;
      const modalHeight = modalElement!.clientHeight;

      setLeft(modalWidth / 2);
      setTop(modalHeight / 2);
    }, [ref]);

    return createPortal(
      <Dim>
        <StyledModal ref={ref} $left={left} $top={top}>
          <ModalContainer ref={modalRef}>
            <ModalHeader>{header}</ModalHeader>
            {content}
          </ModalContainer>
        </StyledModal>
      </Dim>,
      document.getElementById('modal-root')!
    );
  }
);

const StyledModal = styled.div<{ $left: number; $top: number }>`
  min-width: 20rem;
  position: fixed;
  top: ${({ $top }) => `calc(50% - ${$top}px)`};
  left: ${({ $left }) => `calc(50% - ${$left}px)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-radius: ${({ theme: { radius } }) => radius.medium};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition:
    top 0.3s,
    left 0.3s;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const ModalHeader = styled.span`
  font-size: ${({ theme: { fontSize } }) => fontSize.small};
`;

export default Modal;
