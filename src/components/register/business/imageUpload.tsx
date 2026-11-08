"use client";

type ImageUploadProps = {
    images: File[];
    onChange: (images: File[]) => void;
};

const ImageUpload = (props: ImageUploadProps) => {
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            props.onChange([
                ...props.images,
                ...Array.from(e.target.files)
            ]);
        }
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        props.onChange(
            props.images.filter((image, i) => i !== index)
        );
    };




    return (
         <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {props.images.map((image, index) => (
                    <div key={`${image.name}-${index}`} className="relative w-32 h-32">
                        <img
                            src={URL.createObjectURL(image)}
                            alt={`Business photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />

                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <label className="cursor-pointer">
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted transition">
                        <span className="text-3xl">+</span>
                        <span className="text-sm">Add Photos</span>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default ImageUpload;