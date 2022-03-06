import { useEthers } from "@usedapp/core";
import { useState, MouseEvent, ChangeEvent } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { constants } from "ethers";

export const AdminPw = () => {
  // retrieve the account which is logged in and set the address to zeros if it is not logged in
  const { account } = useEthers();
  const accountAddress = account ? account : constants.AddressZero;

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, password: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const [authToken, setAuthToken] = useState("");

  const submitPassword = () => {
    axios
      .post("http://localhost:3080/api/login", {
        address: accountAddress,
        password: values.password,
      })
      .then((response) => {
        console.log("Response");
        console.log(response);
        setAuthToken(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setPasswordFail(true);
          setValues({ ...values, password: "" });
        }
      });
  };

  const [passwordFail, setPasswordFail] = useState(false);
  const handleCloseSnack = () => {
    setPasswordFail(false);
  };

  const sendIsBusy = false;

  return (
    <div>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Button variant="contained" onClick={submitPassword} sx={{ mt: 2 }}>
        {sendIsBusy ? <CircularProgress size={26} /> : "Submit"}
      </Button>
      <Snackbar
        open={passwordFail}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="error">
          Password failed! Retry
        </Alert>
      </Snackbar>
    </div>
  );
};
