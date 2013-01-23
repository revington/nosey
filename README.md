Nosey
=====

> An smtp server for web development purposes

Nosey is a smtp catch-all server and a web interface.
It is ideal for web development purposes:
- Emails are stored in memory not in your mailbox.
- You can send from/to any address/domain with no configuration.

Install and run
---------------

	git clone https://github.com/revington/nosey.git
	cd nosey
	npm install
	node app.js

1. An smtp server is running at port 4040.
2. Send some emails. From/to can be any address.
3. Open the web interface. http://localhost:4000
4. Voilá

A simple telnet session to test nosey
-------------------------------------
You can telnet to nosey an send and email in 
an old schoolway. Do the following:

First execute nosey. You can do it in the background or in another
terminal. 

	$ node app &
	>Nosey web server listening on port 4000

Then telnet to nosey smtp server

	$ telnet localhost 4040

Boring output...

	Trying 127.0.0.1...
	>Connected to localhost.
	>Escape character is '^]'.
	>Connection from 127.0.0.1
	>220 trifid ESMTP node.js simplesmtp

trifid is my host. Will change on your computer

First, do a HELO

	HELO client
	>250 trifid at your service, [127.0.0.1]

Then do a MAIL From

	MAIL From:<foo@google.com>
	>250 2.1.0 Ok

Set a recipient

	RCPT To:<bar@google.com>
	>250 2.1.0 Ok

Now send some data

	DATA

	>354 End data with <CR><LF>.<CR><LF>
	Just to say hello.

	.
	250 2.0.0 Ok: queued as 800ee2e8056608c7b343

Escape:

	^]  

quit

	quit
	>Connection closed to 127.0.0.1   

Go to localhost:4000 and your email should be there!


License
-------
See LICENSE file. Mit.
