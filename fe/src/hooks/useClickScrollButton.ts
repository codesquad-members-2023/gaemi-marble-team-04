import { MutableRefObject, useEffect, useRef, useState } from 'react';

type UseClickScrollButtonProps = {
  width: number;
};

type ReturnType<T extends HTMLElement> = {
  ref: MutableRefObject<T | null>;
  handleClickScroll: (isRight?: boolean) => void;
};

export default function useClickScrollButton<T extends HTMLElement>({
  width,
}: UseClickScrollButtonProps): ReturnType<T> {
  const ref = useRef<T | null>(null);
  const [x, setX] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollLeft = x;
  }, [x]);

  const handleClickScroll = (isRight?: boolean) => {
    if (isRight) {
      setX(ref.current!.scrollLeft + width);
      return;
    }

    setX(ref.current!.scrollLeft - width);
  };

  return { ref, handleClickScroll };
}
