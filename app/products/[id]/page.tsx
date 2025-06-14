import NotFoundPage from "@/app/not-found"
import { products } from "@/app/product-data"

export default function ProductDetailPage({  params }: { params: { id: string } }) {
    const product = products.find(p => p.id === params.id)

    if (!product) {
        return <NotFoundPage/>
    }
    return (
        <div className="">
            <img src="/" alt="Product Image" />
            <h1 className="text-4xl font-bold mb-4">{product!.name}</h1>
            <p className="text-2xl text-gray-600 mb-6">Price: ${product!.price.toFixed(2)}</p>
            <h3 className="text-2xl font-semibold mb-2">Description:</h3>
            <p className="text-gray-700">{product.description}</p>
        </div>        
    )
}