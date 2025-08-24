interface Props { params: { slug: string } }

async function fetchProduct(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/api/catalog/products/${slug}`, {next: {revalidate: 60}});
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ params }: Props) {
  const product = await fetchProduct(params.slug);
  if (!product) return <main style={{ padding: 24 }}><p>Produit introuvable</p></main>;
  return (
    <main style={{ padding: 24 }}>
      <h1>{product.name}</h1>
      <p>{(product.basePriceCents/100).toFixed(2)} {product.currency}</p>
      <p>{product.description}</p>
    </main>
  );
}

