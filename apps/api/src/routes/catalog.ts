import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { children: true }
  });
  res.json(categories);
});

router.get('/products', async (req, res) => {
  const { q, category, minPrice, maxPrice, sort } = req.query as Record<string, string | undefined>;

  const where: any = {};
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } }
  ];
  if (category) where.category = { slug: category };
  if (minPrice || maxPrice) where.basePriceCents = {
    gte: minPrice ? Number(minPrice) : undefined,
    lte: maxPrice ? Number(maxPrice) : undefined
  };

  const orderBy = sort === 'price_asc' ? { basePriceCents: 'asc' } :
                  sort === 'price_desc' ? { basePriceCents: 'desc' } :
                  sort === 'newest' ? { createdAt: 'desc' } : { name: 'asc' };

  const products = await prisma.product.findMany({ where, orderBy, include: { category: true, variants: true } });
  res.json(products);
});

router.get('/products/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { slug: req.params.slug }, include: { category: true, variants: true, reviews: true } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

export default router;

