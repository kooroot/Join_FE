import * as React from "react";
import { useState } from "react";
import Detect from "./Detect";
import Ruleset from "./Ruleset";
import Simil from "./Simil";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, styled } from "@mui/system";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";

import Tabs from "@mui/base/Tabs";
import TabsList from "@mui/base/TabsList";
import TabPanel from "@mui/base/TabPanel";
import { buttonClasses } from "@mui/base/Button";
import Tab, { tabClasses } from "@mui/base/Tab";

import { TypeAnimation } from "react-type-animation";
import "./index.css";
import { ThemeProvider } from "@emotion/react";

const colors = {
  background: "#434654",
  sidebar: "#202123",
  primary: "#f37321",
  secondary: "#f89b6c",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledTab = styled(Tab)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #f89b6c;
    color: #202123;
  }

  &.${tabClasses.selected} {
    background-color: #f37321;
    color: #202123;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const StyledTabsList = styled(TabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: #434654;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  `
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f37321",
    },
    secondary: {
      main: "#f89b6c",
    },
    sub: {
      main: "#fbb584",
    },
  },
});

function App() {
  // reload, 페이지 이동 시 상태 초기화
  // useState -> 상태관리 : 변수, set* -> 변수값 변경
  const [output, setOutput] = useState();
  const [mitigationResult, setMitigationResult] = useState();

  const [preDetoectorResult, setPreDetoectorResult] = useState([]);
  const [preMitigationResult, setPreMitigationResult] = useState([]);

  const [detector, setDetector] = useState(["Reentrancy"]);
  const [gpt, setGpt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSlitherResult = async () => {
    const data = await axios.post("http://localhost:3001/detector", {
      rule: detector,
    });
    setOutput({ type: "detector", data: data.data });
  };

  const handleGetMitigationResult = async () => {
    const data = await axios.get("http://localhost:3001/mitigation");
    setMitigationResult(data);
  };

  const handleFormGPT = (event) => {
    event.preventDefault(); // do not refresh
    setGpt(event.target.value);
  };

  const handleGPT = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const data = await axios.post(
      "http://localhost:3001/gpt",
      JSON.stringify({ text: gpt }), // {name:value} -> "{name:value}"
      {
        headers: {
          "Content-Type": `application/json`,
        },
      }
    );
    setOutput({ type: "gpt", data: data.data });
    setGpt("");
    setIsLoading(false);
  };

  return (
    <div className="App">
      {/* Dark Mode in MUI: MUI UI를 다크모드일 때 하얀색으로 변경돼서 다크모드로 변경함 */}
      <ThemeProvider theme={darkTheme}>
        {/* flex : _ _ -> | | */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
          }}
        >
          {/* Box === div , aside도 HTML에서 머하는 역할은지 명시하기 위한 것*/}
          {/* SIDEBAR */}
          <Box
            as="aside"
            sx={{
              width: "250px",
              backgroundColor: colors.sidebar,
            }}
          >
            <Stack>
              <RegisterRuleDialogAndButton />
            </Stack>
          </Box>
          <Box
            as="main"
            sx={{
              backgroundColor: colors.background,
              flex: 1,
              color: "white",
            }}
          >
            {/* header */}
            <Box
              as="header"
              sx={{
                paddingY: "12px",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                join v0.1
              </Typography>
            </Box>
            {/*  */}
            <Tabs defaultValue={1}>
              <StyledTabsList
                sx={{
                  width: "100%",
                  paddingX: "20px",
                }}
              >
                <StyledTab value={1}>Rule Set</StyledTab>
                <StyledTab value={2}>Detect</StyledTab>
                <StyledTab value={3}>Simil</StyledTab>
              </StyledTabsList>
              <StyledTabPanel value={1}>
                <Ruleset />
              </StyledTabPanel>
              <StyledTabPanel value={2}>
                <Detect />
              </StyledTabPanel>
              <StyledTabPanel value={3}>
                <Simil />
              </StyledTabPanel>
            </Tabs>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

function RegisterRuleDialogAndButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        sx={{
          justifyContent: "start",
          color: "white",
        }}
        onClick={handleClickOpen}
      >
        Register RUle
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "#111111",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
          }}
        >
          Register Rule
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "white",
            }}
          >
            Rule의 경로를 추가해주세요
          </DialogContentText>
          <Box
            as="form"
            sx={{
              marginTop: "12px",
            }}
          >
            <TextField
              id="path"
              autoFocus
              type="text"
              inputProps={{
                style: { color: "white" },
              }}
              sx={{
                width: "500px",
                "& fieldset": {
                  borderColor: "white",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Register</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
