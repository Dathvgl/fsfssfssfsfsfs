import { Copyright } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Grid, Paper, Typography } from "@mui/material";
import CustomBox from "~/components/CustomBox";
import CustomModalFloat from "~/components/CustomModalFloat";
import Chart from "./components/Chart";
import Deposits from "./components/Deposits";
import Orders from "./components/Orders";

function HomeRoute() {
  return (
    <CustomBox>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <div className="h-20 relative cutoff">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque posuere nunc a leo aliquet, et sagittis lectus
              varius. Mauris tempus consectetur gravida. Sed consequat, arcu ut
              molestie egestas, massa ipsum iaculis arcu, sit amet tempus urna
              elit ut nulla. Vivamus nec felis quis dui tempor posuere. Nam
              sagittis vitae quam nec condimentum. Curabitur in est ut neque
              rhoncus tincidunt. Nullam sed porta quam, at dignissim enim.
              Maecenas varius commodo augue, eget scelerisque lacus sodales sit
              amet. Etiam aliquet magna eu laoreet condimentum. Ut placerat
              semper dictum. Vivamus egestas dolor sit amet odio vestibulum
              pulvinar. Phasellus at sodales lectus. Vestibulum quam eros,
              porttitor eu bibendum ac, accumsan nec dolor. Proin congue ex non
              pretium consequat. Suspendisse lorem sapien, vestibulum sed justo
              id, auctor luctus nisl. Donec porttitor erat sed risus ullamcorper
              pharetra. Nunc cursus nibh nisl, sed consectetur ante pharetra
              nec. Nunc ullamcorper aliquam sapien non viverra. Nam vulputate eu
              sem id tempus. Mauris vel pellentesque neque. Aliquam bibendum
              posuere consequat. Integer purus massa, tincidunt sed pharetra
              nec, lacinia eget leo. Nunc eleifend lacus eu elit efficitur, id
              consectetur quam interdum.
            </div>
            <input className="cutoff-btn" type="checkbox" />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
      <CustomModalFloat icon={<AddIcon />}>
        <Typography id="transition-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </CustomModalFloat>
    </CustomBox>
  );
}

export default HomeRoute;
