import React, { useContext, useState, useEffect } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { FilterContext } from "../context/filter.context";
import {
  FilterContextInterface,
  FilterInterface,
} from "../@types/filterContext.type";

import "./style/filter.css";

interface FilterCompInterface {
  cat?: string;
  subCategories: string[];
}

function valuetext(value: number) {
  return `${value}°C`;
}

export const FilterComp = (props: FilterCompInterface) => {
  const navigate = useNavigate();

  const {
    setFilterState,
    defaultFilter,
    isFilterActivated,
    setIsFilterActivated,
  } = useContext(FilterContext) as FilterContextInterface;
  const [tempFilterState, setTempFilterState] =
    useState<FilterInterface>(defaultFilter);
  const { search } = useLocation();

  useEffect(() => {
    console.log("==> q : ", search);
    if (!search) {
      setIsFilterActivated(false);
    }
  }, []);

  const handleValidateFilter = () => {
    if (isFilterActivated) {
      navigate({
        pathname: `/category/${props.cat}`,
        search: createSearchParams({
          page: "1",
          subCat: tempFilterState.subCategory,
          minPrice: tempFilterState.price[0].toString(),
          maxPrice: tempFilterState.price[1].toString(),
        }).toString(),
      });
      setFilterState(tempFilterState);
    } else {
      navigate({
        pathname: `/category/${props.cat}`,
        search: createSearchParams({
          page: "1",
        }).toString(),
      });
      setTempFilterState(defaultFilter);
      setFilterState(defaultFilter);
    }
  };

  const handleSubcategoryChange = (event: SelectChangeEvent): void => {
    // setAge(event.target.value as string);
    setTempFilterState({
      ...tempFilterState,
      subCategory: event.target.value,
    });
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("checked : ", event.target.checked);
    setIsFilterActivated(event.target.checked);
  };

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const minDistance = 10;
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setTempFilterState({
          ...tempFilterState,
          price: [clamped, clamped + minDistance],
        });
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setTempFilterState({
          ...tempFilterState,
          price: [clamped - minDistance, clamped],
        });
      }
    } else {
      setTempFilterState({
        ...tempFilterState,
        price: newValue as number[],
      });
    }
  };

  return (
    <div className="Filter">
      <h3>Filter :</h3>
      <div>
        <p>Activated : </p>
        <Checkbox
          sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
          checked={isFilterActivated}
          name="activated"
          onChange={handleCheckbox}
        />
      </div>
      <Select
        className="Filter__select"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={tempFilterState.subCategory}
        label="Age"
        onChange={handleSubcategoryChange}
      >
        {["All", ...props.subCategories].map((cat, index) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
      <div className="Filter__priceSection">
        <p>Price :</p>
        <div className="Filter__priceSection__priceDive">
          <p>{tempFilterState.price[0]}</p>
          <Slider
            className="Filter__priceSection__priceDive__price"
            getAriaLabel={() => "Minimum distance shift"}
            value={tempFilterState.price}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            disableSwap
          />
        </div>
      </div>

      <Button variant="contained" onClick={() => handleValidateFilter()}>
        Filter
      </Button>
    </div>
  );
};
