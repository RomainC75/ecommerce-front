import { Link } from "react-router-dom";

import { categoriesTranslator } from "../tools/categories";

import './style/menu.css'

export const Menu = () => {
  return (
    <section className="Menu">
      <ul className="Menu__ul">
        {categoriesTranslator.filter((cat,i)=>i>0).map(cat=>
            <li key={cat[1]} ><Link to={`/category/${cat[1]}`}><p>{cat[0]}</p></Link></li>)}
      </ul>
    </section>
  );
};
