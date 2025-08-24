import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
const adminRoles = ['ADMIN', 'MANAGER', 'SUPPORT'] as const;

router.get('/users', requireAuth(adminRoles as any), async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users);
});

router.get('/orders', requireAuth(adminRoles as any), async (_req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true } });
  res.json(orders);
});

router.post('/categories', requireAuth(adminRoles as any), async (req, res) => {
  const { name, slug, parentId } = req.body;
  const category = await prisma.category.create({ data: { name, slug, parentId } });
  res.json(category);
});

router.post('/products', requireAuth(adminRoles as any), async (req, res) => {
  const { name, slug, description, images, basePriceCents, currency = 'XOF', stock, categoryId, vendorId } = req.body;
  const product = await prisma.product.create({ data: { name, slug, description, images, basePriceCents, currency, stock, categoryId, vendorId } });
  res.json(product);
});

export default router;

