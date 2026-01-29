'use client';

import { useCallback } from 'react';
import { useCanvasState } from './useCanvasState';

export function useImageLoader() {
  const { dispatch } = useCanvasState();

  const loadImage = useCallback(
    (file: File) => {
      dispatch({ type: 'SET_IMAGE', payload: { isLoading: true, error: null } });

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        dispatch({
          type: 'SET_IMAGE',
          payload: {
            file,
            element: img,
            isLoading: false,
            error: null,
          },
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        dispatch({
          type: 'SET_IMAGE',
          payload: {
            file: null,
            element: null,
            isLoading: false,
            error: 'Failed to load image',
          },
        });
      };

      img.src = url;
    },
    [dispatch]
  );

  const clearImage = useCallback(() => {
    dispatch({
      type: 'SET_IMAGE',
      payload: {
        file: null,
        element: null,
        isLoading: false,
        error: null,
      },
    });
  }, [dispatch]);

  return { loadImage, clearImage };
}
