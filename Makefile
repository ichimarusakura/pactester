
VERSION ?= VERSION

all: clean generic-install

clean:
	-rm -rf install

generic-install:
	-mkdir install
	cp pactester.html install/pactester-$(VERSION).html
	perl tools/set "@@VERSION@@" $(VERSION) install/pactester-$(VERSION).html
	cd install && zip pactester-$(VERSION).zip pactester-$(VERSION).html
	rm install/pactester-$(VERSION).html
