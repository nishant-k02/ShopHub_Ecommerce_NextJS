export interface Product {
    id: string;
    imageUrl: string;
    name: string;       
    description: string;
    price: number;
}
export const products: Product[] = [
    {
        id: '1',
        imageUrl: 'file.svg',
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 29.99,
    },
    {
        id: '2',
        imageUrl: 'globe.svg',
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 39.99,
    },
    {
        id: '3',
        imageUrl: 'next.svg',
        name: 'Product 3',
        description: 'Description for Product 3',
        price: 49.99,
    },
    {
        id: '4',
        imageUrl: 'vercel.svg',
        name: 'Product 4',
        description: 'Description for Product 4',
        price: 59.99,
    },
];