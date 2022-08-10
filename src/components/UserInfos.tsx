import axios from "axios";
import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Spinner } from "./Spinner";
import { NewUserToSend, UserExpandedInterface } from "../@types/authContext.type";
import Button from "@mui/material/Button";
import { ImCheckmark, ImCross } from "react-icons/im";

import "./style/userInfos.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const selectUserInfosFieldsToSend = (userInfos: UserExpandedInterface):NewUserToSend => {
  const fields = [
    "firstName",
    "lastName",
    "street1",
    "street2",
    "city",
    "zip",
    "state",
    "country",
  ];
  const newObjectToSend:NewUserToSend = {};
  Object.keys(userInfos).forEach((key: string) => {
    if (fields.includes(key)) {
      newObjectToSend[key as keyof NewUserToSend] =
        userInfos[key as keyof UserExpandedInterface];
    }
  });
  return newObjectToSend
};

export const UserInfos = (): JSX.Element => {
  const [userInfosState, setUserInfosState] =
    useState<UserExpandedInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((ans) => {
        setIsLoading(false);
        setIsLoaded(true);
        console.log("++++", ans.data);
        setUserInfosState(ans.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  const handleUserInfos = (
    el: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (userInfosState) {
      const buff = userInfosState;
      // console.log(el.target.name)
      buff[el.target.name as keyof UserExpandedInterface] = el.target.value;
      console.log("buff", buff);
      setUserInfosState(buff);
    }
  };

  const handleSubmit = (el: React.SyntheticEvent) => {
    el.preventDefault();
    console.log("userInfosState", userInfosState);
    if (userInfosState) {
      console.log('FONCTION: ',selectUserInfosFieldsToSend(userInfosState))
      patchUserInfos(selectUserInfosFieldsToSend(userInfosState));
    }
  };

  const patchUserInfos = (newUserInfos: NewUserToSend) => {
    const storedToken = localStorage.getItem("authToken");

    axios.patch(`${API_URL}/user`, newUserInfos, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
  };

  return (
    <>
      {!isLoading && userInfosState ? (
        <div className="User">
          <form onSubmit={handleSubmit}>
            <div className="User__line">
              <TextField
                id="outlined-error"
                label="email"
                value={
                  userInfosState &&
                  "email" in userInfosState &&
                  userInfosState.email
                }
              />
              <div className="User__line__validated">
                <p>Email Certified :</p>
                {userInfosState && userInfosState.isMailValidated ? (
                  <ImCheckmark className="green" />
                ) : (
                  <ImCross className="red" />
                )}
              </div>
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="street1"
                defaultValue={userInfosState?.street1 || undefined}
                variant="filled"
                name="street1"
                value={userInfosState?.street1 || undefined}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="street2"
                defaultValue="stree"
                variant="filled"
                name="street2"
                value={userInfosState?.street2}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="city"
                defaultValue="city"
                variant="filled"
                name="city"
                value={userInfosState?.city}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="zip"
                defaultValue="zip"
                variant="filled"
                name="zip"
                value={userInfosState?.zip}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="state"
                defaultValue="state"
                variant="filled"
                name="state"
                value={userInfosState?.state}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="country"
                defaultValue="country"
                variant="filled"
                name="country"
                value={userInfosState?.country}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <Button variant="outlined" type="submit">
              Outlined
            </Button>
          </form>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
