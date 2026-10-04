import { Request, Response, NextFunction } from 'express'
import { settingsService } from '../services/settings.service'
import { sendSuccess } from '../utils/api-response'

export class SettingsController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getSettings()
      return sendSuccess(res, settings)
    } catch (error) {
      return next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await settingsService.updateSettings(req.body)
      return sendSuccess(res, updated, 'تنظیمات با موفقیت ذخیره شد')
    } catch (error) {
      return next(error)
    }
  }
}

export const settingsController = new SettingsController()
