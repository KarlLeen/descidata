import app from './app';
import config from './config';

const PORT = config.server.port;

// 启动服务器
app.listen(PORT, () => {
  console.log(`
======================================================
  DeSciData API 服务器已启动
  环境: ${config.server.env}
  端口: ${PORT}
  区块链网络: ${config.blockchain.rpcUrl}
  实验合约地址: ${config.blockchain.experimentContractAddress}
======================================================
  `);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 优雅退出
process.on('SIGTERM', () => {
  console.log('SIGTERM信号收到，关闭服务...');
  process.exit(0);
});

export default app;
