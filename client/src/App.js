import React, { createContext, useState, useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import "./App.css";
import Button from "@mui/material/Button";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacitySharpIcon from "@mui/icons-material/OpacitySharp";
import { io } from "socket.io-client";
const styleL = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const styleD = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#fff",
  bgcolor: "#100b30",
  boxShadow: 24,
  p: 4,
};

const ThemeContext = createContext();

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const api = "https://mui.anuchadev.com";

export default function App() {
  const [checked, setChecked] = useState(true);
  const [lable, setLable] = useState();
  const [theme, setTheme] = useState("dark");
  const [unlock, setUnlock] = useState(false);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
    theme === "light" ? setLable("Light Mode") : setLable("Dark Mode");
  };

  const handleChange = (data, stateSw) => {
    var state = stateSw;
    if (stateSw === true) {
      state = 1;
    } else {
      state = 0;
    }
    axios.get(api + "/updatestatesw/" + data + "/" + state).then((res) => {
      console.log(res);
    });
  };

  const [open, setOpen] = useState(false);
  // openPass
  const [swID, setSwID] = useState();
  const [swName, setSwName] = useState();
  const [swTimeOn, setSwTimeOn] = useState();
  const [swTimeOff, setSwTimeOff] = useState();
  const [random, setRandom] = useState();

  const handleOpen = (data, name, timeOn, timeOff) => {
    setSwID(data);
    setSwName(name);
    setSwTimeOn(timeOn);
    setSwTimeOff(timeOff);
    setOpen(true);
  };

  const [time, setTime] = useState("fetching");

  const [swStateIO, setSwStateIO] = useState();
  const [swDataIO, setSwDataIO] = useState();
  const [swRialIO, setSwRialIO] = useState();

  useEffect(() => {
    getdata();
    getDataTem();

    const socket = io("https://mui.anuchadev.com");

    socket.on("connect", () => console.log(socket.id));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("sw-state", (data) => {
      console.log(data);
    });

    socket.on("sw-data", (data) => setSwDataIO(data));
    socket.on("data-rial", (data) => {
      setDataTem(data.tem);
      setDataHum(data.hum);
    });
    socket.on("disconnect", () => setTime("server disconnected"));
    console.log(swStateIO);
    console.log(swDataIO);
    console.log(swRialIO);
  }, [random]);

  const [dataSW, setDataSW] = useState([]);

  const getdata = () => {
    axios.get(api + "/getswdata").then((res) => {
      const { data } = res;
      setDataSW(data.data);
      console.log("device_id", data.data);
    });
  };

  const [dataTem, setDataTem] = useState([]);
  const [dataHum, setDataHum] = useState([]);
  const [timeShow, setTimeShow] = useState();
  const getDataTem = () => {
    axios.get(api + "/getrialdata").then((res) => {
      const { data } = res;
      setDataTem(data.data[0].raildata_tem);
      setDataHum(data.data[0].raildata_hum);
      var dt = data.data[0].raildata_date;
      console.log(dt.toString("YYYY-MM-dd"));
    });
  };

  console.log("dataTem", dataTem);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <div className="nav">
          <div class="container-xl">
            <div className="row">
              <div className="col-sm-5">
                {" "}
                <div className="d-flex tt">
                  <div style={{ marginTop: -10, marginRight: 10 }}>
                    <AgricultureIcon sx={{ fontSize: 40 }} />
                  </div>
                  <div>
                    <h2>Smart Farm System</h2>{" "}
                  </div>
                </div>
              </div>
              <div className="col-sm"></div>
              <div className="col-sm-3">
                <div className="tt" style={{ justifyContent: "end" }}>
                  {theme === "light" ? "Light Mode" : "Dark Mode"}
                  &emsp;
                  <FormGroup>
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      onChange={toggleTheme}
                    />
                  </FormGroup>
                  {unlock ? (
                    <LockOpenOutlinedIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setUnlock(false)}
                    />
                  ) : (
                    <LockOutlinedIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpen("lock")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container-xl">
          <div className="row">
            <div className="col-sm-5 p-2 ">
              <div className="head main">
                <div style={{ display: "block", padding: 20 }}>
                  <img
                    style={{ width: "100%", marginBottom: 15 }}
                    src="https://www.weruwan.ac.th/img/logo.png"
                  />
                  <hr />
                  <img
                    style={{ width: "100%" }}
                    src="https://devcm.info/img/logo.png"
                  />
                </div>
              </div>
            </div>

            <div className="col-sm p-2 ">
              <div className="head main">
                <div
                  style={{ display: "block", padding: 20, textAlign: "center" }}
                >
                  <h1>
                    <ThermostatIcon sx={{ fontSize: 45 }} />
                    temperature
                  </h1>
                  <br />
                  <h1>{dataTem} °C</h1>
                  <br />
                </div>
              </div>
            </div>

            <div className="col-sm p-2 ">
              <div className="head main">
                <div
                  style={{ display: "block", padding: 20, textAlign: "center" }}
                >
                  <h1>
                    <OpacitySharpIcon sx={{ fontSize: 40 }} />
                    humidity
                  </h1>
                  <br />
                  <h1>{dataHum} %</h1>
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {dataSW.map((index, key) => {
              return (
                <div className="col-sm-3 p-2">
                  <div className="main p-3">
                    <div className="sw">
                      <div style={{ flexGrow: 1 }}>
                        {theme === "light" ? "ON" : "OFF"}
                      </div>

                      <FormGroup>
                        {index.device_state === 1 ? (
                          <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            onChange={(event) => {
                              if (unlock === true) {
                                setChecked(event.target.checked);
                                handleChange(
                                  index.device_id,
                                  !index.device_state
                                );
                                return;
                              } else {
                                return (
                                  <script>
                                    function myFunction(){" "}
                                    {alert("Please unlock py password")}
                                  </script>
                                );
                              }
                            }}
                          />
                        ) : (
                          <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} />}
                            onChange={(event) => {
                              setChecked(event.target.checked);
                              handleChange(
                                index.device_id,
                                !index.device_state
                              );
                            }}
                          />
                        )}
                      </FormGroup>
                    </div>
                    <hr />
                    <div className="sw ">
                      <p style={{ flexGrow: 1 }}>Device Name :</p>
                      <p style={{ marginRight: "1.5rem" }}>
                        {index.device_name}
                      </p>
                    </div>

                    <div className="sw ">
                      <p style={{ flexGrow: 1 }}>Time Start :</p>
                      <p style={{ marginRight: "1.5rem" }}>
                        {index.device_time_on1}
                      </p>
                    </div>

                    <div className="sw ">
                      <p style={{ flexGrow: 1 }}>Time End :</p>
                      <p style={{ marginRight: "1.5rem" }}>
                        {index.device_time_off1}
                      </p>
                    </div>
                    <div className="sw ">
                      <div style={{ flexGrow: 1 }}></div>
                      <div style={{ marginRight: "1.5rem" }}>
                        <Button
                          variant="outlined"
                          startIcon={<SettingsIcon />}
                          onClick={() =>
                            handleOpen(
                              index.device_id,
                              index.device_name,
                              index.device_time_on1,
                              index.device_time_off1
                            )
                          }
                        >
                          Setting
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 29, textAlign: "end", widows: "100%" }}>
            <p>
              develop by <a href="https://devcm.info/">CM-DEVELOPER</a>
            </p>
          </div>
        </div>
        {open ? (
          <ModalSetting
            setOpen={setOpen}
            open={open}
            swID={swID}
            theme={theme}
            setUnlock={setUnlock}
            swName={swName}
            swTimeOn={swTimeOn}
            swTimeOff={swTimeOff}
            setRandom={setRandom}
          />
        ) : undefined}
      </div>
    </ThemeContext.Provider>
  );
}

