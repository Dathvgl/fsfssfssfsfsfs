import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton } from "@mui/material";

type ActionsBadgeProps = {
  total?: number;
  size?: "small" | "medium" | "large";
};

function ActionsBadge(props: ActionsBadgeProps) {
  const { total, size } = props;

  return (
    <div className="row-center">
      <IconButton size={size} color="inherit">
        <Badge badgeContent={total} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </div>
  );
}

export default ActionsBadge;
