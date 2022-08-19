import React from "react";
import { Link } from "react-router-dom";

import { categoriesTranslator } from "../tools/categories";

import './style/menu.css'

export const Menu = () => {
  return (
    <section className="Menu">
      <ul className="Menu__li">
        {categoriesTranslator.map(cat=>
            <li key={cat[1]} ><Link to={`/category/${cat[1]}`}>{cat[0]}</Link></li>)}
      </ul>
    </section>
  );
};
