export const getPosition = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
) => {
  if ("touches" in event) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  return { x: event.clientX, y: event.clientY };
};

export function isMouseEvent(event) {
  return event.nativeEvent instanceof MouseEvent;
}

export function isTouchEvent({ nativeEvent }) {
  return window.TouchEvent
    ? nativeEvent instanceof TouchEvent
    : "touches" in nativeEvent;
}
