// Hardcoded environment variables for production deployment
// This ensures the app works even without proper environment setup

export const ENV = {
  // Hugging Face API Configuration
  HF_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN || 'hf_demo_token_placeholder',
  
  // TTS Configuration
  TTS_RATE: parseFloat(process.env.NEXT_PUBLIC_TTS_RATE || '0.9'),
  TTS_PITCH: parseFloat(process.env.NEXT_PUBLIC_TTS_PITCH || '1.0'),
  TTS_VOLUME: parseFloat(process.env.NEXT_PUBLIC_TTS_VOLUME || '0.8'),
  
  // Base Path Configuration
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/Hush' : ''),
  
  // API Endpoints
  HF_TTS_API: 'https://api-inference.huggingface.co/models/onnx-community/Kokoro-82M-v1.0-ONNX-timestamped',
  
  // Feature Flags
  ENABLE_TTS: process.env.NEXT_PUBLIC_ENABLE_TTS !== 'false',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // Development vs Production
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
}

// Validate environment configuration
export function validateEnv() {
  const warnings: string[] = []
  
  // Only show warnings in development mode
  if (ENV.IS_DEVELOPMENT) {
    if (ENV.HF_TOKEN === 'hf_demo_token_placeholder') {
      warnings.push('Hugging Face token not configured. TTS will use browser fallback.')
    }
    
    if (ENV.BASE_PATH) {
      warnings.push('Base path detected in development mode. This may cause issues.')
    }
    
    if (warnings.length > 0) {
      console.warn('Environment Configuration Warnings:', warnings)
    }
  }
  
  return warnings
}

// Initialize environment validation
if (typeof window !== 'undefined') {
  validateEnv()
}
