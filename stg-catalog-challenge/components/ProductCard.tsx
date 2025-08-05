import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
}

export default function ProductCard({ id, name, price, image_url, description }: ProductCardProps) {
  return (
    <Link href={`/produto/${id}`}>
        <Image
          src={image_url}
          alt={name}
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="mt-2 text-lg font-semibold">{name}</h3>
        <p>{description}</p>
        <p className="text-gray-700">R$ {price.toFixed(2)}</p>
    </Link>
  );
}