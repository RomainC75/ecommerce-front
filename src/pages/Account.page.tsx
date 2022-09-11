import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { AuthContextInterface } from "../@types/authContext.type";
import TextField from "@mui/material/TextField";
import { Spinner } from "../components/Spinner";
import {
  NewUserToSend,
  UserExpandedInterface,
} from "../@types/authContext.type";
import Button from "@mui/material/Button";

import { ImCheckmark, ImCross } from "react-icons/im";
import "./style/accountPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

const selectUserInfosFieldsToSend = (
  userInfos: UserExpandedInterface
): NewUserToSend => {
  const fields = [
    "firstname",
    "lastname",
    "street1",
    "street2",
    "city",
    "zip",
    "state",
    "country",
    "birthdate",
  ];

  const newObjectToSend: NewUserToSend = {};
  Object.keys(userInfos).forEach((key: string) => {
    if (fields.includes(key)) {
      newObjectToSend[key as keyof NewUserToSend] =
        userInfos[key as keyof UserExpandedInterface];
    }
  });
  return newObjectToSend;
};

const initialFValues: UserExpandedInterface = {
  _id: "",
  email: "",
  isMailValidated: "",
  createdAt: "",
  updatedAt: "",
  firstname: "firstname",
  lastname: "lastname",
  street1: "street1",
  street2: "street2",
  city: "city",
  zip: "zippp",
  state: "state",
  country: "country",
  birthdate: "",
};

//---------------------------------------------------

export const Account = (): JSX.Element => {
  const { authenticateUser } = useContext(AuthContext) as AuthContextInterface;

  const [userInfosState, setUserInfosState] =
    useState<UserExpandedInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [buttonColorState, setButtonColorState] = useState<
    "primary" | "success" | "error"
  >("primary");
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameState, setFileNameState] = useState<string | null>(null);

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
      const buff: UserExpandedInterface = {
        _id: userInfosState._id,
        email: userInfosState.email,
        isMailValidated: userInfosState.isMailValidated,
        createdAt: userInfosState.createdAt,
        updatedAt: userInfosState.updatedAt,
        firstname: userInfosState.firstname ? userInfosState.firstname : "",
        lastname: userInfosState.lastname ? userInfosState.lastname : "",
        street1: userInfosState.street1 ? userInfosState.street1 : "",
        street2: userInfosState.street2 ? userInfosState.street2 : "",
        city: userInfosState.city ? userInfosState.city : "",
        zip: userInfosState.zip ? userInfosState.zip : "",
        state: userInfosState.state ? userInfosState.state : "",
        country: userInfosState.country ? userInfosState.country : "",
        birthdate: userInfosState.birthdate ? userInfosState.birthdate : "",
      };
      buff[el.target.name as keyof UserExpandedInterface] = el.target.value
        ? el.target.value
        : "";
      setUserInfosState(buff);
    }
  };

  const handleSubmit = (el: React.SyntheticEvent) => {
    el.preventDefault();
    if (userInfosState) {
      patchUserInfos(selectUserInfosFieldsToSend(userInfosState));
    }
  };

  const patchUserInfos = (newUserInfos: NewUserToSend) => {
    const storedToken = localStorage.getItem("authToken");
    setIsLoadingButton(true);
    axios
      .patch(`${API_URL}/user`, newUserInfos, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((ans) => {
        setIsLoadingButton(false);
        setButtonColorState("success");
      })
      .catch((ans) => {
        setIsLoadingButton(false);
        setButtonColorState("error");
      });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // console.log('FILE ',e.target.files[0].name)
    setFileNameState(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  const sendFile = () => {
    if (selectedFile) {
      const storedToken = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("image", selectedFile, "ZeName");
      axios({
        url: API_URL + "/user/image",
        method: "POST",
        headers: {
          authorization: `BEARER ${storedToken}`,
        },
        data: formData,
      })
        .then((ans) => {
          console.log("ans : ", ans.data);
          authenticateUser();
        })
        .catch((err) => {});
    }
  };

  return (
    <div className="AccountPage">
      {!isLoading && userInfosState ? (
        <div className="User box">
          <h2>User Informations</h2>
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
                label="First Name"
                variant="filled"
                name="firstname"
                value={userInfosState.firstname}
                onChange={handleUserInfos}
              />
              <TextField
                id="filled-error"
                label="Last Name"
                variant="filled"
                name="lastname"
                value={userInfosState?.lastname}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="Street 1"
                variant="filled"
                name="street1"
                value={userInfosState?.street1}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="street2"
                variant="filled"
                name="street2"
                value={userInfosState?.street2 || undefined}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="city"
                // defaultValue={userInfosState?.city || "city"}
                variant="filled"
                name="city"
                value={userInfosState?.city || undefined}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="zip"
                // defaultValue={userInfosState?.zip || "zip"}
                variant="filled"
                name="zip"
                value={userInfosState.zip || initialFValues.zip}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="filled-error"
                label="state"
                variant="filled"
                name="state"
                value={userInfosState?.state || undefined}
                onChange={(el) => handleUserInfos(el)}
              />
              <TextField
                id="filled-error"
                label="country"
                variant="filled"
                name="country"
                value={userInfosState?.country}
                onChange={(el) => handleUserInfos(el)}
              />
            </div>
            <div className="User__line">
              <TextField
                id="date"
                label="Birthdate"
                type="date"
                name="birthdate"
                onChange={handleUserInfos}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={userInfosState?.birthdate}
              />
            </div>
            {isLoadingButton ? (
              <Button variant="contained" disabled>
                Loading
              </Button>
            ) : (
              <Button variant="contained" type="submit" color={buttonColorState}>
                Update Infos
              </Button>
            )}
          </form>
        </div>
      ) : (
        <Spinner />
      )}
      <br />

      <div className="avatarSection box">
        <h2>Avatar</h2>
        <Button className="avatarSection__selectFileButton" variant="outlined" component="label">
          Select file
          <input type="file" hidden onChange={handleFile} />
        </Button>
        <Button variant="contained" color="primary" onClick={() => sendFile()}>
          Send File
        </Button>
        {fileNameState && (
          <div className="avatarSection__fileName">
            <p>Nom du fichier : </p>
            <p>{fileNameState}</p>
          </div>
        )}
      </div>
    </div>
  );
};
