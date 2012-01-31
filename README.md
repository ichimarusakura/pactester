
# Description

pactester - Proxy Auto Configuration File Tester

# Synopsis

Simply download, unzip and open *pactester-<version>.html*.

# Overview

This tool aims to make the process of the writing of Proxy Auto Configuration
(PAC) files quicker and less error prone.

It allows you test the logic within a PAC file given client and server
parameters without actually having to deploy it to a web proxy, and have a
real client download and use it.

In addition to taking a number of parameters to test the proxy calculation
logic, it will let you create DNS resolution maps to emulate a DNS environment
so that you can fully test the PAC files logic away from the target
evironment.

And finally it performs some basic checking to ensure subnet and IP addresses
you specify in the logic are correct, the JavaScript syntax is correct, and
that functions used are called correctly (i.e. using the correct case).

This tool was developed after I saw what someone had to go through to get a
PAC file implemented for a Bluecoat appliance, had this tool been around it
would have made the PAC file writing part a little easier - I think :)

![screenshot](https://bitbucket.org/stephenwvickers/pactester/src/e96b47880aae/screenshots/pactester.png)

# License

**NOTE** Third party code will be found in this program, licenses
for such code will be found inline.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

# Author

Stephen Vickers <vortex.is.at@gmail.com>
