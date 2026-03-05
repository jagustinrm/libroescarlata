import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrls: string[]) => {
    const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        // Si no hay imágenes para precargar, marcamos todo como listo
        if (!imageUrls || imageUrls.length === 0) {
            setImagesPreloaded(true);
            return;
        }

        let loadedCount = 0;
        const totalImages = imageUrls.length;

        const loadImage = (url: string) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = url;

                img.onload = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve(url);
                };

                img.onerror = () => {
                    // Ignoramos el error para no bloquear la aplicación entera
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve(url);
                };
            });
        };

        Promise.all(imageUrls.map(loadImage)).then(() => {
            setImagesPreloaded(true);
            // Opcional: Para asegurar que la barra llegue al 100% visualmente
            setProgress(100);
        });

    }, [imageUrls]); // Depende del listado de URLs

    return { imagesPreloaded, progress };
};
