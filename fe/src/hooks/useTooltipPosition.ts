import { MutableRefObject, useRef, useState } from 'react';

type ReturnType<T extends HTMLElement> = {
  positionRef: MutableRefObject<T | null>;
  position: {
    top?: number | null;
    right?: number | null;
    bottom?: number | null;
    left?: number | null;
  };
  calcPosition: (e: React.MouseEvent) => void;
};

export default function useTooltipPosition<
  T extends HTMLElement,
>(): ReturnType<T> {
  const positionRef = useRef<T | null>(null);
  const [position, setPosition] = useState<ReturnType<T>['position']>({});

  const calcPosition = (e: React.MouseEvent) => {
    const refPositionInfo = positionRef.current?.getBoundingClientRect();

    const halfOfX = window.innerWidth / 2;

    const y = e.clientY;

    const height = refPositionInfo!.height;

    const left = refPositionInfo!.left;
    const right = window.innerWidth - refPositionInfo!.right;
    const top = refPositionInfo!.top + height;
    const bottom = window.innerHeight - refPositionInfo!.bottom + height;

    const isOverY = y > window.innerHeight - height;

    setPosition({
      left: halfOfX ? null : left,
      right: halfOfX ? right : null,
      top: isOverY ? null : top,
      bottom: isOverY ? bottom : null,
    });
  };

  return { positionRef, position, calcPosition };
}
