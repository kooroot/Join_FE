import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box } from "@mui/system";
import {
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { TypeAnimation } from "react-type-animation";
import "./index.css";
import { ThemeProvider } from "@emotion/react";

const colors = {
  background: "#434654",
  sidebar: "#202123",
  primary: "#f37321",
  secondary: "#f89b6c",
};

function Ruleset() {
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
    <>
      <Box
        sx={{
          height: "80%",
          width: "100%",
          paddingX: "20px",
          paddingY: "40px",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "50px",
          }}
        >
          <SelectDetectors detector={detector} setDetector={setDetector} />
          <Button variant="outlined" onClick={handleGetSlitherResult}>
            Execute
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {/* Slither 결과 */}
          <Box
            sx={{
              height: "50vh",
              width: "100%",
              marginBottom: "40px",
            }}
          >
            <Typography>Result</Typography>
            <OutputBox>
              {preDetoectorResult?.map((item, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    {item.type === "detector" ? (
                      <img
                        src="/hanwha.svg"
                        width={40}
                        height={40}
                        alt="hanwha"
                      />
                    ) : (
                      <img src="/gpt.svg" width={40} height={40} alt="gpt" />
                    )}

                    <Box>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.data}
                      </div>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "18px",
                    }}
                  >
                    {item.type === "detector" && (
                      <ButtonGroup>
                        <Button onClick={handleGetMitigationResult}>
                          Mitigation
                        </Button>
                        <Button>Description</Button>
                      </ButtonGroup>
                    )}
                  </Box>
                </Box>
              ))}

              {output && output.data && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "self-start",
                  }}
                >
                  {output.type === "detector" ? (
                    <img
                      src="/hanwha.svg"
                      width={40}
                      height={40}
                      alt="hanwha"
                    />
                  ) : (
                    <img src="/gpt.svg" width={40} height={40} alt="gpt" />
                  )}
                  <Box>
                    <NewDataTypo
                      data={output.data}
                      callback={() => {
                        setPreDetoectorResult([...preDetoectorResult, output]);
                        setOutput(undefined);
                      }}
                    />
                  </Box>
                </Box>
              )}
            </OutputBox>
            {/* GPT */}
          </Box>
        </Box>
        <Box as="form" onSubmit={handleGPT} sx={{ marginTop: "60px" }}>
          <Box
            sx={{
              display: "flex",
              gap: "18px",
              position: "relative",
              marginTop: "12px",
            }}
          >
            <TextField
              variant="outlined"
              type="text"
              id="gpt"
              name="gpt"
              value={gpt}
              sx={{ flex: 1 }}
              onChange={handleFormGPT}
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{
                position: "absolute",
                right: "10px",
                top: "50%",
                translate: "0 -50%",
                color: "black",
              }}
              onClick={handleGPT}
            >
              {isLoading ? (
                <p
                  style={{
                    color: "white",
                  }}
                >
                  Loading..
                </p>
              ) : (
                <p
                  style={{
                    color: "white",
                  }}
                >
                  Submit
                </p>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function NewDataTypo({ data, callback }) {
  return (
    <TypeAnimation
      omitDeletionAnimation={true}
      style={{
        whiteSpace: "pre-line",
        display: "block",
      }}
      speed={80}
      sequence={[`${data}`, 500, callback]}
    />
  );
}

function OutputBox({ children }) {
  return (
    <Box
      sx={{
        marginTop: "8px",
        height: "100%",
        width: "100%",
        backgroundColor: colors.sidebar,
        border: `1px solid ${colors.primary}`,
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        gap: "20px",
        wordBreak: "break-word",
      }}
    >
      {children}
    </Box>
  );
}

function SelectDetectors({ detector, setDetector }) {
  const onChange = (event) => {
    setDetector(event.target.value);
  };

  const detectors = [
    "ConstantPragma",
    "IncorrectSolc",
    "LockedEther",
    "ConstantFunctionsAsm",
    "ConstantFunctionsState",
    "MissingInheritance",
    "StorageSignedIntegerArray",
    "UninitializedFunctionPtrsConstructor",
    "ABIEncoderV2Array",
    "ArrayByReference",
    "EnumConversion",
    "MultipleConstructorSchemes",
    "PublicMappingNested",
    "ReusedBaseConstructor",
    "IncorrectERC20InterfaceDetection",
    "ArbitrarySendErc20NoPermit",
    "ArbitrarySendErc20Permit",
    "IncorrectERC721InterfaceDetection",
    "UnindexedERC20EventParameters",
    "ArbitrarySendEth",
    "Suicidal",
    "ExternalFunction",
    "UnimplementedFunctionDetection",
    "ProtectedVariables",
    "DomainSeparatorCollision",
    "Codex",
    "CyclomaticComplexity",
    "ModifierDefaultDetection",
    "DeadCode",
    "NamingConvention",
    "LowLevelCalls",
    "UnusedReturnValues",
    "UncheckedTransfer",
    "UncheckedLowLevel",
    "UncheckedSend",
    "VoidConstructor",
    "Timestamp",
    "BadPRNG",
    "EncodePackedCollision",
    "MissingEventsAccessControl",
    "MissingEventsArithmetic",
    "MissingZeroAddressValidation",
    "ReentrancyBenign",
    "ReentrancyReadBeforeWritten",
    "ReentrancyEth",
    "ReentrancyNoGas",
    "ReentrancyEvent",
    "TokenReentrancy",
    "ShadowingAbstractDetection",
    "StateShadowing",
    "LocalShadowing",
    "BuiltinSymbolShadowing",
    "NameReused",
    "RightToLeftOverride",
    "TxOrigin",
    "Assembly",
    "ControlledDelegateCall",
    "MultipleCallsInLoop",
    "IncorrectStrictEquality",
    "DeprecatedStandards",
    "TooManyDigits",
    "TypeBasedTautology",
    "BooleanEquality",
    "BooleanConstantMisuse",
    "DivideBeforeMultiply",
    "UnprotectedUpgradeable",
    "MappingDeletionDetection",
    "ArrayLengthAssignment",
    "RedundantStatements",
    "CostlyOperationsInLoop",
    "AssertStateChange",
    "IncorrectUnaryExpressionDetection",
    "WriteAfterWrite",
    "MsgValueInLoop",
    "DelegatecallInLoop",
    "UninitializedStateVarsDetection",
    "UninitializedStorageVars",
    "UninitializedLocalVars",
    "VarReadUsingThis",
    "UnusedStateVars",
    "CouldBeConstant",
    "CouldBeImmutable",
    "SimilarVarsDetection",
    "FunctionInitializedState",
    "PredeclarationUsageLocal",
    "SuicidalModule",
    "ReentrancyEth",
  ];

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Detectors</InputLabel>
      <Select
        multiple
        value={detector}
        label="Select Ragister"
        onChange={onChange}
      >
        {detectors.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Ruleset;
