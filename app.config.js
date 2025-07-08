import 'dotenv/config';

export default {
  expo: {
    name: 'VIBOOK',
    slug: 'VIBOOK',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/libros.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/libros.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          'Esta app necesita acceso a tu galería para que puedas subir imágenes de los libros.',
      },
    },
    android: {
      permissions: ['CAMERA', 'READ_MEDIA_IMAGES', 'READ_EXTERNAL_STORAGE'],
      adaptiveIcon: {
        foregroundImage: './assets/libros.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/libros.png',
    },
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      SERVICE_KEY: process.env.EXPO_PUBLIC_SERVICE_KEY,
    },
  },
};
