import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const CardSummaryDashboard = ({
  title = "Total",
  value,
  renderValue,
  isLoading = false,
  icon: Icon,
  action,
  footer,
  className = "",
  descriptionClassName = "",
  titleClassName = "",
  footerClassName = "",
}) => {
  const content = renderValue ? renderValue() : value;

  return (
    <Card className={`relative ${className} `}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Summary Data {title}</CardDescription>
        <CardAction>{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}</CardAction>
      </CardHeader>

      <CardContent className="p-2 ">
        <div className={`text-2xl font-bold px-3 py-1 ${titleClassName}`}>{isLoading ? "..." : content}</div>
      </CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

export default CardSummaryDashboard;

export const ListDataRenderer = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, val]: any) => (
        <div key={key} className="flex items-center justify-between gap-3 rounded-md px-3 py-1 transition-colors">
          <span className="font-medium text-foreground truncate flex-1 text-xs">{key}</span>
          <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold tabular-nums">
            {val}
          </span>
        </div>
      ))}
    </div>
  );
};
