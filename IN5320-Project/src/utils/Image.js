export const handleUploadImage = (e, setImage) => {
    if (e.target.files.length === 0) {
        setImage(null);
        return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const selectedImage = e.target.files[0];

    if (!allowedTypes.includes(selectedImage.type)) {
        alert('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
        return;
    }

    setImage(selectedImage);
};