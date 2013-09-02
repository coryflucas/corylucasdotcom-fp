---
title: Setting up Node.js on a production server
date: 2013-09-02 5:30 PM
---
After creating [French Press](https://github.com/coryflucas/french-press) and migrating my site to Node.js, I realized I needed to setup Node on my actual web server.  Here's some info on what steps were involved.

## Setting up an HTTP proxy
I set up a HTTP proxy so that I could run node on a non-privledged port, but still access it via port 80.  This also would allow me to run multiple instances of node in the future if I needed to for some reason and have basic load balancing. I chose to use (Nginx)[http://wiki.nginx.org/] as my proxy.  As I am running Ubuntu, installation is dead simple:

	$ sudo apt-get install nginx

Now we need to configure the Nginx to proxy our requests.  Create a new file in /etc/nginx/sites-available:

	upstream app_cluster_1 {
	  server 127.0.0.1:YOUR_NODE_PORT;
	}
	
	server {
	  listen 0.0.0.0:80;
	  server_name YOUR_HOSTNAME_HERE;
	  access_log /var/log/nginx/node.log;
	
	  location / {
	    proxy_set_header X-Real-IP $remote_addr;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_set_header Host $http_host;
	    proxy_set_header X-NginX-Proxy true;
	
	    proxy_pass http://app_cluster_1/;
	    proxy_redirect off;
	  }
	}

## Create a start up script
I want to make sure that starting and stoping the Node app is as simple as possible, so I needed to create a start up script.  Service startup and shutdown is handled via upstart on Ubuntu these days, so I created the following upstart script in /etc/init/:

	#!upstart
	description "My Node.js app"
	author      "Cory Lucas"
	
	start on startup
	stop on shutdown
	
	script
	    export NODE_ENV=production
	
	    echo $$ > /var/run/my_node_app.pid
	    exec sudo -u node /opt/node/bin/node [PATH_TO_YOUR_APP] >> /var/log/my_node_app.sys.log 2>&1
	end script
	
	pre-start script
	    # Date format same as (new Date()).toISOString() for consistency
	    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Starting" >> /var/log/my_node_app.sys.log
	end script
	
	pre-stop script
	    rm /var/run/my_node_app.pid
	    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Stopping" >> /var/log/my_node_app.sys.log
	end script

With the script in place, starting the Node app is as simple as

	service start [YOUR_SERVICE_NAME]
	
## Setup Monit
My app is currently pretty simple, but I don't want an unhandled exception to take the site down so I set up [Monit](http://mmonit.com/monit/) to make sure Node keeps running.  Instalation is simple:

	$ sudo apt-get install monit

We need to create a configuration for Monit to watch our node process now.  In Ubuntu, these go in /etc/monit/monitrc.d/.  Here's my config file:

	 check process node with pidfile /var/run/my_node_app.pid
	   start program = "/sbin/start YOUR_SERVICE_NAME"
	   stop program = "/sbin/stop YOUR_SERVICE_NAME"
	   if failed port YOUR_NODE_PORT protocol http
	     request "/"
	     with timeout 10 seconds
	     then restart
	   if 5 restarts with 5 cycles then timeout

This is my setup so far.  I will update this post if I find anything else.
