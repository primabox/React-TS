export interface Product {
    id: number;
    name: string;
    price: string; // API returns price as a string
    description: string;
    category: string;
    stock: number;
}