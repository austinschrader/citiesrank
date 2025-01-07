import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';

interface PhotoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
}

export const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({
  isOpen,
  onClose,
  placeId,
  placeName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Photo uploaded!",
      description: "You earned 50 points for your contribution.",
    });

    // Show points animation
    const pointsPopup = document.createElement('div');
    pointsPopup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary animate-bounce';
    pointsPopup.textContent = '+50 points!';
    document.body.appendChild(pointsPopup);
    setTimeout(() => pointsPopup.remove(), 2000);

    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle>Add Photo for {placeName}</DialogTitle>
        
        <div className="space-y-4">
          {/* Photo Upload Area */}
          <div 
            className={`
              relative aspect-square rounded-lg border-2 border-dashed
              ${preview ? 'border-primary' : 'border-muted-foreground/25'}
              hover:border-primary/50 transition-colors
              flex items-center justify-center
            `}
          >
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center p-6">
                <ImagePlus className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Caption</label>
            <Textarea
              placeholder="Share the story behind this photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="Add tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2">
            {['#view', '#architecture', '#food', '#nature', '#street'].map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => setTags(prev => prev ? `${prev}, ${tag}` : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Upload Button */}
          <Button 
            className="w-full"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
