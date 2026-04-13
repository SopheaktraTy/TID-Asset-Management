import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal } from './Modal';
import { Button } from './Button';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  circular?: boolean;
}

export const ImageCropper = ({
  image,
  onCropComplete,
  onCancel,
  aspect = 1,
  circular = false
}: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} maxWidth="max-w-[500px]">
      <div className="flex flex-col gap-6 p-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight leading-none">Crop Image</h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-medium lowercase">adjust scale and position</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-[var(--surface-hover)] rounded-full text-[var(--text-muted)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[380px] w-full bg-[#000] rounded-2xl overflow-hidden shadow-inner translate-z-0">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="flex flex-col gap-6 mt-1">
          <div className="flex items-center gap-6 px-1 justify-center">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <ZoomOut size={16} />
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="flex-1 h-1.5 bg-[var(--surface-hover)] rounded-lg appearance-none cursor-pointer accent-[var(--color-growth-green)]"
              />
              <div className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <ZoomIn size={16} />
              </div>
            </div>

            <button
              onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
              className="flex items-center gap-2 px-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-colors"
              title="Reset Crop"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-10 h-10 rounded-2xl text-xs font-bold border-[var(--border-color)]/50"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="px-14 h-10 rounded-2xl text-xs font-bold bg-[var(--color-growth-green)] text-white shadow-lg shadow-[var(--color-growth-green)]/15 border-0"
            >
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
