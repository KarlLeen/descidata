import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import experimentRoutes from './routes/experiment.routes';

// 创建Express应用
const app = express();

// 中间件配置
app.use(helmet()); // 安全HTTP头
app.use(morgan('dev')); // 日志记录
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// CORS配置
app.use(cors({
  origin: config.cors.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 路由
app.use('/api/experiments', experimentRoutes);

// 健康检查端点
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'DeSciData API is running' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 处理404错误
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

export default app;
