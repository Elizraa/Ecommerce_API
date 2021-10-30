# Ecommerce_NFT_API

API project in e-commerce about NFT

# website :
[ecomrece.vercel.app](https://ecomrece.vercel.app/)

# Fitur

- [User](#User)
- [Product](#Product)
- [Wishlist](#Wishlist)
- [Order](#Order)

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
  
### Get User Info by accesToken
	GET  
	/users
	auth : accesToken 
	return user  
  
### Get User Info by Username 
	GET  
	/users/{name}
	return user

### Get User Top Saldo
	GET  
	/users/topSaldo
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

### Get product by category
	GET
	/products/category/{category}
	return products

### Update product by productId
	PUT
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
### Get Tax Nationalty Fee
	GET
	/orders/{sellerNationality}
	auth = bearer accessToken 
	return buyerNationality, sellerNationality, tax

### Add Order
	POST
	/orders
	payload = productId, finalPrice
	auth = bearer accessToken
	return orderId

### Get All History User
	GET
	/orders/history
	auth = bearer accessToken
	return ordersSell, ordersBuy

### Get Buy History User
	GET
	/orders/history/buy
	auth = bearer accessToken
	return orders

### Get Sell History User
	GET
	/orders/history/sell
	auth = bearer accessToken
	return orders

### Delete Order By OrderId
	DELETE
	/orders/{orderId}
	auth = bearer accessToken

		
## TimeStamp
### Add Timestamp without login
	POST 
	/times
	param = productId, event  (eventnya semacam on_click/wishlist/checkout/dll)
	return timesId

### Add Timestamp with login
	POST 
	/times/user
	param = productId, event  (eventnya semacam on_click/wishlist/checkout/dll)
	auth = bearer accessToken
	return timesId

### Get All Times
	GET
	/times
	return times data 

### Get Search history user
	GET
	/times/history/
	auth = bearer accessToken
	return products, times data



