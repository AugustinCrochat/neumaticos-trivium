import { useEffect, useRef, useState, type RefObject, type TouchEvent } from "react";

/**
 * Swipe de galería en touch, igual al de ProductImageGallery: la imagen sigue
 * al dedo, la vecina se asoma por el costado y al soltar se asienta (o vuelve).
 * El eje se decide una sola vez: un gesto que arranca vertical es scroll de la
 * página y no se toca.
 *
 * Los handlers van en el contenedor del slide (no en un botón), así el swipe
 * también funciona sobre slides que no son clickeables. Tras un swipe el
 * navegador igual dispara un click: el botón de ampliar debe llamar a
 * `consumeSwipe()` y no abrir nada si devuelve true.
 */
export function useSwipeGallery(
  count: number,
  boxRef: RefObject<HTMLElement | null>,
  thumbsRef: RefObject<HTMLDivElement | null>,
  onChange?: () => void
) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [settling, setSettling] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; w: number; axis: "x" | "y" | null } | null>(null);
  const didSwipeRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wrap = (i: number) => ((i % count) + count) % count;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));

  // La tira de miniaturas se desplaza para dejar la activa a la vista, sin mover la página.
  useEffect(() => {
    const box = thumbsRef.current;
    const thumb = box?.children[safeIndex] as HTMLElement | undefined;
    if (!box || !thumb) return;
    box.scrollTo({ left: thumb.offsetLeft - (box.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [safeIndex]);
  useEffect(() => () => { if (settleTimerRef.current) clearTimeout(settleTimerRef.current); }, []);

  function goTo(next: number) {
    // Un cambio manual (miniatura, flecha) cancela el swipe que estaba asentándose.
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    setSettling(false);
    setDragX(0);
    setIndex(wrap(next));
    onChange?.();
  }

  function onTouchStart(e: TouchEvent) {
    if (settling) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, w: boxRef.current?.offsetWidth ?? 320, axis: null };
  }

  function onTouchMove(e: TouchEvent) {
    const start = touchStartRef.current;
    if (!start || count < 2) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (!start.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (start.axis === "x") setDragX(dx);
  }

  function onTouchEnd() {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || start.axis !== "x") return;
    didSwipeRef.current = true;
    const passed = Math.abs(dragX) > Math.min(start.w * 0.2, 80);
    const dir = dragX < 0 ? 1 : -1;
    setSettling(true);
    setDragX(passed ? -dir * start.w : 0);
    settleTimerRef.current = setTimeout(() => {
      if (passed) goTo(safeIndex + dir);
      setSettling(false);
      setDragX(0);
    }, 220);
  }

  /** true si el click que llega es el que dispara el navegador al soltar un swipe. */
  function consumeSwipe() {
    if (!didSwipeRef.current) return false;
    didSwipeRef.current = false;
    return true;
  }

  const peekIndex = dragX !== 0 && count > 1 ? wrap(safeIndex + (dragX < 0 ? 1 : -1)) : null;

  return {
    index: safeIndex,
    goTo,
    dragX,
    settling,
    peekIndex,
    consumeSwipe,
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
  };
}
