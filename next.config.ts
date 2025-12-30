import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 개발 환경에서는 output: 'export'를 사용하지 않음 (middleware 작동을 위해)
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  // 정적 사이트 생성 모드에서는 이미지 최적화 비활성화
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
