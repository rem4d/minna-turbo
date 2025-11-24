export const getPosition = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
) => {
  if ("touches" in event) {
    return { x: event.touches[0]?.clientX, y: event.touches[0]?.clientY };
  }
  return { x: event.clientX, y: event.clientY };
};

export function isMouseEvent(event: any) {
  return event.nativeEvent instanceof MouseEvent;
}

export function isTouchEvent({ nativeEvent }: { nativeEvent: any }) {
  return nativeEvent instanceof TouchEvent;
}
