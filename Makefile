
VERSION ?= VERSION

all: clean generic-install

clean:
	-rm -rf install

generic-install:
	-mkdir install
	cp -r static install
	echo $(VERSION) > install/static/version.txt
	perl tools/embed-files install/static pactester.js install/pactester-$(VERSION).js
	gzip install/pactester-$(VERSION).js
	rm -rf install/static
