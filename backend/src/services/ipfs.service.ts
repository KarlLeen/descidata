import axios from 'axios';
import FormData from 'form-data';
import config from '../config';

class IpfsService {
  private static instance: IpfsService;
  private apiKey: string;
  private apiSecret: string;
  private jwt: string;
  private gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs/';

  private constructor() {
    this.apiKey = config.ipfs.pinataApiKey;
    this.apiSecret = config.ipfs.pinataApiSecret;
    this.jwt = config.ipfs.pinataJWT;
  }

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService();
    }
    return IpfsService.instance;
  }

  /**
   * 上传文件到IPFS (Pinata)
   * @param fileBuffer 文件Buffer
   */
  async uploadFile(fileBuffer: Buffer): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer);
      
      // Pinata元数据
      const pinataMetadata = JSON.stringify({
        name: `file-${Date.now()}`
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      // Pinata选项
      const pinataOptions = JSON.stringify({
        cidVersion: 1
      });
      formData.append('pinataOptions', pinataOptions);
      
      // 设置请求头
      const headers: Record<string, string> = {};
      
      if (this.jwt) {
        headers['Authorization'] = `Bearer ${this.jwt}`;
      } else {
        headers['pinata_api_key'] = this.apiKey;
        headers['pinata_secret_api_key'] = this.apiSecret;
      }
      
      // 发送请求
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        { 
          headers,
          maxBodyLength: Infinity, // 对于大文件
          maxContentLength: Infinity
        }
      );
      
      return response.data; // 返回包含IpfsHash的响应
    } catch (error) {
      console.error('文件上传到IPFS失败:', error);
      throw error;
    }
  }

  /**
   * 上传元数据到IPFS (Pinata)
   * @param metadata 要上传的元数据对象
   */
  async uploadMetadata(metadata: any): Promise<any> {
    try {
      // 设置请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (this.jwt) {
        headers['Authorization'] = `Bearer ${this.jwt}`;
      } else {
        headers['pinata_api_key'] = this.apiKey;
        headers['pinata_secret_api_key'] = this.apiSecret;
      }
      
      // 准备数据
      const data = {
        pinataContent: metadata,
        pinataMetadata: {
          name: `metadata-${Date.now()}.json`
        },
        pinataOptions: {
          cidVersion: 1
        }
      };
      
      // 发送请求
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        { headers }
      );
      
      return response.data; // 返回包含IpfsHash的响应
    } catch (error) {
      console.error('元数据上传到IPFS失败:', error);
      throw error;
    }
  }

  /**
   * 从IPFS获取元数据
   * @param hash IPFS哈希
   */
  async getMetadata(hash: string): Promise<any> {
    try {
      const url = this.getGatewayUrl(hash);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('从IPFS获取元数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取IPFS内容的网关URL
   * @param hash IPFS哈希
   */
  getGatewayUrl(hash: string): string {
    return `${this.gatewayUrl}${hash}`;
  }
}

// 导出单例实例
export default IpfsService.getInstance();
