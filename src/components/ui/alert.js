import * as React from "react";

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-900",
    success: "bg-green-100 text-green-900",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };