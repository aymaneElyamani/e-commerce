from flask import Blueprint, request, jsonify

from app.database import get_db
from app.models import Blog

blogs_bp = Blueprint('blogs', __name__, url_prefix="/api/blogs")


# GET all blogs
@blogs_bp.route('/', methods=['GET'])
def get_blogs():
    db = get_db()
    try:
        blogs = db.query(Blog).order_by(Blog.created_at.desc()).all()
        return jsonify([b.to_dict() for b in blogs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# GET single blog by ID
@blogs_bp.route('/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    db = get_db()
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if blog:
            return jsonify(blog.to_dict()), 200
        return jsonify({'error': 'Blog not found'}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@blogs_bp.route('/', methods=['POST'])
def create_blog():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid or missing JSON in request body'}), 400

    required_fields = ['title', 'content']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    is_published = data.get('is_published')
    if is_published is None:
        is_published = True
    elif isinstance(is_published, str):
        is_published = is_published.lower() in ['true', '1', 'yes']

    db = get_db()
    try:
        new_blog = Blog(
            title=data['title'],
            content=data['content'],
            image_url=data.get('image_url'),
            is_published=is_published,
        )
        db.add(new_blog)
        db.commit()
        return jsonify({'message': 'Blog created successfully'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# PUT update an existing blog (admin only)
@blogs_bp.route('/<int:blog_id>', methods=['PUT'])
def update_blog(blog_id):
    data = request.get_json() or {}
    db = get_db()
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404

        blog.title = data.get('title', blog.title)
        blog.content = data.get('content', blog.content)
        blog.image_url = data.get('image_url', blog.image_url)
        blog.is_published = data.get('is_published', blog.is_published)

        db.commit()
        return jsonify(blog.to_dict()), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# DELETE a blog (admin only)
@blogs_bp.route('/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    db = get_db()
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404

        db.delete(blog)
        db.commit()
        return jsonify({'message': 'Blog deleted'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
