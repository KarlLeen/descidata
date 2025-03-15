import { NextRequest, NextResponse } from 'next/server';

// 模拟服务器的基础URL
const MOCK_API_BASE_URL = 'http://localhost:3030/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 构建完整的API路径
    const path = params.path.join('/');
    const url = `${MOCK_API_BASE_URL}/${path}`;
    
    console.log(`Proxying GET request to: ${url}`);
    
    // 转发请求到模拟服务器
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from mock server' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 构建完整的API路径
    const path = params.path.join('/');
    const url = `${MOCK_API_BASE_URL}/${path}`;
    
    // 获取请求体
    const body = await request.json();
    
    console.log(`Proxying POST request to: ${url}`, body);
    
    // 转发请求到模拟服务器
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to send data to mock server' },
      { status: 500 }
    );
  }
}
