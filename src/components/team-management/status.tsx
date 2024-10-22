import { Badge } from "../ui/badge";

export type Status = "pending" | "confirmed" | "canceled";

interface StatusProps {
  status: Status;
}

export function Status(props: StatusProps) {
  const { status } = props;

  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    canceled: "Canceled",
  };

  const statusColorMap = {
    pending: "notice",
    confirmed: "success",
    canceled: "warning",
  } as const;

  return (
    <Badge className="px-2 py-1 w-fit" variant={statusColorMap[status]}>
      {statusMap[status]}
    </Badge>
  );
}
