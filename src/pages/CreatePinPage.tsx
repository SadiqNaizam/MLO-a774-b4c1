import React, { useState } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SiteFooter from '@/components/layout/SiteFooter';
import { UploadCloud, Link as LinkIcon, XCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Placeholder data for boards
const placeholderBoards = [
  { id: 'board1', name: 'My Inspirations' },
  { id: 'board2', name: 'Travel Dreams' },
  { id: 'board3', name: 'DIY Projects' },
  { id: 'new_board', name: 'Create new board...' },
];

const pinSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  destinationLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  boardId: z.string().min(1, "Please select a board"),
  mediaFile: z.any().optional(), // For file upload
});

type PinFormData = z.infer<typeof pinSchema>;

const CreatePinPage = () => {
  console.log('CreatePinPage loaded');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { control, handleSubmit, register, formState: { errors, isSubmitting }, setValue, watch } = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      title: '',
      description: '',
      destinationLink: '',
      boardId: '',
    }
  });

  const selectedBoardId = watch('boardId');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFileName(file.name);
        setValue('mediaFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    setFileName(null);
    setValue('mediaFile', null);
    const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // Reset file input
  }

  const onSubmit = (data: PinFormData) => {
    console.log('Pin creation data:', data);
    if (data.boardId === 'new_board') {
        // Handle new board creation logic here, perhaps open a dialog
        console.log("User wants to create a new board for:", data.title);
        alert("New board creation flow not implemented yet. Please select an existing board.");
        return;
    }
    // Simulate API call
    return new Promise(resolve => setTimeout(() => {
        console.log("Pin submitted to server", data);
        alert(`Pin "${data.title}" created and saved to board ID ${data.boardId}!`);
        resolve(data);
    }, 1000));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-10 flex justify-center">
        <Card className="w-full max-w-4xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Create Pin</CardTitle>
            <CardDescription>Share your inspiration with the world.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Left side: File Upload & Preview */}
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 h-full flex flex-col items-center justify-center">
                  {!imagePreview ? (
                    <>
                      <Input
                        id="mediaFile"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Label
                        htmlFor="mediaFile"
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm font-semibold text-gray-600">Drag & drop or click to upload</span>
                        <span className="text-xs text-muted-foreground mt-1">Image or Video (Max 20MB)</span>
                      </Label>
                    </>
                  ) : (
                    <div className="relative w-full">
                       <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
                         <img src={imagePreview} alt="Pin preview" className="object-contain w-full h-full" />
                       </AspectRatio>
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full" onClick={removeImagePreview}>
                           <XCircle className="h-5 w-5" />
                       </Button>
                       {fileName && <p className="text-xs text-muted-foreground mt-2 truncate">File: {fileName}</p>}
                    </div>
                  )}
                </div>
                 {errors.mediaFile && <p className="text-sm text-red-500">{errors.mediaFile.message?.toString()}</p>}
                <Button type="button" variant="outline" className="w-full">
                  <LinkIcon className="mr-2 h-4 w-4" /> Save from site (Coming soon)
                </Button>
              </div>

              {/* Right side: Form Fields */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Add a title for your Pin" 
                    className="mt-1 text-lg p-3"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="boardId" className="text-base">Board</Label>
                  <Controller
                    name="boardId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full mt-1 text-lg p-3 h-auto">
                            <SelectValue placeholder="Choose a board" />
                        </SelectTrigger>
                        <SelectContent>
                            {placeholderBoards.map(board => (
                            <SelectItem key={board.id} value={board.id} className={board.id === 'new_board' ? 'font-semibold text-primary' : ''}>
                                {board.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    )}
                  />
                  {errors.boardId && <p className="text-sm text-red-500 mt-1">{errors.boardId.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-base">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell everyone what your Pin is about (optional)"
                    className="mt-1 min-h-[100px] text-base p-3"
                    {...register("description")}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <Label htmlFor="destinationLink" className="text-base">Destination Link</Label>
                  <Input
                    id="destinationLink"
                    placeholder="Add a destination link (optional)"
                    className="mt-1 text-base p-3"
                    {...register("destinationLink")}
                  />
                  {errors.destinationLink && <p className="text-sm text-red-500 mt-1">{errors.destinationLink.message}</p>}
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="text-base px-8 py-6" disabled={isSubmitting || !imagePreview}>
                    {isSubmitting ? 'Saving...' : 'Save Pin'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CreatePinPage;