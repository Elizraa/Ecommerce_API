# Ecommerce_NFT_API

API project in e-commerce about NFT

# website :
[ecomrece.vercel.app](https://ecomrece.vercel.app/)

# Fitur
## User  
### Signup
	POST  
	/users  
	param : name, email, phone_number, password  
	return userId  
  
### Signin 
	POST  
	/authentications  
	param : email, password  
	return accessToken, refreshToken  
  
	accessToken kadaluarsa tiap 30 menit (iya kelamaan) dan kalo dalam waktu itu user belum logout,
	kalo mau tetep keitung login, ngirimin refreshToken yang tadi buat memperbarui accessToken,
	kalo user logout refreshToken diapus

### RefreshAccess
	PUT  
	/authentications  
	param : refreshToken  
	return accessToken  
  
### Logout
	DELETE  
	/authentications  
	param : refreshToken  
  
### Get User Info by Id
	GET  
	/users/{id}  
	return user  
  
### Get User Info by Username 
	GET  
	/users  
	param : name  
	return users  
  
### Delete user
	DELETE  
	/users  
	param : email, password  
  
### Upload profile 
	POST  
	/users/upload/profile  
	payload : image  
	auth : bearer accessToken  
	return urlImage  
  
### Upload cover
	POST  
	/users/upload/cover  
	payload : image  
	auth : bearer accessToken  
	return urlImage  
  
## Product  
### Add product
	POST
	/products
	param : name, description, category, price, onSell
	auth : bearer accessToken
	return productId

### Add image product
	POST
	/products/image/{productId}
	payload : image
	auth : bearer accessToken
	return urlImage

### Get all products
	GET
	/products
	return products
	
### Get all products on sell
	GET
	/products/onsell
	return products

### Get product by productId
	GET
	/products/{productId}
	return product

### Get product by ownerId
	GET
	/products/{ownerId}
	return product

### Update product by productId
	GET
	/products/{productId}
	param : name, description, category, price, onSell

### Delete product by productId
	DELETE
	/products/{productId}


## Wishlist
### Add Wishlist  
	POST  
	/wishlists  
	param : productId  
	auth : bearer accessToken  
	return wishlistId  
  
### Show Wishlist  
	GET  
	/wishlists  
	auth : bearer accessToken  
	return wishlist, product  
  
### Delete wishlist  
	Delete  
	/wishlists/{wishlistId}  
	payload = wishlistId  

## Orders
### Add Order
	POST
	/orders
	payload = productId
	auth = bearer accessToken
	return orderId

### Get Buy History
	GET
	/orders/history/buy
	auth = bearer accessToken
	return orders

### Get Sell History
	GET
	/orders/history/sell
	auth = bearer accessToken
	return orders

### Delete Order By OrderId
	DELETE
	/orders/{orderId}
	auth = bearer accessToken

		
	
	
