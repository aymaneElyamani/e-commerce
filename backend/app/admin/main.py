import os
from flask import render_template, request, redirect, url_for, Blueprint, session, flash
from functools import wraps

admin = Blueprint("admin", __name__, url_prefix="/admin", template_folder="templates")

# Dummy admin credentials
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@gmail.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

# Decorator to protect routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

# Login route
@admin.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('admin.home'))
        flash('Invalid credentials', 'danger')
    return render_template('login.html')

# Logout route
@admin.route('/logout')
@login_required
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin.login'))

# Protected routes
@admin.route('/')
@login_required
def home():
    return render_template('home.html')

@admin.route('/products')
@login_required
def products():
    return render_template('products.html')

@admin.route('/users')
@login_required
def users():
    return render_template('users.html')

@admin.route('/orders')
@login_required
def orders():
    return render_template('orders.html')

@admin.route('/offers')
@login_required
def offers():
    return render_template('offers.html')

@admin.route('/blogs')
@login_required
def blogs():
    return render_template('blogs.html')
