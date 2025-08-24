import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth(['CUSTOMER', 'ADMIN', 'MANAGER', 'SUPPORT', 'VENDOR']), async (req, res) => {
  const userId = (req as any).user.userId as string;
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
  const items = await prisma.cartItem.findMany({ where: { cartId: cart.id }, include: { product: true, variant: true } });
  res.json({ id: cart.id, items });
});

router.post('/items', requireAuth(['CUSTOMER']), async (req, res) => {
  const userId = (req as any).user.userId as string;
  const { productId, variantId, quantity = 1, priceCents } = req.body;
  const cart = await prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  const item = await prisma.cartItem.create({ data: { cartId: cart.id, productId, variantId, quantity, priceCents } });
  res.json(item);
});

router.patch('/items/:id', requireAuth(['CUSTOMER']), async (req, res) => {
  const { quantity } = req.body;
  const item = await prisma.cartItem.update({ where: { id: req.params.id }, data: { quantity } });
  res.json(item);
});

router.delete('/items/:id', requireAuth(['CUSTOMER']), async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;

