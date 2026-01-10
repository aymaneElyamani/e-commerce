"""
Upload routes for handling file uploads to Cloudinary
"""
from flask import Blueprint, request, jsonify
from app.cloudinary_service import upload_image, upload_multiple_images

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')


@upload_bp.route('/image', methods=['POST'])
def upload_single_image():
    """
    Upload a single image to Cloudinary
    
    Request:
        - file: Image file (multipart/form-data)
        - folder: Optional folder name (default: "ecommerce")
    
    Response:
        - 200: {success: true, url: string, public_id: string, ...}
        - 400: {error: string}
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    folder = request.form.get('folder', 'ecommerce')
    
    result = upload_image(file, folder)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify({'error': result['error']}), 400


@upload_bp.route('/images', methods=['POST'])
def upload_multiple():
    """
    Upload multiple images to Cloudinary
    
    Request:
        - files: Multiple image files (multipart/form-data)
        - folder: Optional folder name (default: "ecommerce")
    
    Response:
        - 200: {success: true, urls: [string, ...], results: [...]}
        - 400: {error: string}
    """
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    
    if len(files) == 0:
        return jsonify({'error': 'No files selected'}), 400
    
    folder = request.form.get('folder', 'ecommerce')
    
    results = upload_multiple_images(files, folder)
    
    # Check if all uploads were successful
    successful_uploads = [r for r in results if r.get('success')]
    failed_uploads = [r for r in results if not r.get('success')]
    
    if len(successful_uploads) > 0:
        return jsonify({
            'success': True,
            'urls': [r['url'] for r in successful_uploads],
            'results': results,
            'uploaded': len(successful_uploads),
            'failed': len(failed_uploads)
        }), 200
    else:
        return jsonify({
            'success': False,
            'error': 'All uploads failed',
            'results': results
        }), 400
