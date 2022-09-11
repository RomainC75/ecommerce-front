import React from 'react'
import { useParams } from 'react-router-dom'
import { ProductsList } from './ProductsList.page'

import { categoriesTranslator } from '../tools/categories'

export const CategoriesList = () => {
    const {cat} = useParams()
  return (
    <div className="CategoriesList">
      <ProductsList cat={cat}/>
    </div>
  )
}
