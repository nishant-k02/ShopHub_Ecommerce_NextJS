import NotFoundPage from "@/app/not-found"
import { products } from "@/app/product-data"

export default function ProductDetailPage({  params }: { params: { id: string } }) {
    const product = products.find(p => p.id === params.id)

    if (!product) {
        return <NotFoundPage/>
    }
    return (
        <>
        <h1>{product!.name}</h1>
        <p>Price: ${product!.price.toFixed(2)}</p>
        <h3>Description:</h3>
        <p>{product!.description}</p>
        </>
        
    )
}