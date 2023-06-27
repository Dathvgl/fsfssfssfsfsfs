import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesSharpIcon from "@mui/icons-material/AutoStoriesSharp";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material";
import { Link } from "@tanstack/router";
import { ReactNode } from "react";

function CustomInfo(props: { title: string; icon: ReactNode }) {
  const { title, icon } = props;

  return (
    <>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </>
  );
}

export const MainList = () => {
  return (
    <>
      <Link to="/">
        <CustomInfo title="Home" icon={<DashboardIcon />} />
      </Link>
      <Link to="/todo">
        <CustomInfo title="Todo" icon={<PlaylistAddCheckIcon />} />
      </Link>
      <Link to="/manga">
        <CustomInfo title="Manga" icon={<AutoStoriesSharpIcon />} />
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>
    </>
  );
};

export const SecondList = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </>
);
