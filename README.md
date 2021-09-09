# Manga Reader

Manga Reader with many sources (Komikindo, Mangabat) 


### Rest-API Installation
1. Require Node.js 14.x.x;
2. type **npm install** on terminal;
3. type **node .** to running web server;

### Web Installation
1. Install Nginx in WSL/Linux
2. Install php7.4-fpm
3. edit nginx config
```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        
        root /home/[your username]/manga-reader/web;

        # Add index.php to the list if you are using PHP
        index index.php;

        server_name _;
		
		rewrite /login /login.php last;
		rewrite /logout /logout.php last;
			
        location /komikindo {
                try_files $uri $uri/ =404;
				
				rewrite /search/page/(.*)$ /komikindo/index.php?p=$1 last;
				rewrite /chapter/(.*)$ /komikindo/index.php?c=$1 last;
				rewrite /favorite /komikindo/favorite.php last;
        }
	
		location /mangabat {
			    try_files $uri $uri/ =404;
				
				rewrite /search/(.*)$ /mangabat/index.php?s=$1 last;
				rewrite /chapter/(.*)$ /mangabat/index.php?c=$1 last;
				rewrite /favorite /mangabat/favorite.php last;
		}
		
		location ~ \.php$ {
			fastcgi_pass unix:/run/php/php7.4-fpm.sock;
			fastcgi_intercept_errors on;
			fastcgi_index index.php;
			fastcgi_split_path_info ^(.+\.php)(.*)$;
			include fastcgi_params;
			fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		}
		
}
```
4. Run Nginx and php7.4-fpm
5. open url **localhost/** in browser

## Home Page
![enter image description here](https://i.lolicon.date/qvvodz.png)

## Search
![](https://i.lolicon.date/ubimna.png)

## Manga Detail
![](https://i.lolicon.date/cmasar.png)

## Read Manga
![](https://i.lolicon.date/cfbfbn.jpeg)