function ModalSetting({
  setOpen,
  open,
  swID,
  theme,
  setUnlock,
  swName,
  swTimeOn,
  swTimeOff,
  setRandom,
}) {
  const handleClose = () => setOpen(false);
  const [passWord, setPassWord] = useState("");
  const [name, setName] = useState(swName);
  const [timeS, setTimeS] = useState(swTimeOn);
  const [timeE, setTimeE] = useState(swTimeOff);
  const handleChangePassWord = (event) => {
    setPassWord(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeTimeS = (event) => {
    setTimeS(event.target.value);
  };
  const handleChangeTimeE = (event) => {
    setTimeE(event.target.value);
  };

  const checkPass = () => {
    if (passWord !== "abc1234") {
      return (
        <script>
          function myFunction() {alert("Invalid password please try again")}
        </script>
      );
    } else {
      setUnlock(true);
      handleClose();
    }
  };

  const updateDataSw = async (name, s, e) => {
    // GET https://mui.anuchadev.com/updatdatasw/5/sw5/67/77/7/9 HTTP/1.1
    await axios
      .get(
        api +
          "/updatdatasw/" +
          swID +
          "/" +
          name +
          "/" +
          s +
          "/" +
          e +
          "/off/off"
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setTimeout(() => {
            handleClose();
            setRandom(Math.random());
          }, 200);
        } else {
        }
      });
  };
  const [dataSW, setDataSW] = useState([]);
  useEffect(() => {
    getdata();
  }, []);

  const getdata = () => {
    axios.get(api + "/getswdata").then((res) => {
      const { data } = res;
      setDataSW(data.data);
    });
  };

  console.log(passWord);
  console.log("madol", open);
  console.log("swID", swID);
  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      {swID === "lock" ? (
        <Box sx={theme === "light" ? styleL : styleD} className="text-center">
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Enter password for unlock system
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            <input
              type="password"
              className="form-control"
              onChange={handleChangePassWord}
            />
            <button
              type="button"
              class="btn btn-outline-primary btn-lg btn-block"
              style={{ width: "80%", marginTop: 20 }}
              onClick={checkPass}
            >
              Confirm
            </button>
          </Typography>
        </Box>
      ) : (
        <Box sx={theme === "light" ? styleL : styleD}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Change device
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            <div className="sw " style={{ marginTop: "0.5rem" }}>
              <p style={{ flexGrow: 1, marginTop: "1rem" }}>Device Name :</p>
              <input
                type="text"
                className="form-control"
                style={{ width: "13rem" }}
                value={name}
                onChange={handleChangeName}
              />
            </div>

            <div className="sw " style={{ marginTop: "0.5rem" }}>
              <p style={{ flexGrow: 1, marginTop: "1rem" }}>Time Start :</p>
              <input
                type="time"
                className="form-control"
                style={{ width: "13rem" }}
                value={timeS}
                onChange={handleChangeTimeS}
              />
            </div>

            <div className="sw " style={{ marginTop: "0.5rem" }}>
              <p style={{ flexGrow: 1, marginTop: "1rem" }}>Time End :</p>
              <input
                type="time"
                className="form-control"
                style={{ width: "13rem" }}
                value={timeE}
                onChange={handleChangeTimeE}
              />
            </div>
            <div className="sw " style={{ marginTop: "1rem" }}>
              <div style={{ flexGrow: 1 }}></div>
              <div>
                <Button
                  variant="outlined"
                  startIcon={<SaveAltIcon />}
                  onClick={() => updateDataSw(name, timeS, timeE)}
                >
                  Save
                </Button>
              </div>
            </div>
          </Typography>
        </Box>
      )}
    </Modal>
  );
}
