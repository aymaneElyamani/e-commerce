from flask import render_template, request, redirect, url_for , Blueprint


admin = Blueprint("admin", __name__, url_prefix="/admin" , template_folder="templates")



@admin.route('/', methods=['GET'])
def home():
    return render_template('home.html')


@admin.route('/products', methods=['GET'])
def products():
    return render_template('products.html')

@admin.route('/users', methods=['GET'])
def users():
    return render_template('users.html')


@admin.route('/orders', methods=['GET'])
def orders():
    return render_template('orders.html')


@admin.route('/offers', methods=['GET'])
def offers():
    return render_template('offers.html')
