import Image from 'next/image';
import Link from 'next/link';
import { Product } from './lib/db';

export default function ProductsList({ products } : { products: Product[] }) {
    return (
        <div>
            {products.map((product) => (
                <Link key={product.id} className="product" href={"/products/" + product.id}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={150}
                        height={150} />
                    <h2>{product.name}</h2>
                    <p>Price: ${product.price.toFixed(2)}</p>
                </Link>
            ))}
        </div>
    )
}