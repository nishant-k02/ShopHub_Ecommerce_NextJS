import { products } from "../product-data";
import ProductsList from "../ProductsList";

export default function ProductsPage() {
    return (
        <>
        <h1>Products</h1>
        <ProductsList products={products} />
        </>
        
    )
}