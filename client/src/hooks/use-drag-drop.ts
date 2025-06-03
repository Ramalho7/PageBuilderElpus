import { useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';

export interface DragItem {
  type: string;
  elementType?: string;
  id?: string;
}

export function useDragDrop(
  onDropElement: (elementType: string) => void,
  canDrop: boolean = true
) {
  const [{ isOver, canDropHere }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: DragItem) => {
      if (item.elementType) {
        onDropElement(item.elementType);
      }
    },
    canDrop: () => canDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropHere: monitor.canDrop(),
    }),
  }), [onDropElement, canDrop]);

  return {
    drop,
    isOver,
    canDropHere,
  };
}

export function useDragComponent(elementType: string) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type: 'COMPONENT', elementType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [elementType]);

  return {
    drag,
    isDragging,
  };
}
