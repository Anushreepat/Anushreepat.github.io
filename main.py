from flask import *
from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__, static_folder = 'static')
CORS(app)

@app.route('/')
def home():
    return app.send_static_file("index.html")

@app.route('/val/<string:par>', methods = ['GET'])
def getval(par):
    res = json.loads(par)
    keyw = res[0]
    d = res[1]
    category = res[2]
    x = res[3]
    y = res[4]
    dist = round(int(d)*1609.34)
    base_url = "https://api.yelp.com/v3/businesses/search"
    response = requests.get(base_url, params = {'term':keyw,'latitude':x,'longitude':y,'category':category,'radius':dist}, headers={'Authorization': 'BEARER 4EdXZPRV5BjM0BIe0arViFfVNVpAqS5WRataF4tIo1wC5lfCLrGC3hq2uxfJKf9RbviPvK9fnM58dg7FrYkHUlzwYGt7qnpCmW-xe4MS9PviQTnVdKBxVcayeXBkZHYx', 'Access-Control-Allow-Origin': '*'})
    cp = json.loads(response.text)
    json_dict = {}
    #if (len(responseText) == 0):
        #break;
    for i in range(0,20):
        c_id = cp['businesses'][i]['id']
        c_name = cp['businesses'][i]['name']
        c_image =  cp['businesses'][i]['image_url']
        c_rating = cp['businesses'][i]['rating']
        d = cp['businesses'][i]['distance']
        c_dist = round((d / 1609.34),2)
        res = {'id': c_id, 'name': c_name, 'image_url': c_image,'rating': c_rating, 'distance': c_dist}
        json_dict[i] = res
    fres = json.dumps(json_dict)
    return (fres)

@app.route('/deets/<string:y_id>', methods = ['GET'])
def getdetails(y_id):

    y_id=str(y_id).replace('"','')
    y_info = {}
    y_details = {"name":[], "status": [], "categories":[], "address": [], "phone":[], "transactions": [], "price": [], "url":[], "photos":[]}
    base_url = "https://api.yelp.com/v3/businesses/"
    res1 = requests.get(base_url+y_id, headers={'Authorization': 'BEARER 4EdXZPRV5BjM0BIe0arViFfVNVpAqS5WRataF4tIo1wC5lfCLrGC3hq2uxfJKf9RbviPvK9fnM58dg7FrYkHUlzwYGt7qnpCmW-xe4MS9PviQTnVdKBxVcayeXBkZHYx', 'Access-Control-Allow-Origin':'*'})
    c_detail = json.loads(res1.text)
    #print(c_detail)
    keys = list(c_detail.keys())
    if 'name' in keys:
        y_name = c_detail['name']
        y_details["name"].append(y_name)
    if 'hours' in keys:
        y_status = c_detail['hours'][0]['is_open_now']
        y_details["status"].append(y_status)
    if 'categories' in keys:
        y_categories = c_detail['categories']
        y_details["categories"].append(y_categories)
    if 'location' in keys:
        y_address = c_detail['location']['display_address']
        y_details["address"].append(y_address)
    if 'display_phone' in keys:
        y_phone =  c_detail['display_phone']
        y_details["phone"].append(y_phone)
    if 'transactions' in keys:
        y_tran = c_detail['transactions']
        y_details["transactions"].append(y_tran)
    if 'price' in keys:
        y_price = c_detail['price']
        y_details["price"].append(y_price)
    if 'url' in keys:
        y_url = c_detail['url']
        y_details["url"].append(y_url)
    if 'photos' in keys:
        y_images = c_detail['photos']
        y_details["photos"].append(y_images)

    y_info = json.dumps(y_details)
    return (y_info)

if __name__ == '__main__':
    app.run()
