# Rest-API Documentation
## Path
```
http://localhost:4873/api
```
## Account
### **Auth**
```
METHOD: POST
PATH: /account/login
BODY: {
        username: 'username',
        password: 'password'
      }
```
## **Favorite**
```
METHOD: POST
PATH: /account/favorit
BODY: {
        username: 'username',
        method: '[add/remove/list]', //add, remove, list
        favorites: [data]
      }
```

## KomikIndo
### **Status**
```
/komikindo/api
```

### **Home Page**
```
/komikindo/api/home
```
> http://komikato.bugs.today/komikindo/api/home/

### **Daftar Komik**
```
/komikindo/api/daftar-komik/page/<pagination>
```
> http://komikato.bugs.today/komikindo/api/daftar-komik/page/1/

### **Komik Terbaru**
```
/komikindo/api/komik-terbaru/page/<pagination>
```
> http://komikato.bugs.today/komikindo/api/komik-terbaru/page/1/

### **Komik Filter [Manga/Manhua/Manhwa]**
```
/komikindo/api/komik/<type>/page/<pagination>
```
> http://komikato.bugs.today/komikindo/api/manga/page/1/

### **Search Komik**
```
/komikindo/api/cari/<query>/page/1
```
> http://komikato.bugs.today/komikindo/api/cari/kanojo/page/1/

### **Komik Detail**
```
/komikindo/api/komik/<endpoint>
```
> http://komikato.bugs.today/komikindo/api/komik/ice-cream-kanojo/

### **Komik Chapter**
```
/komikindo/api/chapter/<endpoint>
```
> http://komikato.bugs.today/komikindo/api/chapter/ice-cream-kanojo-chapter-1/


## Mangabat
### **Status**
```
/mangabat/api/
```
### **Search**
```
/mangabat/api/search/<query>/page/<pagination>
```
> http://komikato.bugs.today/mangabat/api/search/kanojo/page/1

### **Detail**
```
/mangabat/api/comic/<endpoint>
```
> http://komikato.bugs.today/mangabat/api/comic/read-ij39832

### **Chapter**
```
/mangabat/api/chapter/<endpoint>
```
> http://komikato.bugs.today/mangabat/api/chapter/read-ij39832-chap-66