/** The system's wireframe frame: a hairline border plus four crosshair
 * registration marks drawn just outside each corner. */
export function Blueprint({
  as: As = "div",
  className = "",
  children,
  ref,
  ...rest
}: {
  as?: "div" | "span";
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <As ref={ref} className={`relative border border-divider ${className}`} {...rest}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      {children}
    </As>
  );
}
