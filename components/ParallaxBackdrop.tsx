/**
 * Mobile-only stand-in for `background-attachment: fixed`. iOS WebKit (every
 * browser on iPhone, Chrome included) never reliably supports that property
 * and silently falls back to `scroll`, so below the `sm` breakpoint we use
 * this CSS-only trick instead: a viewport-height layer that sticks to the
 * top of the viewport, with a matching negative bottom margin so it doesn't
 * push sibling content down. Pure CSS/compositor-driven — no scroll
 * listeners, so no scroll jank. Desktop/tablet keep plain `bg-fixed` on the
 * section itself; this component is hidden there (`sm:hidden`).
 */
export default function ParallaxBackdrop({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="sm:hidden sticky top-0 h-dvh bg-cover bg-center"
      style={{ backgroundImage: `url('${src}')`, marginBottom: '-100dvh' }}
    />
  );
}
