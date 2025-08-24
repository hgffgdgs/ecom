import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth(['CUSTOMER']), async (req, res) => {
  const userId = (req as any).user.userId as string;
  const { items, shippingAddress, billingAddress, paymentMethod, currency = 'XOF' } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });

  const totalCents = items.reduce((sum: number, it: any) => sum + (it.unitPriceCents * it.quantity), 0);

  const order = await prisma.order.create({
    data: {
      userId,
      currency,
      totalCents,
      paymentMethod,
      shippingAddress,
      billingAddress,
      items: {
        create: items.map((it: any) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
          unitPriceCents: it.unitPriceCents
        }))
      }
    },
    include: { items: true }
  });
  res.json(order);
});

router.get('/', requireAuth(['CUSTOMER']), async (req, res) => {
  const userId = (req as any).user.userId as string;
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

router.get('/:id', requireAuth(['CUSTOMER']), async (req, res) => {
  const userId = (req as any).user.userId as string;
  const order = await prisma.order.findFirst({ where: { id: req.params.id, userId }, include: { items: true, transactions: true } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

export default router;

