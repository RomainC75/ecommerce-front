import React, { useContext, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FilterContext } from "../context/filter.context";
import { FilterContextInterface } from "../@types/filterContext.type";
import MenuItem from "@mui/material/MenuItem";
import { categories } from "../tools/categories";
import Slider from '@mui/material/Slider';

import "./style/filter.css";
import { getValue } from "@testing-library/user-event/dist/utils";

function valuetext(value: number) {
    return `${value}°C`;
  }

export const Filter = () => {
  const { filterState, setFilterState } = useContext(
    FilterContext
  ) as FilterContextInterface;

  const handleChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value as string);
    setFilterState({
      ...filterState,
      category: event.target.value,
    });
  };

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const minDistance = 10;
    console.log('+++++',event,newValue,'active',activeThumb)
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        console.log("clamped",clamped)
        setFilterState({
            ...filterState,
            price:[clamped, clamped + minDistance]
        });
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        console.log("clamped",clamped)
        setFilterState({
            ...filterState,
            price:[clamped - minDistance, clamped]});
      }
    } else {
      setFilterState({
        ...filterState,
        price:newValue as number[]});
    }
  };

  return (
    <div className="Filter">
        <p>Category :</p>
      <Select
        className="Filter__select"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={filterState.category}
        label="Age"
        onChange={handleChange}
      >
        {categories.map((cat, index) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
      <p>Price :</p>
      <div className="Filter__priceDive">
        <p>{filterState.price[0]}</p>
        <Slider
            className="Filter__priceDive__price"
            getAriaLabel={() => 'Minimum distance shift'}
            value={filterState.price}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            disableSwap
        />
        <p>{filterState.price[1]}</p>
      </div>
    </div>
  );
};
