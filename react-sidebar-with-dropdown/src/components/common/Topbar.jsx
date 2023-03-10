import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: "unset",
        ml: sizeConfigs.sidebar.width,
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar>
        <Typography variant="h6">React sidebar with dropdown</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
