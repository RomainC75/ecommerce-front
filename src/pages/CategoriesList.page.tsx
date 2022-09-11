import { useParams } from 'react-router-dom'
import { ProductsList } from './ProductsList.page'

export const CategoriesList = () => {
    const {cat} = useParams()
  return (
    <div className="CategoriesList">
      <ProductsList cat={cat}/>
    </div>
  )
}
