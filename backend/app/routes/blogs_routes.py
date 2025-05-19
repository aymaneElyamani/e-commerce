from flask import Blueprint, request, jsonify
from app import get_db  # your DB connection function

blogs_bp = Blueprint('blogs', __name__, url_prefix="/api/blogs")

# GET all blogs
@blogs_bp.route('/', methods=['GET'])
def get_blogs():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        SELECT id, title, content, image_url, is_published, created_at
        FROM blogs
        ORDER BY created_at DESC
    ''')
    blogs = cur.fetchall()
    cur.close()

    # # convert list of tuples to list of dicts for JSON response
    # blogs_list = []
    # for blog in blogs:
    #     blogs_list.append({
    #         'id': blog[0],
    #         'title': blog[1],
    #         'content': blog[2],
    #         'image_url': blog[3],
    #         'is_published': blog[4],
    #         'created_at': blog[5]
    #     })

    return jsonify(blogs)

# GET single blog by ID
@blogs_bp.route('/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT id, title, content, image_url, is_published, created_at FROM blogs WHERE id = %s', (blog_id,))
    blog = cur.fetchone()
    cur.close()

    if blog:
        blog_dict = {
            'id': blog[0],
            'title': blog[1],
            'content': blog[2],
            'image_url': blog[3],
            'is_published': blog[4],
            'created_at': blog[5].isoformat() if blog[5] else None
        }
        return jsonify(blog_dict)

    return jsonify({'error': 'Blog not found'}), 404






@blogs_bp.route('/', methods=['POST'])
def create_blog():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid or missing JSON in request body'}), 400

    required_fields = ['title', 'content']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        is_published = data.get('is_published')
        if is_published is None:
            is_published = True
        elif isinstance(is_published, str):
            is_published = is_published.lower() in ['true', '1', 'yes']

        cur.execute('''
            INSERT INTO blogs (title, content, image_url, is_published)
            VALUES (%s, %s, %s, %s)
        ''', (
            data['title'],
            data['content'],
            data.get('image_url'),
            is_published
        ))
        conn.commit()
        return jsonify({'message': 'Blog created successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()



# PUT update an existing blog (admin only)
@blogs_bp.route('/<int:blog_id>', methods=['PUT'])
def update_blog(blog_id):
    data = request.get_json()
    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute('''
            UPDATE blogs
            SET title = %s,
                content = %s,
                image_url = %s,
                is_published = %s
            WHERE id = %s
            RETURNING id, title, content, image_url, is_published, created_at
        ''', (
            data.get('title'),
            data.get('content'),
            data.get('image_url'),
            data.get('is_published', True),
            blog_id
        ))
        blog = cur.fetchone()
        conn.commit()

        if blog:
            blog_dict = {
                'id': blog[0],
                'title': blog[1],
                'content': blog[2],
                'image_url': blog[3],
                'is_published': blog[4],
                'created_at': blog[5].isoformat() if blog[5] else None
            }
            return jsonify(blog_dict)

        return jsonify({'error': 'Blog not found'}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

# DELETE a blog (admin only)
@blogs_bp.route('/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM blogs WHERE id = %s RETURNING id', (blog_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()

    if deleted:
        return jsonify({'message': 'Blog deleted'})
    return jsonify({'error': 'Blog not found'}), 404
