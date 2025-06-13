'use client';

import { useState } from "react";
import { products } from "../product-data";
import Link from "next/link";

export default function CartPage() {
    const [cartIds] = useState(['1', '2']);

    const cartProducts = cartIds.map(id => products.find(p => p.id === id)!);
    
    return (
        <>
        <h1>Shopping Cart</h1>
        {cartProducts.map(product => (
            <Link key={product.id} className="cart-item" href={"/products/" + product.id}>
                <h3>{product.name}</h3>
                <p>Price: ${product.price.toFixed(2)}</p>
            </Link>
        ))}
        </>
        
    )
}