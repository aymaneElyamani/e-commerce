"""
Cloudinary Service for handling image uploads
"""
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


def upload_image(file, folder="ecommerce"):
    """
    Upload an image to Cloudinary
    
    Args:
        file: File object from request.files
        folder: Cloudinary folder to upload to (default: "ecommerce")
    
    Returns:
        dict: Upload result containing secure_url and other metadata
    
    Raises:
        Exception: If upload fails
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="auto",
            allowed_formats=["jpg", "jpeg", "png", "gif", "webp"]
        )
        return {
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'format': result['format'],
            'width': result.get('width'),
            'height': result.get('height')
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def upload_multiple_images(files, folder="ecommerce"):
    """
    Upload multiple images to Cloudinary
    
    Args:
        files: List of file objects from request.files
        folder: Cloudinary folder to upload to
    
    Returns:
        list: List of upload results
    """
    results = []
    for file in files:
        result = upload_image(file, folder)
        results.append(result)
    return results


def delete_image(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: The public ID of the image to delete
    
    Returns:
        dict: Result of deletion operation
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': True,
            'result': result
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
