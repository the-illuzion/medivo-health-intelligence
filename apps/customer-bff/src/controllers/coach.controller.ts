import { Request, Response, NextFunction } from 'express';

export const chatWithCoach = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    const reply = `Based on your recent sub-dermal telemetry analysis, your skin moisture barrier is responding well to micro-peptide therapy. Regarding your query ("${message}"): We recommend continuing your SPF 50 application and avoiding harsh physical scrub cleansers.`;
    
    res.json({
      success: true,
      data: {
        id: `chat-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};
