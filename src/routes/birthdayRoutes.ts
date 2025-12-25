import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm-data-source.js';
import { WishSentLog, WishType, WishStatus } from '../entities/WishSentLog.js';
import { DateTime } from 'luxon';
import { shouldSendWish } from '../scheduler/birthdayWishCron.js';

export const birthdayRouter = Router();

birthdayRouter.post('/validate', async (req: Request, res: Response) => {
  try {
    const { userId, time } = req.body;
    if (!userId || !time) {
      return res.status(400).json({ error: 'userId and time are required' });
    }
    const wishLogRepo = AppDataSource.getRepository(WishSentLog);
    const wish = await wishLogRepo.findOne({
      where: {
        user: { id: userId },
        type: WishType.BIRTHDAY,
        status: WishStatus.PENDING,
      },
      relations: ['user'],
      order: { sendDate: 'ASC' },
    });
    if (!wish) {
      return res.status(404).json({ error: 'No pending birthday wish found for this user' });
    }
    const user = wish.user;
    const nowUtc = DateTime.fromISO(time, { zone: 'utc' });
    const { canSend, now, wishDate } = shouldSendWish({ sendDate: wish.sendDate, user }, nowUtc);
    res.json({
      userId,
      wishSendDate: wishDate.toISO(),
      testTimeUtc: nowUtc.toISO(),
      testTimeInUserTz: now.toISO(),
      canSend,
      reason: canSend ? 'send' : 'not yet',
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});
