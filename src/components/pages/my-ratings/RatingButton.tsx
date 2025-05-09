import Link from "next/link";

type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  asChild?: boolean;
  className?: string;
};

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & {
    asChild: true;
    href: string;
  };

type ButtonAsButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: false;
  };

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

export function RatingButton({
  children,
  variant = "outline",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  if (asChild) {
    const { href, ...rest } = props as ButtonAsLinkProps;
    return (
      <Link
        href={href}
        {...rest}
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
          ${variant === "outline" ? "border border-border hover:bg-muted" : "bg-primary hover:bg-primary/50 text-foreground"}
          ${size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 py-2"}
        `}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...(props as ButtonAsButtonProps)}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
        ${variant === "outline" ? "border border-border hover:bg-muted" : "bg-primary hover:bg-primary/50 text-foreground"}
        ${size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 py-2"}
      `}
    >
      {children}
    </button>
  );
}
