import { useEffect, useState } from "react";
import axios from "axios";
import { DestinationAddressInterface } from "../@types/destinationAddress.type";
import TextField from "@mui/material/TextField";

import './style/destinationAddress.css'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

interface DestinationAddressProps {
  addressToSendState: DestinationAddressInterface | null;
  setAddressToSendState: (state: DestinationAddressInterface) => void;
}

export const DestinationAddress = (props: DestinationAddressProps) => {
  const { addressToSendState, setAddressToSendState } = props;
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
        const buff={
          firstname: ans.data.firstname,
          lastname: ans.data.lastname,
          street1: ans.data.street1,
          street2: ans.data.street2,
          city: ans.data.city,
          zip: ans.data.zip,
          state: ans.data.state,
          country: ans.data.country,   
        }
        setAddressToSendState(buff);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(err.response.data.message);
      });
  }, []);

  const handleAddresToSend = (e: any) => {
    if (addressToSendState) {
      const addressToSendBuff = {
        firstname: addressToSendState.firstname,
        lastname: addressToSendState.lastname,
        street1: addressToSendState.street1,
        street2: addressToSendState.street2,
        city: addressToSendState.city,
        zip: addressToSendState.zip,
        state: addressToSendState.state,
        country: addressToSendState.country,
      };
      if (
        addressToSendBuff &&
        e.target.name &&
        typeof e.target.name === "string" &&
        e.target.name in addressToSendBuff
      ) {
        addressToSendBuff[e.target.name as keyof DestinationAddressInterface] =
          e.target.value;
      }
      setAddressToSendState(addressToSendBuff);
    }
  };

  return (
    <div className="DestinationAddress">
      <h3>Destination address :</h3>
      <div className="line">
        <TextField
          // error={error}
          id="first-name"
          label="First Name"
          name="firstname"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.firstname : ""}
          // placeholder={addressToSendState?.firstname}
          // focused
          // color={color}
        />
        <TextField
          // error={error}
          id="first-name"
          label="Last Name"
          name="lastname"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.lastname : ""}
          // placeholder={addressToSendState?.lastname}
          // focused
          // color={color}
        />
      </div>
      
      <div className="line">
        <TextField
          // error={error}
          id="street1"
          label="Street 1"
          name="street1"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.street1 : ""}
          // placeholder={addressToSendState?.firstname}
          // focused
          // color={color}
        />
        <TextField
          // error={error}
          id="street2"
          label="Street 2"
          name="street2"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.street2 : ""}
          // placeholder={addressToSendState?.firstname}
          // focused
          // color={color}
        />
      </div>

      <div className="line">
        <TextField
          // error={error}
          id="city"
          label="City"
          name="city"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.city : ""}
          // placeholder={addressToSendState?.firstname}
          // focused
          // color={color}
        />
        <TextField
          // error={error}
          id="zip"
          label="Zip"
          name="zip"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.zip : ""}
          // placeholder={addressToSendState?.lastname}
          // focused
          // color={color}
        />
      </div>

      <div className="line">
        <TextField
          // error={error}
          id="state"
          label="State"
          name="state"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.state : ""}
          // placeholder={addressToSendState?.firstname}
          // focused
          // color={color}
        />
        <TextField
          // error={error}
          id="country"
          label="Country"
          name="country"
          //defaultValue=""
          // helperText={helperText}
          onChange={handleAddresToSend}
          //inputRef={inputRef}
          value={addressToSendState ? addressToSendState?.country : ""}
          // placeholder={addressToSendState?.lastname}
          // focused
          // color={color}
        />
      </div>
    </div>
  );
};
