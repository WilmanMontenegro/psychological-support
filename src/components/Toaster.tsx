'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Opciones por defecto
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        // Success
        success: {
          duration: 3000,
          style: {
            background: '#F2DCDC', // color-pastel
            color: '#4982A6', // color-accent
            border: '2px solid #BF88AC', // color-secondary
          },
          iconTheme: {
            primary: '#BF88AC', // color-secondary
            secondary: '#fff',
          },
        },
        // Error
        error: {
          duration: 4000,
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '2px solid #DC2626',
          },
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          style: {
            background: '#E8E9F5', // color-tertiary-light
            color: '#4982A6', // color-accent
            border: '2px solid #9B9DBF', // color-tertiary
          },
          iconTheme: {
            primary: '#9B9DBF', // color-tertiary
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
