import type { Product } from "../types";  // použij vzor pro produkt z typu

interface Props {
    product: Product; //komponenta potřebuje ve formátu Product
}

export const ProductCard = ({ product }: Props) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-2 font-bold text-blue-600">{product.price} Kč</p>
        </div>
    );
};